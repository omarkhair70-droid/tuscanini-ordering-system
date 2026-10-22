"""Runs only against a disposable PostgreSQL test database on localhost."""

from concurrent.futures import ThreadPoolExecutor

from django.db import close_old_connections, connections
from django.test import TransactionTestCase

from .models import CatalogItem, Order, OrderLine, OrderStatusEvent, OutboxEvent, PaymentAttempt
from .services import RequestKeyCollision, deliver_one_outbox, submit_order


class PostgresOrderTests(TransactionTestCase):
    reset_sequences = False

    def setUp(self):
        CatalogItem.objects.create(sku="PIZZA_01", name="Synthetic pizza", unit_price_cents=14500)
        CatalogItem.objects.create(sku="DRINK_01", name="Synthetic drink", unit_price_cents=2500)

    def payload(self):
        return [{"sku": "PIZZA_01", "qty": 2}, {"sku": "DRINK_01", "qty": 1}]

    def test_database_prices_and_snapshots_are_authoritative(self):
        result = submit_order("order-price-0001", self.payload())
        self.assertEqual(result.subtotal_cents, 31500)
        self.assertEqual(
            list(OrderLine.objects.filter(order=result).values_list("line_total_cents", flat=True)),
            [2500, 29000],
        )
        self.assertEqual(OrderStatusEvent.objects.filter(order=result).count(), 1)
        self.assertEqual(OutboxEvent.objects.filter(order=result).count(), 1)
        CatalogItem.objects.filter(sku="PIZZA_01").update(unit_price_cents=99900)
        line = OrderLine.objects.get(order=result, sku_snapshot="PIZZA_01")
        self.assertEqual(line.unit_price_cents, 14500)

    def test_same_key_same_payload_returns_existing_order(self):
        first = submit_order("order-repeat-001", self.payload())
        second = submit_order("order-repeat-001", list(reversed(self.payload())))
        self.assertEqual(first.pk, second.pk)
        self.assertEqual(Order.objects.count(), 1)
        self.assertEqual(OutboxEvent.objects.count(), 1)

    def test_same_key_changed_payload_is_rejected(self):
        submit_order("order-collision1", self.payload())
        with self.assertRaises(RequestKeyCollision):
            submit_order("order-collision1", [{"sku": "PIZZA_01", "qty": 3}])
        self.assertEqual(Order.objects.count(), 1)

    def test_each_mid_transaction_failure_rolls_back_every_related_row(self):
        for index, fault in enumerate(["after_header", "after_lines", "after_history", "after_outbox"]):
            with self.subTest(fault=fault):
                with self.assertRaises(RuntimeError):
                    submit_order(f"order-fault-{index:04d}", self.payload(), fail_at=fault)
                self.assertEqual(Order.objects.count(), 0)
                self.assertEqual(OrderLine.objects.count(), 0)
                self.assertEqual(OrderStatusEvent.objects.count(), 0)
                self.assertEqual(OutboxEvent.objects.count(), 0)

    def test_simultaneous_duplicate_submission(self):
        def worker():
            close_old_connections()
            try:
                return submit_order("order-concurrent1", self.payload()).pk
            finally:
                connections.close_all()

        with ThreadPoolExecutor(max_workers=2) as executor:
            first, second = list(executor.map(lambda _: worker(), range(2)))
        self.assertEqual(first, second)
        self.assertEqual(Order.objects.count(), 1)
        self.assertEqual(OutboxEvent.objects.count(), 1)

    def test_outbox_recovers_after_transport_outage(self):
        submit_order("order-outbox-0001", self.payload())
        event = OutboxEvent.objects.get()
        deliveries = []

        def unavailable(_event_id, _payload):
            raise ConnectionError("Store network disconnected")

        with self.assertRaises(ConnectionError):
            deliver_one_outbox(unavailable)
        event.refresh_from_db()
        self.assertIsNone(event.delivered_at)
        self.assertTrue(deliver_one_outbox(lambda key, payload: deliveries.append((key, payload))))
        event.refresh_from_db()
        self.assertIsNotNone(event.delivered_at)
        self.assertEqual(len(deliveries), 1)
        self.assertFalse(deliver_one_outbox(lambda *_: self.fail("Unexpected resend")))

    def test_order_and_payment_have_distinct_lifecycles(self):
        order = submit_order("order-payment-001", self.payload())
        attempt = PaymentAttempt.objects.create(
            order=order, amount_cents=order.subtotal_cents, status="initiated"
        )
        self.assertEqual(order.status, "received")
        self.assertEqual(attempt.status, "initiated")
        attempt.status = "failed"
        attempt.save(update_fields=["status"])
        order.refresh_from_db()
        self.assertEqual(order.status, "received")


    def test_failed_transaction_allows_same_key_retry(self):
        with self.assertRaises(RuntimeError):
            submit_order("order-retry-fail", self.payload(), fail_at="after_history")
        self.assertEqual(Order.objects.count(), 0)
        result = submit_order("order-retry-fail", self.payload())
        self.assertEqual(result.status, "received")
        self.assertEqual(Order.objects.count(), 1)
        self.assertEqual(OutboxEvent.objects.count(), 1)

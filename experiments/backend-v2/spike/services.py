"""Transactional order ingestion and toy outbox relay for failure-mode tests.

No HTTP endpoints, merchant data, payment gateway, printer or external POS.
"""

import hashlib
import json
import re

from django.db import IntegrityError, transaction
from django.utils import timezone

from .models import CatalogItem, Order, OrderLine, OrderStatusEvent, OutboxEvent

KEY = re.compile(r"^[a-zA-Z0-9_-]{8,80}$")
SKU = re.compile(r"^[a-zA-Z0-9_-]{1,64}$")


class RequestKeyCollision(ValueError):
    pass


def _normalize(items):
    if not isinstance(items, list) or not 1 <= len(items) <= 20:
        raise ValueError("Expected 1–20 order line objects.")
    normalized = []
    seen = set()
    for line in items:
        if not isinstance(line, dict):
            raise ValueError("Invalid line.")
        sku, qty = line.get("sku"), line.get("qty")
        if (not isinstance(sku, str) or not SKU.fullmatch(sku)
                or type(qty) is not int or not 1 <= qty <= 100 or sku in seen):
            raise ValueError("Invalid SKU, quantity, or duplicate SKU.")
        seen.add(sku)
        normalized.append({"sku": sku, "qty": qty})
    return sorted(normalized, key=lambda line: line["sku"])


def submit_order(request_key: str, items: list[dict], *, fail_at: str | None = None) -> Order:
    """A committed request key always maps to one committed order or a payload conflict.

    The unique request_key constraint is authoritative under concurrent processes.
    """
    if not isinstance(request_key, str) or not KEY.fullmatch(request_key):
        raise ValueError("Request key format invalid.")
    normalized = _normalize(items)
    fingerprint = hashlib.sha256(
        json.dumps(normalized, sort_keys=True, separators=(",", ":")).encode()
    ).hexdigest()

    def existing_or_raise() -> Order | None:
        previous = Order.objects.filter(request_key=request_key).first()
        if previous and previous.payload_sha256 != fingerprint:
            raise RequestKeyCollision("Request key reused with a different cart.")
        return previous

    existing = existing_or_raise()
    if existing is not None:
        return existing

    try:
        with transaction.atomic():
            lines = []
            subtotal = 0
            # Deterministic lock order avoids SKU-to-SKU deadlocks when prices change.
            for line in normalized:
                try:
                    catalog = CatalogItem.objects.select_for_update().get(
                        sku=line["sku"], available=True
                    )
                except CatalogItem.DoesNotExist as exc:
                    raise ValueError("Unavailable or unknown catalog item.") from exc
                line_total = catalog.unit_price_cents * line["qty"]
                subtotal += line_total
                lines.append((catalog, line["qty"], line_total))

            order = Order.objects.create(
                request_key=request_key,
                payload_sha256=fingerprint,
                subtotal_cents=subtotal,
                status="received",
            )
            if fail_at == "after_header":
                raise RuntimeError("Injected fault: header")

            OrderLine.objects.bulk_create([
                OrderLine(
                    order=order,
                    sku_snapshot=product.sku,
                    name_snapshot=product.name,
                    unit_price_cents=product.unit_price_cents,
                    quantity=qty,
                    line_total_cents=total,
                ) for product, qty, total in lines
            ])
            if fail_at == "after_lines":
                raise RuntimeError("Injected fault: lines")

            OrderStatusEvent.objects.create(
                order=order, status="received", detail="Received, not accepted by staff."
            )
            if fail_at == "after_history":
                raise RuntimeError("Injected fault: audit")

            OutboxEvent.objects.create(
                order=order,
                kind="order.received",
                payload={"order_id": str(order.pk), "status": "received"},
            )
            if fail_at == "after_outbox":
                raise RuntimeError("Injected fault: outbox")
            return order

    except IntegrityError:
        # This is outside transaction.atomic(): the failed insert has rolled back.
        # PostgreSQL's unique key ensures concurrent same-key requests serialize.
        existing = existing_or_raise()
        if existing is not None:
            return existing
        raise


def deliver_one_outbox(send):
    """At-least-once mock relay; the consumer MUST deduplicate by event UUID.

    A crash after successful send but before commit can cause a retry.
    No external production service is contacted by the tests.
    """
    with transaction.atomic():
        event = (
            OutboxEvent.objects.select_for_update(skip_locked=True)
            .filter(delivered_at__isnull=True)
            .order_by("created_at")
            .first()
        )
        if event is None:
            return False
        send(str(event.pk), event.payload)  # mock sender; may throw
        event.delivered_at = timezone.now()
        event.save(update_fields=["delivered_at"])
        return True

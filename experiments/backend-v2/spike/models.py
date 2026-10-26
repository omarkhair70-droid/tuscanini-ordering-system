"""Small domain model for an isolated transactional spike, NOT a production migration."""

import uuid

from django.db import models
from django.db.models import Q


class CatalogItem(models.Model):
    sku = models.CharField(max_length=64, unique=True)
    name = models.CharField(max_length=160)
    unit_price_cents = models.PositiveIntegerField()
    available = models.BooleanField(default=True)


class Order(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    request_key = models.CharField(max_length=80, unique=True)
    payload_sha256 = models.CharField(max_length=64)
    status = models.CharField(max_length=24, default="received")
    subtotal_cents = models.PositiveBigIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)


class OrderLine(models.Model):
    order = models.ForeignKey(Order, related_name="lines", on_delete=models.PROTECT)
    sku_snapshot = models.CharField(max_length=64)
    name_snapshot = models.CharField(max_length=160)
    unit_price_cents = models.PositiveIntegerField()
    quantity = models.PositiveIntegerField()
    line_total_cents = models.PositiveBigIntegerField()

    class Meta:
        constraints = [
            models.CheckConstraint(condition=Q(quantity__gte=1), name="spike_line_qty_min_1"),
        ]


class OrderStatusEvent(models.Model):
    order = models.ForeignKey(Order, related_name="events", on_delete=models.PROTECT)
    status = models.CharField(max_length=24)
    detail = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)


class OutboxEvent(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order, related_name="outbox", on_delete=models.PROTECT)
    kind = models.CharField(max_length=80)
    payload = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    delivered_at = models.DateTimeField(null=True, blank=True)


class PaymentAttempt(models.Model):
    """Money is deliberately a separate lifecycle; no card data stored."""

    order = models.ForeignKey(Order, related_name="payment_attempts", on_delete=models.PROTECT)
    provider_reference = models.CharField(max_length=120, null=True, blank=True)
    status = models.CharField(max_length=24, default="initiated")
    amount_cents = models.PositiveBigIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

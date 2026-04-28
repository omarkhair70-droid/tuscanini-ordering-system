export type ActiveOrderSnapshot = {
  orderId: string;
  reference: string;
  tableReference: string | null;
  createdAt: string;
};

const ACTIVE_ORDER_STORAGE_KEY = 'tuscanini-active-order-v1';

function isValidSnapshot(value: unknown): value is ActiveOrderSnapshot {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<ActiveOrderSnapshot>;

  return (
    typeof candidate.orderId === 'string' &&
    candidate.orderId.trim().length > 0 &&
    typeof candidate.reference === 'string' &&
    candidate.reference.trim().length > 0 &&
    (typeof candidate.tableReference === 'string' || candidate.tableReference === null) &&
    typeof candidate.createdAt === 'string' &&
    candidate.createdAt.trim().length > 0
  );
}

export function loadActiveOrder(): ActiveOrderSnapshot | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.localStorage.getItem(ACTIVE_ORDER_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!isValidSnapshot(parsed)) {
      return null;
    }

    return {
      orderId: parsed.orderId.trim(),
      reference: parsed.reference.trim(),
      tableReference: typeof parsed.tableReference === 'string' ? parsed.tableReference.trim() || null : null,
      createdAt: parsed.createdAt.trim(),
    };
  } catch {
    return null;
  }
}

export function saveActiveOrder(snapshot: ActiveOrderSnapshot): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(
    ACTIVE_ORDER_STORAGE_KEY,
    JSON.stringify({
      orderId: snapshot.orderId,
      reference: snapshot.reference,
      tableReference: snapshot.tableReference,
      createdAt: snapshot.createdAt,
    }),
  );
}

export function clearActiveOrder(): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(ACTIVE_ORDER_STORAGE_KEY);
}

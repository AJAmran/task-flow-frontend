import type { PaidPlan, PendingPayment } from "@/types";

const STORAGE_KEY = "tf_pending_payment";

export function savePendingPayment(payment: PendingPayment): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payment));
  } catch {
    // Storage unavailable (private mode) — URL param remains the source.
  }
}

export function readPendingPayment(): PendingPayment | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as PendingPayment;
    if (!parsed.paymentID || !parsed.organizationId) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearPendingPayment(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors.
  }
}

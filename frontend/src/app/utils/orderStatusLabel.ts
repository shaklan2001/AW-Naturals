/**
 * Maps persisted order status to a customer-facing label. DB / API values stay unchanged (e.g. "pending").
 */
const LABELS: Record<string, string> = {
  pending: "Order placed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export function formatOrderStatusLabel(status: string): string {
  const key = status.trim().toLowerCase();
  return LABELS[key] ?? status;
}

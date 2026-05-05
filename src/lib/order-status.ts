import type { OrderRow } from "@/db/schema";

export const ORDER_STATUS_LABELS: Record<OrderRow["status"], string> = {
  new: "New",
  confirmed: "Confirmed",
  in_progress: "In progress",
  ready: "Ready",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const ORDER_STATUSES: OrderRow["status"][] = [
  "new",
  "confirmed",
  "in_progress",
  "ready",
  "completed",
  "cancelled",
];

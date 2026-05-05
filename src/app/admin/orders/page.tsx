import { listOrders } from "@/actions/orders";
import { OrdersFilters } from "@/components/admin/orders-filters";
import { ORDER_STATUS_LABELS } from "@/lib/order-status";
import type { OrderRow } from "@/db/schema";
import Link from "next/link";
import { Suspense } from "react";

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

async function OrdersTable({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const statusRaw = searchParams.status;
  const status =
    typeof statusRaw === "string"
      ? (statusRaw as OrderRow["status"] | "all")
      : "all";
  const q = typeof searchParams.q === "string" ? searchParams.q : undefined;
  const fromDate =
    typeof searchParams.from === "string" ? searchParams.from : undefined;

  const allowed: (OrderRow["status"] | "all")[] = [
    "all",
    "new",
    "confirmed",
    "in_progress",
    "ready",
    "completed",
    "cancelled",
  ];
  const safeStatus =
    status && (allowed as readonly string[]).includes(status)
      ? (status as OrderRow["status"] | "all")
      : "all";

  const rows = await listOrders({
    status: safeStatus,
    q,
    fromDate,
  });

  if (rows.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-[#d4dde6] bg-white p-12 text-center text-[#4f6479]">
        No orders match your filters.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#d4dde6] bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-[#d4dde6] bg-[#edf2f8] text-xs uppercase tracking-wide text-[#4f6479]">
          <tr>
            <th className="px-4 py-3 font-medium">Received</th>
            <th className="px-4 py-3 font-medium">Customer</th>
            <th className="px-4 py-3 font-medium">Phone</th>
            <th className="px-4 py-3 font-medium">Event</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="w-px px-4 py-3 font-medium" />
          </tr>
        </thead>
        <tbody className="divide-y divide-[#e6edf4]">
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-[#f7fafe]">
              <td className="whitespace-nowrap px-4 py-3 text-[#0f2f4f]">
                {formatDate(row.createdAt)}
              </td>
              <td className="px-4 py-3 font-medium text-[#0f2f4f]">
                {row.customerName}
              </td>
              <td className="px-4 py-3 text-[#4f6479]">{row.phone}</td>
              <td className="px-4 py-3 text-[#4f6479]">
                {row.eventDate || "—"}
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex rounded-full bg-[#d9e4f0] px-2.5 py-0.5 text-xs font-medium text-[#1f4568]">
                  {ORDER_STATUS_LABELS[row.status]}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/admin/orders/${row.id}`}
                  className="text-sm font-medium text-[#b8944f] hover:underline"
                >
                  Open
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-[#0f2f4f]">
            Orders
          </h1>
          <p className="text-sm text-[#4f6479]">
            Custom cake requests from the website
          </p>
        </div>
      </div>

      <div className="mb-6">
        <Suspense fallback={null}>
          <OrdersFilters />
        </Suspense>
      </div>

      <Suspense
        fallback={
          <p className="text-sm text-[#4f6479]">Loading orders…</p>
        }
      >
        <OrdersTable searchParams={sp} />
      </Suspense>
    </main>
  );
}

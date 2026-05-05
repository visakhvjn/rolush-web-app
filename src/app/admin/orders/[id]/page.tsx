import { getOrderById, updateOrder } from "@/actions/orders";
import { ORDER_STATUS_LABELS, ORDER_STATUSES } from "@/lib/order-status";
import Link from "next/link";
import { notFound } from "next/navigation";

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(d);
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href="/admin/orders"
        className="text-sm font-medium text-[#b8944f] hover:underline"
      >
        ← Back to orders
      </Link>

      <h1 className="mt-6 font-serif text-2xl font-semibold text-[#0f2f4f]">
        Order detail
      </h1>
      <p className="mt-1 text-sm text-[#4f6479]">
        Received {formatDate(order.createdAt)}
      </p>

      <dl className="mt-8 grid gap-6 rounded-xl border border-[#d4dde6] bg-white p-6 shadow-sm">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-[#4f6479]">
            Customer
          </dt>
          <dd className="mt-1 text-[#0f2f4f]">{order.customerName}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-[#4f6479]">
            Phone
          </dt>
          <dd className="mt-1 text-[#0f2f4f]">{order.phone}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-[#4f6479]">
            Email
          </dt>
          <dd className="mt-1 text-[#0f2f4f]">{order.email || "—"}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-[#4f6479]">
            Event date
          </dt>
          <dd className="mt-1 text-[#0f2f4f]">{order.eventDate || "—"}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-[#4f6479]">
            Brief
          </dt>
          <dd className="mt-1 whitespace-pre-wrap text-[#0f2f4f]">
            {order.message}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-[#4f6479]">
            Reference image URL
          </dt>
          <dd className="mt-1 break-all text-[#b8944f]">
            {order.imageUrl ? (
              <a href={order.imageUrl} target="_blank" rel="noreferrer">
                {order.imageUrl}
              </a>
            ) : (
              "—"
            )}
          </dd>
        </div>
      </dl>

      <form
        action={updateOrder}
        className="mt-8 space-y-6 rounded-xl border border-[#d4dde6] bg-white p-6 shadow-sm"
      >
        <input type="hidden" name="id" value={order.id} />

        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-[#0f2f4f]"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={order.status}
            className="mt-2 w-full max-w-xs rounded-lg border border-[#d4dde6] px-3 py-2 text-[#0f2f4f] outline-none ring-[#d3b06a] focus:ring-2"
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {ORDER_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="adminNotes"
            className="block text-sm font-medium text-[#0f2f4f]"
          >
            Internal notes
          </label>
          <textarea
            id="adminNotes"
            name="adminNotes"
            rows={4}
            defaultValue={order.adminNotes ?? ""}
            placeholder="Notes visible only to staff"
            className="mt-2 w-full rounded-lg border border-[#d4dde6] px-3 py-2 text-[#0f2f4f] outline-none ring-[#d3b06a] focus:ring-2"
          />
        </div>

        <button
          type="submit"
          className="rounded-full bg-[#0f2f4f] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0b2239]"
        >
          Save changes
        </button>
      </form>
    </main>
  );
}

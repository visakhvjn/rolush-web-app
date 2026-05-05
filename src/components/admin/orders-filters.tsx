"use client";

import { ORDER_STATUSES, ORDER_STATUS_LABELS } from "@/lib/order-status";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useTransition } from "react";

export function OrdersFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const qRef = useRef<HTMLInputElement>(null);

  const status = searchParams.get("status") ?? "all";
  const q = searchParams.get("q") ?? "";
  const from = searchParams.get("from") ?? "";

  function applyUpdates(next: {
    status?: string;
    q?: string;
    from?: string;
  }) {
    const params = new URLSearchParams(searchParams.toString());
    const s = next.status ?? status;
    const query = next.q !== undefined ? next.q : q;
    const fromDate = next.from !== undefined ? next.from : from;

    if (s && s !== "all") params.set("status", s);
    else params.delete("status");

    if (query.trim()) params.set("q", query.trim());
    else params.delete("q");

    if (fromDate) params.set("from", fromDate);
    else params.delete("from");

    params.delete("page");

    startTransition(() => {
      router.push(`/admin/orders?${params.toString()}`);
    });
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
      <div>
        <label
          htmlFor="filter-status"
          className="block text-xs font-medium uppercase tracking-wide text-[#4f6479]"
        >
          Status
        </label>
        <select
          id="filter-status"
          value={status}
          disabled={pending}
          onChange={(e) => applyUpdates({ status: e.target.value })}
          className="mt-1 rounded-lg border border-[#d4dde6] bg-white px-3 py-2 text-sm text-[#0f2f4f] outline-none ring-[#d3b06a] focus:ring-2"
        >
          <option value="all">All</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {ORDER_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>
      <div className="min-w-[200px] flex-1">
        <label
          htmlFor="filter-q"
          className="block text-xs font-medium uppercase tracking-wide text-[#4f6479]"
        >
          Search
        </label>
        <input
          ref={qRef}
          id="filter-q"
          type="search"
          placeholder="Name or phone"
          defaultValue={q}
          disabled={pending}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              applyUpdates({ q: qRef.current?.value ?? "" });
            }
          }}
          className="mt-1 w-full rounded-lg border border-[#d4dde6] bg-white px-3 py-2 text-sm text-[#0f2f4f] outline-none ring-[#d3b06a] focus:ring-2"
        />
      </div>
      <div>
        <label
          htmlFor="filter-from"
          className="block text-xs font-medium uppercase tracking-wide text-[#4f6479]"
        >
          From date
        </label>
        <input
          id="filter-from"
          type="date"
          defaultValue={from}
          disabled={pending}
          onChange={(e) => applyUpdates({ from: e.target.value })}
          className="mt-1 rounded-lg border border-[#d4dde6] bg-white px-3 py-2 text-sm text-[#0f2f4f] outline-none ring-[#d3b06a] focus:ring-2"
        />
      </div>
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          applyUpdates({
            q: qRef.current?.value ?? "",
          })
        }
        className="rounded-full bg-[#0f2f4f] px-4 py-2 text-sm font-medium text-white hover:bg-[#0b2239] disabled:opacity-60"
      >
        Search
      </button>
    </div>
  );
}

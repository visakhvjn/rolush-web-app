"use client";

import {
  createOrder,
  type CreateOrderState,
} from "@/actions/orders";
import { useActionState } from "react";

const initial: CreateOrderState = {
  ok: false,
  message: "",
};

export function SiteOrderForm() {
  const [state, formAction, pending] = useActionState(createOrder, initial);

  return (
    <div
      id="order"
      className="scroll-mt-24 rounded-3xl border border-[#d4dde6] bg-white p-8 shadow-sm sm:p-10"
    >
      <h2 className="font-serif text-2xl font-semibold text-[#0f2f4f] sm:text-3xl">
        Request a custom cake
      </h2>
      <p className="mt-2 text-[#4f6479]">
        Share your date, size, and ideas. We will reach out to confirm flavour,
        pricing, and pickup or delivery options.
      </p>

      {state?.ok ? (
        <p
          className="mt-6 rounded-xl bg-[#e8f5e9] px-4 py-3 text-sm font-medium text-[#1b5e20]"
          role="status"
        >
          {state.message}
        </p>
      ) : null}

      {state?.ok === false && state.message ? (
        <p className="mt-6 text-sm text-red-600" role="alert">
          {state.message}
        </p>
      ) : null}

      <form
        key={state?.ok ? "reset" : "form"}
        action={formAction}
        className="mt-8 space-y-5"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="customerName"
              className="block text-sm font-medium text-[#2c1810]"
            >
              Your name
            </label>
            <input
              id="customerName"
              name="customerName"
              required
              autoComplete="name"
              className="mt-1 w-full rounded-lg border border-[#d4dde6] px-3 py-2.5 text-[#0f2f4f] outline-none ring-[#d3b06a] focus:ring-2"
            />
            {state?.ok === false && state.fieldErrors?.customerName?.[0] ? (
              <p className="mt-1 text-xs text-red-600">
                {state.fieldErrors.customerName[0]}
              </p>
            ) : null}
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-[#2c1810]"
            >
              Phone (WhatsApp)
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              placeholder="+91 …"
              className="mt-1 w-full rounded-lg border border-[#d4dde6] px-3 py-2.5 text-[#0f2f4f] outline-none ring-[#d3b06a] focus:ring-2"
            />
            {state?.ok === false && state.fieldErrors?.phone?.[0] ? (
              <p className="mt-1 text-xs text-red-600">
                {state.fieldErrors.phone[0]}
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#2c1810]"
            >
              Email <span className="font-normal text-[#4f6479]">(optional)</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className="mt-1 w-full rounded-lg border border-[#d4dde6] px-3 py-2.5 text-[#0f2f4f] outline-none ring-[#d3b06a] focus:ring-2"
            />
            {state?.ok === false && state.fieldErrors?.email?.[0] ? (
              <p className="mt-1 text-xs text-red-600">
                {state.fieldErrors.email[0]}
              </p>
            ) : null}
          </div>
          <div>
            <label
              htmlFor="eventDate"
              className="block text-sm font-medium text-[#2c1810]"
            >
              Event date
            </label>
            <input
              id="eventDate"
              name="eventDate"
              type="date"
              className="mt-1 w-full rounded-lg border border-[#d4dde6] px-3 py-2.5 text-[#0f2f4f] outline-none ring-[#d3b06a] focus:ring-2"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-[#0f2f4f]"
          >
            Cake brief
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            placeholder="Servings, flavours, theme, frosting preference…"
            className="mt-1 w-full rounded-lg border border-[#d4dde6] px-3 py-2.5 text-[#0f2f4f] outline-none ring-[#d3b06a] focus:ring-2"
          />
          {state?.ok === false && state.fieldErrors?.message?.[0] ? (
            <p className="mt-1 text-xs text-red-600">
              {state.fieldErrors.message[0]}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="imageUrl"
            className="block text-sm font-medium text-[#0f2f4f]"
          >
            Reference photo URL{" "}
            <span className="font-normal text-[#4f6479]">(optional)</span>
          </label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="url"
            placeholder="https://…"
            className="mt-1 w-full rounded-lg border border-[#d4dde6] px-3 py-2.5 text-[#0f2f4f] outline-none ring-[#d3b06a] focus:ring-2"
          />
          {state?.ok === false && state.fieldErrors?.imageUrl?.[0] ? (
            <p className="mt-1 text-xs text-red-600">
              {state.fieldErrors.imageUrl[0]}
            </p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-[#0f2f4f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0b2239] disabled:opacity-60 sm:w-auto"
        >
          {pending ? "Sending…" : "Submit request"}
        </button>
      </form>
    </div>
  );
}

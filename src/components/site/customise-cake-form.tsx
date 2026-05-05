"use client";

import {
  createCustomCakeOrder,
  type CreateCustomCakeOrderState,
} from "@/actions/orders";
import { useActionState } from "react";

const initial: CreateCustomCakeOrderState = {
  ok: false,
  message: "",
};

export function CustomiseCakeForm() {
  const [state, formAction, pending] = useActionState(createCustomCakeOrder, initial);

  return (
    <section className="mx-auto max-w-3xl rounded-3xl border border-[#d4dde6] bg-white p-6 shadow-sm sm:p-8">
      <h1 className="font-serif text-3xl font-semibold text-[#0f2f4f]">Customise your cake</h1>
      <p className="mt-2 text-sm text-[#4f6479]">
        Tell us your exact preferences and upload a reference image. We will contact you
        to confirm pricing and availability.
      </p>

      {state?.ok ? (
        <p className="mt-5 rounded-xl bg-[#e8f5e9] px-4 py-3 text-sm font-medium text-[#1b5e20]">
          {state.message}
        </p>
      ) : null}

      {state?.ok === false && state.message ? (
        <p className="mt-5 text-sm text-red-600">{state.message}</p>
      ) : null}

      <form
        key={state?.ok ? "reset" : "form"}
        action={formAction}
        className="mt-6 space-y-5"
        encType="multipart/form-data"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="customerName" className="block text-sm font-medium text-[#0f2f4f]">
              Your name
            </label>
            <input
              id="customerName"
              name="customerName"
              required
              className="mt-1 w-full rounded-lg border border-[#d4dde6] px-3 py-2.5 text-[#0f2f4f] outline-none ring-[#d3b06a] focus:ring-2"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-[#0f2f4f]">
              Phone (WhatsApp)
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              className="mt-1 w-full rounded-lg border border-[#d4dde6] px-3 py-2.5 text-[#0f2f4f] outline-none ring-[#d3b06a] focus:ring-2"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="eventDate" className="block text-sm font-medium text-[#0f2f4f]">
              Event date
            </label>
            <input
              id="eventDate"
              name="eventDate"
              type="date"
              required
              className="mt-1 w-full rounded-lg border border-[#d4dde6] px-3 py-2.5 text-[#0f2f4f] outline-none ring-[#d3b06a] focus:ring-2"
            />
          </div>
          <div>
            <label htmlFor="servings" className="block text-sm font-medium text-[#0f2f4f]">
              Servings needed
            </label>
            <input
              id="servings"
              name="servings"
              required
              placeholder="e.g. 25-30 people"
              className="mt-1 w-full rounded-lg border border-[#d4dde6] px-3 py-2.5 text-[#0f2f4f] outline-none ring-[#d3b06a] focus:ring-2"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="flavour" className="block text-sm font-medium text-[#0f2f4f]">
              Flavour preference
            </label>
            <input
              id="flavour"
              name="flavour"
              required
              placeholder="e.g. Belgian chocolate"
              className="mt-1 w-full rounded-lg border border-[#d4dde6] px-3 py-2.5 text-[#0f2f4f] outline-none ring-[#d3b06a] focus:ring-2"
            />
          </div>
          <div>
            <label htmlFor="cakeShape" className="block text-sm font-medium text-[#0f2f4f]">
              Cake shape
            </label>
            <input
              id="cakeShape"
              name="cakeShape"
              required
              placeholder="e.g. Round"
              className="mt-1 w-full rounded-lg border border-[#d4dde6] px-3 py-2.5 text-[#0f2f4f] outline-none ring-[#d3b06a] focus:ring-2"
            />
          </div>
        </div>

        <div>
          <label htmlFor="designNotes" className="block text-sm font-medium text-[#0f2f4f]">
            Design notes
          </label>
          <textarea
            id="designNotes"
            name="designNotes"
            required
            rows={5}
            placeholder="Theme, colors, text on cake, decorations, and anything else."
            className="mt-1 w-full rounded-lg border border-[#d4dde6] px-3 py-2.5 text-[#0f2f4f] outline-none ring-[#d3b06a] focus:ring-2"
          />
        </div>

        <div>
          <label htmlFor="referenceImage" className="block text-sm font-medium text-[#0f2f4f]">
            Reference image (required)
          </label>
          <input
            id="referenceImage"
            name="referenceImage"
            type="file"
            required
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="mt-1 w-full rounded-lg border border-[#d4dde6] bg-white px-3 py-2.5 text-sm text-[#0f2f4f] file:mr-3 file:rounded-md file:border-0 file:bg-[#e6edf4] file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-[#1f4568] hover:file:bg-[#d6e2ef]"
          />
          <p className="mt-1 text-xs text-[#4f6479]">PNG, JPG, WEBP or GIF. Max 8MB.</p>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-[#0f2f4f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0b2239] disabled:opacity-60 sm:w-auto"
        >
          {pending ? "Submitting..." : "Submit custom order"}
        </button>
      </form>
    </section>
  );
}

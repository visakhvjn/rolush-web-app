"use client";

import { placeCartOrder, type PlaceCartOrderState } from "@/actions/orders";
import { useActionState, useEffect, useMemo, useState } from "react";

type CartItem = {
  id: string;
  name: string;
  price: string;
  quantity: number;
  size?: string;
  cakeMessage?: string;
  shape?: string;
  tier?: string;
  addons?: string[];
};

const CART_STORAGE_KEY = "rolush-cart";

const initialState: PlaceCartOrderState = {
  ok: false,
  message: "",
};

function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
  } catch {
    return [];
  }
}

function parsePrice(value: string): number {
  const numeric = Number.parseFloat(value.replace(/[^0-9.]/g, ""));
  return Number.isNaN(numeric) ? 0 : numeric;
}

export function CartPage() {
  const [cart, setCart] = useState<CartItem[]>(readCart);
  const [state, formAction, pending] = useActionState(placeCartOrder, initialState);

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + parsePrice(item.price) * item.quantity, 0),
    [cart],
  );

  function writeCart(next: CartItem[]) {
    setCart(next);
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("rolush-cart-updated"));
  }

  function updateQuantity(id: string, delta: number) {
    const next = cart
      .map((item) =>
        item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item,
      )
      .filter((item) => item.quantity > 0);
    writeCart(next);
  }

  function removeItem(id: string) {
    writeCart(cart.filter((item) => item.id !== id));
  }

  useEffect(() => {
    if (state.ok) {
      writeCart([]);
    }
  }, [state.ok]);

  return (
    <section className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.4fr_1fr]">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-[#0f2f4f] sm:text-4xl">Your Cart</h1>
        {cart.length === 0 ? (
          <p className="mt-6 rounded-2xl border border-[#d4dde6] bg-white p-6 text-[#4f6479] shadow-sm">
            Your cart is empty. Add cakes to place an order.
          </p>
        ) : (
          <div className="mt-6 space-y-4">
            {cart.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-[#d4dde6] bg-white p-4 shadow-sm"
              >
                <p className="font-medium text-[#0f2f4f]">{item.name}</p>
                {item.cakeMessage ? (
                  <p className="mt-1 text-xs text-[#4f6479]">
                    Message: <span className="font-medium text-[#35506a]">{item.cakeMessage}</span>
                  </p>
                ) : null}
                {item.shape ? (
                  <p className="mt-1 text-xs text-[#4f6479]">
                    Shape: <span className="font-medium text-[#35506a]">{item.shape}</span>
                  </p>
                ) : null}
                {item.tier ? (
                  <p className="mt-1 text-xs text-[#4f6479]">
                    Tier: <span className="font-medium text-[#35506a]">{item.tier}</span>
                  </p>
                ) : null}
                {item.addons && item.addons.length > 0 ? (
                  <p className="mt-1 text-xs text-[#4f6479]">
                    Add-ons: <span className="font-medium text-[#35506a]">{item.addons.join(", ")}</span>
                  </p>
                ) : null}
                <p className="mt-1 text-sm text-[#4f6479]">{item.price}</p>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, -1)}
                    className="rounded-md border border-[#d4dde6] px-2 py-1 text-sm text-[#0f2f4f]"
                  >
                    -
                  </button>
                  <span className="min-w-6 text-center text-sm font-medium text-[#0f2f4f]">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, 1)}
                    className="rounded-md border border-[#d4dde6] px-2 py-1 text-sm text-[#0f2f4f]"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="ml-3 text-xs font-medium text-[#b24a4a] hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-[#d4dde6] bg-white p-6 shadow-sm">
        <h2 className="font-serif text-2xl font-semibold text-[#0f2f4f]">Checkout</h2>
        <p className="mt-3 text-sm text-[#4f6479]">
          Total: <span className="font-semibold text-[#0f2f4f]">Rs {total.toFixed(2)}</span>
        </p>

        {state.ok ? (
          <p className="mt-4 rounded-xl bg-[#e8f5e9] px-4 py-3 text-sm font-medium text-[#1b5e20]">
            {state.message}
          </p>
        ) : null}
        {!state.ok && state.message ? (
          <p className="mt-4 text-sm text-red-600">{state.message}</p>
        ) : null}

        <form action={formAction} className="mt-5 space-y-4">
          <input type="hidden" name="cartItemsJson" value={JSON.stringify(cart)} />
          <div>
            <label className="block text-sm font-medium text-[#35506a]" htmlFor="customerName">
              Name
            </label>
            <input
              id="customerName"
              name="customerName"
              required
              className="mt-1 w-full rounded-lg border border-[#d4dde6] px-3 py-2 text-sm outline-none ring-[#d3b06a] focus:ring-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#35506a]" htmlFor="phone">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              required
              className="mt-1 w-full rounded-lg border border-[#d4dde6] px-3 py-2 text-sm outline-none ring-[#d3b06a] focus:ring-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#35506a]" htmlFor="email">
              Email (optional)
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="mt-1 w-full rounded-lg border border-[#d4dde6] px-3 py-2 text-sm outline-none ring-[#d3b06a] focus:ring-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#35506a]" htmlFor="eventDate">
              Delivery / Event Date (optional)
            </label>
            <input
              id="eventDate"
              name="eventDate"
              type="date"
              className="mt-1 w-full rounded-lg border border-[#d4dde6] px-3 py-2 text-sm outline-none ring-[#d3b06a] focus:ring-2"
            />
          </div>
          <button
            type="submit"
            disabled={pending || cart.length === 0}
            className="w-full rounded-full bg-[#0f2f4f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0b2239] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Placing..." : "Final Place Order"}
          </button>
        </form>
      </div>
    </section>
  );
}

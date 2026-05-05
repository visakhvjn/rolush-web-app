"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const CART_STORAGE_KEY = "rolush-cart";

type CartEntry = { quantity?: number };

function getCartCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return 0;
    return parsed.reduce(
      (total: number, item: CartEntry) => total + (typeof item.quantity === "number" ? item.quantity : 0),
      0,
    );
  } catch {
    return 0;
  }
}

export function CartNavButton() {
  const [count, setCount] = useState(() => getCartCount());

  useEffect(() => {
    const refresh = () => setCount(getCartCount());
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("rolush-cart-updated", refresh as EventListener);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("rolush-cart-updated", refresh as EventListener);
    };
  }, []);

  if (count <= 0) return null;

  return (
    <Link
      href="/cart"
      className="inline-flex items-center rounded-full border border-[#d4dde6] bg-white px-4 py-2 text-sm font-medium text-[#0f2f4f] transition hover:bg-[#edf2f8]"
    >
      Cart ({count})
    </Link>
  );
}

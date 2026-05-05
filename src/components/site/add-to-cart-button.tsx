"use client";

import { useState } from "react";

type CartItem = {
  id: string;
  name: string;
  price: string;
  quantity: number;
  size?: string;
};

type AddToCartButtonProps = {
  item: {
    id: string;
    name: string;
    price: string;
  };
  sizeOptions?: string[];
  defaultSize?: string;
  className?: string;
};

const CART_STORAGE_KEY = "rolush-cart";

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

export function AddToCartButton({
  item,
  sizeOptions = [],
  defaultSize,
  className,
}: AddToCartButtonProps) {
  const [label, setLabel] = useState("Add to cart");
  const [selectedSize, setSelectedSize] = useState(
    defaultSize ?? sizeOptions[0] ?? "",
  );

  function onAddToCart() {
    const cart = readCart();
    const cartKey = selectedSize ? `${item.id}:${selectedSize}` : item.id;
    const existing = cart.find((cartItem) => cartItem.id === cartKey);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: cartKey,
        name: selectedSize ? `${item.name} (${selectedSize})` : item.name,
        price: item.price,
        quantity: 1,
        size: selectedSize || undefined,
      });
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event("rolush-cart-updated"));
    setLabel("Added");
    window.setTimeout(() => setLabel("Add to cart"), 1200);
  }

  return (
    <div className="space-y-3">
      {sizeOptions.length > 0 ? (
        <div>
          <label htmlFor="cake-size" className="mb-1 block text-sm font-medium text-[#35506a]">
            Cake size
          </label>
          <select
            id="cake-size"
            value={selectedSize}
            onChange={(event) => setSelectedSize(event.target.value)}
            className="w-full max-w-xs rounded-lg border border-[#d4dde6] bg-white px-3 py-2 text-sm text-[#0f2f4f] outline-none ring-[#d3b06a] focus:ring-2"
          >
            {sizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      ) : null}
      <button
        type="button"
        onClick={onAddToCart}
        className={
          className ||
          "rounded-full bg-[#0f2f4f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0b2239]"
        }
      >
        {label}
      </button>
    </div>
  );
}

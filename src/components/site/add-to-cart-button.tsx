"use client";

import { useState } from "react";

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

type AddToCartButtonProps = {
  item: {
    id: string;
    name: string;
    price: string;
  };
  sizeOptions?: string[];
  defaultSize?: string;
  shapeOptions?: string[];
  tierOptions?: string[];
  addonOptions?: string[];
  className?: string;
  enableCakeMessage?: boolean;
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
  shapeOptions = [],
  tierOptions = [],
  addonOptions = [],
  className,
  enableCakeMessage = false,
}: AddToCartButtonProps) {
  const [label, setLabel] = useState("Add to cart");
  const [selectedSize, setSelectedSize] = useState(
    defaultSize ?? sizeOptions[0] ?? "",
  );
  const [cakeMessage, setCakeMessage] = useState("");
  const [selectedShape, setSelectedShape] = useState(shapeOptions[0] ?? "");
  const [selectedTier, setSelectedTier] = useState(tierOptions[0] ?? "");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  function onAddToCart() {
    const cart = readCart();
    const trimmedMessage = cakeMessage.trim();
    const cartKey = `${item.id}:${selectedSize || "default"}:${selectedShape || "default"}:${
      selectedTier || "default"
    }:${selectedAddons.sort().join("|") || "-"}:${trimmedMessage || "-"}`;
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
        cakeMessage: trimmedMessage || undefined,
        shape: selectedShape || undefined,
        tier: selectedTier || undefined,
        addons: selectedAddons.length > 0 ? selectedAddons : undefined,
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
      {shapeOptions.length > 0 ? (
        <div>
          <label htmlFor="cake-shape" className="mb-1 block text-sm font-medium text-[#35506a]">
            Cake shape
          </label>
          <select
            id="cake-shape"
            value={selectedShape}
            onChange={(event) => setSelectedShape(event.target.value)}
            className="w-full max-w-xs rounded-lg border border-[#d4dde6] bg-white px-3 py-2 text-sm text-[#0f2f4f] outline-none ring-[#d3b06a] focus:ring-2"
          >
            {shapeOptions.map((shape) => (
              <option key={shape} value={shape}>
                {shape}
              </option>
            ))}
          </select>
        </div>
      ) : null}
      {tierOptions.length > 0 ? (
        <div>
          <label htmlFor="cake-tier" className="mb-1 block text-sm font-medium text-[#35506a]">
            Cake tier
          </label>
          <select
            id="cake-tier"
            value={selectedTier}
            onChange={(event) => setSelectedTier(event.target.value)}
            className="w-full max-w-xs rounded-lg border border-[#d4dde6] bg-white px-3 py-2 text-sm text-[#0f2f4f] outline-none ring-[#d3b06a] focus:ring-2"
          >
            {tierOptions.map((tier) => (
              <option key={tier} value={tier}>
                {tier}
              </option>
            ))}
          </select>
        </div>
      ) : null}
      {addonOptions.length > 0 ? (
        <fieldset>
          <legend className="mb-1 block text-sm font-medium text-[#35506a]">Add-ons</legend>
          <div className="flex flex-wrap gap-3">
            {addonOptions.map((addon) => (
              <label key={addon} className="inline-flex items-center gap-2 text-sm text-[#35506a]">
                <input
                  type="checkbox"
                  checked={selectedAddons.includes(addon)}
                  onChange={(event) =>
                    setSelectedAddons((prev) =>
                      event.target.checked
                        ? [...prev, addon]
                        : prev.filter((item) => item !== addon),
                    )
                  }
                />
                {addon}
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}
      {enableCakeMessage ? (
        <div>
          <label
            htmlFor="cake-message"
            className="mb-1 block text-sm font-medium text-[#35506a]"
          >
            Message on cake (optional)
          </label>
          <textarea
            id="cake-message"
            value={cakeMessage}
            onChange={(event) => setCakeMessage(event.target.value)}
            rows={3}
            placeholder="e.g. Happy Birthday Aisha"
            className="w-full max-w-md rounded-lg border border-[#d4dde6] bg-white px-3 py-2 text-sm text-[#0f2f4f] outline-none ring-[#d3b06a] focus:ring-2"
          />
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

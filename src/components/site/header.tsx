"use client";

import Image from "next/image";
import Link from "next/link";
import { CartNavButton } from "@/components/site/cart-nav-button";
import { useState } from "react";

const nav = [
  { href: "/", label: "Home" },
  { href: "/customise-your-cake", label: "Customise your cake" },
  { href: "/#journey", label: "About Us" },
  { href: "/#locate", label: "Locate Us" },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#1f4568] bg-[#0f2f4f]/95 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Rolush home">
            <Image
              src="/images/logo.png"
              alt="Rolush"
              width={84}
              height={84}
              className="h-10 w-10 rounded-sm object-contain"
              priority
            />
            <span className="font-serif text-xl font-semibold text-white">
              Rolush<span className="text-[#d3b06a]">.</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <nav className="flex items-center gap-6 text-sm font-medium text-[#d4dde6]">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="transition hover:text-[#d3b06a]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <CartNavButton />
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-white px-4 py-2 text-[#0f2f4f] transition hover:bg-[#edf2f8]"
              >
                WhatsApp
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <CartNavButton />
            <button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((prev) => !prev)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#35506a] text-white"
            >
              <span className="text-lg leading-none">{mobileOpen ? "×" : "☰"}</span>
            </button>
          </div>
        </div>

        <div className={`${mobileOpen ? "mt-3 block" : "hidden"} md:hidden`}>
          <nav className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#d4dde6]">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-full border border-[#35506a] px-3 py-1.5 transition hover:border-[#d3b06a] hover:text-[#d3b06a]"
              >
                {item.label}
              </Link>
            ))}
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white px-3 py-1.5 text-[#0f2f4f] transition hover:bg-[#edf2f8]"
            >
              WhatsApp
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}

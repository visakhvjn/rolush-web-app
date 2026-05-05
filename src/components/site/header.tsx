import Link from "next/link";
import { CartNavButton } from "@/components/site/cart-nav-button";

const nav = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About Us" },
  { href: "/#locate", label: "Locate Us" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#d4dde6]/80 bg-[#f3f6fa]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="font-serif text-xl font-semibold text-[#0f2f4f]">
          Rolush<span className="text-[#d3b06a]">.</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-[#35506a]">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-[#d3b06a]"
            >
              {item.label}
            </Link>
          ))}
          <CartNavButton />
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-[#0f2f4f] px-4 py-2 text-white transition hover:bg-[#0b2239]"
          >
            WhatsApp
          </a>
        </nav>
      </div>
    </header>
  );
}

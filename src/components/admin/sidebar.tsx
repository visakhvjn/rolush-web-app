"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/admin/logout-button";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/items", label: "Items" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/orders", label: "Orders" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-b border-[#d4dde6] bg-[#0f2f4f] p-4 lg:flex lg:min-h-screen lg:w-64 lg:flex-col lg:border-b-0 lg:border-r lg:border-r-[#214566]">
      <div className="mb-6">
        <Link href="/admin" className="font-serif text-lg font-semibold text-[#f5f8fc]">
          Rolush admin
        </Link>
      </div>

      <nav className="flex gap-2 lg:flex-1 lg:flex-col">
        {links.map((link) => {
          const active =
            pathname === link.href ||
            (link.href !== "/admin" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-sm transition ${
                active
                  ? "bg-[#d3b06a] font-medium text-[#0f2f4f]"
                  : "text-[#c3d4e4] hover:bg-[#1a3f61]"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-4 border-t border-[#214566] pt-4">
        <LogoutButton className="text-sm text-[#c3d4e4] hover:text-white" />
      </div>

    </aside>
  );
}

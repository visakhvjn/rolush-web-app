import { getDashboardStats } from "@/actions/items";

const cards = [
  { key: "ordersTotal", label: "Total orders" },
  { key: "ordersNew", label: "New orders" },
  { key: "itemsTotal", label: "Total items" },
  { key: "itemsActive", label: "Active items" },
] as const;

export default async function AdminPage() {
  const stats = await getDashboardStats();

  return (
    <main className="px-4 py-8 lg:px-8">
      <h1 className="font-serif text-2xl font-semibold text-[#0f2f4f]">Dashboard</h1>
      <p className="mt-1 text-sm text-[#4f6479]">
        Quick analytics snapshot for orders and menu items.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <section
            key={card.key}
            className="rounded-xl border border-[#d4dde6] bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-[#4f6479]">{card.label}</p>
            <p className="mt-2 font-serif text-3xl font-semibold text-[#0f2f4f]">
              {stats[card.key]}
            </p>
          </section>
        ))}
      </div>
    </main>
  );
}

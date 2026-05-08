import { listActiveItems, type ItemWithImages } from "@/actions/items";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { AddToCartButton } from "@/components/site/add-to-cart-button";
import { optimizeCloudinaryImageUrl } from "@/lib/cloudinary-url";
import Link from "next/link";
import Image from "next/image";

const categoryPriority: Record<string, number> = {
  premium: 1,
  regular: 2,
  snack: 3,
  beverage: 4,
};

function parsePrice(value: string): number {
  const numeric = Number.parseFloat(value.replace(/[^0-9.]/g, ""));
  return Number.isNaN(numeric) ? 0 : numeric;
}

function getEffectivePrice(item: ItemWithImages): number {
  return parsePrice(item.discountedPrice || item.price);
}

function getCategoryOrder(category: string): number {
  const lower = category.toLowerCase();
  if (lower.includes("premium")) return categoryPriority.premium;
  if (lower.includes("regular")) return categoryPriority.regular;
  if (lower.includes("snack")) return categoryPriority.snack;
  if (lower.includes("beverage")) return categoryPriority.beverage;
  return 99;
}

export default async function MenuPage() {
  const items = await listActiveItems();
  const ordered = [...items].sort((a, b) => {
    const categoryDiff = getCategoryOrder(a.category) - getCategoryOrder(b.category);
    if (categoryDiff !== 0) return categoryDiff;
    return getEffectivePrice(b) - getEffectivePrice(a);
  });

  return (
    <>
      <SiteHeader />
      <main className="px-4 py-16">
        <section className="mx-auto max-w-6xl">
          <h1 className="font-serif text-4xl font-semibold text-[#0f2f4f]">Menu</h1>
          <p className="mt-3 max-w-3xl text-[#4f6479]">
            Browse our items from premium to regular picks. Open any item for details and add it to your order.
          </p>

          {ordered.length === 0 ? (
            <p className="mt-10 rounded-2xl border border-[#d4dde6] bg-white p-6 text-sm text-[#4f6479] shadow-sm">
              No menu items are available right now.
            </p>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {ordered.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-[#d4dde6] bg-white p-5 shadow-sm"
                >
                  {item.images[0] ? (
                    <Image
                      src={optimizeCloudinaryImageUrl(item.images[0], {
                        width: 1200,
                        height: 900,
                      })}
                      alt={item.name}
                      className="aspect-[4/3] w-full rounded-xl object-cover"
                      width={800}
                      height={600}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="aspect-[4/3] w-full rounded-xl bg-gradient-to-br from-[#dbe5f0] to-[#a7bcd1]" />
                  )}
                  <p className="mt-4 text-xs font-medium uppercase tracking-wide text-[#b8944f]">
                    {item.category}
                  </p>
                  <h2 className="mt-2 font-serif text-xl font-semibold text-[#0f2f4f]">
                    {item.name}
                  </h2>
                  <p className="mt-2 text-sm text-[#4f6479]">
                    {item.description || "Freshly made for your occasion."}
                  </p>
                  <p className="mt-3 text-base font-semibold text-[#0f2f4f]">
                    {item.discountedPrice || item.price}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      href={`/items/${item.id}`}
                      className="inline-flex rounded-full bg-[#0f2f4f] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0b2239]"
                    >
                      View Details
                    </Link>
                    <AddToCartButton
                      item={{
                        id: item.id,
                        name: item.name,
                        price: item.discountedPrice || item.price,
                      }}
                      className="inline-flex rounded-full border border-[#d4dde6] bg-white px-4 py-2 text-sm font-medium text-[#0f2f4f] transition hover:border-[#d3b06a]"
                    />
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

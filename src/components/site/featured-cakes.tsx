import type { ItemWithImages } from "@/actions/items";
import { AddToCartButton } from "@/components/site/add-to-cart-button";
import Link from "next/link";

type FeaturedCakesProps = {
  items: ItemWithImages[];
};

export function FeaturedCakes({ items }: FeaturedCakesProps) {
  if (items.length === 0) return null;

  return (
    <section className="border-y border-[#d4dde6] bg-[#f7f1e6] px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-serif text-3xl font-semibold text-[#0f2f4f] sm:text-4xl">
          Featured Cakes
        </h2>
        <p className="mt-3 max-w-2xl text-[#4f6479]">
          Our highlighted picks for this season. Explore details and order your favorite.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-[#d4dde6] bg-white p-5 shadow-sm"
            >
              {item.images[0] ? (
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="aspect-[4/3] w-full rounded-xl object-cover"
                />
              ) : (
                <div className="aspect-[4/3] w-full rounded-xl bg-gradient-to-br from-[#dbe5f0] to-[#a7bcd1]" />
              )}
              <p className="mt-4 text-xs font-medium uppercase tracking-wide text-[#b8944f]">
                {item.category}
              </p>
              <h3 className="mt-2 font-serif text-xl font-semibold text-[#0f2f4f]">
                {item.name}
              </h3>
              {item.description ? (
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#4f6479]">
                  {item.description}
                </p>
              ) : null}
              <p className="mt-3 text-sm font-semibold text-[#0f2f4f]">
                {item.discountedPrice || item.price}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={`/items/${item.id}`}
                  className="inline-flex rounded-full bg-[#0f2f4f] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0b2239]"
                >
                  View details
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
      </div>
    </section>
  );
}

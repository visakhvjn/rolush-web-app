import type { ItemWithImages } from "@/actions/items";
import { optimizeCloudinaryImageUrl } from "@/lib/cloudinary-url";
import Link from "next/link";

type SiteServicesProps = {
  items: ItemWithImages[];
};

export function SiteServices({ items }: SiteServicesProps) {
  return (
    <section className="border-y border-[#d4dde6] bg-[#edf2f8] px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-serif text-3xl font-semibold text-[#0f2f4f] sm:text-4xl">
          What we bake
        </h2>
        <p className="mt-3 max-w-2xl text-[#4f6479]">
          Every order is made to order. Share your brief — we will guide portions
          and timelines.
        </p>
        {items.length === 0 ? (
          <p className="mt-12 rounded-2xl border border-[#d4dde6] bg-white p-6 text-sm text-[#4f6479] shadow-sm">
            No items are available right now. Please check back soon.
          </p>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <Link
                key={item.id}
                href={`/items/${item.id}`}
                className="block rounded-2xl border border-[#d4dde6] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#d3b06a]"
              >
                {item.images[0] ? (
                  <img
                    src={optimizeCloudinaryImageUrl(item.images[0], {
                      width: 1200,
                      height: 900,
                    })}
                    alt={item.name}
                    className="mb-4 aspect-[4/3] w-full rounded-xl object-cover"
                  />
                ) : (
                  <div className="mb-4 aspect-[4/3] w-full rounded-xl bg-gradient-to-br from-[#dbe5f0] to-[#a7bcd1]" />
                )}
                <p className="text-xs font-medium uppercase tracking-wide text-[#b8944f]">
                  {item.category}
                </p>
                <h3 className="mt-2 font-serif text-xl font-semibold text-[#0f2f4f]">
                  {item.name}
                </h3>
                {item.description ? (
                  <p className="mt-3 text-sm leading-relaxed text-[#4f6479]">
                    {item.description}
                  </p>
                ) : null}
                <div className="mt-4 flex items-end gap-2">
                  {item.discountedPrice ? (
                    <>
                      <p className="text-xs text-[#6d8196] line-through">{item.price}</p>
                      <p className="text-sm font-semibold text-[#0f2f4f]">
                        {item.discountedPrice}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm font-semibold text-[#0f2f4f]">{item.price}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

"use client";

import type { ItemWithImages } from "@/actions/items";
import { AddToCartButton } from "@/components/site/add-to-cart-button";
import type { CategoryRow } from "@/db/schema";
import Link from "next/link";
import { useMemo, useState } from "react";

type SiteCategoriesProps = {
  categories: CategoryRow[];
  items: ItemWithImages[];
};

export function SiteCategories({ categories, items }: SiteCategoriesProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    categories[0]?.id ?? null,
  );
  const [showAllForSelected, setShowAllForSelected] = useState(false);

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === selectedCategoryId),
    [categories, selectedCategoryId],
  );

  const categoryItems = useMemo(() => {
    if (!selectedCategory) return [];
    return items.filter((item) => item.category === selectedCategory.name);
  }, [items, selectedCategory]);
  const visibleItems = showAllForSelected ? categoryItems : categoryItems.slice(0, 8);

  return (
    <section id="categories" className="scroll-mt-24 bg-[#eef3f9] px-4 py-20">
      <div className="mx-auto max-w-6xl">
        {categories.length === 0 ? (
          <p className="mt-12 rounded-2xl border border-[#d4dde6] bg-white p-6 text-sm text-[#4f6479] shadow-sm">
            Categories will show here once they are added in the admin panel.
          </p>
        ) : (
          <>
            <div className="mt-12 flex flex-wrap justify-center gap-5">
              {categories.map((category) => {
                const isSelected = category.id === selectedCategoryId;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategoryId(category.id);
                      setShowAllForSelected(false);
                    }}
                    className="group flex w-[120px] flex-col items-center text-center sm:w-[140px]"
                  >
                    <span
                      className={`relative flex h-[100px] w-[100px] items-center justify-center overflow-hidden rounded-full border-2 transition sm:h-[120px] sm:w-[120px] ${
                        isSelected
                          ? "border-[#d3b06a] ring-4 ring-[#d3b06a]/20"
                          : "border-[#d4dde6] group-hover:border-[#d3b06a]/60"
                      }`}
                    >
                      {category.imageUrl ? (
                        <img
                          src={category.imageUrl}
                          alt={category.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="h-full w-full bg-gradient-to-br from-[#dbe5f0] to-[#a7bcd1]" />
                      )}
                    </span>
                    <span className="mt-2 text-sm font-medium text-[#0f2f4f]">{category.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-10 text-center">
              {selectedCategory ? (
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-[#0f2f4f]">
                    {selectedCategory.name} Cakes
                  </h3>
                  {selectedCategory.description ? (
                    <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-[#4f6479]">
                      {selectedCategory.description}
                    </p>
                  ) : null}
                </div>
              ) : null}
              {categoryItems.length === 0 ? (
                <p className="mt-4 rounded-2xl border border-[#d4dde6] bg-white p-5 text-sm text-[#4f6479] shadow-sm">
                  No cakes found in this category yet.
                </p>
              ) : (
                <>
                  <div className="mx-auto mt-6 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {visibleItems.map((item) => (
                      <article
                        key={item.id}
                        className="rounded-2xl border border-[#d4dde6] bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#d3b06a]"
                      >
                        {item.images[0] ? (
                          <img
                            src={item.images[0]}
                            alt={item.name}
                            className="aspect-square w-full rounded-xl object-cover"
                          />
                        ) : (
                          <div className="aspect-square w-full rounded-xl bg-gradient-to-br from-[#dbe5f0] to-[#a7bcd1]" />
                        )}
                        <p className="mt-3 line-clamp-1 text-sm font-medium text-[#0f2f4f]">{item.name}</p>
                        {item.description ? (
                          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#4f6479]">
                            {item.description}
                          </p>
                        ) : null}
                        <p className="mt-1 text-xs font-semibold text-[#35506a]">
                          {item.discountedPrice || item.price}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Link
                            href={`/items/${item.id}`}
                            className="inline-flex rounded-full bg-[#0f2f4f] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[#0b2239]"
                          >
                            View details
                          </Link>
                          <AddToCartButton
                            item={{
                              id: item.id,
                              name: item.name,
                              price: item.discountedPrice || item.price,
                            }}
                            className="inline-flex rounded-full border border-[#d4dde6] bg-white px-3 py-1.5 text-xs font-medium text-[#0f2f4f] transition hover:border-[#d3b06a]"
                          />
                        </div>
                      </article>
                    ))}
                  </div>
                  {categoryItems.length > 8 ? (
                    <button
                      type="button"
                      onClick={() => setShowAllForSelected((prev) => !prev)}
                      className="mt-6 rounded-full border border-[#d4dde6] bg-white px-5 py-2 text-sm font-medium text-[#0f2f4f] transition hover:border-[#d3b06a]"
                    >
                      {showAllForSelected ? "View less" : "View more"}
                    </button>
                  ) : null}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

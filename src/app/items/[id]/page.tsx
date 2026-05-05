import { getActiveItemById } from "@/actions/items";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { AddToCartButton } from "@/components/site/add-to-cart-button";
import { ItemImageCarousel } from "@/components/site/item-image-carousel";
import { notFound } from "next/navigation";

type ItemDetailsPageProps = {
  params: Promise<{ id: string }>;
};

function parseOptionList(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((value) => String(value).trim())
      .filter((value) => value.length > 0);
  } catch {
    return [];
  }
}

export default async function ItemDetailsPage({ params }: ItemDetailsPageProps) {
  const { id } = await params;
  const item = await getActiveItemById(id);

  if (!item) {
    notFound();
  }

  const weightOptions = parseOptionList(item.cakeWeights);
  const shapeOptions = parseOptionList(item.cakeShapes);
  const tierOptions = parseOptionList(item.cakeTiers);
  const addonOptions = parseOptionList(item.cakeAddons);

  return (
    <>
      <SiteHeader />
      <main className="px-4 py-16">
        <article className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <ItemImageCarousel images={item.images} name={item.name} />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[#b8944f]">
              {item.category}
            </p>
            <h1 className="mt-2 font-serif text-3xl font-semibold text-[#0f2f4f] sm:text-4xl">
              {item.name}
            </h1>
            <div className="mt-4 flex items-end gap-3">
              {item.discountedPrice ? (
                <>
                  <p className="text-sm text-[#6d8196] line-through">{item.price}</p>
                  <p className="text-lg font-semibold text-[#0f2f4f]">{item.discountedPrice}</p>
                </>
              ) : (
                <p className="text-lg font-semibold text-[#0f2f4f]">{item.price}</p>
              )}
            </div>
            <p className="mt-5 text-sm leading-relaxed text-[#4f6479]">
              {item.description || "Freshly made and customizable for your occasion."}
            </p>
            <div className="mt-8">
              <AddToCartButton
                item={{
                  id: item.id,
                  name: item.name,
                  price: item.discountedPrice || item.price,
                }}
                sizeOptions={weightOptions.length > 0 ? weightOptions : ["Half Pound", "1 Pound"]}
                defaultSize={weightOptions[0] ?? "1 Pound"}
                shapeOptions={shapeOptions}
                tierOptions={tierOptions}
                addonOptions={addonOptions}
                enableCakeMessage
              />
            </div>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

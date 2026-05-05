import { listPublicCategories } from "@/actions/categories";
import { listActiveItems, listFeaturedItems } from "@/actions/items";
import { SiteCategories } from "@/components/site/categories";
import { FeaturedCakes } from "@/components/site/featured-cakes";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { SiteHero } from "@/components/site/hero";
import { SiteJourney } from "@/components/site/journey";
import { SiteLocateUs } from "@/components/site/locate-us";

export default async function HomePage() {
  const [items, categories, featuredItems] = await Promise.all([
    listActiveItems(),
    listPublicCategories(),
    listFeaturedItems(),
  ]);

  return (
    <>
      <SiteHeader />
      <SiteHero />
      <FeaturedCakes items={featuredItems} />
      <SiteCategories categories={categories} items={items} />
      <SiteJourney />
      <SiteLocateUs />
      <SiteFooter />
    </>
  );
}

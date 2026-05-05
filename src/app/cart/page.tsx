import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { CartPage } from "@/components/site/cart-page";

export default function CartRoutePage() {
  return (
    <>
      <SiteHeader />
      <main className="px-4 py-16">
        <CartPage />
      </main>
      <SiteFooter />
    </>
  );
}

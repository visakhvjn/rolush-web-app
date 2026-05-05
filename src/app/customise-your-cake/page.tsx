import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { CustomiseCakeForm } from "@/components/site/customise-cake-form";

export default function CustomiseYourCakePage() {
  return (
    <>
      <SiteHeader />
      <main className="px-4 py-10 lg:px-8">
        <CustomiseCakeForm />
      </main>
      <SiteFooter />
    </>
  );
}

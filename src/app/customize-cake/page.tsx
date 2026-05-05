import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";

const flavours = ["Chocolate", "Vanilla", "Red Velvet", "Butterscotch"];
const weights = ["500g", "1kg", "2kg"];
const shapes = ["Round", "Square", "Heart", "Custom"];
const tiers = ["Single Tier", "2 Tier", "Multi Tier"];
const addOns = ["Flowers", "Berries", "Accessories"];

export default function CustomizeCakePage() {
  return (
    <>
      <SiteHeader />
      <main className="px-4 py-16">
        <section className="mx-auto max-w-3xl rounded-3xl border border-[#d4dde6] bg-white p-8 shadow-sm sm:p-10">
          <h1 className="font-serif text-3xl font-semibold text-[#0f2f4f] sm:text-4xl">
            Customize Your Cake
          </h1>
          <p className="mt-3 text-[#4f6479]">
            Choose your cake preferences below, then continue to the order form.
          </p>

          <form action="/#order" className="mt-8 space-y-5">
            <div>
              <label htmlFor="flavour" className="block text-sm font-medium text-[#0f2f4f]">
                Cake Flavour
              </label>
              <select
                id="flavour"
                name="flavour"
                required
                className="mt-1 w-full rounded-lg border border-[#d4dde6] px-3 py-2.5 text-[#0f2f4f] outline-none ring-[#d3b06a] focus:ring-2"
              >
                <option value="">Select flavour</option>
                {flavours.map((flavour) => (
                  <option key={flavour} value={flavour}>
                    {flavour}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-[#0f2f4f]">
                  Cake Weight
                </label>
                <select
                  id="weight"
                  name="weight"
                  required
                  className="mt-1 w-full rounded-lg border border-[#d4dde6] px-3 py-2.5 text-[#0f2f4f] outline-none ring-[#d3b06a] focus:ring-2"
                >
                  <option value="">Select weight</option>
                  {weights.map((weight) => (
                    <option key={weight} value={weight}>
                      {weight}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="shape" className="block text-sm font-medium text-[#0f2f4f]">
                  Cake Shape
                </label>
                <select
                  id="shape"
                  name="shape"
                  required
                  className="mt-1 w-full rounded-lg border border-[#d4dde6] px-3 py-2.5 text-[#0f2f4f] outline-none ring-[#d3b06a] focus:ring-2"
                >
                  <option value="">Select shape</option>
                  {shapes.map((shape) => (
                    <option key={shape} value={shape}>
                      {shape}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="tier" className="block text-sm font-medium text-[#0f2f4f]">
                  Cake Tier
                </label>
                <select
                  id="tier"
                  name="tier"
                  className="mt-1 w-full rounded-lg border border-[#d4dde6] px-3 py-2.5 text-[#0f2f4f] outline-none ring-[#d3b06a] focus:ring-2"
                >
                  {tiers.map((tier) => (
                    <option key={tier} value={tier}>
                      {tier}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="photoPrint" className="block text-sm font-medium text-[#0f2f4f]">
                  Photo Print Cake
                </label>
                <select
                  id="photoPrint"
                  name="photoPrint"
                  className="mt-1 w-full rounded-lg border border-[#d4dde6] px-3 py-2.5 text-[#0f2f4f] outline-none ring-[#d3b06a] focus:ring-2"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="photoUpload" className="block text-sm font-medium text-[#0f2f4f]">
                  Upload Photo (JPG, PNG)
                </label>
                <input
                  id="photoUpload"
                  name="photoUpload"
                  type="file"
                  accept="image/jpeg,image/png"
                  className="mt-1 w-full rounded-lg border border-[#d4dde6] bg-white px-3 py-2.5 text-sm text-[#0f2f4f]"
                />
              </div>
              <div>
                <label htmlFor="designUpload" className="block text-sm font-medium text-[#0f2f4f]">
                  Upload Custom Design (JPG, PNG)
                </label>
                <input
                  id="designUpload"
                  name="designUpload"
                  type="file"
                  accept="image/jpeg,image/png"
                  className="mt-1 w-full rounded-lg border border-[#d4dde6] bg-white px-3 py-2.5 text-sm text-[#0f2f4f]"
                />
              </div>
            </div>

            <fieldset>
              <legend className="block text-sm font-medium text-[#0f2f4f]">Add-ons</legend>
              <div className="mt-2 flex flex-wrap gap-4">
                {addOns.map((addOn) => (
                  <label key={addOn} className="inline-flex items-center gap-2 text-sm text-[#35506a]">
                    <input type="checkbox" name="addOns" value={addOn} />
                    {addOn}
                  </label>
                ))}
              </div>
            </fieldset>

            <button
              type="submit"
              className="rounded-full bg-[#0f2f4f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0b2239]"
            >
              Continue to Order Form
            </button>
          </form>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

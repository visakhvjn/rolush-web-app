export function SiteAbout() {
  return (
    <section id="about" className="scroll-mt-24 px-4 py-20">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="font-serif text-3xl font-semibold text-[#0f2f4f] sm:text-4xl">
            Crafted in Kannur
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-[#4f6479]">
            Rolush is a small bakery focused on custom celebration cakes. We work
            with you on flavour, size, and design — whether you want minimalist
            elegance or something bold and playful.
          </p>
          <p className="mt-4 leading-relaxed text-[#4f6479]">
            Tell us your date, serving size, and inspiration; we will follow up to
            confirm details and pricing before we bake.
          </p>
        </div>
        <div className="rounded-3xl border border-[#d4dde6] bg-gradient-to-br from-[#ffffff] to-[#eef2f8] p-10 shadow-sm">
          <ul className="space-y-4 text-[#0f2f4f]">
            <li className="flex gap-3">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#d3b06a]" />
              <span>Custom flavours & fillings</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#d3b06a]" />
              <span>Buttercream & fondant finishes</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#d3b06a]" />
              <span>Weddings, birthdays & milestones</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

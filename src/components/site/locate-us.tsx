export function SiteLocateUs() {
  return (
    <section id="locate" className="scroll-mt-24 border-t border-[#d4dde6] bg-white px-4 py-20">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-start">
        <div>
          <h2 className="font-serif text-3xl font-semibold text-[#0f2f4f] sm:text-4xl">
            Locate Us
          </h2>
          <p className="mt-3 max-w-lg text-[#4f6479]">
            Visit our cake studio in Kannur or call us to confirm pickup and delivery slots.
          </p>
          <div className="mt-8 rounded-2xl border border-[#d4dde6] bg-[#f7f9fc] p-5 text-sm text-[#35506a]">
            <p className="font-medium text-[#0f2f4f]">Rolush Cafe</p>
            <p className="mt-2">Kannur, Kerala</p>
            <p className="mt-1">Phone: +91 98765 43210</p>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-[#d4dde6] shadow-sm">
          <iframe
            title="Rolush location map"
            src="https://maps.google.com/maps?q=Kannur&t=&z=13&ie=UTF8&iwloc=&output=embed"
            className="h-[360px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}

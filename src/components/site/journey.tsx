export function SiteJourney() {
  return (
    <section id="journey" className="scroll-mt-24 border-y border-[#1f4568] bg-[#0f2f4f] px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-serif text-3xl font-semibold text-white sm:text-4xl">
          The Rolush Journey
        </h2>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-[#d4dde6]">
          Rolush began with a simple idea: every celebration deserves a cake that feels personal.
          What started as small custom orders in Kannur has grown into a trusted local cake studio
          for birthdays, anniversaries, weddings, and milestone moments.
        </p>
        <p className="mt-4 max-w-3xl leading-relaxed text-[#d4dde6]">
          We focus on fresh bakes, balanced flavours, and handcrafted finishing details. From your
          first message to final delivery, our process is built around listening, planning, and
          creating cakes that reflect your story.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#d4dde6] bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-[#b8944f]">Started with</p>
            <p className="mt-2 font-serif text-xl font-semibold text-[#0f2f4f]">
              Custom cake requests
            </p>
          </div>
          <div className="rounded-2xl border border-[#d4dde6] bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-[#b8944f]">Built on</p>
            <p className="mt-2 font-serif text-xl font-semibold text-[#0f2f4f]">
              Quality and consistency
            </p>
          </div>
          <div className="rounded-2xl border border-[#d4dde6] bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-[#b8944f]">Driven by</p>
            <p className="mt-2 font-serif text-xl font-semibold text-[#0f2f4f]">
              Your celebration stories
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

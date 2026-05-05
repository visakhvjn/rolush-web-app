export function SiteHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#e8eef5] via-[#f3f6fa] to-[#edf2f8] px-4 pb-20 pt-16 sm:pt-24">
      <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-[#d3b06a]/25 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-[#9db4cc]/35 blur-3xl" />
      <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#b8944f]">
            Kannur · custom cakes
          </p>
          <h1 className="mt-4 max-w-2xl font-serif text-4xl font-semibold leading-tight text-[#0f2f4f] sm:text-5xl sm:leading-tight">
            Celebrate every moment with cakes made for you
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#4f6479]">
            From birthdays to weddings, we design flavour-forward custom cakes with
            careful detail — baked fresh and styled to match your story.
          </p>
        </div>
        <div className="overflow-hidden rounded-3xl border border-[#d4dde6] bg-white shadow-xl">
          <img
            src="/sample/FERRERO W STAND.jpg.jpeg"
            alt="Elegant chocolate cake by Rolush"
            className="aspect-[4/3] w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}

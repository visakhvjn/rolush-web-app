const placeholders = [
  { label: "Floral tier", tone: "from-[#e2ebf5] to-[#afc1d4]" },
  { label: "Minimal white", tone: "from-[#ffffff] to-[#e5edf6]" },
  { label: "Chocolate drip", tone: "from-[#0f2f4f] to-[#d3b06a]" },
  { label: "Kids theme", tone: "from-[#d8e6f4] to-[#eef3f9]" },
  { label: "Rustic naked", tone: "from-[#dfe8f3] to-[#bdcddd]" },
  { label: "Anniversary", tone: "from-[#e9eef6] to-[#c9d7e6]" },
];

export function SiteGallery() {
  return (
    <section id="gallery" className="scroll-mt-24 px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-serif text-3xl font-semibold text-[#0f2f4f] sm:text-4xl">
          Gallery
        </h2>
        <p className="mt-3 max-w-2xl text-[#4f6479]">
          Placeholder tiles — replace with your cake photography when ready.
        </p>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {placeholders.map((p) => (
            <div
              key={p.label}
              className={`flex aspect-[4/3] flex-col justify-end rounded-2xl bg-gradient-to-br p-6 shadow-sm ${p.tone}`}
            >
              <span
                className={
                  p.label === "Chocolate drip"
                    ? "text-sm font-medium text-white/95"
                    : "text-sm font-medium text-[#0f2f4f]/85"
                }
              >
                {p.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

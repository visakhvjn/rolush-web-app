export function SiteFooter() {
  return (
    <footer className="border-t border-[#1d3f61] bg-[#0b2239] px-4 py-12 text-[#dde8f3]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-serif text-xl font-semibold text-[#f6f9fc]">
            Rolush<span className="text-[#d3b06a]">.</span>
          </p>
          <p className="max-w-sm text-sm text-[#c3d4e4]/90">
          </p>
          <p className="text-sm text-[#c3d4e4]/90">
            From birthdays to weddings, we design flavour-forward custom cakes with <br />careful detail — baked fresh and styled to match your story.
          </p>
        </div>
        <div className="flex flex-col gap-3 text-sm">
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#d3b06a]"
          >
            WhatsApp
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#d3b06a]"
          >
            Instagram
          </a>
          <a href="/admin/login" className="text-[#c3d4e4]/75 hover:text-[#d3b06a]">
            Staff login
          </a>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-6xl text-center text-xs text-[#9fb3c8]/75">
        © {new Date().getFullYear()} Rolush. All rights reserved.
      </p>
    </footer>
  );
}

import { Providers } from "@/app/providers";
import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const display = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
});

const sans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rolush Cafe | Custom Cakes Kannur",
  description:
    "Custom celebration cakes in Kannur — weddings, birthdays, and bespoke designs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full bg-[#f3f6fa] font-sans text-[#0f2f4f]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

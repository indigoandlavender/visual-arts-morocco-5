import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { SmoothScrollProvider } from "@/components/animations";
import "./globals.css";

const serif = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Morocco Art Archive",
  description: "A comprehensive archive of Moroccan visual art - painting and photography",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${serif.variable} ${inter.variable}`}>
      <head>
        {/* Mapbox GL CSS */}
        <link 
          href="https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css" 
          rel="stylesheet" 
        />
      </head>
      <body className="font-sans antialiased bg-[#FAF9F6] text-[#1C1917]">
        <SmoothScrollProvider>
        {/* Fixed Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 mix-blend-difference">
          <div className="flex justify-between items-center px-6 md:px-12 py-6">
            {/* Logo */}
            <Link href="/" className="text-white">
              <span className="text-[11px] tracking-[0.4em] uppercase font-medium">
                Morocco Art Archive
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-12">
              {[
                { href: '/artists', label: 'Artists' },
                { href: '/works', label: 'Works' },
                { href: '/movements', label: 'Movements' },
                { href: '/cities', label: 'Cities' },
                { href: '/institutions', label: 'Institutions' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-[11px] tracking-[0.2em] uppercase text-white/70 hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Search */}
            <Link 
              href="/search" 
              className="text-white/70 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
          </div>
        </nav>

        {/* Main Content */}
        <main>
          {children}
        </main>

        {/* Footer */}
        <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}

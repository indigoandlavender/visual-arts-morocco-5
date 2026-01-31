'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface LegalLink {
  label: string;
  href: string;
}

interface FooterData {
  legal: LegalLink[];
  poweredBy: {
    name: string;
    url: string;
  };
  copyright: {
    year: number;
    name: string;
  };
}

export function Footer() {
  const [footerData, setFooterData] = useState<FooterData | null>(null);

  useEffect(() => {
    fetch('/api/footer')
      .then((res) => res.json())
      .then((data) => setFooterData(data))
      .catch(() => {
        // Fallback data
        setFooterData({
          legal: [
            { label: 'Privacy', href: '/privacy' },
            { label: 'Terms', href: '/terms' },
            { label: 'Disclaimer', href: '/disclaimer' },
          ],
          poweredBy: { name: 'Slow Morocco', url: 'https://slowmorocco.com' },
          copyright: { year: new Date().getFullYear(), name: 'Morocco Art Archive' },
        });
      });
  }, []);

  return (
    <footer>
      {/* Main Footer */}
      <div className="bg-[#1f1f1f] text-white">
        <div className="px-6 md:px-12 py-24">
          <div className="max-w-[1800px] mx-auto grid md:grid-cols-12 gap-12 md:gap-8">
            {/* Brand */}
            <div className="md:col-span-4">
              <span className="text-[11px] tracking-[0.4em] uppercase font-medium block mb-6">
                Morocco Art Archive
              </span>
              <p className="text-white/40 text-sm leading-relaxed max-w-xs">
                A living record of Moroccan visual art from the 20th century to today.
                Painting and photography.
              </p>
            </div>

            {/* Navigation */}
            <div className="md:col-span-2">
              <span className="text-[10px] tracking-[0.3em] uppercase text-white/30 block mb-6">
                Explore
              </span>
              <div className="flex flex-col gap-3">
                {['Artists', 'Works', 'Movements', 'Cities', 'Themes'].map((item) => (
                  <Link
                    key={item}
                    href={`/${item.toLowerCase()}`}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>

            {/* Medium */}
            <div className="md:col-span-2">
              <span className="text-[10px] tracking-[0.3em] uppercase text-white/30 block mb-6">
                Medium
              </span>
              <div className="flex flex-col gap-3">
                <Link href="/painting" className="text-sm text-white/60 hover:text-white transition-colors">
                  Painting
                </Link>
                <Link href="/photography" className="text-sm text-white/60 hover:text-white transition-colors">
                  Photography
                </Link>
              </div>
            </div>

            {/* API */}
            <div className="md:col-span-4">
              <span className="text-[10px] tracking-[0.3em] uppercase text-white/30 block mb-6">
                Data
              </span>
              <div className="flex flex-col gap-3">
                <Link href="/api/v1/artists" className="text-sm text-white/60 hover:text-white transition-colors">
                  API
                </Link>
                <Link href="/search" className="text-sm text-white/60 hover:text-white transition-colors">
                  Search
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Banner */}
      <div className="bg-[#161616] text-white">
        <div className="px-6 md:px-12 py-6">
          <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Legal Links */}
            <div className="flex items-center gap-4 flex-wrap justify-center">
              {footerData?.legal.map((link, index) => (
                <span key={link.href} className="flex items-center gap-4">
                  <Link
                    href={link.href}
                    className="text-xs text-white/40 hover:text-white/70 transition-colors"
                  >
                    {link.label}
                  </Link>
                  {index < (footerData?.legal.length || 0) - 1 && (
                    <span className="text-white/20">·</span>
                  )}
                </span>
              ))}
            </div>

            {/* Copyright */}
            <span className="text-[10px] tracking-[0.2em] uppercase text-white/30">
              © {footerData?.copyright.year || new Date().getFullYear()} {footerData?.copyright.name || 'Morocco Art Archive'}. All rights reserved.
            </span>
          </div>
        </div>
      </div>

      {/* Powered By Banner */}
      <div className="bg-[#0e0e0e] text-white">
        <div className="px-6 md:px-12 py-4">
          <div className="max-w-[1800px] mx-auto flex justify-center items-center">
            <span className="text-[10px] tracking-[0.2em] uppercase text-white/30">
              Powered by{' '}
              <a
                href={footerData?.poweredBy.url || 'https://slowmorocco.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C4A052]/70 hover:text-[#C4A052] transition-colors"
              >
                {footerData?.poweredBy.name || 'Slow Morocco'}
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

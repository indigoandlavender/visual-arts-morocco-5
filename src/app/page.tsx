export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import Link from 'next/link';
import { generateHomeMetadata } from '@/lib/seo';
import { generateSearchActionJsonLd, generateOrganizationJsonLd } from '@/lib/seo';
import {
  getFeaturedArtists,
  getFeaturedWorks,
  getArtistCount,
  getArtworkCount,
} from '@/lib/queries';

export const metadata: Metadata = generateHomeMetadata();

export default async function HomePage() {
  // Fetch data with error handling
  let featuredArtists: Awaited<ReturnType<typeof getFeaturedArtists>> = [];
  let artistCount = 0;
  let artworkCount = 0;

  try {
    const [
      allFeaturedArtists,
      allFeaturedWorks,
      artistCountResult,
      artworkCountResult,
    ] = await Promise.all([
      getFeaturedArtists(),
      getFeaturedWorks(),
      getArtistCount(),
      getArtworkCount(),
    ]);

    featuredArtists = allFeaturedArtists.slice(0, 6);
    artistCount = artistCountResult;
    artworkCount = artworkCountResult;
  } catch (error) {
    console.error('Failed to fetch data from Google Sheets:', error);
    // Continue with empty data - page will still render
  }

  const jsonLd = [generateSearchActionJsonLd(), generateOrganizationJsonLd()];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-[#FAF9F6]">
        {/* Hero */}
        <section className="relative h-screen flex items-end pb-24 px-8 md:px-16">
          {/* Background texture */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }} />
          
          <div className="relative z-10 max-w-7xl w-full">
            <div className="grid md:grid-cols-12 gap-8 items-end">
              <div className="md:col-span-8">
                <p className="text-[#8B7355] tracking-[0.3em] text-xs uppercase mb-6 font-medium">
                  Archive of Moroccan Visual Art
                </p>
                <h1 className="text-[clamp(3rem,10vw,8rem)] font-serif font-normal leading-[0.9] tracking-[-0.02em] text-[#1C1917]">
                  Morocco
                  <br />
                  <span className="italic">Art</span> Archive
                </h1>
              </div>
              <div className="md:col-span-4 pb-4">
                <p className="text-[#57534E] text-lg leading-relaxed max-w-sm">
                  Painting & photography from the 20th century to today. 
                  A living record of artistic vision.
                </p>
              </div>
            </div>
          </div>
          
          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#A8A29E]">
            <span className="text-[10px] tracking-[0.2em] uppercase">Scroll</span>
            <div className="w-px h-12 bg-gradient-to-b from-[#A8A29E] to-transparent" />
          </div>
        </section>

        {/* Medium Cards */}
        <section className="px-8 md:px-16 py-32">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-4">
              <Link href="/painting" className="group relative aspect-[4/3] bg-[#E7E5E4] overflow-hidden">
                <div className="absolute inset-0 bg-[#292524] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 p-10 flex flex-col justify-between">
                  <span className="text-[10px] tracking-[0.3em] uppercase text-[#78716C] group-hover:text-[#A8A29E] transition-colors duration-500">
                    01 — Medium
                  </span>
                  <div>
                    <h2 className="text-5xl md:text-6xl font-serif text-[#1C1917] group-hover:text-[#FAF9F6] transition-colors duration-500">
                      Painting
                    </h2>
                    <div className="flex items-center gap-3 mt-4">
                      <span className="text-sm text-[#78716C] group-hover:text-[#A8A29E] transition-colors duration-500">
                        Explore collection
                      </span>
                      <svg className="w-4 h-4 text-[#78716C] group-hover:text-[#A8A29E] group-hover:translate-x-1 transition-all duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
              
              <Link href="/photography" className="group relative aspect-[4/3] bg-[#292524] overflow-hidden">
                <div className="absolute inset-0 bg-[#FAF9F6] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 p-10 flex flex-col justify-between">
                  <span className="text-[10px] tracking-[0.3em] uppercase text-[#A8A29E] group-hover:text-[#78716C] transition-colors duration-500">
                    02 — Medium
                  </span>
                  <div>
                    <h2 className="text-5xl md:text-6xl font-serif text-[#FAF9F6] group-hover:text-[#1C1917] transition-colors duration-500">
                      Photography
                    </h2>
                    <div className="flex items-center gap-3 mt-4">
                      <span className="text-sm text-[#A8A29E] group-hover:text-[#78716C] transition-colors duration-500">
                        Explore collection
                      </span>
                      <svg className="w-4 h-4 text-[#A8A29E] group-hover:text-[#78716C] group-hover:translate-x-1 transition-all duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="border-y border-[#E7E5E4]">
          <div className="max-w-7xl mx-auto px-8 md:px-16">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#E7E5E4]">
              <div className="py-12 md:py-16 pr-8">
                <div className="text-5xl md:text-6xl font-serif text-[#1C1917] tabular-nums">{artistCount}</div>
                <div className="text-[10px] tracking-[0.3em] uppercase text-[#78716C] mt-2">Artists</div>
              </div>
              <div className="py-12 md:py-16 px-8">
                <div className="text-5xl md:text-6xl font-serif text-[#1C1917] tabular-nums">{artworkCount}</div>
                <div className="text-[10px] tracking-[0.3em] uppercase text-[#78716C] mt-2">Works</div>
              </div>
              <div className="py-12 md:py-16 px-8 hidden md:block">
                <div className="text-5xl md:text-6xl font-serif text-[#1C1917]">100+</div>
                <div className="text-[10px] tracking-[0.3em] uppercase text-[#78716C] mt-2">Years Span</div>
              </div>
              <div className="py-12 md:py-16 pl-8 hidden md:block">
                <div className="text-5xl md:text-6xl font-serif text-[#1C1917]">12</div>
                <div className="text-[10px] tracking-[0.3em] uppercase text-[#78716C] mt-2">Cities</div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Artists */}
        {featuredArtists.length > 0 && (
          <section className="px-8 md:px-16 py-32">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-end mb-16">
                <div>
                  <span className="text-[10px] tracking-[0.3em] uppercase text-[#78716C] block mb-4">Featured</span>
                  <h2 className="text-4xl md:text-5xl font-serif text-[#1C1917]">Artists</h2>
                </div>
                <Link href="/artists" className="group flex items-center gap-2 text-sm text-[#78716C] hover:text-[#1C1917] transition-colors">
                  View all
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
              
              <div className="grid md:grid-cols-3 gap-x-8 gap-y-12">
                {featuredArtists.map((artist, index) => (
                  <Link 
                    key={artist.id}
                    href={`/artists/${artist.slug}`}
                    className="group"
                  >
                    <div className="aspect-[3/4] bg-[#E7E5E4] mb-6 overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-[#D6D3D1] to-[#E7E5E4] group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-normal text-[#1C1917] group-hover:text-[#78716C] transition-colors">
                          {artist.name}
                        </h3>
                        {artist.birthYear && (
                          <p className="text-sm text-[#A8A29E] mt-1">
                            {artist.birthYear}—{artist.deathYear || 'Present'}
                          </p>
                        )}
                      </div>
                      <span className="text-[10px] tracking-[0.2em] text-[#A8A29E]">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Browse Section */}
        <section className="bg-[#292524] text-[#FAF9F6] px-8 md:px-16 py-32">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 md:gap-32">
              <div>
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#A8A29E] block mb-4">Discover</span>
                <h2 className="text-4xl md:text-5xl font-serif mb-8">Browse the Archive</h2>
                <p className="text-[#A8A29E] text-lg leading-relaxed max-w-md">
                  Explore Moroccan art through multiple lenses — by city, theme, 
                  movement, or chronology.
                </p>
              </div>
              
              <div className="flex flex-col gap-4">
                {[
                  { href: '/cities', label: 'By City', desc: 'Casablanca, Marrakech, Tangier...' },
                  { href: '/themes', label: 'By Theme', desc: 'Identity, landscape, tradition...' },
                  { href: '/movements', label: 'By Movement', desc: 'Casablanca School, Contemporary...' },
                  { href: '/works', label: 'All Works', desc: 'Complete collection' },
                ].map((item) => (
                  <Link 
                    key={item.href}
                    href={item.href}
                    className="group flex justify-between items-center py-6 border-b border-[#3F3F46] hover:border-[#FAF9F6] transition-colors"
                  >
                    <div>
                      <span className="text-2xl font-serif group-hover:text-[#A8A29E] transition-colors">{item.label}</span>
                      <p className="text-sm text-[#71717A] mt-1">{item.desc}</p>
                    </div>
                    <svg className="w-5 h-5 text-[#71717A] group-hover:text-[#FAF9F6] group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Search CTA */}
        <section className="px-8 md:px-16 py-32">
          <div className="max-w-7xl mx-auto text-center">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#78716C] block mb-6">Search</span>
            <h2 className="text-4xl md:text-6xl font-serif text-[#1C1917] mb-8">
              Looking for<br />something specific?
            </h2>
            <Link 
              href="/search"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#1C1917] text-[#FAF9F6] text-sm tracking-wide hover:bg-[#292524] transition-colors"
            >
              <span>Search the Archive</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

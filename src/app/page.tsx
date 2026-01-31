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

    featuredArtists = allFeaturedArtists.slice(0, 8);
    artistCount = artistCountResult;
    artworkCount = artworkCountResult;
  } catch (error) {
    console.error('Failed to fetch data from Google Sheets:', error);
  }

  const jsonLd = [generateSearchActionJsonLd(), generateOrganizationJsonLd()];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ========== HERO: THE ENTRANCE ========== */}
      <section className="relative h-screen bg-[#0A0A0A] overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
        
        {/* Subtle grid pattern - like industrial windows */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `
            linear-gradient(to right, white 1px, transparent 1px),
            linear-gradient(to bottom, white 1px, transparent 1px)
          `,
          backgroundSize: '120px 120px',
        }} />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-end px-6 md:px-12 pb-24">
          <div className="max-w-7xl">
            {/* Micro label */}
            <p className="text-[10px] tracking-[0.5em] uppercase text-white/40 mb-8">
              Archive of Moroccan Visual Art
            </p>
            
            {/* Main title - massive, architectural */}
            <h1 className="font-serif text-[clamp(4rem,15vw,14rem)] font-light leading-[0.85] tracking-[-0.03em] text-white">
              Morocco
              <br />
              <span className="text-white/20">Art</span> Archive
            </h1>

            {/* Subtitle */}
            <p className="mt-12 text-white/50 text-lg md:text-xl max-w-lg leading-relaxed font-light">
              Painting & photography from the 20th century to today.
              A living record of artistic vision.
            </p>
          </div>
        </div>

        {/* Scroll indicator - minimal */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <div className="w-px h-16 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </section>

      {/* ========== GALLERY HALLS: MEDIUMS ========== */}
      <section className="bg-[#FAF9F6]">
        <div className="grid md:grid-cols-2">
          {/* Painting Hall */}
          <Link 
            href="/painting" 
            className="group relative h-[70vh] md:h-screen flex items-end p-8 md:p-16 bg-[#E8E4DF] overflow-hidden"
          >
            {/* Hover state - gold leaf inspiration */}
            <div className="absolute inset-0 bg-[#C4A052] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            {/* Number */}
            <span className="absolute top-8 md:top-16 right-8 md:right-16 text-[20vw] md:text-[15vw] font-serif font-light text-[#D4CFC8] group-hover:text-[#B8943F] transition-colors duration-700 leading-none">
              01
            </span>

            {/* Content */}
            <div className="relative z-10">
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#8B7355] group-hover:text-[#1C1917]/60 transition-colors duration-500 block mb-4">
                Medium
              </span>
              <h2 className="font-serif text-6xl md:text-8xl font-light text-[#1C1917] group-hover:text-[#1C1917] transition-colors duration-500">
                Painting
              </h2>
              <div className="mt-6 flex items-center gap-3 text-[#78716C] group-hover:text-[#1C1917]/70 transition-colors duration-500">
                <span className="text-sm tracking-wide">Enter gallery</span>
                <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Photography Hall */}
          <Link 
            href="/photography" 
            className="group relative h-[70vh] md:h-screen flex items-end p-8 md:p-16 bg-[#1C1917] overflow-hidden"
          >
            {/* Hover state - polished steel inspiration */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#4A4A4A] to-[#2A2A2A] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            {/* Number */}
            <span className="absolute top-8 md:top-16 right-8 md:right-16 text-[20vw] md:text-[15vw] font-serif font-light text-[#2A2928] group-hover:text-[#5A5A5A] transition-colors duration-700 leading-none">
              02
            </span>

            {/* Content */}
            <div className="relative z-10">
              <span className="text-[10px] tracking-[0.3em] uppercase text-white/30 group-hover:text-white/50 transition-colors duration-500 block mb-4">
                Medium
              </span>
              <h2 className="font-serif text-6xl md:text-8xl font-light text-white group-hover:text-white transition-colors duration-500">
                Photography
              </h2>
              <div className="mt-6 flex items-center gap-3 text-white/40 group-hover:text-white/70 transition-colors duration-500">
                <span className="text-sm tracking-wide">Enter gallery</span>
                <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ========== THE DATA WALL ========== */}
      <section className="bg-[#FAF9F6] border-y border-[#E7E5E4]">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {[
            { value: artistCount || '—', label: 'Artists', suffix: '' },
            { value: artworkCount || '—', label: 'Works', suffix: '' },
            { value: '100', label: 'Years Span', suffix: '+' },
            { value: '12', label: 'Cities', suffix: '' },
          ].map((stat, i) => (
            <div 
              key={stat.label}
              className={`py-16 md:py-24 px-6 md:px-12 ${i > 0 ? 'border-l border-[#E7E5E4]' : ''}`}
            >
              <div className="font-serif text-5xl md:text-7xl font-light text-[#1C1917] tabular-nums">
                {stat.value}{stat.suffix}
              </div>
              <div className="text-[10px] tracking-[0.3em] uppercase text-[#A8A29E] mt-3">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========== FEATURED ARTISTS: THE PODIUM ========== */}
      {featuredArtists.length > 0 && (
        <section className="bg-[#FAF9F6] px-6 md:px-12 py-32 md:py-48">
          <div className="max-w-[1800px] mx-auto">
            {/* Section header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-16 md:mb-24">
              <div>
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#A8A29E] block mb-4">
                  Featured
                </span>
                <h2 className="font-serif text-5xl md:text-7xl font-light text-[#1C1917]">
                  Artists
                </h2>
              </div>
              <Link 
                href="/artists" 
                className="group inline-flex items-center gap-3 text-[#78716C] hover:text-[#1C1917] transition-colors"
              >
                <span className="text-sm tracking-wide">View all artists</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {/* Artists grid - asymmetric gallery wall */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {featuredArtists.map((artist, index) => (
                <Link
                  key={artist.id}
                  href={`/artists/${artist.slug}`}
                  className={`group relative ${
                    index === 0 ? 'col-span-2 row-span-2' : ''
                  }`}
                >
                  {/* Image placeholder */}
                  <div className={`relative overflow-hidden bg-[#E7E5E4] ${
                    index === 0 ? 'aspect-square' : 'aspect-[3/4]'
                  }`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#D6D3D1] to-[#E7E5E4]" />
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-[#1C1917] opacity-0 group-hover:opacity-90 transition-opacity duration-500" />
                    
                    {/* Hover content */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <span className="text-[10px] tracking-[0.2em] uppercase text-white/50 mb-2">
                        {artist.birthYear}—{artist.deathYear || 'Present'}
                      </span>
                      <span className="text-white text-sm md:text-base leading-relaxed line-clamp-3">
                        {artist.biographyShort || 'View artist profile →'}
                      </span>
                    </div>
                  </div>

                  {/* Artist name */}
                  <div className="mt-4 flex justify-between items-start">
                    <div>
                      <h3 className={`font-serif text-[#1C1917] group-hover:text-[#78716C] transition-colors ${
                        index === 0 ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'
                      }`}>
                        {artist.name}
                      </h3>
                      {index === 0 && artist.birthYear && (
                        <p className="text-sm text-[#A8A29E] mt-1">
                          {artist.birthYear}—{artist.deathYear || 'Present'}
                        </p>
                      )}
                    </div>
                    <span className="text-[10px] tracking-[0.2em] text-[#D4D4D4] tabular-nums">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========== NAVIGATION HALLS ========== */}
      <section className="bg-[#1C1917]">
        <div className="grid md:grid-cols-2">
          {/* Left: Browse options */}
          <div className="px-6 md:px-12 py-24 md:py-32">
            <span className="text-[10px] tracking-[0.3em] uppercase text-white/30 block mb-8">
              Discover
            </span>
            <h2 className="font-serif text-4xl md:text-6xl font-light text-white mb-16">
              Browse the<br />Archive
            </h2>

            <div className="space-y-0">
              {[
                { href: '/cities', label: 'By City', desc: 'Casablanca, Marrakech, Tangier, Fes...' },
                { href: '/themes', label: 'By Theme', desc: 'Identity, landscape, tradition, modernity...' },
                { href: '/movements', label: 'By Movement', desc: 'Casablanca School, Contemporary, Modern...' },
                { href: '/works', label: 'All Works', desc: 'Complete collection' },
              ].map((item, i) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex justify-between items-center py-6 border-b border-white/10 hover:border-white/30 transition-colors"
                >
                  <div>
                    <span className="font-serif text-2xl md:text-3xl text-white group-hover:text-white/70 transition-colors">
                      {item.label}
                    </span>
                    <p className="text-sm text-white/30 mt-1 group-hover:text-white/50 transition-colors">
                      {item.desc}
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-white/20 group-hover:text-white/60 group-hover:translate-x-2 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>

          {/* Right: Search CTA - like a spotlight on art */}
          <div className="relative bg-[#C4A052] px-6 md:px-12 py-24 md:py-32 flex flex-col justify-center">
            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, #1C1917 1px, transparent 0)`,
              backgroundSize: '24px 24px',
            }} />

            <div className="relative z-10 max-w-md">
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#1C1917]/50 block mb-8">
                Search
              </span>
              <h3 className="font-serif text-4xl md:text-5xl font-light text-[#1C1917] mb-6">
                Looking for something specific?
              </h3>
              <p className="text-[#1C1917]/60 mb-10">
                Search by artist, artwork title, year, theme, or any keyword.
              </p>
              <Link
                href="/search"
                className="inline-flex items-center gap-4 px-8 py-4 bg-[#1C1917] text-white text-sm tracking-wide hover:bg-[#292524] transition-colors"
              >
                <span>Search the Archive</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CLOSING: THE EXIT ========== */}
      <section className="bg-[#FAF9F6] px-6 md:px-12 py-32 md:py-48">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[10px] tracking-[0.5em] uppercase text-[#A8A29E] mb-8">
            Morocco Art Archive
          </p>
          <p className="font-serif text-3xl md:text-5xl font-light text-[#1C1917] leading-tight">
            &ldquo;The archive is not a preservation project and not a new architecture. 
            Two conditions that are usually kept separate here confront each other 
            in a state of permanent interaction.&rdquo;
          </p>
          <p className="text-[#78716C] mt-8 text-sm tracking-wide">
            — Inspired by OMA / Rem Koolhaas
          </p>
        </div>
      </section>
    </>
  );
}

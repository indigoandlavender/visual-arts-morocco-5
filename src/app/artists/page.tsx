export const dynamic = 'force-dynamic';
// =============================================================================
// Artists Index Page — Gallery Hall
// Fondazione Prada Inspired
// =============================================================================

import type { Metadata } from 'next';
import Link from 'next/link';
import { generateListMetadata } from '@/lib/seo';
import { getAllArtists, countArtists } from '@/lib/queries';

export const metadata: Metadata = generateListMetadata('artists');

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default async function ArtistsPage() {
  const [artists, totalCount] = await Promise.all([
    getAllArtists(),
    countArtists(),
  ]);

  // Group artists by first letter for gallery sections
  const groupedArtists = artists.reduce((acc, artist) => {
    const letter = artist.name.charAt(0).toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(artist);
    return acc;
  }, {} as Record<string, typeof artists>);

  const sortedLetters = Object.keys(groupedArtists).sort();

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] bg-[#0A0A0A] flex items-end">
        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `
            linear-gradient(to right, white 1px, transparent 1px),
            linear-gradient(to bottom, white 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }} />

        <div className="relative z-10 w-full px-6 md:px-12 pb-16 md:pb-24">
          <div className="max-w-[1800px] mx-auto">
            <span className="text-[10px] tracking-[0.5em] uppercase text-white/40 block mb-6">
              The Collection
            </span>
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-8">
              <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl font-light text-white leading-none">
                Artists
              </h1>
              <p className="text-white/50 text-lg max-w-md font-light">
                {totalCount} Moroccan visual artists spanning a century of creative vision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Alphabet Navigation */}
      <section className="sticky top-0 z-40 bg-[#FAF9F6] border-b border-[#E7E5E4]">
        <div className="px-6 md:px-12 py-4 overflow-x-auto">
          <div className="max-w-[1800px] mx-auto flex gap-1 md:gap-2">
            {sortedLetters.map((letter) => (
              <a
                key={letter}
                href={`#letter-${letter}`}
                className="px-3 py-2 text-sm text-[#78716C] hover:text-[#1C1917] hover:bg-[#E7E5E4] transition-colors"
              >
                {letter}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Artists Grid by Letter */}
      <section className="px-6 md:px-12 py-16 md:py-24">
        <div className="max-w-[1800px] mx-auto">
          {sortedLetters.map((letter) => (
            <div key={letter} id={`letter-${letter}`} className="mb-24 scroll-mt-20">
              {/* Letter Header */}
              <div className="flex items-baseline gap-8 mb-12 border-b border-[#E7E5E4] pb-6">
                <span className="font-serif text-8xl md:text-9xl font-light text-[#E7E5E4]">
                  {letter}
                </span>
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#A8A29E]">
                  {groupedArtists[letter].length} {groupedArtists[letter].length === 1 ? 'artist' : 'artists'}
                </span>
              </div>

              {/* Artists in this section */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {groupedArtists[letter].map((artist, index) => (
                  <Link
                    key={artist.id}
                    href={`/artists/${artist.slug}`}
                    className="group"
                  >
                    {/* Image placeholder */}
                    <div className="relative aspect-[4/5] bg-[#E7E5E4] overflow-hidden mb-6">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#D6D3D1] to-[#E7E5E4]" />
                      
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-[#1C1917] opacity-0 group-hover:opacity-90 transition-opacity duration-500" />
                      
                      {/* Index number */}
                      <span className="absolute top-6 right-6 text-[10px] tracking-[0.2em] text-[#A8A29E] group-hover:text-white/50 transition-colors">
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      {/* Object Type badge */}
                      {artist.primaryObjectType && (
                        <span className="absolute bottom-6 left-6 text-[10px] tracking-[0.2em] uppercase text-[#78716C] group-hover:text-white/70 transition-colors">
                          {artist.primaryObjectType.name}
                        </span>
                      )}

                      {/* Hover content */}
                      <div className="absolute inset-0 p-8 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        {artist.biographyShort && (
                          <p className="text-white/80 text-sm leading-relaxed line-clamp-4">
                            {artist.biographyShort}
                          </p>
                        )}
                        <span className="text-white/50 text-sm mt-4">
                          View artist →
                        </span>
                      </div>
                    </div>

                    {/* Artist info */}
                    <div>
                      <h2 className="font-serif text-2xl text-[#1C1917] group-hover:text-[#78716C] transition-colors">
                        {artist.name}
                      </h2>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-sm text-[#A8A29E]">
                          {artist.birthYear}
                          {artist.deathYear ? `–${artist.deathYear}` : '–present'}
                        </span>
                        {artist.themes && artist.themes.length > 0 && (
                          <>
                            <span className="text-[#D4D4D4]">·</span>
                            <span className="text-sm text-[#A8A29E]">
                              {artist.themes[0].name}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {artists.length === 0 && (
            <div className="text-center py-32">
              <p className="text-[#A8A29E] text-lg">No artists found in the archive.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

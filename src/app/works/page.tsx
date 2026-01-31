export const dynamic = 'force-dynamic';
// =============================================================================
// Works Index Page — The Gallery
// Fondazione Prada Inspired with Scroll Animations
// =============================================================================

import type { Metadata } from 'next';
import Link from 'next/link';
import { generateListMetadata } from '@/lib/seo';
import { getArtworks, getArtworkFacets, getArtworkCount } from '@/lib/queries';
import { 
  FadeUp, 
  TextReveal, 
  ArtworkCard,
  LineReveal 
} from '@/components/animations';

export const metadata: Metadata = generateListMetadata('works');

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default async function WorksPage() {
  const [artworks, facets, totalCount] = await Promise.all([
    getArtworks(),
    getArtworkFacets(),
    getArtworkCount(),
  ]);

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] bg-[#1C1917] flex items-end">
        {/* Abstract background pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, #C4A052 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, #8B7355 0%, transparent 50%)
            `,
          }} />
        </div>

        <div className="relative z-10 w-full px-6 md:px-12 pb-16 md:pb-24">
          <div className="max-w-[1800px] mx-auto">
            <FadeUp delay={0.2}>
              <span className="text-[10px] tracking-[0.5em] uppercase text-white/40 block mb-6">
                The Collection
              </span>
            </FadeUp>
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-8">
              <TextReveal>
                <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl font-light text-white leading-none">
                  Artworks
                </h1>
              </TextReveal>
              <FadeUp delay={0.4}>
                <div className="flex flex-col md:items-end gap-2">
                  <p className="text-white/50 text-lg font-light">
                    {totalCount} works in the archive
                  </p>
                  <p className="text-white/30 text-sm">
                    Painting & Photography
                  </p>
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-0 z-40 bg-[#FAF9F6] border-b border-[#E7E5E4]">
        <div className="px-6 md:px-12 py-5">
          <div className="max-w-[1800px] mx-auto flex flex-wrap items-center gap-4 md:gap-8">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#A8A29E]">
              Filter by
            </span>
            
            {/* Medium filters */}
            <div className="flex gap-2">
              <Link 
                href="/painting"
                className="px-4 py-2 text-sm text-[#78716C] hover:text-[#1C1917] hover:bg-[#E7E5E4] transition-colors"
              >
                Painting
              </Link>
              <Link 
                href="/photography"
                className="px-4 py-2 text-sm text-[#78716C] hover:text-[#1C1917] hover:bg-[#E7E5E4] transition-colors"
              >
                Photography
              </Link>
            </div>

            <span className="text-[#E7E5E4]">|</span>

            {/* City filters */}
            {facets.cities && facets.cities.slice(0, 4).map((city) => (
              <Link
                key={city.name}
                href={`/cities/${city.slug}`}
                className="px-4 py-2 text-sm text-[#78716C] hover:text-[#1C1917] hover:bg-[#E7E5E4] transition-colors"
              >
                {city.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Works Grid - Museum Wall Layout */}
      <section className="px-6 md:px-12 py-16 md:py-24">
        <div className="max-w-[1800px] mx-auto">
          {/* Asymmetric masonry-style grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {artworks.map((artwork, index) => {
              // Create visual variety like a curated gallery wall
              const isLarge = index % 7 === 0;
              const isTall = index % 5 === 2;
              
              return (
                <ArtworkCard
                  key={artwork.id}
                  index={index}
                  className={`${
                    isLarge ? 'col-span-2 row-span-2' : ''
                  } ${isTall && !isLarge ? 'row-span-2' : ''}`}
                >
                  <Link
                    href={`/works/${artwork.slug}`}
                    className="group block"
                  >
                    {/* Artwork frame */}
                    <div className={`relative overflow-hidden bg-[#E7E5E4] ${
                      isLarge ? 'aspect-square' : isTall ? 'aspect-[3/5]' : 'aspect-[4/5]'
                    }`}>
                      {/* Image or placeholder */}
                      {artwork.imageUrl ? (
                        <img 
                          src={artwork.imageUrl} 
                          alt={artwork.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#D6D3D1] to-[#C4BFBA]" />
                      )}
                      
                      {/* Iconic badge */}
                      {artwork.isIconic && (
                        <div className="absolute top-4 left-4 z-20">
                          <span className="inline-block px-2 py-1 bg-[#C4A052] text-white text-[9px] tracking-[0.2em] uppercase">
                            Iconic
                          </span>
                        </div>
                      )}

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-[#0A0A0A] opacity-0 group-hover:opacity-95 transition-opacity duration-500" />
                      
                      {/* Hover content */}
                      <div className="absolute inset-0 p-6 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div>
                          <span className="text-[10px] tracking-[0.3em] uppercase text-white/40">
                            {artwork.year || 'Date unknown'}
                          </span>
                        </div>
                        <div>
                          <h3 className={`font-serif text-white leading-tight ${
                            isLarge ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'
                          }`}>
                            {artwork.title}
                          </h3>
                          {artwork.artist && (
                            <p className="text-white/60 text-sm mt-2">
                              {artwork.artist.name}
                            </p>
                          )}
                          {artwork.description && (
                            <p className="text-white/40 text-sm mt-4 line-clamp-2">
                              {artwork.description}
                            </p>
                          )}
                          <span className="inline-block mt-4 text-white/50 text-sm">
                            View work →
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Caption below - museum style */}
                    <div className="mt-4">
                      <h3 className="font-serif text-[#1C1917] text-lg group-hover:text-[#78716C] transition-colors line-clamp-1">
                        {artwork.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        {artwork.artist && (
                          <span className="text-sm text-[#78716C]">
                            {artwork.artist.name}
                          </span>
                        )}
                        {artwork.year && (
                          <>
                            <span className="text-[#D4D4D4]">·</span>
                            <span className="text-sm text-[#A8A29E]">
                              {artwork.year}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                </ArtworkCard>
              );
            })}
          </div>

          {artworks.length === 0 && (
            <div className="text-center py-32">
              <p className="text-[#A8A29E] text-lg">No artworks found in the archive.</p>
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#1C1917] px-6 md:px-12 py-24">
        <div className="max-w-[1800px] mx-auto">
          <LineReveal className="bg-white/10 mb-16" />
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-8">
            <FadeUp>
              <div>
                <span className="text-[10px] tracking-[0.3em] uppercase text-white/30 block mb-4">
                  Discover More
                </span>
                <h2 className="font-serif text-3xl md:text-4xl text-white">
                  Explore by artist, city, or theme
                </h2>
              </div>
            </FadeUp>
            <FadeUp delay={0.2}>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/artists"
                  className="px-6 py-3 border border-white/20 text-white text-sm hover:bg-white hover:text-[#1C1917] transition-colors"
                >
                  View Artists
                </Link>
                <Link
                  href="/cities"
                  className="px-6 py-3 border border-white/20 text-white text-sm hover:bg-white hover:text-[#1C1917] transition-colors"
                >
                  By City
                </Link>
                <Link
                  href="/themes"
                  className="px-6 py-3 border border-white/20 text-white text-sm hover:bg-white hover:text-[#1C1917] transition-colors"
                >
                  By Theme
                </Link>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>
    </div>
  );
}

// =============================================================================
// City Detail Page — Fondazione Prada Aesthetic
// =============================================================================

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCityBySlug, getArtistsByCity, getArtworksByCity, getCities } from '@/lib/queries';
import { generateCityMetadata, generateBreadcrumbs } from '@/lib/seo';
import { generateCityJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo';
import { CityMapWrapper } from '@/components/city-map-wrapper';

// =============================================================================
// METADATA
// =============================================================================

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const city = await getCityBySlug(slug);

  if (!city) {
    return { title: 'City Not Found' };
  }

  return generateCityMetadata(city);
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default async function CityPage({ params }: PageProps) {
  const { slug } = await params;
  const city = await getCityBySlug(slug);

  if (!city) {
    notFound();
  }

  // Fetch related data
  const [artists, artworks, allCities] = await Promise.all([
    getArtistsByCity(city.id),
    getArtworksByCity(city.id),
    getCities(),
  ]);

  // Get related cities (same region, excluding current)
  const relatedCities = allCities
    .filter(c => c.region === city.region && c.id !== city.id)
    .slice(0, 4);

  // Generate structured data
  const breadcrumbs = generateBreadcrumbs(`/cities/${slug}`, city.name);
  const jsonLd = [
    generateCityJsonLd(city),
    generateBreadcrumbJsonLd(breadcrumbs),
  ];

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-[#FAF9F6]">
        {/* Hero Section */}
        <section className="bg-[#1C1917] text-white">
          <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-24 md:py-32">
            {/* Breadcrumbs */}
            <nav className="mb-12">
              <ol className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-white/40">
                <li>
                  <Link href="/" className="hover:text-white/60 transition-colors">Home</Link>
                </li>
                <li className="text-white/20">/</li>
                <li>
                  <Link href="/cities" className="hover:text-white/60 transition-colors">Cities</Link>
                </li>
                <li className="text-white/20">/</li>
                <li className="text-white/70">{city.name}</li>
              </ol>
            </nav>

            {/* City Header */}
            <div className="grid md:grid-cols-2 gap-12 md:gap-24">
              <div>
                <span className="text-[10px] tracking-[0.5em] uppercase text-[#C4A052] block mb-6">
                  {city.region || 'Morocco'}
                </span>
                <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl font-light leading-none mb-6">
                  {city.name}
                </h1>
                {city.nameArabic && (
                  <p className="font-serif text-3xl md:text-4xl text-white/30" dir="rtl">
                    {city.nameArabic}
                  </p>
                )}
              </div>

              <div className="flex flex-col justify-end">
                {city.description && (
                  <p className="text-white/60 text-lg md:text-xl leading-relaxed max-w-lg">
                    {city.description}
                  </p>
                )}
                
                {/* Stats */}
                <div className="mt-12 flex gap-12">
                  <div>
                    <span className="text-4xl md:text-5xl font-serif text-[#C4A052]">
                      {artists.length}
                    </span>
                    <span className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mt-2">
                      Artists
                    </span>
                  </div>
                  <div>
                    <span className="text-4xl md:text-5xl font-serif text-[#C4A052]">
                      {artworks.length}
                    </span>
                    <span className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mt-2">
                      Works
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Map */}
          <div className="h-[300px] md:h-[400px] relative">
            <CityMapWrapper city={city.slug || city.name} className="h-full w-full" />
          </div>
        </section>

        {/* Artists Section */}
        {artists.length > 0 && (
          <section className="px-6 md:px-12 py-16 md:py-24 border-b border-[#E7E5E4]">
            <div className="max-w-[1800px] mx-auto">
              <div className="flex justify-between items-end mb-12">
                <div>
                  <span className="text-[10px] tracking-[0.3em] uppercase text-[#A8A29E] block mb-3">
                    Associated Artists
                  </span>
                  <h2 className="font-serif text-3xl md:text-4xl text-[#1C1917]">
                    Artists of {city.name}
                  </h2>
                </div>
                <span className="text-[10px] tracking-[0.2em] text-[#A8A29E]">
                  {artists.length} {artists.length === 1 ? 'artist' : 'artists'}
                </span>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {artists.map((artist) => (
                  <Link
                    key={artist.id}
                    href={`/artists/${artist.slug}`}
                    className="group border border-[#E7E5E4] p-6 md:p-8 hover:border-[#1C1917] transition-colors"
                  >
                    <span className="text-[10px] tracking-[0.3em] uppercase text-[#A8A29E] block mb-4">
                      {artist.medium}
                    </span>
                    <h3 className="font-serif text-2xl md:text-3xl text-[#1C1917] group-hover:text-[#78716C] transition-colors mb-2">
                      {artist.name}
                    </h3>
                    {artist.birthYear && (
                      <span className="text-sm text-[#78716C]">
                        {artist.birthYear}{artist.deathYear ? `–${artist.deathYear}` : '–present'}
                      </span>
                    )}
                    {artist.biographyShort && (
                      <p className="text-[#78716C] text-sm mt-4 line-clamp-2">
                        {artist.biographyShort}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Artworks Section */}
        {artworks.length > 0 && (
          <section className="px-6 md:px-12 py-16 md:py-24 bg-[#F5F5F4]">
            <div className="max-w-[1800px] mx-auto">
              <div className="flex justify-between items-end mb-12">
                <div>
                  <span className="text-[10px] tracking-[0.3em] uppercase text-[#A8A29E] block mb-3">
                    Associated Works
                  </span>
                  <h2 className="font-serif text-3xl md:text-4xl text-[#1C1917]">
                    Art from {city.name}
                  </h2>
                </div>
                <span className="text-[10px] tracking-[0.2em] text-[#A8A29E]">
                  {artworks.length} {artworks.length === 1 ? 'work' : 'works'}
                </span>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {artworks.map((artwork) => (
                  <Link
                    key={artwork.id}
                    href={`/works/${artwork.slug}`}
                    className="group"
                  >
                    <div className="aspect-[4/5] bg-[#1C1917] mb-4 overflow-hidden">
                      {artwork.imageUrl ? (
                        <img
                          src={artwork.imageUrl}
                          alt={artwork.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-white/20 text-[10px] tracking-[0.3em] uppercase">
                            No Image
                          </span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-serif text-lg text-[#1C1917] group-hover:text-[#78716C] transition-colors">
                      {artwork.title}
                    </h3>
                    <span className="text-sm text-[#78716C]">
                      {artwork.year}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Related Cities */}
        {relatedCities.length > 0 && (
          <section className="px-6 md:px-12 py-16 md:py-24 border-t border-[#E7E5E4]">
            <div className="max-w-[1800px] mx-auto">
              <div className="mb-12">
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#A8A29E] block mb-3">
                  Same Region
                </span>
                <h2 className="font-serif text-3xl md:text-4xl text-[#1C1917]">
                  Nearby Cities
                </h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedCities.map((relatedCity) => (
                  <Link
                    key={relatedCity.id}
                    href={`/cities/${relatedCity.slug}`}
                    className="group py-6 border-b border-[#E7E5E4] hover:border-[#1C1917] transition-colors"
                  >
                    <h3 className="font-serif text-2xl text-[#1C1917] group-hover:text-[#78716C] transition-colors">
                      {relatedCity.name}
                    </h3>
                    {relatedCity.description && (
                      <p className="text-sm text-[#A8A29E] mt-2 line-clamp-1">
                        {relatedCity.description}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Empty State */}
        {artists.length === 0 && artworks.length === 0 && (
          <section className="px-6 md:px-12 py-24 md:py-32 text-center">
            <p className="text-[#A8A29E] text-lg mb-6">
              No artists or artworks documented for {city.name} yet.
            </p>
            <Link
              href="/cities"
              className="inline-flex items-center gap-2 text-[#1C1917] hover:text-[#78716C] transition-colors"
            >
              <span>← Back to all cities</span>
            </Link>
          </section>
        )}

        {/* Search CTA */}
        <section className="bg-[#1C1917] px-6 md:px-12 py-16 md:py-24">
          <div className="max-w-[1800px] mx-auto text-center">
            <span className="text-[10px] tracking-[0.5em] uppercase text-white/30 block mb-6">
              Explore More
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-8">
              Search the Archive
            </h2>
            <Link
              href={`/search?city=${city.slug}`}
              className="inline-block px-8 py-4 border border-[#C4A052] text-[#C4A052] hover:bg-[#C4A052] hover:text-[#1C1917] transition-colors text-sm tracking-[0.2em] uppercase"
            >
              Search in {city.name}
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

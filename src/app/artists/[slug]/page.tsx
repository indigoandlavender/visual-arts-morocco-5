// =============================================================================
// Artist Detail Page
// Moroccan Art Platform
// =============================================================================

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArtistBySlug, getRelatedArtists, getArtworksByArtist } from '@/lib/queries';
import { generateArtistMetadata, generateBreadcrumbs } from '@/lib/seo';
import { generateArtistJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo';

// =============================================================================
// METADATA
// =============================================================================

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const artist = await getArtistBySlug(slug);

  if (!artist) {
    return { title: 'Artist Not Found' };
  }

  return generateArtistMetadata(artist);
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default async function ArtistPage({ params }: PageProps) {
  const { slug } = await params;
  const artist = await getArtistBySlug(slug);

  if (!artist) {
    notFound();
  }

  // Fetch additional related data
  const [relatedArtists, artworks] = await Promise.all([
    getRelatedArtists(artist.id),
    getArtworksByArtist(artist.id),
  ]);

  // Generate structured data
  const breadcrumbs = generateBreadcrumbs(`/artists/${slug}`, artist.name);
  const jsonLd = [
    generateArtistJsonLd(artist),
    generateBreadcrumbJsonLd(breadcrumbs),
  ];

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="text-sm mb-6">
          <Link href="/" className="text-blue-600 hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/artists" className="text-blue-600 hover:underline">Artists</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-600">{artist.name}</span>
        </nav>

        {/* Artist Header */}
        <header className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">{artist.name}</h1>
              {artist.nameArabic && (
                <p className="text-2xl text-gray-600 mb-2" dir="rtl">{artist.nameArabic}</p>
              )}
              <p className="text-lg text-gray-500">
                {artist.birthYear}
                {artist.deathYear ? `–${artist.deathYear}` : '–present'}
              </p>
            </div>
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium">
              {artist.medium}
            </span>
          </div>
        </header>

        {/* Biography */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Biography</h2>
          <p className="text-gray-700 leading-relaxed">
            {artist.biography || artist.biographyShort}
          </p>
        </section>

        {/* Themes */}
        {artist.themes && artist.themes.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Key Themes</h2>
            <div className="flex flex-wrap gap-2">
              {artist.themes.map((theme) => (
                <Link
                  key={theme.id}
                  href={`/themes/${theme.slug}`}
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
                >
                  {theme.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Movements */}
        {artist.movements && artist.movements.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Movements</h2>
            <div className="flex flex-wrap gap-2">
              {artist.movements.map((movement) => (
                <Link
                  key={movement.id}
                  href={`/movements/${movement.slug}`}
                  className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full hover:bg-purple-100 transition-colors"
                >
                  {movement.name}
                  {movement.periodStart && (
                    <span className="text-purple-500 ml-1">
                      ({movement.periodStart}–{movement.periodEnd || 'present'})
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Cities */}
        {artist.cities && artist.cities.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Cities</h2>
            <div className="flex flex-wrap gap-2">
              {artist.cities.map((cityRel, idx) => (
                <Link
                  key={idx}
                  href={`/cities/${cityRel.city.slug}`}
                  className="px-3 py-1 bg-green-50 text-green-700 rounded-full hover:bg-green-100 transition-colors"
                >
                  {cityRel.city.name}
                  <span className="text-green-500 ml-1">({cityRel.relationType})</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Selected Works */}
        {artworks.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Selected Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {artworks.map((artwork) => (
                <Link
                  key={artwork.id}
                  href={`/works/${artwork.slug}`}
                  className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow border"
                >
                  <h3 className="font-semibold mb-1">{artwork.title}</h3>
                  <p className="text-sm text-gray-500">
                    {artwork.year}{artwork.yearEnd ? `–${artwork.yearEnd}` : ''}
                  </p>
                  {artwork.isIconic && (
                    <span className="inline-block mt-2 text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded">
                      Iconic Work
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related Artists */}
        {relatedArtists.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Related Artists</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedArtists.map((related) => (
                <Link
                  key={related.id}
                  href={`/artists/${related.slug}`}
                  className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow border"
                >
                  <h3 className="font-semibold">{related.name}</h3>
                  <p className="text-sm text-gray-500">
                    {related.birthYear}–{related.deathYear || 'present'}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}

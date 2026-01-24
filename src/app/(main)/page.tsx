export const dynamic = 'force-dynamic';
// =============================================================================
// Homepage
// Moroccan Art Platform
// =============================================================================

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

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default async function HomePage() {
  // Fetch data in parallel
  let featuredArtists: any[] = [];
  let featuredWorks: any[] = [];
  let artistCount = 0;
  let artworkCount = 0;
  let dataError = false;

  try {
    const [allArtists, allWorks, totalArtists, totalArtworks] = await Promise.all([
      getFeaturedArtists(),
      getFeaturedWorks(),
      getArtistCount(),
      getArtworkCount(),
    ]);
    featuredArtists = allArtists.slice(0, 6);
    featuredWorks = allWorks.slice(0, 4);
    artistCount = totalArtists;
    artworkCount = totalArtworks;
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    dataError = true;
  }

  // JSON-LD structured data
  const jsonLd = [generateSearchActionJsonLd(), generateOrganizationJsonLd()];

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center py-16">
          <h1 className="text-4xl font-bold mb-4">Morocco Art Archive</h1>
          <p className="text-xl text-gray-600 mb-8">
            A comprehensive database of Moroccan visual art - Photography & Painting
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/photography"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Explore Photography
            </Link>
            <Link
              href="/painting"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Explore Painting
            </Link>
          </div>
        </section>

        {/* Data Error Notice */}
        {dataError && (
          <section className="py-4 px-6 bg-yellow-50 border border-yellow-200 rounded-lg mb-8">
            <p className="text-yellow-800 text-center">
              Unable to load data. Please check that Google Sheets credentials are configured.
            </p>
          </section>
        )}

        {/* Stats */}
        <section className="grid grid-cols-2 gap-8 py-8 text-center">
          <div className="p-6 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold">{artistCount || '—'}</div>
            <div className="text-gray-600">Artists</div>
          </div>
          <div className="p-6 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold">{artworkCount || '—'}</div>
            <div className="text-gray-600">Artworks</div>
          </div>
        </section>

        {/* Featured Artists */}
        {featuredArtists.length > 0 && (
          <section className="py-8">
            <h2 className="text-2xl font-bold mb-6">Featured Artists</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {featuredArtists.map((artist) => (
                <Link
                  key={artist.id}
                  href={`/artists/${artist.slug}`}
                  className="p-4 border rounded-lg hover:shadow-lg transition-shadow"
                >
                  <h3 className="font-semibold">{artist.name}</h3>
                  <p className="text-sm text-gray-500">{artist.medium}</p>
                </Link>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link href="/artists" className="text-blue-600 hover:underline">
                View all artists →
              </Link>
            </div>
          </section>
        )}

        {/* Featured Works */}
        {featuredWorks.length > 0 && (
          <section className="py-8">
            <h2 className="text-2xl font-bold mb-6">Iconic Works</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featuredWorks.map((work) => (
                <Link
                  key={work.id}
                  href={`/works/${work.slug}`}
                  className="p-4 border rounded-lg hover:shadow-lg transition-shadow"
                >
                  <h3 className="font-semibold">{work.title}</h3>
                  <p className="text-sm text-gray-500">{work.artist?.name}</p>
                  {work.year && (
                    <p className="text-sm text-gray-400">{work.year}</p>
                  )}
                </Link>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link href="/works" className="text-blue-600 hover:underline">
                View all works →
              </Link>
            </div>
          </section>
        )}

        {/* Browse Navigation */}
        <section className="py-8">
          <h2 className="text-2xl font-bold mb-6">Browse the Archive</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/movements"
              className="p-6 bg-purple-50 rounded-lg text-center hover:bg-purple-100"
            >
              <div className="font-semibold">Movements</div>
              <div className="text-sm text-gray-500">Art movements & periods</div>
            </Link>
            <Link
              href="/themes"
              className="p-6 bg-yellow-50 rounded-lg text-center hover:bg-yellow-100"
            >
              <div className="font-semibold">Themes</div>
              <div className="text-sm text-gray-500">Subjects & concepts</div>
            </Link>
            <Link
              href="/cities"
              className="p-6 bg-red-50 rounded-lg text-center hover:bg-red-100"
            >
              <div className="font-semibold">Cities</div>
              <div className="text-sm text-gray-500">Art by location</div>
            </Link>
            <Link
              href="/search"
              className="p-6 bg-blue-50 rounded-lg text-center hover:bg-blue-100"
            >
              <div className="font-semibold">Search</div>
              <div className="text-sm text-gray-500">Find artists & works</div>
            </Link>
          </div>
        </section>

        {/* About Section */}
        <section className="py-8 mt-8 border-t">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">About the Archive</h2>
            <p className="text-gray-600 mb-4">
              Morocco Art Archive is a reference database dedicated to documenting Moroccan visual art,
              focusing exclusively on photography and painting. Our mission is to preserve and make
              accessible the rich artistic heritage of Morocco.
            </p>
            <Link href="/about" className="text-blue-600 hover:underline">
              Learn more about the project →
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

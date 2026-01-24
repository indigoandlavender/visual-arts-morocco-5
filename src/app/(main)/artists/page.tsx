export const dynamic = 'force-dynamic';
// =============================================================================
// Artists Index Page
// Moroccan Art Platform
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Artists</h1>
        <p className="text-gray-600">{totalCount} Moroccan visual artists</p>
      </header>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artists.map((artist) => (
          <Link
            key={artist.id}
            href={`/artists/${artist.slug}`}
            className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow border"
          >
            <div className="flex items-start justify-between mb-2">
              <h2 className="text-xl font-semibold">{artist.name}</h2>
              <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                {artist.medium}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-3">
              {artist.birthYear}
              {artist.deathYear ? `–${artist.deathYear}` : '–present'}
            </p>
            {artist.biographyShort && (
              <p className="text-gray-600 text-sm line-clamp-3">
                {artist.biographyShort}
              </p>
            )}
            {artist.themes && artist.themes.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {artist.themes.slice(0, 3).map((theme) => (
                  <span
                    key={theme.id}
                    className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded"
                  >
                    {theme.name}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>

      {artists.length === 0 && (
        <p className="text-center text-gray-500 py-12">No artists found.</p>
      )}
    </div>
  );
}

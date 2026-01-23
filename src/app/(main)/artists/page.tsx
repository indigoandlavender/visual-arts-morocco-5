// =============================================================================
// Artists Index Page
// Moroccan Art Platform
// =============================================================================

import type { Metadata } from 'next';
import { generateListMetadata } from '@/lib/seo';
import { getArtists, getArtistFacets, getArtistCount } from '@/lib/queries/artists';
import { parseURLParams } from '@/lib/search';
import type { URLQueryParams } from '@/lib/search';

export const metadata: Metadata = generateListMetadata('artists');

// =============================================================================
// PAGE PROPS
// =============================================================================

interface ArtistsPageProps {
  searchParams: Promise<URLQueryParams>;
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default async function ArtistsPage({ searchParams }: ArtistsPageProps) {
  const params = await searchParams;
  const query = parseURLParams(params);

  // Fetch data in parallel
  const [artistsResult, facets, totalCount] = await Promise.all([
    getArtists({
      q: query.keyword,
      medium: query.medium?.[0],
      periodStart: query.periodStart,
      periodEnd: query.periodEnd,
      city: query.cityIds?.[0],
      theme: query.themeIds?.[0],
      movement: query.movementIds?.[0],
      page: query.page,
      limit: query.limit,
      sort: query.sort as any,
      order: query.order,
    }),
    getArtistFacets(),
    getArtistCount(),
  ]);

  return (
    <div>
      {/* Section 1: Page Header */}
      <section data-section="header">
        {/*
          Content:
          - Title: "Artists"
          - Count: {totalCount} artists
          - Description: "Browse all Moroccan visual artists"
        */}
      </section>

      {/* Section 2: Filter Controls */}
      <section data-section="filters">
        {/*
          Filter Dimensions:
          - Medium: Photography | Painting | Both
          - Time Period: Pre-1900 | 1900-1955 | 1956-1980 | 1981-2000 | 2001-present
          - City: Dynamic from {facets.cities}
          - Theme: Dynamic from {facets.themes}
          - Movement: Dynamic (separate query)
          - Moroccan Connection: Born | Based | Diaspora | Significant Work

          State Management:
          - Filters update URL params
          - URL is source of truth
          - Facet counts update based on current filters
        */}
      </section>

      {/* Section 3: Sort Controls */}
      <section data-section="sort">
        {/*
          Sort Options:
          - Alphabetical (A-Z, Z-A)
          - Birth Year (newest, oldest)
          - Active Period Start
          - Recently Added
        */}
      </section>

      {/* Section 4: Active Filters Display */}
      <section data-section="active-filters">
        {/*
          Display currently active filters as removable chips
          "Clear All" option
        */}
      </section>

      {/* Section 5: Alphabet Quick Jump */}
      <section data-section="alphabet-nav">
        {/*
          A-Z navigation for alphabetical browsing
          Links: /artists?letter=A, etc.
        */}
      </section>

      {/* Section 6: Results Grid */}
      <section data-section="results">
        {/*
          Data: {artistsResult.data}
          Display: Grid of artist cards
          Each card links to: /artists/[slug]

          Card Content:
          - Name
          - Medium badge
          - Birth/Death years
          - Short bio excerpt
        */}
      </section>

      {/* Section 7: Pagination */}
      <section data-section="pagination">
        {/*
          Data: {artistsResult.pagination}
          - Current page
          - Total pages
          - Previous/Next links
          - Page number links
        */}
      </section>
    </div>
  );
}

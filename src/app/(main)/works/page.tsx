// =============================================================================
// Works Index Page
// Moroccan Art Platform
// =============================================================================

import type { Metadata } from 'next';
import { generateListMetadata } from '@/lib/seo';
import { getArtworks, getArtworkFacets, getArtworkCount } from '@/lib/queries';
import { parseURLParams } from '@/lib/search';
import type { URLQueryParams } from '@/lib/search';

export const metadata: Metadata = generateListMetadata('works');

// =============================================================================
// PAGE PROPS
// =============================================================================

interface WorksPageProps {
  searchParams: Promise<URLQueryParams>;
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default async function WorksPage({ searchParams }: WorksPageProps) {
  const params = await searchParams;
  const query = parseURLParams(params);

  // Fetch data in parallel
  const [artworksResult, facets, totalCount] = await Promise.all([
    getArtworks({
      q: query.keyword,
      medium: query.medium?.[0],
      periodStart: query.periodStart,
      periodEnd: query.periodEnd,
      city: query.cityIds?.[0],
      theme: query.themeIds?.[0],
      movement: query.movementIds?.[0],
      artist: query.artistIds?.[0],
      iconic: query.iconicOnly,
      page: query.page,
      limit: query.limit,
      sort: query.sort as any,
      order: query.order,
    }),
    getArtworkFacets(),
    getArtworkCount(),
  ]);

  return (
    <div>
      {/* Section 1: Page Header */}
      <section data-section="header">
        {/*
          Content:
          - Title: "Artworks"
          - Count: {totalCount} works
          - Description: "Explore canonical artworks and iconic images"
        */}
      </section>

      {/* Section 2: Filter Controls */}
      <section data-section="filters">
        {/*
          Filter Dimensions:
          - Medium: Photography | Painting
          - Time Period: Decade ranges
          - City: Dynamic from {facets.cities}
          - Theme: Dynamic from {facets.themes}
          - Movement: Dynamic (separate query)
          - Artist: Autocomplete search
          - Iconic Only: Boolean toggle

          State Management:
          - Filters update URL params
          - URL is source of truth
        */}
      </section>

      {/* Section 3: View Toggle */}
      <section data-section="view-toggle">
        {/*
          Options:
          - All Works (default)
          - Iconic Images Only
          URL: ?iconic=true
        */}
      </section>

      {/* Section 4: Sort Controls */}
      <section data-section="sort">
        {/*
          Sort Options:
          - Year (newest, oldest)
          - Artist Name (A-Z, Z-A)
          - Recently Added
        */}
      </section>

      {/* Section 5: Active Filters Display */}
      <section data-section="active-filters">
        {/*
          Display currently active filters as removable chips
        */}
      </section>

      {/* Section 6: Results Grid */}
      <section data-section="results">
        {/*
          Data: {artworksResult.data}
          Display: Grid of artwork cards
          Each card links to: /works/[slug]

          Card Content:
          - Title
          - Artist name (linked)
          - Year
          - Thumbnail image
          - Iconic badge (if applicable)
        */}
      </section>

      {/* Section 7: Pagination */}
      <section data-section="pagination">
        {/*
          Data: {artworksResult.pagination}
        */}
      </section>
    </div>
  );
}

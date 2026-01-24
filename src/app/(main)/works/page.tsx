export const dynamic = 'force-dynamic';
// =============================================================================
// Works Index Page
// Moroccan Art Platform
// =============================================================================

import type { Metadata } from 'next';
import { generateListMetadata } from '@/lib/seo';
import { getArtworks, getArtworkFacets, getArtworkCount } from '@/lib/queries';

export const metadata: Metadata = generateListMetadata('works');

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default async function WorksPage() {
  // Fetch data in parallel
  const [artworks, facets, totalCount] = await Promise.all([
    getArtworks(),
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
          Data: {artworks}
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
          Client-side pagination of {artworks}
        */}
      </section>
    </div>
  );
}

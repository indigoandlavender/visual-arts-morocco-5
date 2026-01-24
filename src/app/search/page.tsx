export const dynamic = 'force-dynamic';
// =============================================================================
// Search Page
// Moroccan Art Platform
// =============================================================================

import type { Metadata } from 'next';
import { generateSearchMetadata } from '@/lib/seo';
import { executeSearch, parseURLParams } from '@/lib/search';
import type { URLQueryParams } from '@/lib/search';

// =============================================================================
// METADATA
// =============================================================================

interface SearchPageProps {
  searchParams: Promise<URLQueryParams>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  return generateSearchMetadata(params.q || '');
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = parseURLParams(params);

  // Execute search
  const searchResults = await executeSearch(query);

  return (
    <div>
      {/* Section 1: Search Header */}
      <section data-section="search-header">
        {/*
          Content:
          - Title: "Search"
          - Search input field
          - Search query display: "Results for: {query.keyword}"
        */}
      </section>

      {/* Section 2: Search Input */}
      <section data-section="search-input">
        {/*
          Input Components:
          - Text input for keyword search
          - Autocomplete suggestions
          - Search button

          Behavior:
          - Updates URL params on submit
          - Debounced autocomplete
        */}
      </section>

      {/* Section 3: Entity Type Tabs */}
      <section data-section="entity-tabs">
        {/*
          Tabs:
          - All ({searchResults.totalCount})
          - Artists ({searchResults.groupedResults?.artists.length})
          - Artworks ({searchResults.groupedResults?.artworks.length})

          Links:
          - /search?type=all
          - /search?type=artists
          - /search?type=artworks
        */}
      </section>

      {/* Section 4: Filter Controls */}
      <section data-section="filters">
        {/*
          Filter Dimensions:
          - Medium: {searchResults.facets.medium}
          - Time Period: {searchResults.facets.period}
          - City: {searchResults.facets.city}
          - Theme: {searchResults.facets.theme}
          - Movement: {searchResults.facets.movement}

          Display:
          - Faceted counts for each option
          - Selected filters highlighted
          - Filter updates preserve other params

          Paywall Hook:
          - Free: Single filter at a time
          - Premium: Multiple simultaneous filters
        */}
      </section>

      {/* Section 5: Active Filters */}
      <section data-section="active-filters">
        {/*
          Display:
          - List of active filters as removable chips
          - "Clear All" button
        */}
      </section>

      {/* Section 6: Results Summary */}
      <section data-section="results-summary">
        {/*
          Content:
          - Total results: {searchResults.totalCount}
          - Execution time: {searchResults.executionTime}ms
          - Current filters summary
        */}
      </section>

      {/* Section 7: Sort Controls */}
      <section data-section="sort">
        {/*
          Sort Options:
          - Relevance (default for keyword search)
          - Name (A-Z, Z-A)
          - Year (newest, oldest)
        */}
      </section>

      {/* Section 8: Search Results */}
      <section data-section="results">
        {/*
          Data: {searchResults.results}

          Display: Mixed results list
          Each result shows:
          - Type badge (Artist / Artwork)
          - Title
          - Subtitle
          - Thumbnail (for artworks)
          - Highlighted search matches (if keyword search)

          Links:
          - Artists → /artists/[slug]
          - Artworks → /works/[slug]
        */}
      </section>

      {/* Section 9: Pagination */}
      <section data-section="pagination">
        {/*
          Data: Derived from query.page and searchResults.totalCount
          - Previous / Next
          - Page numbers
          - Jump to page
        */}
      </section>

      {/* Section 10: No Results State */}
      {searchResults.totalCount === 0 && (
        <section data-section="no-results">
          {/*
            Content:
            - "No results found" message
            - Suggestions:
              - Check spelling
              - Try different keywords
              - Browse categories instead
            - Links to /artists, /works, /themes
          */}
        </section>
      )}

      {/* Section 11: Search Tips (collapsed by default) */}
      <section data-section="search-tips">
        {/*
          Content:
          - How to use filters
          - Example queries
          - Advanced search syntax (if implemented)
        */}
      </section>
    </div>
  );
}

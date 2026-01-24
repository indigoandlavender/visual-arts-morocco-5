// =============================================================================
// Search Engine - Google Sheets Backend
// Moroccan Art Platform
// =============================================================================

import { searchAll } from '@/lib/queries';
import type {
  SearchQuery,
  SearchResult,
  SearchResultSet,
  SearchFacets,
  AutocompleteRequest,
  AutocompleteSuggestion,
} from '@/types/search';

// =============================================================================
// MAIN SEARCH FUNCTION
// =============================================================================

export async function executeSearch(query: SearchQuery): Promise<SearchResultSet> {
  const startTime = Date.now();

  // Use the Google Sheets search
  const searchResults = await searchAll(query.keyword || '');

  // Convert to SearchResult format
  const artistResults: SearchResult[] = searchResults.artists.map((artist) => ({
    type: 'artist' as const,
    id: artist.id,
    slug: artist.slug,
    title: artist.name,
    subtitle: artist.medium || '',
    score: query.keyword ? calculateRelevanceScore(artist.name, query.keyword) : undefined,
  }));

  const artworkResults: SearchResult[] = searchResults.artworks.map((artwork) => ({
    type: 'artwork' as const,
    id: artwork.id,
    slug: artwork.slug,
    title: artwork.title,
    subtitle: artwork.artist?.name || '',
    imageUrl: artwork.imageUrl || undefined,
    score: query.keyword ? calculateRelevanceScore(artwork.title, query.keyword) : undefined,
  }));

  // Filter by entity type if specified
  let results: SearchResult[] = [];
  if (query.entityType === 'artists') {
    results = artistResults;
  } else if (query.entityType === 'artworks') {
    results = artworkResults;
  } else {
    results = [...artistResults, ...artworkResults];
  }

  // Sort by relevance score if keyword search
  if (query.keyword) {
    results.sort((a, b) => (b.score || 0) - (a.score || 0));
  }

  // Paginate
  const start = (query.page - 1) * query.limit;
  const paginatedResults = results.slice(start, start + query.limit);

  // Empty facets (simplified for now)
  const facets: SearchFacets = {
    medium: [],
    period: [],
    city: [],
    theme: [],
    movement: [],
    moroccanConnection: [],
  };

  return {
    results: paginatedResults,
    groupedResults: {
      artists: artistResults,
      artworks: artworkResults,
      movements: [],
      themes: [],
      cities: [],
    },
    totalCount: results.length,
    facets,
    query,
    executionTime: Date.now() - startTime,
  };
}

// =============================================================================
// AUTOCOMPLETE
// =============================================================================

export async function getAutocompleteSuggestions(
  request: AutocompleteRequest
): Promise<AutocompleteSuggestion[]> {
  const { prefix, limit = 10 } = request;

  if (prefix.length < 2) return [];

  const searchResults = await searchAll(prefix);

  const suggestions: AutocompleteSuggestion[] = [];

  // Add artists
  searchResults.artists.slice(0, limit).forEach((a) => {
    suggestions.push({
      type: 'artist',
      id: a.id,
      slug: a.slug,
      text: a.name,
      subtitle: a.medium || undefined,
    });
  });

  // Add artworks
  searchResults.artworks.slice(0, limit).forEach((a) => {
    suggestions.push({
      type: 'artwork',
      id: a.id,
      slug: a.slug,
      text: a.title,
      subtitle: a.artist?.name,
    });
  });

  // Sort by relevance
  suggestions.sort((a, b) => {
    const aStartsWith = a.text.toLowerCase().startsWith(prefix.toLowerCase());
    const bStartsWith = b.text.toLowerCase().startsWith(prefix.toLowerCase());
    if (aStartsWith && !bStartsWith) return -1;
    if (!aStartsWith && bStartsWith) return 1;
    return a.text.localeCompare(b.text);
  });

  return suggestions.slice(0, limit);
}

// =============================================================================
// UTILITIES
// =============================================================================

function calculateRelevanceScore(text: string, keyword: string): number {
  const lowerText = text.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();

  if (lowerText === lowerKeyword) return 100;
  if (lowerText.startsWith(lowerKeyword)) return 90;
  if (lowerText.includes(` ${lowerKeyword}`)) return 80;
  if (lowerText.includes(lowerKeyword)) return 70;
  return 50;
}

// =============================================================================
// Search Module Exports
// Moroccan Art Platform
// =============================================================================

export { executeSearch, getAutocompleteSuggestions } from './engine';

export {
  parseURLParams,
  serializeToURLParams,
  buildSearchURL,
  mergeQueryParams,
  removeFilter,
  clearAllFilters,
  createFacetBuckets,
  getActiveFilterCount,
  periodToLabel,
  validateSearchQuery,
} from './query-builder';

export type {
  SearchQuery,
  SearchResult,
  SearchResultSet,
  SearchFacets,
  FacetBucket,
  URLQueryParams,
  AutocompleteRequest,
  AutocompleteSuggestion,
  FilterDefinition,
  FilterOption,
  TimePeriodBucket,
  FilterState,
  ActiveFilter,
  AvailableFilters,
} from '@/types/search';

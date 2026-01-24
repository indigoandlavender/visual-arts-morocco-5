// =============================================================================
// Search & Query Types
// Moroccan Art Platform
// =============================================================================

import { Medium, ThemeCategory, SortOption } from './index';

// =============================================================================
// FILTER SCHEMA DEFINITIONS
// =============================================================================

export interface FilterDefinition {
  key: string;
  label: string;
  type: 'single' | 'multi' | 'range' | 'boolean';
  appliesTo: ('artists' | 'artworks')[];
  options?: FilterOption[];
  range?: {
    min: number;
    max: number;
    step?: number;
  };
  buckets?: TimePeriodBucket[];
}

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface TimePeriodBucket {
  label: string;
  start: number | null;
  end: number | null;
}

// Pre-defined time period buckets
export const TIME_PERIOD_BUCKETS: TimePeriodBucket[] = [
  { label: 'Pre-1900', start: null, end: 1899 },
  { label: '1900-1955', start: 1900, end: 1955 },
  { label: '1956-1980', start: 1956, end: 1980 },
  { label: '1981-2000', start: 1981, end: 2000 },
  { label: '2001-present', start: 2001, end: null },
];

// =============================================================================
// SEARCH QUERY BUILDER TYPES
// =============================================================================

export interface SearchQuery {
  // Text search
  keyword?: string;

  // Entity filters
  medium?: Medium[];
  moroccanConnection?: string[];

  // Relational filters (by slug or id)
  cityIds?: string[];
  themeIds?: string[];
  movementIds?: string[];
  artistIds?: string[];

  // Time filters
  periodStart?: number;
  periodEnd?: number;

  // Boolean filters
  iconicOnly?: boolean;

  // Result options
  entityType: 'artists' | 'artworks' | 'all';
  page: number;
  limit: number;
  sort: SortOption;
  order: 'asc' | 'desc';
}

export interface CompositeQuery {
  // Allows combining multiple query conditions
  and?: SearchQuery[];
  or?: SearchQuery[];
  not?: Partial<SearchQuery>;
}

// =============================================================================
// FULL-TEXT SEARCH TYPES
// =============================================================================

export interface TextSearchConfig {
  fields: TextSearchField[];
  language: 'english' | 'french' | 'arabic';
  fuzzyMatch: boolean;
  highlightMatches: boolean;
}

export interface TextSearchField {
  field: string;
  weight: number; // 1-10, higher = more important
  entity: 'artist' | 'artwork' | 'movement' | 'theme' | 'city';
}

export const DEFAULT_SEARCH_FIELDS: TextSearchField[] = [
  { field: 'name', weight: 10, entity: 'artist' },
  { field: 'title', weight: 10, entity: 'artwork' },
  { field: 'name', weight: 8, entity: 'movement' },
  { field: 'name', weight: 7, entity: 'theme' },
  { field: 'name', weight: 7, entity: 'city' },
  { field: 'biography', weight: 3, entity: 'artist' },
  { field: 'description', weight: 3, entity: 'artwork' },
];

// =============================================================================
// SEARCH RESULTS TYPES
// =============================================================================

export interface SearchResult {
  type: 'artist' | 'artwork' | 'movement' | 'theme' | 'city';
  id: string;
  slug: string;
  title: string; // Primary display name
  subtitle?: string; // Secondary info (e.g., dates, medium)
  imageUrl?: string;
  score?: number; // Relevance score
  highlights?: SearchHighlight[];
}

export interface SearchHighlight {
  field: string;
  snippet: string; // Text with <mark> tags around matches
}

export interface SearchResultSet {
  results: SearchResult[];
  groupedResults?: {
    artists: SearchResult[];
    artworks: SearchResult[];
    movements: SearchResult[];
    themes: SearchResult[];
    cities: SearchResult[];
  };
  totalCount: number;
  facets: SearchFacets;
  query: SearchQuery;
  executionTime: number;
}

export interface SearchFacets {
  medium: FacetBucket[];
  period: FacetBucket[];
  city: FacetBucket[];
  theme: FacetBucket[];
  movement: FacetBucket[];
  moroccanConnection: FacetBucket[];
}

export interface FacetBucket {
  value: string;
  label: string;
  count: number;
  selected: boolean;
}

// =============================================================================
// URL QUERY PARAMETER MAPPING
// =============================================================================

export interface URLQueryParams {
  q?: string;
  medium?: string; // comma-separated: "photography,painting"
  period?: string; // "1956-1980" or "1960-" or "-1900"
  city?: string; // comma-separated slugs
  theme?: string; // comma-separated slugs
  movement?: string; // comma-separated slugs
  artist?: string; // single slug
  iconic?: string; // "true" or "false"
  connection?: string; // comma-separated: "born,diaspora"
  type?: string; // "artists" | "artworks" | "all"
  page?: string;
  limit?: string;
  sort?: string;
  order?: string;
}

// URL parsing utilities type
export type QueryParamParser = (params: URLQueryParams) => SearchQuery;
export type QueryParamSerializer = (query: SearchQuery) => URLQueryParams;

// =============================================================================
// AUTOCOMPLETE TYPES
// =============================================================================

export interface AutocompleteRequest {
  prefix: string;
  entityTypes?: ('artist' | 'artwork' | 'city' | 'theme' | 'movement')[];
  limit?: number;
}

export interface AutocompleteSuggestion {
  type: 'artist' | 'artwork' | 'city' | 'theme' | 'movement';
  id: string;
  slug: string;
  text: string;
  subtitle?: string;
}

// =============================================================================
// FILTER STATE MANAGEMENT
// =============================================================================

export interface FilterState {
  active: ActiveFilter[];
  available: AvailableFilters;
}

export interface ActiveFilter {
  key: string;
  value: string | string[] | boolean | [number, number];
  label: string;
}

export interface AvailableFilters {
  medium: FilterOption[];
  period: TimePeriodBucket[];
  city: FilterOption[];
  theme: FilterOption[];
  movement: FilterOption[];
  moroccanConnection: FilterOption[];
}

// =============================================================================
// Search Query Builder
// Moroccan Art Platform
// =============================================================================

import type {
  SearchQuery,
  URLQueryParams,
  SearchResult,
  SearchResultSet,
  SearchFacets,
  FacetBucket,
  TIME_PERIOD_BUCKETS,
} from '@/types/search';
import type { Medium, MoroccanConnection } from '@/types';

// =============================================================================
// URL PARAMETER PARSING
// =============================================================================

export function parseURLParams(params: URLQueryParams): SearchQuery {
  return {
    keyword: params.q || undefined,

    medium: params.medium
      ? (params.medium.split(',').map((m) => m.toUpperCase()) as Medium[])
      : undefined,

    moroccanConnection: params.connection
      ? (params.connection.split(',').map((c) => c.toUpperCase()) as MoroccanConnection[])
      : undefined,

    cityIds: params.city ? params.city.split(',') : undefined,
    themeIds: params.theme ? params.theme.split(',') : undefined,
    movementIds: params.movement ? params.movement.split(',') : undefined,
    artistIds: params.artist ? [params.artist] : undefined,

    periodStart: params.period ? parsePeriodStart(params.period) : undefined,
    periodEnd: params.period ? parsePeriodEnd(params.period) : undefined,

    iconicOnly: params.iconic === 'true',

    entityType: (params.type as 'artists' | 'artworks' | 'all') || 'all',
    page: params.page ? parseInt(params.page, 10) : 1,
    limit: params.limit ? parseInt(params.limit, 10) : 24,
    sort: (params.sort as any) || 'relevance',
    order: (params.order as 'asc' | 'desc') || 'desc',
  };
}

export function serializeToURLParams(query: SearchQuery): URLQueryParams {
  const params: URLQueryParams = {};

  if (query.keyword) params.q = query.keyword;

  if (query.medium?.length) {
    params.medium = query.medium.map((m) => m.toLowerCase()).join(',');
  }

  if (query.moroccanConnection?.length) {
    params.connection = query.moroccanConnection.map((c) => c.toLowerCase()).join(',');
  }

  if (query.cityIds?.length) params.city = query.cityIds.join(',');
  if (query.themeIds?.length) params.theme = query.themeIds.join(',');
  if (query.movementIds?.length) params.movement = query.movementIds.join(',');
  if (query.artistIds?.length) params.artist = query.artistIds[0];

  if (query.periodStart || query.periodEnd) {
    params.period = `${query.periodStart || ''}-${query.periodEnd || ''}`;
  }

  if (query.iconicOnly) params.iconic = 'true';
  if (query.entityType !== 'all') params.type = query.entityType;
  if (query.page > 1) params.page = String(query.page);
  if (query.limit !== 24) params.limit = String(query.limit);
  if (query.sort !== 'relevance') params.sort = query.sort;
  if (query.order !== 'desc') params.order = query.order;

  return params;
}

// =============================================================================
// QUERY BUILDING UTILITIES
// =============================================================================

export function buildSearchURL(baseURL: string, query: Partial<SearchQuery>): string {
  const params = serializeToURLParams(query as SearchQuery);
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) searchParams.set(key, value);
  });

  const queryString = searchParams.toString();
  return queryString ? `${baseURL}?${queryString}` : baseURL;
}

export function mergeQueryParams(
  current: SearchQuery,
  updates: Partial<SearchQuery>
): SearchQuery {
  return {
    ...current,
    ...updates,
    // Reset page when filters change (except explicit page change)
    page: 'page' in updates ? (updates.page ?? 1) : 1,
  };
}

export function removeFilter(
  query: SearchQuery,
  filterKey: keyof SearchQuery,
  value?: string
): SearchQuery {
  const updated = { ...query };

  if (value && Array.isArray(updated[filterKey])) {
    (updated[filterKey] as string[]) = (updated[filterKey] as string[]).filter(
      (v) => v !== value
    );
    if ((updated[filterKey] as string[]).length === 0) {
      delete updated[filterKey];
    }
  } else {
    delete updated[filterKey];
  }

  updated.page = 1; // Reset pagination
  return updated;
}

export function clearAllFilters(query: SearchQuery): SearchQuery {
  return {
    entityType: query.entityType,
    page: 1,
    limit: query.limit,
    sort: 'relevance',
    order: 'desc',
  };
}

// =============================================================================
// FACET UTILITIES
// =============================================================================

export function createFacetBuckets(
  values: { value: string; label: string; count: number }[],
  selectedValues: string[] = []
): FacetBucket[] {
  return values.map((v) => ({
    value: v.value,
    label: v.label,
    count: v.count,
    selected: selectedValues.includes(v.value),
  }));
}

export function getActiveFilterCount(query: SearchQuery): number {
  let count = 0;

  if (query.keyword) count++;
  if (query.medium?.length) count += query.medium.length;
  if (query.moroccanConnection?.length) count += query.moroccanConnection.length;
  if (query.cityIds?.length) count += query.cityIds.length;
  if (query.themeIds?.length) count += query.themeIds.length;
  if (query.movementIds?.length) count += query.movementIds.length;
  if (query.periodStart || query.periodEnd) count++;
  if (query.iconicOnly) count++;

  return count;
}

// =============================================================================
// PERIOD PARSING
// =============================================================================

function parsePeriodStart(period: string): number | undefined {
  const parts = period.split('-');
  const start = parts[0];
  return start ? parseInt(start, 10) : undefined;
}

function parsePeriodEnd(period: string): number | undefined {
  const parts = period.split('-');
  const end = parts[1];
  return end ? parseInt(end, 10) : undefined;
}

export function periodToLabel(start?: number, end?: number): string {
  if (!start && !end) return 'All periods';
  if (!start) return `Before ${end}`;
  if (!end) return `${start} - Present`;
  return `${start} - ${end}`;
}

// =============================================================================
// QUERY VALIDATION
// =============================================================================

export interface QueryValidationResult {
  valid: boolean;
  errors: string[];
  sanitized: SearchQuery;
}

export function validateSearchQuery(query: SearchQuery): QueryValidationResult {
  const errors: string[] = [];
  const sanitized = { ...query };

  // Validate page
  if (sanitized.page < 1) {
    sanitized.page = 1;
    errors.push('Page must be at least 1');
  }

  // Validate limit
  if (sanitized.limit < 1 || sanitized.limit > 100) {
    sanitized.limit = Math.min(Math.max(sanitized.limit, 1), 100);
    errors.push('Limit must be between 1 and 100');
  }

  // Validate period
  if (sanitized.periodStart && sanitized.periodEnd) {
    if (sanitized.periodStart > sanitized.periodEnd) {
      [sanitized.periodStart, sanitized.periodEnd] = [
        sanitized.periodEnd,
        sanitized.periodStart,
      ];
      errors.push('Period start must be before period end');
    }
  }

  // Validate entity type
  if (!['artists', 'artworks', 'all'].includes(sanitized.entityType)) {
    sanitized.entityType = 'all';
    errors.push('Invalid entity type');
  }

  return {
    valid: errors.length === 0,
    errors,
    sanitized,
  };
}

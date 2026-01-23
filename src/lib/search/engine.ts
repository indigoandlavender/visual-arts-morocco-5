// =============================================================================
// Search Engine
// Moroccan Art Platform
// =============================================================================

import { db } from '@/lib/db/client';
import { Prisma } from '@prisma/client';
import type {
  SearchQuery,
  SearchResult,
  SearchResultSet,
  SearchFacets,
  FacetBucket,
  AutocompleteRequest,
  AutocompleteSuggestion,
} from '@/types/search';
import { createFacetBuckets } from './query-builder';

// =============================================================================
// MAIN SEARCH FUNCTION
// =============================================================================

export async function executeSearch(query: SearchQuery): Promise<SearchResultSet> {
  const startTime = Date.now();

  const [artistResults, artworkResults, facets] = await Promise.all([
    query.entityType === 'artworks' ? [] : searchArtists(query),
    query.entityType === 'artists' ? [] : searchArtworks(query),
    getSearchFacets(query),
  ]);

  // Merge and sort results
  const allResults = [...artistResults, ...artworkResults];

  // Sort by relevance score if keyword search, otherwise by the specified sort
  if (query.keyword && query.sort === 'relevance') {
    allResults.sort((a, b) => (b.score || 0) - (a.score || 0));
  }

  // Paginate combined results
  const start = (query.page - 1) * query.limit;
  const paginatedResults = allResults.slice(start, start + query.limit);

  // Group results by type
  const groupedResults = {
    artists: artistResults,
    artworks: artworkResults,
    movements: [],
    themes: [],
    cities: [],
  };

  return {
    results: paginatedResults,
    groupedResults,
    totalCount: allResults.length,
    facets,
    query,
    executionTime: Date.now() - startTime,
  };
}

// =============================================================================
// ARTIST SEARCH
// =============================================================================

async function searchArtists(query: SearchQuery): Promise<SearchResult[]> {
  const where = buildArtistSearchWhere(query);

  const artists = await db.artist.findMany({
    where,
    select: {
      id: true,
      slug: true,
      name: true,
      medium: true,
      birthYear: true,
      deathYear: true,
      biographyShort: true,
    },
    take: query.limit * 2, // Fetch extra for combined pagination
  });

  return artists.map((artist) => ({
    type: 'artist' as const,
    id: artist.id,
    slug: artist.slug,
    title: artist.name,
    subtitle: formatArtistSubtitle(artist),
    score: query.keyword ? calculateRelevanceScore(artist.name, query.keyword) : undefined,
  }));
}

function buildArtistSearchWhere(query: SearchQuery): Prisma.ArtistWhereInput {
  const conditions: Prisma.ArtistWhereInput[] = [{ status: 'PUBLISHED' }];

  // Keyword search
  if (query.keyword) {
    conditions.push({
      OR: [
        { name: { contains: query.keyword, mode: 'insensitive' } },
        { biography: { contains: query.keyword, mode: 'insensitive' } },
        { biographyShort: { contains: query.keyword, mode: 'insensitive' } },
      ],
    });
  }

  // Medium filter
  if (query.medium?.length) {
    conditions.push({
      OR: [
        { medium: { in: query.medium } },
        { medium: 'BOTH' },
      ],
    });
  }

  // Moroccan connection filter
  if (query.moroccanConnection?.length) {
    conditions.push({
      moroccanConnection: { in: query.moroccanConnection },
    });
  }

  // City filter
  if (query.cityIds?.length) {
    conditions.push({
      cities: {
        some: {
          city: { slug: { in: query.cityIds } },
        },
      },
    });
  }

  // Theme filter
  if (query.themeIds?.length) {
    conditions.push({
      themes: {
        some: {
          theme: { slug: { in: query.themeIds } },
        },
      },
    });
  }

  // Movement filter
  if (query.movementIds?.length) {
    conditions.push({
      movements: {
        some: {
          movement: { slug: { in: query.movementIds } },
        },
      },
    });
  }

  // Period filter
  if (query.periodStart || query.periodEnd) {
    if (query.periodStart) {
      conditions.push({
        OR: [
          { activePeriodEnd: { gte: query.periodStart } },
          { activePeriodEnd: null },
        ],
      });
    }
    if (query.periodEnd) {
      conditions.push({
        activePeriodStart: { lte: query.periodEnd },
      });
    }
  }

  return { AND: conditions };
}

// =============================================================================
// ARTWORK SEARCH
// =============================================================================

async function searchArtworks(query: SearchQuery): Promise<SearchResult[]> {
  const where = buildArtworkSearchWhere(query);

  const artworks = await db.artwork.findMany({
    where,
    select: {
      id: true,
      slug: true,
      title: true,
      year: true,
      medium: true,
      imageUrl: true,
      artist: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
    take: query.limit * 2,
  });

  return artworks.map((artwork) => ({
    type: 'artwork' as const,
    id: artwork.id,
    slug: artwork.slug,
    title: artwork.title,
    subtitle: formatArtworkSubtitle(artwork),
    imageUrl: artwork.imageUrl || undefined,
    score: query.keyword
      ? calculateRelevanceScore(artwork.title, query.keyword)
      : undefined,
  }));
}

function buildArtworkSearchWhere(query: SearchQuery): Prisma.ArtworkWhereInput {
  const conditions: Prisma.ArtworkWhereInput[] = [{ status: 'PUBLISHED' }];

  // Keyword search
  if (query.keyword) {
    conditions.push({
      OR: [
        { title: { contains: query.keyword, mode: 'insensitive' } },
        { description: { contains: query.keyword, mode: 'insensitive' } },
        { artist: { name: { contains: query.keyword, mode: 'insensitive' } } },
      ],
    });
  }

  // Medium filter
  if (query.medium?.length) {
    conditions.push({
      medium: { in: query.medium },
    });
  }

  // Artist filter
  if (query.artistIds?.length) {
    conditions.push({
      OR: [
        { artistId: { in: query.artistIds } },
        { artist: { slug: { in: query.artistIds } } },
      ],
    });
  }

  // City filter
  if (query.cityIds?.length) {
    conditions.push({
      cities: {
        some: {
          city: { slug: { in: query.cityIds } },
        },
      },
    });
  }

  // Theme filter
  if (query.themeIds?.length) {
    conditions.push({
      themes: {
        some: {
          theme: { slug: { in: query.themeIds } },
        },
      },
    });
  }

  // Movement filter
  if (query.movementIds?.length) {
    conditions.push({
      movement: { slug: { in: query.movementIds } },
    });
  }

  // Period filter
  if (query.periodStart) {
    conditions.push({ year: { gte: query.periodStart } });
  }
  if (query.periodEnd) {
    conditions.push({ year: { lte: query.periodEnd } });
  }

  // Iconic filter
  if (query.iconicOnly) {
    conditions.push({ isIconic: true });
  }

  return { AND: conditions };
}

// =============================================================================
// FACETS
// =============================================================================

async function getSearchFacets(query: SearchQuery): Promise<SearchFacets> {
  // Build base where clauses without the facet being counted
  const [mediums, cities, themes, movements] = await Promise.all([
    getMediumFacets(query),
    getCityFacets(query),
    getThemeFacets(query),
    getMovementFacets(query),
  ]);

  return {
    medium: mediums,
    period: [], // Computed client-side from year distribution
    city: cities,
    theme: themes,
    movement: movements,
    moroccanConnection: [], // Static enum, no need to compute
  };
}

async function getMediumFacets(query: SearchQuery): Promise<FacetBucket[]> {
  const artistCounts = await db.artist.groupBy({
    by: ['medium'],
    where: { status: 'PUBLISHED' },
    _count: true,
  });

  const values = artistCounts.map((m) => ({
    value: m.medium,
    label: formatMediumLabel(m.medium),
    count: m._count,
  }));

  return createFacetBuckets(values, query.medium || []);
}

async function getCityFacets(query: SearchQuery): Promise<FacetBucket[]> {
  const cities = await db.$queryRaw`
    SELECT c.slug as value, c.name as label, COUNT(DISTINCT ac.artist_id)::int as count
    FROM cities c
    JOIN artist_cities ac ON ac.city_id = c.id
    JOIN artists a ON a.id = ac.artist_id
    WHERE a.status = 'PUBLISHED'
    GROUP BY c.id
    ORDER BY count DESC
    LIMIT 20
  ` as { value: string; label: string; count: number }[];

  return createFacetBuckets(cities, query.cityIds || []);
}

async function getThemeFacets(query: SearchQuery): Promise<FacetBucket[]> {
  const themes = await db.$queryRaw`
    SELECT t.slug as value, t.name as label, COUNT(DISTINCT at.artist_id)::int as count
    FROM themes t
    JOIN artist_themes at ON at.theme_id = t.id
    JOIN artists a ON a.id = at.artist_id
    WHERE a.status = 'PUBLISHED'
    GROUP BY t.id
    ORDER BY count DESC
    LIMIT 20
  ` as { value: string; label: string; count: number }[];

  return createFacetBuckets(themes, query.themeIds || []);
}

async function getMovementFacets(query: SearchQuery): Promise<FacetBucket[]> {
  const movements = await db.$queryRaw`
    SELECT m.slug as value, m.name as label, COUNT(DISTINCT am.artist_id)::int as count
    FROM movements m
    JOIN artist_movements am ON am.movement_id = m.id
    JOIN artists a ON a.id = am.artist_id
    WHERE a.status = 'PUBLISHED' AND m.status = 'PUBLISHED'
    GROUP BY m.id
    ORDER BY count DESC
    LIMIT 20
  ` as { value: string; label: string; count: number }[];

  return createFacetBuckets(movements, query.movementIds || []);
}

// =============================================================================
// AUTOCOMPLETE
// =============================================================================

export async function getAutocompleteSuggestions(
  request: AutocompleteRequest
): Promise<AutocompleteSuggestion[]> {
  const { prefix, entityTypes = ['artist', 'artwork', 'city', 'theme', 'movement'], limit = 10 } = request;

  if (prefix.length < 2) return [];

  const suggestions: AutocompleteSuggestion[] = [];

  const queries = [];

  if (entityTypes.includes('artist')) {
    queries.push(
      db.artist.findMany({
        where: {
          status: 'PUBLISHED',
          name: { contains: prefix, mode: 'insensitive' },
        },
        select: { id: true, slug: true, name: true, medium: true },
        take: limit,
      }).then((artists) =>
        artists.map((a) => ({
          type: 'artist' as const,
          id: a.id,
          slug: a.slug,
          text: a.name,
          subtitle: formatMediumLabel(a.medium),
        }))
      )
    );
  }

  if (entityTypes.includes('artwork')) {
    queries.push(
      db.artwork.findMany({
        where: {
          status: 'PUBLISHED',
          title: { contains: prefix, mode: 'insensitive' },
        },
        select: {
          id: true,
          slug: true,
          title: true,
          artist: { select: { name: true } },
        },
        take: limit,
      }).then((artworks) =>
        artworks.map((a) => ({
          type: 'artwork' as const,
          id: a.id,
          slug: a.slug,
          text: a.title,
          subtitle: a.artist.name,
        }))
      )
    );
  }

  if (entityTypes.includes('city')) {
    queries.push(
      db.city.findMany({
        where: { name: { contains: prefix, mode: 'insensitive' } },
        select: { id: true, slug: true, name: true, region: true },
        take: limit,
      }).then((cities) =>
        cities.map((c) => ({
          type: 'city' as const,
          id: c.id,
          slug: c.slug,
          text: c.name,
          subtitle: c.region || undefined,
        }))
      )
    );
  }

  if (entityTypes.includes('theme')) {
    queries.push(
      db.theme.findMany({
        where: { name: { contains: prefix, mode: 'insensitive' } },
        select: { id: true, slug: true, name: true, category: true },
        take: limit,
      }).then((themes) =>
        themes.map((t) => ({
          type: 'theme' as const,
          id: t.id,
          slug: t.slug,
          text: t.name,
          subtitle: t.category.toLowerCase(),
        }))
      )
    );
  }

  if (entityTypes.includes('movement')) {
    queries.push(
      db.movement.findMany({
        where: {
          status: 'PUBLISHED',
          name: { contains: prefix, mode: 'insensitive' },
        },
        select: { id: true, slug: true, name: true, periodStart: true, periodEnd: true },
        take: limit,
      }).then((movements) =>
        movements.map((m) => ({
          type: 'movement' as const,
          id: m.id,
          slug: m.slug,
          text: m.name,
          subtitle: `${m.periodStart}${m.periodEnd ? ` - ${m.periodEnd}` : '+'}`,
        }))
      )
    );
  }

  const results = await Promise.all(queries);
  suggestions.push(...results.flat());

  // Sort by relevance (exact prefix match first)
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

function formatArtistSubtitle(artist: {
  medium: string;
  birthYear: number | null;
  deathYear: number | null;
}): string {
  const parts = [formatMediumLabel(artist.medium)];

  if (artist.birthYear) {
    const dates = artist.deathYear
      ? `${artist.birthYear} - ${artist.deathYear}`
      : `b. ${artist.birthYear}`;
    parts.push(dates);
  }

  return parts.join(' · ');
}

function formatArtworkSubtitle(artwork: {
  year: number | null;
  medium: string;
  artist: { name: string };
}): string {
  const parts = [artwork.artist.name];
  if (artwork.year) parts.push(String(artwork.year));
  return parts.join(', ');
}

function formatMediumLabel(medium: string): string {
  const labels: Record<string, string> = {
    PHOTOGRAPHY: 'Photography',
    PAINTING: 'Painting',
    BOTH: 'Photography & Painting',
  };
  return labels[medium] || medium;
}

function calculateRelevanceScore(text: string, keyword: string): number {
  const lowerText = text.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();

  // Exact match
  if (lowerText === lowerKeyword) return 100;

  // Starts with
  if (lowerText.startsWith(lowerKeyword)) return 90;

  // Word boundary match
  if (lowerText.includes(` ${lowerKeyword}`)) return 80;

  // Contains
  if (lowerText.includes(lowerKeyword)) return 70;

  return 50;
}

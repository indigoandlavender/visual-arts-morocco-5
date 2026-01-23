// =============================================================================
// Artwork Queries
// Moroccan Art Platform
// =============================================================================

import { db } from '@/lib/db/client';
import { Prisma } from '@prisma/client';
import type {
  ArtworkWithRelations,
  ArtworkBasic,
  PaginatedResult,
  SearchParams,
} from '@/types';

// =============================================================================
// SELECT CONFIGURATIONS
// =============================================================================

const artworkBasicSelect = {
  id: true,
  slug: true,
  title: true,
  year: true,
  medium: true,
  imageUrl: true,
  imageAlt: true,
  isIconic: true,
  artistId: true,
  artist: {
    select: {
      name: true,
      slug: true,
    },
  },
} satisfies Prisma.ArtworkSelect;

const artworkFullInclude = {
  artist: {
    select: {
      id: true,
      slug: true,
      name: true,
      medium: true,
      birthYear: true,
      deathYear: true,
      biographyShort: true,
      activePeriodStart: true,
      activePeriodEnd: true,
    },
  },
  movement: {
    select: {
      id: true,
      slug: true,
      name: true,
      periodStart: true,
      periodEnd: true,
    },
  },
  themes: {
    include: {
      theme: true,
    },
  },
  cities: {
    include: {
      city: true,
    },
  },
  iconicDetails: true,
} satisfies Prisma.ArtworkInclude;

// =============================================================================
// SINGLE ARTWORK QUERIES
// =============================================================================

export async function getArtworkBySlug(
  slug: string
): Promise<ArtworkWithRelations | null> {
  const artwork = await db.artwork.findUnique({
    where: { slug, status: 'PUBLISHED' },
    include: artworkFullInclude,
  });

  if (!artwork) return null;

  return transformArtworkWithRelations(artwork);
}

export async function getArtworkById(
  id: string
): Promise<ArtworkWithRelations | null> {
  const artwork = await db.artwork.findUnique({
    where: { id, status: 'PUBLISHED' },
    include: artworkFullInclude,
  });

  if (!artwork) return null;

  return transformArtworkWithRelations(artwork);
}

// =============================================================================
// LIST QUERIES
// =============================================================================

export async function getArtworks(
  params: SearchParams = {}
): Promise<PaginatedResult<ArtworkBasic>> {
  const {
    q,
    medium,
    periodStart,
    periodEnd,
    city,
    theme,
    movement,
    artist,
    iconic,
    page = 1,
    limit = 24,
    sort = 'year',
    order = 'desc',
  } = params;

  const where = buildArtworkWhereClause({
    q,
    medium,
    periodStart,
    periodEnd,
    city,
    theme,
    movement,
    artist,
    iconic,
  });

  const [artworks, total] = await Promise.all([
    db.artwork.findMany({
      where,
      select: artworkBasicSelect,
      orderBy: buildOrderBy(sort, order),
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.artwork.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: artworks.map((a) => ({
      ...a,
      artistName: a.artist.name,
      artistSlug: a.artist.slug,
    })) as ArtworkBasic[],
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

export async function getArtworksByArtist(
  artistId: string,
  params: Omit<SearchParams, 'artist'> = {}
): Promise<PaginatedResult<ArtworkBasic>> {
  return getArtworks({
    ...params,
    artist: artistId,
  });
}

export async function getArtworksByMedium(
  medium: 'PHOTOGRAPHY' | 'PAINTING',
  params: Omit<SearchParams, 'medium'> = {}
): Promise<PaginatedResult<ArtworkBasic>> {
  return getArtworks({
    ...params,
    medium: medium as any,
  });
}

export async function getIconicWorks(
  params: SearchParams = {}
): Promise<PaginatedResult<ArtworkBasic>> {
  return getArtworks({
    ...params,
    iconic: true,
  });
}

export async function getArtworksByCity(
  citySlug: string,
  params: SearchParams = {}
): Promise<PaginatedResult<ArtworkBasic>> {
  return getArtworks({
    ...params,
    city: citySlug,
  });
}

export async function getArtworksByTheme(
  themeSlug: string,
  params: SearchParams = {}
): Promise<PaginatedResult<ArtworkBasic>> {
  return getArtworks({
    ...params,
    theme: themeSlug,
  });
}

export async function getArtworksByMovement(
  movementSlug: string,
  params: SearchParams = {}
): Promise<PaginatedResult<ArtworkBasic>> {
  return getArtworks({
    ...params,
    movement: movementSlug,
  });
}

export async function getRelatedArtworks(
  artworkId: string,
  limit = 6
): Promise<ArtworkBasic[]> {
  // Get the artwork to find its themes and artist
  const artwork = await db.artwork.findUnique({
    where: { id: artworkId },
    include: {
      themes: true,
      artist: true,
    },
  });

  if (!artwork) return [];

  const themeIds = artwork.themes.map((t) => t.themeId);

  // Find artworks with similar themes or same artist
  const relatedArtworks = await db.artwork.findMany({
    where: {
      status: 'PUBLISHED',
      id: { not: artworkId },
      OR: [
        {
          themes: {
            some: {
              themeId: { in: themeIds },
            },
          },
        },
        {
          artistId: artwork.artistId,
        },
        {
          movementId: artwork.movementId,
        },
      ],
    },
    select: artworkBasicSelect,
    take: limit,
  });

  return relatedArtworks.map((a) => ({
    ...a,
    artistName: a.artist.name,
    artistSlug: a.artist.slug,
  })) as ArtworkBasic[];
}

export async function getFeaturedWorks(limit = 6): Promise<ArtworkBasic[]> {
  const artworks = await db.artwork.findMany({
    where: {
      status: 'PUBLISHED',
      isIconic: true,
    },
    select: artworkBasicSelect,
    orderBy: { updatedAt: 'desc' },
    take: limit,
  });

  return artworks.map((a) => ({
    ...a,
    artistName: a.artist.name,
    artistSlug: a.artist.slug,
  })) as ArtworkBasic[];
}

// =============================================================================
// AGGREGATION QUERIES
// =============================================================================

export async function getArtworkCount(
  filters?: Partial<SearchParams>
): Promise<number> {
  const where = filters
    ? buildArtworkWhereClause(filters)
    : { status: 'PUBLISHED' as const };
  return db.artwork.count({ where });
}

export async function getArtworkFacets(): Promise<{
  mediums: { value: string; count: number }[];
  years: { value: number; count: number }[];
  cities: { value: string; label: string; count: number }[];
  themes: { value: string; label: string; count: number }[];
}> {
  const [mediumCounts, yearCounts, cityCounts, themeCounts] = await Promise.all([
    db.artwork.groupBy({
      by: ['medium'],
      where: { status: 'PUBLISHED' },
      _count: true,
    }),
    db.artwork.groupBy({
      by: ['year'],
      where: { status: 'PUBLISHED', year: { not: null } },
      _count: true,
      orderBy: { year: 'desc' },
    }),
    db.$queryRaw`
      SELECT c.slug as value, c.name as label, COUNT(*)::int as count
      FROM cities c
      JOIN artwork_cities ac ON ac.city_id = c.id
      JOIN artworks a ON a.id = ac.artwork_id
      WHERE a.status = 'PUBLISHED'
      GROUP BY c.id
      ORDER BY count DESC
    ` as Promise<{ value: string; label: string; count: number }[]>,
    db.$queryRaw`
      SELECT t.slug as value, t.name as label, COUNT(*)::int as count
      FROM themes t
      JOIN artwork_themes at ON at.theme_id = t.id
      JOIN artworks a ON a.id = at.artwork_id
      WHERE a.status = 'PUBLISHED'
      GROUP BY t.id
      ORDER BY count DESC
    ` as Promise<{ value: string; label: string; count: number }[]>,
  ]);

  return {
    mediums: mediumCounts.map((m) => ({
      value: m.medium,
      count: m._count,
    })),
    years: yearCounts
      .filter((y) => y.year !== null)
      .map((y) => ({
        value: y.year!,
        count: y._count,
      })),
    cities: cityCounts,
    themes: themeCounts,
  };
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function buildArtworkWhereClause(
  params: Partial<SearchParams>
): Prisma.ArtworkWhereInput {
  const conditions: Prisma.ArtworkWhereInput[] = [{ status: 'PUBLISHED' }];

  // Text search
  if (params.q) {
    conditions.push({
      OR: [
        { title: { contains: params.q, mode: 'insensitive' } },
        { description: { contains: params.q, mode: 'insensitive' } },
        { artist: { name: { contains: params.q, mode: 'insensitive' } } },
      ],
    });
  }

  // Medium filter
  if (params.medium) {
    const mediums = Array.isArray(params.medium) ? params.medium : [params.medium];
    conditions.push({
      medium: { in: mediums as any },
    });
  }

  // Year/period filter
  if (params.periodStart || params.periodEnd) {
    const yearCondition: Prisma.ArtworkWhereInput = {};
    if (params.periodStart) {
      yearCondition.year = { gte: params.periodStart };
    }
    if (params.periodEnd) {
      yearCondition.year = {
        ...(yearCondition.year as object),
        lte: params.periodEnd,
      };
    }
    conditions.push(yearCondition);
  }

  // City filter
  if (params.city) {
    const cities = Array.isArray(params.city) ? params.city : [params.city];
    conditions.push({
      cities: {
        some: {
          city: { slug: { in: cities } },
        },
      },
    });
  }

  // Theme filter
  if (params.theme) {
    const themes = Array.isArray(params.theme) ? params.theme : [params.theme];
    conditions.push({
      themes: {
        some: {
          theme: { slug: { in: themes } },
        },
      },
    });
  }

  // Movement filter
  if (params.movement) {
    const movements = Array.isArray(params.movement)
      ? params.movement
      : [params.movement];
    conditions.push({
      movement: { slug: { in: movements } },
    });
  }

  // Artist filter
  if (params.artist) {
    conditions.push({
      OR: [
        { artistId: params.artist },
        { artist: { slug: params.artist } },
      ],
    });
  }

  // Iconic filter
  if (params.iconic === true) {
    conditions.push({ isIconic: true });
  }

  return { AND: conditions };
}

function buildOrderBy(
  sort: string,
  order: 'asc' | 'desc'
): Prisma.ArtworkOrderByWithRelationInput {
  const orderMap: Record<string, Prisma.ArtworkOrderByWithRelationInput> = {
    title: { title: order },
    year: { year: order },
    createdAt: { createdAt: order },
    name: { artist: { name: order } },
  };

  return orderMap[sort] || { year: 'desc' };
}

function transformArtworkWithRelations(artwork: any): ArtworkWithRelations {
  return {
    ...artwork,
    themes: artwork.themes.map((at: any) => at.theme),
    cities: artwork.cities.map((ac: any) => ac.city),
    iconicDetails: artwork.iconicDetails || null,
  };
}

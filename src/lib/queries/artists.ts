// =============================================================================
// Artist Queries
// Moroccan Art Platform
// =============================================================================

import { db } from '@/lib/db/client';
import { Prisma } from '@prisma/client';
import type {
  ArtistWithRelations,
  ArtistBasic,
  PaginatedResult,
  SearchParams,
} from '@/types';

// =============================================================================
// INCLUDE CONFIGURATIONS
// =============================================================================

const artistBasicSelect = {
  id: true,
  slug: true,
  name: true,
  medium: true,
  birthYear: true,
  deathYear: true,
  biographyShort: true,
  activePeriodStart: true,
  activePeriodEnd: true,
} satisfies Prisma.ArtistSelect;

const artistFullInclude = {
  cities: {
    include: {
      city: true,
    },
  },
  themes: {
    include: {
      theme: true,
    },
  },
  movements: {
    include: {
      movement: true,
    },
  },
  artworks: {
    where: { status: 'PUBLISHED' },
    take: 12,
    orderBy: { year: 'desc' },
    select: {
      id: true,
      slug: true,
      title: true,
      year: true,
      medium: true,
      imageUrl: true,
      imageAlt: true,
      isIconic: true,
      artistId: true,
    },
  },
  relatedTo: {
    include: {
      toArtist: {
        select: artistBasicSelect,
      },
    },
    take: 6,
  },
} satisfies Prisma.ArtistInclude;

// =============================================================================
// SINGLE ARTIST QUERIES
// =============================================================================

export async function getArtistBySlug(
  slug: string
): Promise<ArtistWithRelations | null> {
  const artist = await db.artist.findUnique({
    where: { slug, status: 'PUBLISHED' },
    include: artistFullInclude,
  });

  if (!artist) return null;

  return transformArtistWithRelations(artist);
}

export async function getArtistById(
  id: string
): Promise<ArtistWithRelations | null> {
  const artist = await db.artist.findUnique({
    where: { id, status: 'PUBLISHED' },
    include: artistFullInclude,
  });

  if (!artist) return null;

  return transformArtistWithRelations(artist);
}

// =============================================================================
// LIST QUERIES
// =============================================================================

export async function getArtists(
  params: SearchParams = {}
): Promise<PaginatedResult<ArtistBasic>> {
  const {
    q,
    medium,
    periodStart,
    periodEnd,
    city,
    theme,
    movement,
    moroccanConnection,
    page = 1,
    limit = 24,
    sort = 'name',
    order = 'asc',
  } = params;

  const where = buildArtistWhereClause({
    q,
    medium,
    periodStart,
    periodEnd,
    city,
    theme,
    movement,
    moroccanConnection,
  });

  const [artists, total] = await Promise.all([
    db.artist.findMany({
      where,
      select: artistBasicSelect,
      orderBy: buildOrderBy(sort, order),
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.artist.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: artists as ArtistBasic[],
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

export async function getArtistsByMedium(
  medium: 'PHOTOGRAPHY' | 'PAINTING',
  params: Omit<SearchParams, 'medium'> = {}
): Promise<PaginatedResult<ArtistBasic>> {
  return getArtists({
    ...params,
    medium: medium as any,
  });
}

export async function getArtistsByCity(
  citySlug: string,
  params: SearchParams = {}
): Promise<PaginatedResult<ArtistBasic>> {
  return getArtists({
    ...params,
    city: citySlug,
  });
}

export async function getArtistsByTheme(
  themeSlug: string,
  params: SearchParams = {}
): Promise<PaginatedResult<ArtistBasic>> {
  return getArtists({
    ...params,
    theme: themeSlug,
  });
}

export async function getArtistsByMovement(
  movementSlug: string,
  params: SearchParams = {}
): Promise<PaginatedResult<ArtistBasic>> {
  return getArtists({
    ...params,
    movement: movementSlug,
  });
}

export async function getRelatedArtists(
  artistId: string,
  limit = 6
): Promise<ArtistBasic[]> {
  const relations = await db.artistRelation.findMany({
    where: { fromArtistId: artistId },
    include: {
      toArtist: {
        select: artistBasicSelect,
      },
    },
    take: limit,
  });

  return relations.map((r) => r.toArtist) as ArtistBasic[];
}

export async function getFeaturedArtists(limit = 6): Promise<ArtistBasic[]> {
  // Get a mix of photographers and painters
  const artists = await db.artist.findMany({
    where: { status: 'PUBLISHED' },
    select: artistBasicSelect,
    orderBy: { updatedAt: 'desc' },
    take: limit,
  });

  return artists as ArtistBasic[];
}

// =============================================================================
// AGGREGATION QUERIES
// =============================================================================

export async function getArtistCount(
  filters?: Partial<SearchParams>
): Promise<number> {
  const where = filters ? buildArtistWhereClause(filters) : { status: 'PUBLISHED' as const };
  return db.artist.count({ where });
}

export async function getArtistFacets(): Promise<{
  mediums: { value: string; count: number }[];
  periods: { value: string; count: number }[];
  cities: { value: string; label: string; count: number }[];
  themes: { value: string; label: string; count: number }[];
}> {
  const [mediumCounts, cityCounts, themeCounts] = await Promise.all([
    db.artist.groupBy({
      by: ['medium'],
      where: { status: 'PUBLISHED' },
      _count: true,
    }),
    db.$queryRaw`
      SELECT c.slug as value, c.name as label, COUNT(*)::int as count
      FROM cities c
      JOIN artist_cities ac ON ac.city_id = c.id
      JOIN artists a ON a.id = ac.artist_id
      WHERE a.status = 'PUBLISHED'
      GROUP BY c.id
      ORDER BY count DESC
    ` as Promise<{ value: string; label: string; count: number }[]>,
    db.$queryRaw`
      SELECT t.slug as value, t.name as label, COUNT(*)::int as count
      FROM themes t
      JOIN artist_themes at ON at.theme_id = t.id
      JOIN artists a ON a.id = at.artist_id
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
    periods: [], // Computed on frontend from year data
    cities: cityCounts,
    themes: themeCounts,
  };
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function buildArtistWhereClause(
  params: Partial<SearchParams>
): Prisma.ArtistWhereInput {
  const conditions: Prisma.ArtistWhereInput[] = [{ status: 'PUBLISHED' }];

  // Text search
  if (params.q) {
    conditions.push({
      OR: [
        { name: { contains: params.q, mode: 'insensitive' } },
        { biography: { contains: params.q, mode: 'insensitive' } },
      ],
    });
  }

  // Medium filter
  if (params.medium) {
    const mediums = Array.isArray(params.medium) ? params.medium : [params.medium];
    conditions.push({
      OR: [
        { medium: { in: mediums as any } },
        { medium: 'BOTH' },
      ],
    });
  }

  // Period filter
  if (params.periodStart || params.periodEnd) {
    const periodCondition: Prisma.ArtistWhereInput = {};
    if (params.periodStart) {
      periodCondition.activePeriodEnd = {
        gte: params.periodStart,
      };
    }
    if (params.periodEnd) {
      periodCondition.activePeriodStart = {
        lte: params.periodEnd,
      };
    }
    conditions.push(periodCondition);
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
    const movements = Array.isArray(params.movement) ? params.movement : [params.movement];
    conditions.push({
      movements: {
        some: {
          movement: { slug: { in: movements } },
        },
      },
    });
  }

  // Moroccan connection filter
  if (params.moroccanConnection) {
    const connections = Array.isArray(params.moroccanConnection)
      ? params.moroccanConnection
      : [params.moroccanConnection];
    conditions.push({
      moroccanConnection: { in: connections as any },
    });
  }

  return { AND: conditions };
}

function buildOrderBy(
  sort: string,
  order: 'asc' | 'desc'
): Prisma.ArtistOrderByWithRelationInput {
  const orderMap: Record<string, Prisma.ArtistOrderByWithRelationInput> = {
    name: { name: order },
    birthYear: { birthYear: order },
    activePeriodStart: { activePeriodStart: order },
    createdAt: { createdAt: order },
  };

  return orderMap[sort] || { name: 'asc' };
}

function transformArtistWithRelations(artist: any): ArtistWithRelations {
  return {
    ...artist,
    externalReferences: artist.externalReferences || [],
    cities: artist.cities.map((ac: any) => ({
      ...ac.city,
      relationType: ac.relationType,
    })),
    themes: artist.themes.map((at: any) => at.theme),
    movements: artist.movements.map((am: any) => am.movement),
    artworks: artist.artworks,
    relatedArtists: artist.relatedTo.map((r: any) => r.toArtist),
  };
}

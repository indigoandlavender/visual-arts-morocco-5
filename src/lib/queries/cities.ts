// =============================================================================
// City Queries
// Moroccan Art Platform
// =============================================================================

import { db } from '@/lib/db/client';
import type { CityWithRelations, CityBasic, PaginatedResult } from '@/types';

// =============================================================================
// SINGLE CITY QUERIES
// =============================================================================

export async function getCityBySlug(
  slug: string
): Promise<CityWithRelations | null> {
  const city = await db.city.findUnique({
    where: { slug },
    include: {
      artists: {
        include: {
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
              status: true,
            },
          },
        },
      },
      artworks: {
        include: {
          artwork: {
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
              status: true,
              artist: {
                select: {
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!city) return null;

  return {
    ...city,
    artists: city.artists
      .filter((ac) => ac.artist.status === 'PUBLISHED')
      .map((ac) => ac.artist),
    artworks: city.artworks
      .filter((ac) => ac.artwork.status === 'PUBLISHED')
      .map((ac) => ({
        ...ac.artwork,
        artistName: ac.artwork.artist.name,
        artistSlug: ac.artwork.artist.slug,
      })),
  } as CityWithRelations;
}

// =============================================================================
// LIST QUERIES
// =============================================================================

export async function getCities(params: {
  region?: string;
  page?: number;
  limit?: number;
  sort?: 'name';
  order?: 'asc' | 'desc';
} = {}): Promise<PaginatedResult<CityBasic>> {
  const { region, page = 1, limit = 50, sort = 'name', order = 'asc' } = params;

  const where = region ? { region } : {};

  const [cities, total] = await Promise.all([
    db.city.findMany({
      where,
      select: {
        id: true,
        slug: true,
        name: true,
        region: true,
      },
      orderBy: { [sort]: order },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.city.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: cities as CityBasic[],
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

export async function getCitiesByRegion(region: string): Promise<CityBasic[]> {
  const cities = await db.city.findMany({
    where: { region },
    select: {
      id: true,
      slug: true,
      name: true,
      region: true,
    },
    orderBy: { name: 'asc' },
  });

  return cities as CityBasic[];
}

export async function getRegions(): Promise<string[]> {
  const regions = await db.city.findMany({
    where: { region: { not: null } },
    select: { region: true },
    distinct: ['region'],
    orderBy: { region: 'asc' },
  });

  return regions
    .map((r) => r.region)
    .filter((r): r is string => r !== null);
}

export async function getCityFacets(): Promise<{
  value: string;
  label: string;
  region: string | null;
  count: number;
}[]> {
  const cities = await db.$queryRaw`
    SELECT c.slug as value, c.name as label, c.region,
      (
        (SELECT COUNT(*)::int FROM artist_cities ac
         JOIN artists a ON a.id = ac.artist_id
         WHERE ac.city_id = c.id AND a.status = 'PUBLISHED') +
        (SELECT COUNT(*)::int FROM artwork_cities awc
         JOIN artworks aw ON aw.id = awc.artwork_id
         WHERE awc.city_id = c.id AND aw.status = 'PUBLISHED')
      ) as count
    FROM cities c
    ORDER BY count DESC
  ` as { value: string; label: string; region: string | null; count: number }[];

  return cities;
}

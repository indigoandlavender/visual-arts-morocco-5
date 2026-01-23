// =============================================================================
// Movement Queries
// Moroccan Art Platform
// =============================================================================

import { db } from '@/lib/db/client';
import type { MovementWithRelations, MovementBasic, PaginatedResult } from '@/types';

// =============================================================================
// SINGLE MOVEMENT QUERIES
// =============================================================================

export async function getMovementBySlug(
  slug: string
): Promise<MovementWithRelations | null> {
  const movement = await db.movement.findUnique({
    where: { slug, status: 'PUBLISHED' },
    include: {
      parentMovement: {
        select: {
          id: true,
          slug: true,
          name: true,
          periodStart: true,
          periodEnd: true,
        },
      },
      childMovements: {
        where: { status: 'PUBLISHED' },
        select: {
          id: true,
          slug: true,
          name: true,
          periodStart: true,
          periodEnd: true,
        },
      },
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
            },
          },
        },
      },
      artworks: {
        where: { status: 'PUBLISHED' },
        take: 12,
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
          artist: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      },
    },
  });

  if (!movement) return null;

  return {
    ...movement,
    artists: movement.artists.map((am) => am.artist),
    artworks: movement.artworks.map((a) => ({
      ...a,
      artistName: a.artist.name,
      artistSlug: a.artist.slug,
    })),
  } as MovementWithRelations;
}

// =============================================================================
// LIST QUERIES
// =============================================================================

export async function getMovements(params: {
  page?: number;
  limit?: number;
  sort?: 'name' | 'periodStart';
  order?: 'asc' | 'desc';
} = {}): Promise<PaginatedResult<MovementBasic>> {
  const { page = 1, limit = 24, sort = 'periodStart', order = 'asc' } = params;

  const [movements, total] = await Promise.all([
    db.movement.findMany({
      where: { status: 'PUBLISHED' },
      select: {
        id: true,
        slug: true,
        name: true,
        periodStart: true,
        periodEnd: true,
      },
      orderBy: { [sort]: order },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.movement.count({ where: { status: 'PUBLISHED' } }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: movements as MovementBasic[],
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

export async function getMovementFacets(): Promise<{
  value: string;
  label: string;
  count: number;
}[]> {
  const movements = await db.$queryRaw`
    SELECT m.slug as value, m.name as label,
      (SELECT COUNT(*)::int FROM artist_movements am WHERE am.movement_id = m.id) as count
    FROM movements m
    WHERE m.status = 'PUBLISHED'
    ORDER BY count DESC
  ` as { value: string; label: string; count: number }[];

  return movements;
}

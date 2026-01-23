// =============================================================================
// Theme Queries
// Moroccan Art Platform
// =============================================================================

import { db } from '@/lib/db/client';
import type { ThemeWithRelations, ThemeBasic, PaginatedResult, ThemeCategory } from '@/types';

// =============================================================================
// SINGLE THEME QUERIES
// =============================================================================

export async function getThemeBySlug(
  slug: string
): Promise<ThemeWithRelations | null> {
  const theme = await db.theme.findUnique({
    where: { slug },
    include: {
      parentTheme: {
        select: {
          id: true,
          slug: true,
          name: true,
          category: true,
        },
      },
      childThemes: {
        select: {
          id: true,
          slug: true,
          name: true,
          category: true,
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
        take: 24,
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
              artist: {
                select: {
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
        take: 24,
      },
    },
  });

  if (!theme) return null;

  return {
    ...theme,
    artists: theme.artists.map((at) => at.artist),
    artworks: theme.artworks.map((at) => ({
      ...at.artwork,
      artistName: at.artwork.artist.name,
      artistSlug: at.artwork.artist.slug,
    })),
  } as ThemeWithRelations;
}

// =============================================================================
// LIST QUERIES
// =============================================================================

export async function getThemes(params: {
  category?: ThemeCategory;
  page?: number;
  limit?: number;
  sort?: 'name';
  order?: 'asc' | 'desc';
} = {}): Promise<PaginatedResult<ThemeBasic>> {
  const { category, page = 1, limit = 50, sort = 'name', order = 'asc' } = params;

  const where = category ? { category } : {};

  const [themes, total] = await Promise.all([
    db.theme.findMany({
      where,
      select: {
        id: true,
        slug: true,
        name: true,
        category: true,
      },
      orderBy: { [sort]: order },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.theme.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: themes as ThemeBasic[],
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

export async function getThemesByCategory(
  category: ThemeCategory
): Promise<ThemeBasic[]> {
  const themes = await db.theme.findMany({
    where: { category },
    select: {
      id: true,
      slug: true,
      name: true,
      category: true,
    },
    orderBy: { name: 'asc' },
  });

  return themes as ThemeBasic[];
}

export async function getThemeFacets(): Promise<{
  value: string;
  label: string;
  category: string;
  count: number;
}[]> {
  const themes = await db.$queryRaw`
    SELECT t.slug as value, t.name as label, t.category,
      (
        (SELECT COUNT(*)::int FROM artist_themes at WHERE at.theme_id = t.id) +
        (SELECT COUNT(*)::int FROM artwork_themes awt WHERE awt.theme_id = t.id)
      ) as count
    FROM themes t
    ORDER BY count DESC
  ` as { value: string; label: string; category: string; count: number }[];

  return themes;
}

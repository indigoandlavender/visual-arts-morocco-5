// =============================================================================
// SEO Metadata Generators
// Moroccan Art Platform
// =============================================================================

import type { Metadata } from 'next';

// Simple types for metadata generation (don't require full relations)
interface ArtistForMetadata {
  name: string;
  slug: string;
  biographyShort?: string | null;
}

interface ArtworkForMetadata {
  title: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  artist?: { name: string };
}

interface MovementForMetadata {
  name: string;
  slug: string;
  description?: string | null;
}

interface ThemeForMetadata {
  name: string;
  slug: string;
  description?: string | null;
}

interface CityForMetadata {
  name: string;
  slug: string;
  description?: string | null;
}

const SITE_NAME = 'Morocco Art Archive';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://moroccoartarchive.com';

// =============================================================================
// PAGE METADATA GENERATORS
// =============================================================================

export function generateHomeMetadata(): Metadata {
  return {
    title: 'Morocco Art Archive | Moroccan Visual Art Database',
    description:
      'Comprehensive database of Moroccan visual artists, photographers, and painters. Search, explore, and discover Moroccan art history.',
    openGraph: {
      title: 'Morocco Art Archive',
      description: 'The definitive database for Moroccan visual art',
      url: SITE_URL,
      siteName: SITE_NAME,
      type: 'website',
    },
    alternates: {
      canonical: SITE_URL,
    },
  };
}

export function generateArtistMetadata(artist: ArtistForMetadata): Metadata {
  const title = `${artist.name} | Morocco Art Archive`;
  const description = artist.biographyShort;
  const url = `${SITE_URL}/artists/${artist.slug}`;

  return {
    title,
    description,
    openGraph: {
      title: artist.name,
      description,
      url,
      siteName: SITE_NAME,
      type: 'profile',
    },
    alternates: {
      canonical: url,
    },
  };
}

export function generateArtworkMetadata(artwork: ArtworkForMetadata): Metadata {
  const artistName = artwork.artist?.name || 'Unknown Artist';
  const title = `${artwork.title} by ${artistName} | Morocco Art Archive`;
  const description = artwork.description?.slice(0, 160) || '';
  const url = `${SITE_URL}/works/${artwork.slug}`;

  return {
    title,
    description,
    openGraph: {
      title: artwork.title,
      description,
      url,
      siteName: SITE_NAME,
      type: 'article',
      images: artwork.imageUrl
        ? [{ url: artwork.imageUrl, alt: artwork.title }]
        : undefined,
    },
    alternates: {
      canonical: url,
    },
  };
}

export function generateMovementMetadata(movement: MovementForMetadata): Metadata {
  const title = `${movement.name} | Moroccan Art Movements | Morocco Art Archive`;
  const description = movement.description?.slice(0, 160) || '';
  const url = `${SITE_URL}/movements/${movement.slug}`;

  return {
    title,
    description,
    openGraph: {
      title: movement.name,
      description,
      url,
      siteName: SITE_NAME,
      type: 'article',
    },
    alternates: {
      canonical: url,
    },
  };
}

export function generateThemeMetadata(theme: ThemeForMetadata): Metadata {
  const title = `${theme.name} | Themes in Moroccan Art | Morocco Art Archive`;
  const description =
    theme.description?.slice(0, 160) ||
    `Explore Moroccan artworks and artists associated with the theme: ${theme.name}`;
  const url = `${SITE_URL}/themes/${theme.slug}`;

  return {
    title,
    description,
    openGraph: {
      title: theme.name,
      description,
      url,
      siteName: SITE_NAME,
      type: 'article',
    },
    alternates: {
      canonical: url,
    },
  };
}

export function generateCityMetadata(city: CityForMetadata): Metadata {
  const title = `${city.name} | Moroccan Art by Location | Morocco Art Archive`;
  const description =
    city.description?.slice(0, 160) ||
    `Discover artists and artworks associated with ${city.name}, Morocco`;
  const url = `${SITE_URL}/cities/${city.slug}`;

  return {
    title,
    description,
    openGraph: {
      title: city.name,
      description,
      url,
      siteName: SITE_NAME,
      type: 'article',
    },
    alternates: {
      canonical: url,
    },
  };
}

export function generateSearchMetadata(query: string): Metadata {
  const title = query
    ? `Search: ${query} | Morocco Art Archive`
    : 'Search | Morocco Art Archive';
  const description = query
    ? `Search results for "${query}" in Moroccan visual art`
    : 'Search the Morocco Art Archive database';

  return {
    title,
    description,
    robots: {
      index: false, // Don't index search results pages
      follow: true,
    },
  };
}

export function generateListMetadata(
  entityType: 'artists' | 'works' | 'movements' | 'themes' | 'cities',
  filters?: Record<string, string>
): Metadata {
  const titles: Record<string, string> = {
    artists: 'Artists | Morocco Art Archive',
    works: 'Artworks | Morocco Art Archive',
    movements: 'Art Movements | Morocco Art Archive',
    themes: 'Themes | Morocco Art Archive',
    cities: 'Cities | Morocco Art Archive',
  };

  const descriptions: Record<string, string> = {
    artists: 'Browse all Moroccan visual artists, photographers, and painters',
    works: 'Explore canonical artworks and iconic images from Moroccan art history',
    movements: 'Discover artistic movements and periods in Moroccan art',
    themes: 'Explore themes and subjects in Moroccan visual art',
    cities: 'Explore Moroccan art by city and region',
  };

  return {
    title: titles[entityType],
    description: descriptions[entityType],
    alternates: {
      canonical: `${SITE_URL}/${entityType}`,
    },
  };
}

// =============================================================================
// BREADCRUMB GENERATOR
// =============================================================================

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbs(
  path: string,
  currentTitle?: string
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [{ name: 'Home', url: SITE_URL }];

  const segments = path.split('/').filter(Boolean);

  const pathLabels: Record<string, string> = {
    artists: 'Artists',
    works: 'Artworks',
    photography: 'Photography',
    painting: 'Painting',
    movements: 'Movements',
    themes: 'Themes',
    cities: 'Cities',
    search: 'Search',
  };

  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;

    // Skip slug segments (last segment on detail pages)
    if (index === segments.length - 1 && currentTitle) {
      items.push({ name: currentTitle, url: `${SITE_URL}${currentPath}` });
    } else if (pathLabels[segment]) {
      items.push({ name: pathLabels[segment], url: `${SITE_URL}${currentPath}` });
    }
  });

  return items;
}

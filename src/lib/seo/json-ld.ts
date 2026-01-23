// =============================================================================
// JSON-LD Structured Data Generators
// Moroccan Art Platform
// =============================================================================

import type {
  ArtistWithRelations,
  ArtworkWithRelations,
  MovementWithRelations,
  CityWithRelations,
} from '@/types';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://moroccoartarchive.com';

// =============================================================================
// ARTIST JSON-LD (Person Schema)
// =============================================================================

export function generateArtistJsonLd(artist: ArtistWithRelations): object {
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/artists/${artist.slug}`,
    name: artist.name,
    url: `${SITE_URL}/artists/${artist.slug}`,
    description: artist.biographyShort,
    nationality: {
      '@type': 'Country',
      name: artist.nationality,
    },
  };

  // Birth/death dates
  if (artist.birthYear) {
    jsonLd.birthDate = String(artist.birthYear);
  }
  if (artist.deathYear) {
    jsonLd.deathDate = String(artist.deathYear);
  }

  // Job title based on medium
  const jobTitles: Record<string, string[]> = {
    PHOTOGRAPHY: ['Photographer'],
    PAINTING: ['Painter', 'Visual Artist'],
    BOTH: ['Photographer', 'Painter', 'Visual Artist'],
  };
  jsonLd.jobTitle = jobTitles[artist.medium] || ['Visual Artist'];

  // Known for (themes)
  if (artist.themes.length > 0) {
    jsonLd.knowsAbout = artist.themes.map((theme) => theme.name);
  }

  // Artworks
  if (artist.artworks.length > 0) {
    jsonLd.workExample = artist.artworks.slice(0, 5).map((work) => ({
      '@type': 'VisualArtwork',
      name: work.title,
      url: `${SITE_URL}/works/${work.slug}`,
    }));
  }

  // Same as (external references)
  const sameAs = artist.externalReferences
    .filter((ref) => ref.url)
    .map((ref) => ref.url);
  if (sameAs.length > 0) {
    jsonLd.sameAs = sameAs;
  }

  return jsonLd;
}

// =============================================================================
// ARTWORK JSON-LD (VisualArtwork Schema)
// =============================================================================

export function generateArtworkJsonLd(artwork: ArtworkWithRelations): object {
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'VisualArtwork',
    '@id': `${SITE_URL}/works/${artwork.slug}`,
    name: artwork.title,
    url: `${SITE_URL}/works/${artwork.slug}`,
    description: artwork.description,
    creator: {
      '@type': 'Person',
      name: artwork.artist.name,
      url: `${SITE_URL}/artists/${artwork.artist.slug}`,
    },
  };

  // Date
  if (artwork.year) {
    jsonLd.dateCreated = String(artwork.year);
  }

  // Art form / medium
  const artForms: Record<string, string> = {
    PHOTOGRAPHY: 'photograph',
    PAINTING: 'painting',
  };
  jsonLd.artform = artForms[artwork.medium] || artwork.medium.toLowerCase();

  // Technique
  if (artwork.technique) {
    jsonLd.artMedium = artwork.technique;
  }

  // Dimensions
  if (artwork.dimensions) {
    jsonLd.size = artwork.dimensions;
  }

  // Location
  if (artwork.locationCurrent) {
    jsonLd.locationCreated = {
      '@type': 'Place',
      name: artwork.locationCurrent,
    };
  }

  // Image
  if (artwork.imageUrl) {
    jsonLd.image = {
      '@type': 'ImageObject',
      url: artwork.imageUrl,
      caption: artwork.imageAlt || artwork.title,
    };
  }

  // Movement
  if (artwork.movement) {
    jsonLd.isPartOf = {
      '@type': 'VisualArtsEvent',
      name: artwork.movement.name,
      url: `${SITE_URL}/movements/${artwork.movement.slug}`,
    };
  }

  // Keywords (themes)
  if (artwork.themes.length > 0) {
    jsonLd.keywords = artwork.themes.map((t) => t.name).join(', ');
  }

  return jsonLd;
}

// =============================================================================
// MOVEMENT JSON-LD (Event/MovementOrPeriod)
// =============================================================================

export function generateMovementJsonLd(movement: MovementWithRelations): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'VisualArtsEvent',
    '@id': `${SITE_URL}/movements/${movement.slug}`,
    name: movement.name,
    url: `${SITE_URL}/movements/${movement.slug}`,
    description: movement.description,
    startDate: String(movement.periodStart),
    endDate: movement.periodEnd ? String(movement.periodEnd) : undefined,
    location: {
      '@type': 'Country',
      name: 'Morocco',
    },
    performer: movement.artists.slice(0, 10).map((artist) => ({
      '@type': 'Person',
      name: artist.name,
      url: `${SITE_URL}/artists/${artist.slug}`,
    })),
  };
}

// =============================================================================
// CITY JSON-LD (Place Schema)
// =============================================================================

export function generateCityJsonLd(city: CityWithRelations): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'City',
    '@id': `${SITE_URL}/cities/${city.slug}`,
    name: city.name,
    url: `${SITE_URL}/cities/${city.slug}`,
    description: city.description,
    containedInPlace: {
      '@type': 'Country',
      name: city.country,
    },
  };
}

// =============================================================================
// BREADCRUMB JSON-LD
// =============================================================================

export function generateBreadcrumbJsonLd(
  items: { name: string; url: string }[]
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// =============================================================================
// SEARCH ACTION JSON-LD (For homepage)
// =============================================================================

export function generateSearchActionJsonLd(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: SITE_URL,
    name: 'Morocco Art Archive',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

// =============================================================================
// ORGANIZATION JSON-LD
// =============================================================================

export function generateOrganizationJsonLd(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Morocco Art Archive',
    url: SITE_URL,
    description:
      'Comprehensive database of Moroccan visual artists, photographers, and painters',
    sameAs: [],
  };
}

// =============================================================================
// JSON-LD Structured Data Generators
// Moroccan Art Platform
// =============================================================================

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://moroccoartarchive.com';

// Simple types for JSON-LD generation
interface ArtistForJsonLd {
  slug: string;
  name: string;
  biographyShort?: string | null;
  birthYear?: number | null;
  deathYear?: number | null;
  medium: string;
  themes?: { name: string }[];
}

interface ArtworkForJsonLd {
  slug: string;
  title: string;
  description?: string | null;
  year?: number | null;
  medium: string;
  dimensions?: string | null;
  imageUrl?: string | null;
  artist?: { name: string; slug: string };
  movement?: { name: string; slug: string } | null;
  themes?: { name: string }[];
}

interface MovementForJsonLd {
  slug: string;
  name: string;
  description?: string | null;
  periodStart?: number | null;
  periodEnd?: number | null;
}

interface CityForJsonLd {
  slug: string;
  name: string;
  description?: string | null;
  country: string;
}

// =============================================================================
// ARTIST JSON-LD (Person Schema)
// =============================================================================

export function generateArtistJsonLd(artist: ArtistForJsonLd): object {
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/artists/${artist.slug}`,
    name: artist.name,
    url: `${SITE_URL}/artists/${artist.slug}`,
    description: artist.biographyShort || undefined,
    nationality: {
      '@type': 'Country',
      name: 'Morocco',
    },
  };

  if (artist.birthYear) {
    jsonLd.birthDate = String(artist.birthYear);
  }
  if (artist.deathYear) {
    jsonLd.deathDate = String(artist.deathYear);
  }

  const jobTitles: Record<string, string[]> = {
    PHOTOGRAPHY: ['Photographer'],
    PAINTING: ['Painter', 'Visual Artist'],
    BOTH: ['Photographer', 'Painter', 'Visual Artist'],
  };
  jsonLd.jobTitle = jobTitles[artist.medium] || ['Visual Artist'];

  if (artist.themes && artist.themes.length > 0) {
    jsonLd.knowsAbout = artist.themes.map((theme) => theme.name);
  }

  return jsonLd;
}

// =============================================================================
// ARTWORK JSON-LD (VisualArtwork Schema)
// =============================================================================

export function generateArtworkJsonLd(artwork: ArtworkForJsonLd): object {
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'VisualArtwork',
    '@id': `${SITE_URL}/works/${artwork.slug}`,
    name: artwork.title,
    url: `${SITE_URL}/works/${artwork.slug}`,
    description: artwork.description || undefined,
  };

  if (artwork.artist) {
    jsonLd.creator = {
      '@type': 'Person',
      name: artwork.artist.name,
      url: `${SITE_URL}/artists/${artwork.artist.slug}`,
    };
  }

  if (artwork.year) {
    jsonLd.dateCreated = String(artwork.year);
  }

  const artForms: Record<string, string> = {
    PHOTOGRAPHY: 'photograph',
    PAINTING: 'painting',
  };
  jsonLd.artform = artForms[artwork.medium] || artwork.medium.toLowerCase();

  if (artwork.dimensions) {
    jsonLd.size = artwork.dimensions;
  }

  if (artwork.imageUrl) {
    jsonLd.image = {
      '@type': 'ImageObject',
      url: artwork.imageUrl,
      caption: artwork.title,
    };
  }

  if (artwork.movement) {
    jsonLd.isPartOf = {
      '@type': 'VisualArtsEvent',
      name: artwork.movement.name,
      url: `${SITE_URL}/movements/${artwork.movement.slug}`,
    };
  }

  if (artwork.themes && artwork.themes.length > 0) {
    jsonLd.keywords = artwork.themes.map((t) => t.name).join(', ');
  }

  return jsonLd;
}

// =============================================================================
// MOVEMENT JSON-LD
// =============================================================================

export function generateMovementJsonLd(movement: MovementForJsonLd): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'VisualArtsEvent',
    '@id': `${SITE_URL}/movements/${movement.slug}`,
    name: movement.name,
    url: `${SITE_URL}/movements/${movement.slug}`,
    description: movement.description || undefined,
    startDate: movement.periodStart ? String(movement.periodStart) : undefined,
    endDate: movement.periodEnd ? String(movement.periodEnd) : undefined,
    location: {
      '@type': 'Country',
      name: 'Morocco',
    },
  };
}

// =============================================================================
// CITY JSON-LD (Place Schema)
// =============================================================================

export function generateCityJsonLd(city: CityForJsonLd): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'City',
    '@id': `${SITE_URL}/cities/${city.slug}`,
    name: city.name,
    url: `${SITE_URL}/cities/${city.slug}`,
    description: city.description || undefined,
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
  };
}

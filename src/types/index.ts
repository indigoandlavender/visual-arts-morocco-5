// =============================================================================
// Core Type Definitions
// Moroccan Art Platform - Google Sheets Backend
// =============================================================================

// =============================================================================
// ENUMS
// =============================================================================

export type Medium = 'PHOTOGRAPHY' | 'PAINTING' | 'BOTH';
export type ContentStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type AccessTier = 'FREE' | 'PREMIUM';
export type UserTier = 'FREE' | 'PREMIUM' | 'INSTITUTIONAL';
export type ThemeCategory = 'SUBJECT' | 'STYLE' | 'TECHNIQUE' | 'CONCEPT' | 'CONCEPTUAL';
export type CityRelationType = 'BORN' | 'BASED' | 'WORKED' | 'DEPICTED' | 'CREATED';
export type ArtistRelationType = 'CONTEMPORARY' | 'INFLUENCED_BY' | 'TEACHER_STUDENT' | 'COLLABORATED';

// =============================================================================
// CORE ENTITY TYPES
// =============================================================================

export interface Artist {
  id: string;
  slug: string;
  name: string;
  nameArabic?: string | null;
  medium: Medium;
  birthYear?: number | null;
  deathYear?: number | null;
  biographyShort?: string | null;
  biography?: string | null;
  activePeriodStart?: number | null;
  activePeriodEnd?: number | null;
  photoUrl?: string | null;
  websiteUrl?: string | null;
  status: ContentStatus;
  // Relations
  cities?: { city: City; relationType: CityRelationType }[];
  themes?: Theme[];
  movements?: Movement[];
}

export interface Artwork {
  id: string;
  slug: string;
  title: string;
  titleArabic?: string | null;
  artistId: string;
  artist?: { id: string; slug: string; name: string; medium: Medium };
  medium: Medium;
  year?: number | null;
  yearEnd?: number | null;
  description?: string | null;
  dimensions?: string | null;
  materialsAndTechniques?: string | null;
  currentLocation?: string | null;
  imageUrl?: string | null;
  isIconic: boolean;
  movementId?: string | null;
  movement?: Movement;
  status: ContentStatus;
  // Relations
  themes?: Theme[];
  cities?: { city: City; relationType: CityRelationType }[];
  iconicImage?: IconicImage;
}

export interface Movement {
  id: string;
  slug: string;
  name: string;
  nameArabic?: string | null;
  description?: string | null;
  periodStart?: number | null;
  periodEnd?: number | null;
}

export interface Theme {
  id: string;
  slug: string;
  name: string;
  nameArabic?: string | null;
  description?: string | null;
  category: ThemeCategory;
}

export interface City {
  id: string;
  slug: string;
  name: string;
  nameArabic?: string | null;
  region?: string | null;
  country: string;
  description?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface IconicImage {
  subject?: string | null;
  composition?: string | null;
  colorPalette?: string | null;
  technique?: string | null;
  historicalContext?: string | null;
  significance?: string | null;
  interpretation?: string | null;
}

export interface User {
  id: string;
  email: string;
  name?: string | null;
  tier: UserTier;
}

// =============================================================================
// SEARCH & FILTER TYPES
// =============================================================================

export interface SearchParams {
  q?: string;
  medium?: Medium | Medium[];
  periodStart?: number;
  periodEnd?: number;
  city?: string | string[];
  theme?: string | string[];
  movement?: string | string[];
  artist?: string;
  iconic?: boolean;
  page?: number;
  limit?: number;
  sort?: SortOption;
  order?: 'asc' | 'desc';
}

export type SortOption =
  | 'name'
  | 'year'
  | 'birthYear'
  | 'activePeriodStart'
  | 'createdAt'
  | 'relevance';

export interface FilterFacet {
  value: string;
  label: string;
  count: number;
}

export interface FilterFacets {
  mediums: FilterFacet[];
  periods: FilterFacet[];
  cities: FilterFacet[];
  themes: FilterFacet[];
  movements: FilterFacet[];
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  facets?: FilterFacets;
}

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: {
    timestamp: string;
    version: string;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// =============================================================================
// SEO TYPES
// =============================================================================

export interface PageMetadata {
  title: string;
  description: string;
  canonical: string;
  openGraph?: {
    title: string;
    description: string;
    type: 'website' | 'article' | 'profile';
    images?: { url: string; alt: string }[];
  };
  jsonLd?: Record<string, unknown>;
}

export interface BreadcrumbItem {
  label: string;
  href: string;
}

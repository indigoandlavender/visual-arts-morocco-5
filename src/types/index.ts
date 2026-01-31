// =============================================================================
// Core Type Definitions
// Moroccan Art Platform - Museum/Curatorial Standards
// =============================================================================

// =============================================================================
// ENUMS
// =============================================================================

export type ContentStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type AccessTier = 'FREE' | 'PREMIUM';
export type UserTier = 'FREE' | 'PREMIUM' | 'INSTITUTIONAL';
export type CityRelationType = 'BORN' | 'BASED' | 'WORKED' | 'DEPICTED' | 'CREATED';
export type ArtistRelationType = 'CONTEMPORARY' | 'INFLUENCED_BY' | 'TEACHER_STUDENT' | 'COLLABORATED';
export type InstitutionType = 'MUSEUM' | 'GALLERY' | 'CULTURAL_CENTER' | 'ART_SCHOOL' | 'FOUNDATION' | 'RESIDENCY';
export type SubjectCategory = 'PLACE' | 'PEOPLE' | 'MOTIF' | 'OBJECT' | 'ACTIVITY';

// =============================================================================
// LOOKUP/TAXONOMY TYPES
// =============================================================================

// Physical form of artwork (Painting, Photograph, Sculpture, etc.)
export interface ObjectType {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
}

// Traditional subject classification (Portrait, Landscape, Abstract, etc.)
export interface Genre {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
}

// Art historical periods and schools
export interface Movement {
  id: string;
  slug: string;
  name: string;
  nameArabic?: string | null;
  description?: string | null;
  periodStart?: number | null;
  periodEnd?: number | null;
}

// Curatorial/interpretive concepts (Identity, Postcolonialism, etc.)
export interface Theme {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
}

// Controlled vocabulary for depicted content (Medina, Women, Calligraphy, etc.)
export interface SubjectTerm {
  id: string;
  slug: string;
  name: string;
  category: SubjectCategory;
}

// =============================================================================
// CORE ENTITY TYPES
// =============================================================================

export interface Artist {
  id: string;
  slug: string;
  name: string;
  nameArabic?: string | null;
  primaryObjectTypeId?: string | null;
  primaryObjectType?: ObjectType;
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
  artist?: { id: string; slug: string; name: string; primaryObjectTypeId?: string };
  objectTypeId?: string | null;
  objectType?: ObjectType;
  genreId?: string | null;
  genre?: Genre;
  materials?: string | null;
  dimensions?: string | null;
  year?: number | null;
  yearEnd?: number | null;
  description?: string | null;
  currentLocation?: string | null;
  imageUrl?: string | null;
  isIconic: boolean;
  movementId?: string | null;
  movement?: Movement;
  status: ContentStatus;
  // Relations
  themes?: Theme[];
  subjects?: SubjectTerm[];
  cities?: { city: City; relationType: CityRelationType }[];
  iconicImage?: IconicImage;
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

export interface Institution {
  id: string;
  slug: string;
  name: string;
  nameArabic?: string | null;
  type: InstitutionType;
  cityId: string;
  city?: City;
  address?: string | null;
  description?: string | null;
  descriptionLong?: string | null;
  website?: string | null;
  phone?: string | null;
  email?: string | null;
  hours?: string | null;
  admission?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  yearEstablished?: number | null;
  highlights?: string | null;
  status: ContentStatus;
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
  objectType?: string | string[];
  genre?: string | string[];
  periodStart?: number;
  periodEnd?: number;
  city?: string | string[];
  theme?: string | string[];
  subject?: string | string[];
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
  objectTypes: FilterFacet[];
  genres: FilterFacet[];
  periods: FilterFacet[];
  cities: FilterFacet[];
  themes: FilterFacet[];
  subjects: FilterFacet[];
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

// =============================================================================
// LEGACY COMPATIBILITY
// =============================================================================

/** @deprecated Use ObjectType instead */
export type Medium = 'PHOTOGRAPHY' | 'PAINTING' | 'BOTH';

/** @deprecated Use Theme instead */
export type ThemeCategory = 'SUBJECT' | 'STYLE' | 'TECHNIQUE' | 'CONCEPT' | 'CONCEPTUAL';

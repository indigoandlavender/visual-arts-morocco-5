// =============================================================================
// Core Type Definitions
// Moroccan Art Platform
// =============================================================================

// Re-export Prisma types
export type {
  Artist,
  Artwork,
  IconicImage,
  Movement,
  Theme,
  City,
  User,
} from '@prisma/client';

// =============================================================================
// ENUMS (Mirror Prisma enums for client-side use)
// =============================================================================

export enum Medium {
  PHOTOGRAPHY = 'PHOTOGRAPHY',
  PAINTING = 'PAINTING',
  BOTH = 'BOTH',
}

export enum MoroccanConnection {
  BORN = 'BORN',
  BASED = 'BASED',
  DIASPORA = 'DIASPORA',
  SIGNIFICANT_WORK = 'SIGNIFICANT_WORK',
}

export enum ContentStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export enum AccessTier {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM',
}

export enum UserTier {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM',
  INSTITUTIONAL = 'INSTITUTIONAL',
}

export enum ThemeCategory {
  SUBJECT = 'SUBJECT',
  STYLE = 'STYLE',
  TECHNIQUE = 'TECHNIQUE',
  CONCEPT = 'CONCEPT',
}

// =============================================================================
// QUERY & FILTER TYPES
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
  moroccanConnection?: MoroccanConnection | MoroccanConnection[];
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
// COMPOSITE TYPES (Joined Data)
// =============================================================================

export interface ArtistWithRelations {
  id: string;
  slug: string;
  name: string;
  nameArabic?: string | null;
  medium: Medium;
  birthYear?: number | null;
  deathYear?: number | null;
  nationality: string;
  moroccanConnection: MoroccanConnection;
  biography: string;
  biographyShort: string;
  activePeriodStart: number;
  activePeriodEnd?: number | null;
  externalReferences: ExternalReference[];
  status: ContentStatus;
  accessTier: AccessTier;
  cities: CityWithRelation[];
  themes: ThemeBasic[];
  movements: MovementBasic[];
  artworks: ArtworkBasic[];
  relatedArtists: ArtistBasic[];
}

export interface ArtworkWithRelations {
  id: string;
  slug: string;
  title: string;
  titleArabic?: string | null;
  year?: number | null;
  yearApproximate: boolean;
  medium: Medium;
  technique?: string | null;
  dimensions?: string | null;
  description: string;
  locationCurrent?: string | null;
  locationCreated?: string | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
  isIconic: boolean;
  iconicSignificance?: string | null;
  artist: ArtistBasic;
  movement?: MovementBasic | null;
  themes: ThemeBasic[];
  cities: CityBasic[];
  iconicDetails?: IconicImageDetails | null;
}

export interface MovementWithRelations {
  id: string;
  slug: string;
  name: string;
  nameArabic?: string | null;
  periodStart: number;
  periodEnd?: number | null;
  description: string;
  keyCharacteristics: string[];
  geographicScope: string;
  parentMovement?: MovementBasic | null;
  childMovements: MovementBasic[];
  artists: ArtistBasic[];
  artworks: ArtworkBasic[];
}

export interface ThemeWithRelations {
  id: string;
  slug: string;
  name: string;
  nameArabic?: string | null;
  category: ThemeCategory;
  description?: string | null;
  parentTheme?: ThemeBasic | null;
  childThemes: ThemeBasic[];
  artists: ArtistBasic[];
  artworks: ArtworkBasic[];
}

export interface CityWithRelations {
  id: string;
  slug: string;
  name: string;
  nameArabic?: string | null;
  region?: string | null;
  country: string;
  description?: string | null;
  artists: ArtistBasic[];
  artworks: ArtworkBasic[];
}

// =============================================================================
// BASIC TYPES (For lists and references)
// =============================================================================

export interface ArtistBasic {
  id: string;
  slug: string;
  name: string;
  medium: Medium;
  birthYear?: number | null;
  deathYear?: number | null;
  biographyShort: string;
  activePeriodStart: number;
  activePeriodEnd?: number | null;
}

export interface ArtworkBasic {
  id: string;
  slug: string;
  title: string;
  year?: number | null;
  medium: Medium;
  imageUrl?: string | null;
  imageAlt?: string | null;
  isIconic: boolean;
  artistId: string;
  artistName?: string;
  artistSlug?: string;
}

export interface MovementBasic {
  id: string;
  slug: string;
  name: string;
  periodStart: number;
  periodEnd?: number | null;
}

export interface ThemeBasic {
  id: string;
  slug: string;
  name: string;
  category: ThemeCategory;
}

export interface CityBasic {
  id: string;
  slug: string;
  name: string;
  region?: string | null;
}

export interface CityWithRelation extends CityBasic {
  relationType: 'BORN' | 'BASED' | 'WORKED';
}

// =============================================================================
// EMBEDDED TYPES
// =============================================================================

export interface ExternalReference {
  type: 'museum' | 'publication' | 'gallery' | 'archive' | 'wikipedia' | 'official_site';
  title: string;
  url: string;
  description?: string;
}

export interface IconicImageDetails {
  subject: string;
  historicalContext: string;
  culturalSignificance: string;
  publicationHistory: string[];
  relatedEvent?: string | null;
  relatedEventYear?: number | null;
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

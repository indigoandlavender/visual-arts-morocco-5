// =============================================================================
// Application Constants
// Moroccan Art Platform
// =============================================================================

// =============================================================================
// SITE CONFIGURATION
// =============================================================================

export const SITE_CONFIG = {
  name: 'Morocco Art Archive',
  description: 'Comprehensive database of Moroccan visual artists and artworks',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://moroccoartarchive.com',
  locale: 'en',
  supportedLocales: ['en', 'fr', 'ar'],
} as const;

// =============================================================================
// PAGINATION DEFAULTS
// =============================================================================

export const PAGINATION = {
  defaultLimit: 24,
  maxLimit: 100,
  artistsPerPage: 24,
  artworksPerPage: 24,
  searchResultsPerPage: 20,
} as const;

// =============================================================================
// TIME PERIOD DEFINITIONS
// =============================================================================

export const TIME_PERIODS = [
  { id: 'pre-1900', label: 'Pre-1900', start: null, end: 1899 },
  { id: '1900-1955', label: '1900-1955', start: 1900, end: 1955 },
  { id: '1956-1980', label: '1956-1980 (Independence Era)', start: 1956, end: 1980 },
  { id: '1981-2000', label: '1981-2000', start: 1981, end: 2000 },
  { id: '2001-present', label: '2001-Present', start: 2001, end: null },
] as const;

// =============================================================================
// MEDIUM LABELS
// =============================================================================

export const MEDIUM_LABELS = {
  PHOTOGRAPHY: 'Photography',
  PAINTING: 'Painting',
  BOTH: 'Photography & Painting',
} as const;

// =============================================================================
// MOROCCAN CONNECTION LABELS
// =============================================================================

export const CONNECTION_LABELS = {
  BORN: 'Born in Morocco',
  BASED: 'Based in Morocco',
  DIASPORA: 'Moroccan Diaspora',
  SIGNIFICANT_WORK: 'Significant Work in Morocco',
} as const;

// =============================================================================
// THEME CATEGORY LABELS
// =============================================================================

export const THEME_CATEGORY_LABELS = {
  SUBJECT: 'Subject Matter',
  STYLE: 'Artistic Style',
  TECHNIQUE: 'Technique',
  CONCEPT: 'Conceptual Theme',
} as const;

// =============================================================================
// SORT OPTIONS
// =============================================================================

export const ARTIST_SORT_OPTIONS = [
  { value: 'name', label: 'Name (A-Z)', order: 'asc' },
  { value: 'name', label: 'Name (Z-A)', order: 'desc' },
  { value: 'birthYear', label: 'Birth Year (Newest)', order: 'desc' },
  { value: 'birthYear', label: 'Birth Year (Oldest)', order: 'asc' },
  { value: 'activePeriodStart', label: 'Active Period', order: 'asc' },
  { value: 'createdAt', label: 'Recently Added', order: 'desc' },
] as const;

export const ARTWORK_SORT_OPTIONS = [
  { value: 'year', label: 'Year (Newest)', order: 'desc' },
  { value: 'year', label: 'Year (Oldest)', order: 'asc' },
  { value: 'title', label: 'Title (A-Z)', order: 'asc' },
  { value: 'title', label: 'Title (Z-A)', order: 'desc' },
  { value: 'createdAt', label: 'Recently Added', order: 'desc' },
] as const;

// =============================================================================
// MAJOR CITIES
// =============================================================================

export const MAJOR_CITIES = [
  'casablanca',
  'marrakech',
  'tangier',
  'rabat',
  'fez',
  'asilah',
  'essaouira',
  'tetouan',
] as const;

// =============================================================================
// API CONFIGURATION
// =============================================================================

export const API_CONFIG = {
  version: '1.0',
  rateLimit: {
    free: { requests: 30, window: 60 }, // 30 requests per minute
    premium: { requests: 100, window: 60 },
    institutional: { requests: 1000, window: 60 },
  },
} as const;

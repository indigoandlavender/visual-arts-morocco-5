// =============================================================================
// Query Exports
// Moroccan Art Platform
// =============================================================================

// Artists
export * from './artists';

// Artworks
export * from './artworks';

// Movements
export {
  getMovementBySlug,
  getMovements,
  getMovementFacets,
} from './movements';

// Themes
export {
  getThemeBySlug,
  getThemes,
  getThemesByCategory,
} from './themes';

// Cities
export {
  getCityBySlug,
  getCities,
  getCitiesByRegion,
} from './cities';

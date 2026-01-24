// =============================================================================
// Query Exports - Google Sheets Backend
// Moroccan Art Platform
// =============================================================================

export {
  // Artists
  getAllArtists,
  getArtistBySlug,
  getArtistById,
  getArtistsByMedium,
  getArtistsByMovement,
  getArtistsByTheme,
  getArtistsByCity,
  getRelatedArtists,
  countArtists,

  // Artworks
  getAllArtworks,
  getArtworkBySlug,
  getArtworkById,
  getArtworksByArtist,
  getArtworksByTheme,
  getArtworksByCity,
  getIconicArtworks,
  countArtworks,

  // Movements
  getAllMovements,
  getMovementBySlug,
  countMovements,

  // Themes
  getAllThemes,
  getThemeBySlug,
  countThemes,

  // Cities
  getAllCities,
  getCityBySlug,
  countCities,

  // Search
  searchAll,
} from '../db/data-access';

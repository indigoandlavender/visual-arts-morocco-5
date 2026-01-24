// =============================================================================
// Query Exports - Google Sheets Backend
// Moroccan Art Platform
// =============================================================================

import {
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

// =============================================================================
// Re-export with original names
// =============================================================================

export {
  // Artists - original exports
  getAllArtists,
  getArtistBySlug,
  getArtistById,
  getArtistsByMedium,
  getArtistsByMovement,
  getArtistsByTheme,
  getArtistsByCity,
  getRelatedArtists,
  countArtists,

  // Artworks - original exports
  getAllArtworks,
  getArtworkBySlug,
  getArtworkById,
  getArtworksByArtist,
  getArtworksByTheme,
  getArtworksByCity,
  getIconicArtworks,
  countArtworks,

  // Movements - original exports
  getAllMovements,
  getMovementBySlug,
  countMovements,

  // Themes - original exports
  getAllThemes,
  getThemeBySlug,
  countThemes,

  // Cities - original exports
  getAllCities,
  getCityBySlug,
  countCities,

  // Search
  searchAll,
};

// =============================================================================
// Aliases for backward compatibility with page imports
// =============================================================================

// Artists aliases
export const getArtists = getAllArtists;
export const getArtistCount = countArtists;
export const getFeaturedArtists = getAllArtists; // Returns all, pages can slice

// Artworks aliases
export const getArtworks = getAllArtworks;
export const getArtworkCount = countArtworks;
export const getIconicWorks = getIconicArtworks;
export const getFeaturedWorks = getIconicArtworks;
export const getRelatedArtworks = async (artworkId: string, limit = 6) => {
  const artworks = await getAllArtworks();
  const current = artworks.find(a => a.id === artworkId);
  if (!current) return [];
  // Return artworks by same artist or same themes
  return artworks
    .filter(a => a.id !== artworkId && a.artistId === current.artistId)
    .slice(0, limit);
};

// Movements aliases
export const getMovements = getAllMovements;
export const getMovementFacets = async () => ({ movements: await getAllMovements() });

// Themes aliases
export const getThemes = getAllThemes;
export const getThemesByCategory = async (category: string) => {
  const themes = await getAllThemes();
  return themes.filter(t => t.category === category);
};
export const getThemeFacets = async () => ({ themes: await getAllThemes() });

// Cities aliases
export const getCities = getAllCities;
export const getRegions = async () => {
  const cities = await getAllCities();
  const regions = [...new Set(cities.map(c => c.region).filter(Boolean))];
  return regions.map(r => ({ name: r, cities: cities.filter(c => c.region === r) }));
};
export const getCitiesByRegion = async (region: string) => {
  const cities = await getAllCities();
  return cities.filter(c => c.region === region);
};
export const getCityFacets = async () => ({ cities: await getAllCities() });

// =============================================================================
// Facet functions (return filter options for UI)
// =============================================================================

export const getArtistFacets = async () => {
  const [artists, movements, themes, cities] = await Promise.all([
    getAllArtists(),
    getAllMovements(),
    getAllThemes(),
    getAllCities(),
  ]);

  const mediums = [...new Set(artists.map(a => a.medium).filter(Boolean))];

  return {
    mediums,
    movements,
    themes,
    cities,
    totalCount: artists.length,
  };
};

export const getArtworkFacets = async () => {
  const [artworks, artists, themes, cities] = await Promise.all([
    getAllArtworks(),
    getAllArtists(),
    getAllThemes(),
    getAllCities(),
  ]);

  const mediums = [...new Set(artworks.map(a => a.medium).filter(Boolean))];

  return {
    mediums,
    artists,
    themes,
    cities,
    totalCount: artworks.length,
  };
};

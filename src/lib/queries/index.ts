// =============================================================================
// Query Exports - Google Sheets Backend
// Moroccan Art Platform - Museum/Curatorial Standards
// =============================================================================

export {
  // Lookup Tables
  getAllObjectTypes,
  getObjectTypeBySlug,
  getAllGenres,
  getGenreBySlug,
  getAllMovements,
  getMovementBySlug,
  getAllThemes,
  getThemeBySlug,
  getAllSubjectTerms,
  getSubjectTermBySlug,
  getSubjectTermsByCategory,
  getAllCities,
  getCityBySlug,

  // Institutions
  getAllInstitutions,
  getInstitutionBySlug,
  getInstitutionsByCity,
  getInstitutionsByCitySlug,
  getInstitutionsByType,

  // Artists
  getAllArtists,
  getArtistBySlug,
  getArtistById,
  getArtistsByObjectType,
  getArtistsByMovement,
  getArtistsByTheme,
  getArtistsByCity,
  getRelatedArtists,

  // Artworks
  getAllArtworks,
  getArtworkBySlug,
  getArtworkById,
  getArtworksByArtist,
  getArtworksByObjectType,
  getArtworksByGenre,
  getArtworksByTheme,
  getArtworksBySubject,
  getArtworksByCity,
  getIconicArtworks,

  // Search
  searchAll,

  // Counts
  countArtists,
  countArtworks,
  countMovements,
  countThemes,
  countCities,
  countInstitutions,
  countInstitutionsByCity,
  countObjectTypes,
  countGenres,
  countSubjectTerms,

  // Legacy
  getArtistsByMedium,
} from '../db/data-access';

// =============================================================================
// Aliases for convenience
// =============================================================================

import {
  getAllArtists,
  getAllArtworks,
  getAllMovements,
  getAllThemes,
  getAllCities,
  getAllObjectTypes,
  getAllGenres,
  getAllSubjectTerms,
  getAllInstitutions,
  getIconicArtworks,
  countArtists,
  countArtworks,
  countInstitutions,
} from '../db/data-access';

// Artists
export const getArtists = getAllArtists;
export const getArtistCount = countArtists;
export const getFeaturedArtists = getAllArtists;

// Artworks
export const getArtworks = getAllArtworks;
export const getArtworkCount = countArtworks;
export const getIconicWorks = getIconicArtworks;
export const getFeaturedWorks = getIconicArtworks;

// Related artworks (same artist, theme, or movement)
export async function getRelatedArtworks(artworkId: string, limit = 6) {
  const allArtworks = await getAllArtworks();
  const currentArtwork = allArtworks.find(a => a.id === artworkId);
  if (!currentArtwork) return [];

  // Score artworks by relatedness
  const scored = allArtworks
    .filter(a => a.id !== artworkId)
    .map(artwork => {
      let score = 0;
      // Same artist
      if (artwork.artistId === currentArtwork.artistId) score += 10;
      // Same movement
      if (artwork.movementId && artwork.movementId === currentArtwork.movementId) score += 5;
      // Same genre
      if (artwork.genreId && artwork.genreId === currentArtwork.genreId) score += 3;
      // Same object type
      if (artwork.objectTypeId === currentArtwork.objectTypeId) score += 2;
      // Shared themes
      const sharedThemes = artwork.themes?.filter(t => 
        currentArtwork.themes?.some(ct => ct.id === t.id)
      ) || [];
      score += sharedThemes.length * 2;
      // Shared subjects
      const sharedSubjects = artwork.subjects?.filter(s => 
        currentArtwork.subjects?.some(cs => cs.id === s.id)
      ) || [];
      score += sharedSubjects.length * 2;
      return { artwork, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.artwork);

  return scored;
}

// Lookup tables
export const getMovements = getAllMovements;
export const getThemes = getAllThemes;
export const getCities = getAllCities;
export const getObjectTypes = getAllObjectTypes;
export const getGenres = getAllGenres;
export const getSubjectTerms = getAllSubjectTerms;
export const getInstitutions = getAllInstitutions;
export const getInstitutionCount = countInstitutions;

// =============================================================================
// Facet functions (for filter UI)
// =============================================================================

export const getArtistFacets = async () => {
  const [artists, objectTypes, movements, themes, cities] = await Promise.all([
    getAllArtists(),
    getAllObjectTypes(),
    getAllMovements(),
    getAllThemes(),
    getAllCities(),
  ]);

  return {
    objectTypes,
    movements,
    themes,
    cities,
    totalCount: artists.length,
  };
};

export const getArtworkFacets = async () => {
  const [artworks, objectTypes, genres, themes, subjects, cities] = await Promise.all([
    getAllArtworks(),
    getAllObjectTypes(),
    getAllGenres(),
    getAllThemes(),
    getAllSubjectTerms(),
    getAllCities(),
  ]);

  return {
    objectTypes,
    genres,
    themes,
    subjects,
    cities,
    totalCount: artworks.length,
  };
};

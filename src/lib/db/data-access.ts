import { readSheet, SHEETS } from './sheets-client';
import type {
  Artist,
  Artwork,
  Movement,
  Theme,
  City,
  Medium,
  ContentStatus,
  ThemeCategory,
  CityRelationType,
  ArtistRelationType,
} from '@/types';

// Row types from sheets (flat structure)
interface ArtistRow {
  id: string;
  slug: string;
  name: string;
  nameAr: string | null;
  medium: string;
  birthYear: number | null;
  deathYear: number | null;
  biographyShort: string | null;
  biography: string | null;
  activePeriodStart: number | null;
  activePeriodEnd: number | null;
  photoUrl: string | null;
  websiteUrl: string | null;
  status: string;
}

interface ArtworkRow {
  id: string;
  slug: string;
  title: string;
  titleAr: string | null;
  artistId: string;
  medium: string;
  year: number | null;
  yearEnd: number | null;
  description: string | null;
  dimensions: string | null;
  materialsAndTechniques: string | null;
  currentLocation: string | null;
  imageUrl: string | null;
  isIconic: boolean;
  movementId: string | null;
  status: string;
}

interface MovementRow {
  id: string;
  slug: string;
  name: string;
  nameAr: string | null;
  description: string | null;
  periodStart: number | null;
  periodEnd: number | null;
}

interface ThemeRow {
  id: string;
  slug: string;
  name: string;
  nameAr: string | null;
  description: string | null;
  category: string;
}

interface CityRow {
  id: string;
  slug: string;
  name: string;
  nameAr: string | null;
  region: string | null;
  country: string;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
}

interface ArtistCityRow {
  artistId: string;
  cityId: string;
  relationType: string;
}

interface ArtistThemeRow {
  artistId: string;
  themeId: string;
}

interface ArtistMovementRow {
  artistId: string;
  movementId: string;
}

interface ArtistRelationRow {
  fromArtistId: string;
  toArtistId: string;
  relationType: string;
}

interface ArtworkThemeRow {
  artworkId: string;
  themeId: string;
}

interface ArtworkCityRow {
  artworkId: string;
  cityId: string;
  relationType: string;
}

interface IconicImageRow {
  id: string;
  artworkId: string;
  subject: string | null;
  composition: string | null;
  colorPalette: string | null;
  technique: string | null;
  historicalContext: string | null;
  significance: string | null;
  interpretation: string | null;
}

// Cache for data (refreshed on each request in dev, cached in production)
let cache: {
  artists?: ArtistRow[];
  artworks?: ArtworkRow[];
  movements?: MovementRow[];
  themes?: ThemeRow[];
  cities?: CityRow[];
  artistCities?: ArtistCityRow[];
  artistThemes?: ArtistThemeRow[];
  artistMovements?: ArtistMovementRow[];
  artistRelations?: ArtistRelationRow[];
  artworkThemes?: ArtworkThemeRow[];
  artworkCities?: ArtworkCityRow[];
  iconicImages?: IconicImageRow[];
  timestamp?: number;
} = {};

const CACHE_TTL = process.env.NODE_ENV === 'production' ? 60000 : 5000; // 1 min prod, 5s dev

async function getCache() {
  const now = Date.now();
  if (cache.timestamp && now - cache.timestamp < CACHE_TTL) {
    return cache;
  }

  // Refresh cache
  const [
    artists,
    artworks,
    movements,
    themes,
    cities,
    artistCities,
    artistThemes,
    artistMovements,
    artistRelations,
    artworkThemes,
    artworkCities,
    iconicImages,
  ] = await Promise.all([
    readSheet<ArtistRow>(SHEETS.ARTISTS),
    readSheet<ArtworkRow>(SHEETS.ARTWORKS),
    readSheet<MovementRow>(SHEETS.MOVEMENTS),
    readSheet<ThemeRow>(SHEETS.THEMES),
    readSheet<CityRow>(SHEETS.CITIES),
    readSheet<ArtistCityRow>(SHEETS.ARTIST_CITIES),
    readSheet<ArtistThemeRow>(SHEETS.ARTIST_THEMES),
    readSheet<ArtistMovementRow>(SHEETS.ARTIST_MOVEMENTS),
    readSheet<ArtistRelationRow>(SHEETS.ARTIST_RELATIONS),
    readSheet<ArtworkThemeRow>(SHEETS.ARTWORK_THEMES),
    readSheet<ArtworkCityRow>(SHEETS.ARTWORK_CITIES),
    readSheet<IconicImageRow>(SHEETS.ICONIC_IMAGES),
  ]);

  cache = {
    artists,
    artworks,
    movements,
    themes,
    cities,
    artistCities,
    artistThemes,
    artistMovements,
    artistRelations,
    artworkThemes,
    artworkCities,
    iconicImages,
    timestamp: now,
  };

  return cache;
}

// Helper to build full artist object with relations
function buildArtist(
  row: ArtistRow,
  data: Awaited<ReturnType<typeof getCache>>
): Artist {
  const artistCities = data.artistCities?.filter(ac => ac.artistId === row.id) || [];
  const artistThemes = data.artistThemes?.filter(at => at.artistId === row.id) || [];
  const artistMovements = data.artistMovements?.filter(am => am.artistId === row.id) || [];

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    nameArabic: row.nameAr,
    medium: row.medium as Medium,
    birthYear: row.birthYear,
    deathYear: row.deathYear,
    biographyShort: row.biographyShort,
    biography: row.biography,
    activePeriodStart: row.activePeriodStart,
    activePeriodEnd: row.activePeriodEnd,
    photoUrl: row.photoUrl,
    websiteUrl: row.websiteUrl,
    status: row.status as ContentStatus,
    cities: artistCities.map(ac => {
      const city = data.cities?.find(c => c.id === ac.cityId);
      return city ? {
        city: buildCity(city),
        relationType: ac.relationType as CityRelationType,
      } : null;
    }).filter(Boolean) as { city: City; relationType: CityRelationType }[],
    themes: artistThemes.map(at => {
      const theme = data.themes?.find(t => t.id === at.themeId);
      return theme ? buildTheme(theme) : null;
    }).filter(Boolean) as Theme[],
    movements: artistMovements.map(am => {
      const movement = data.movements?.find(m => m.id === am.movementId);
      return movement ? buildMovement(movement) : null;
    }).filter(Boolean) as Movement[],
  };
}

function buildArtwork(
  row: ArtworkRow,
  data: Awaited<ReturnType<typeof getCache>>
): Artwork {
  const artworkThemes = data.artworkThemes?.filter(at => at.artworkId === row.id) || [];
  const artworkCities = data.artworkCities?.filter(ac => ac.artworkId === row.id) || [];
  const artistRow = data.artists?.find(a => a.id === row.artistId);
  const movementRow = row.movementId ? data.movements?.find(m => m.id === row.movementId) : null;
  const iconicImage = data.iconicImages?.find(ii => ii.artworkId === row.id);

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    titleAr: row.titleAr,
    artistId: row.artistId,
    artist: artistRow ? {
      id: artistRow.id,
      slug: artistRow.slug,
      name: artistRow.name,
      medium: artistRow.medium as Medium,
    } : undefined,
    medium: row.medium as Medium,
    year: row.year,
    yearEnd: row.yearEnd,
    description: row.description,
    dimensions: row.dimensions,
    materialsAndTechniques: row.materialsAndTechniques,
    currentLocation: row.currentLocation,
    imageUrl: row.imageUrl,
    isIconic: row.isIconic,
    movementId: row.movementId,
    movement: movementRow ? buildMovement(movementRow) : undefined,
    status: row.status as ContentStatus,
    themes: artworkThemes.map(at => {
      const theme = data.themes?.find(t => t.id === at.themeId);
      return theme ? buildTheme(theme) : null;
    }).filter(Boolean) as Theme[],
    cities: artworkCities.map(ac => {
      const city = data.cities?.find(c => c.id === ac.cityId);
      return city ? {
        city: buildCity(city),
        relationType: ac.relationType as CityRelationType,
      } : null;
    }).filter(Boolean) as { city: City; relationType: CityRelationType }[],
    iconicImage: iconicImage ? {
      subject: iconicImage.subject,
      composition: iconicImage.composition,
      colorPalette: iconicImage.colorPalette,
      technique: iconicImage.technique,
      historicalContext: iconicImage.historicalContext,
      significance: iconicImage.significance,
      interpretation: iconicImage.interpretation,
    } : undefined,
  };
}

function buildMovement(row: MovementRow): Movement {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    nameArabic: row.nameAr,
    description: row.description,
    periodStart: row.periodStart,
    periodEnd: row.periodEnd,
  };
}

function buildTheme(row: ThemeRow): Theme {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    nameArabic: row.nameAr,
    description: row.description,
    category: row.category as ThemeCategory,
  };
}

function buildCity(row: CityRow): City {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    nameArabic: row.nameAr,
    region: row.region,
    country: row.country,
    description: row.description,
    latitude: row.latitude,
    longitude: row.longitude,
  };
}

// Public API

export async function getAllArtists(): Promise<Artist[]> {
  const data = await getCache();
  return (data.artists || [])
    .filter(a => a.status === 'PUBLISHED')
    .map(a => buildArtist(a, data));
}

export async function getArtistBySlug(slug: string): Promise<Artist | null> {
  const data = await getCache();
  const row = data.artists?.find(a => a.slug === slug);
  if (!row) return null;
  return buildArtist(row, data);
}

export async function getArtistById(id: string): Promise<Artist | null> {
  const data = await getCache();
  const row = data.artists?.find(a => a.id === id);
  if (!row) return null;
  return buildArtist(row, data);
}

export async function getArtistsByMedium(medium: Medium): Promise<Artist[]> {
  const data = await getCache();
  return (data.artists || [])
    .filter(a => a.status === 'PUBLISHED' && (a.medium === medium || a.medium === 'BOTH'))
    .map(a => buildArtist(a, data));
}

export async function getAllArtworks(): Promise<Artwork[]> {
  const data = await getCache();
  return (data.artworks || [])
    .filter(a => a.status === 'PUBLISHED')
    .map(a => buildArtwork(a, data));
}

export async function getArtworkBySlug(slug: string): Promise<Artwork | null> {
  const data = await getCache();
  const row = data.artworks?.find(a => a.slug === slug);
  if (!row) return null;
  return buildArtwork(row, data);
}

export async function getArtworkById(id: string): Promise<Artwork | null> {
  const data = await getCache();
  const row = data.artworks?.find(a => a.id === id);
  if (!row) return null;
  return buildArtwork(row, data);
}

export async function getArtworksByArtist(artistId: string): Promise<Artwork[]> {
  const data = await getCache();
  return (data.artworks || [])
    .filter(a => a.artistId === artistId && a.status === 'PUBLISHED')
    .map(a => buildArtwork(a, data));
}

export async function getIconicArtworks(): Promise<Artwork[]> {
  const data = await getCache();
  return (data.artworks || [])
    .filter(a => a.isIconic && a.status === 'PUBLISHED')
    .map(a => buildArtwork(a, data));
}

export async function getAllMovements(): Promise<Movement[]> {
  const data = await getCache();
  return (data.movements || []).map(m => buildMovement(m));
}

export async function getMovementBySlug(slug: string): Promise<Movement | null> {
  const data = await getCache();
  const row = data.movements?.find(m => m.slug === slug);
  if (!row) return null;
  return buildMovement(row);
}

export async function getArtistsByMovement(movementId: string): Promise<Artist[]> {
  const data = await getCache();
  const artistIds = (data.artistMovements || [])
    .filter(am => am.movementId === movementId)
    .map(am => am.artistId);
  return (data.artists || [])
    .filter(a => artistIds.includes(a.id) && a.status === 'PUBLISHED')
    .map(a => buildArtist(a, data));
}

export async function getAllThemes(): Promise<Theme[]> {
  const data = await getCache();
  return (data.themes || []).map(t => buildTheme(t));
}

export async function getThemeBySlug(slug: string): Promise<Theme | null> {
  const data = await getCache();
  const row = data.themes?.find(t => t.slug === slug);
  if (!row) return null;
  return buildTheme(row);
}

export async function getArtistsByTheme(themeId: string): Promise<Artist[]> {
  const data = await getCache();
  const artistIds = (data.artistThemes || [])
    .filter(at => at.themeId === themeId)
    .map(at => at.artistId);
  return (data.artists || [])
    .filter(a => artistIds.includes(a.id) && a.status === 'PUBLISHED')
    .map(a => buildArtist(a, data));
}

export async function getArtworksByTheme(themeId: string): Promise<Artwork[]> {
  const data = await getCache();
  const artworkIds = (data.artworkThemes || [])
    .filter(at => at.themeId === themeId)
    .map(at => at.artworkId);
  return (data.artworks || [])
    .filter(a => artworkIds.includes(a.id) && a.status === 'PUBLISHED')
    .map(a => buildArtwork(a, data));
}

export async function getAllCities(): Promise<City[]> {
  const data = await getCache();
  return (data.cities || []).map(c => buildCity(c));
}

export async function getCityBySlug(slug: string): Promise<City | null> {
  const data = await getCache();
  const row = data.cities?.find(c => c.slug === slug);
  if (!row) return null;
  return buildCity(row);
}

export async function getArtistsByCity(cityId: string): Promise<Artist[]> {
  const data = await getCache();
  const artistIds = (data.artistCities || [])
    .filter(ac => ac.cityId === cityId)
    .map(ac => ac.artistId);
  return (data.artists || [])
    .filter(a => artistIds.includes(a.id) && a.status === 'PUBLISHED')
    .map(a => buildArtist(a, data));
}

export async function getArtworksByCity(cityId: string): Promise<Artwork[]> {
  const data = await getCache();
  const artworkIds = (data.artworkCities || [])
    .filter(ac => ac.cityId === cityId)
    .map(ac => ac.artworkId);
  return (data.artworks || [])
    .filter(a => artworkIds.includes(a.id) && a.status === 'PUBLISHED')
    .map(a => buildArtwork(a, data));
}

export async function getRelatedArtists(artistId: string): Promise<Artist[]> {
  const data = await getCache();
  const relatedIds = (data.artistRelations || [])
    .filter(r => r.fromArtistId === artistId || r.toArtistId === artistId)
    .map(r => r.fromArtistId === artistId ? r.toArtistId : r.fromArtistId);
  return (data.artists || [])
    .filter(a => relatedIds.includes(a.id) && a.status === 'PUBLISHED')
    .map(a => buildArtist(a, data));
}

// Search function
export async function searchAll(query: string): Promise<{
  artists: Artist[];
  artworks: Artwork[];
}> {
  const data = await getCache();
  const q = query.toLowerCase();

  const artists = (data.artists || [])
    .filter(a =>
      a.status === 'PUBLISHED' &&
      (a.name.toLowerCase().includes(q) ||
       a.biographyShort?.toLowerCase().includes(q) ||
       a.biography?.toLowerCase().includes(q))
    )
    .map(a => buildArtist(a, data));

  const artworks = (data.artworks || [])
    .filter(a =>
      a.status === 'PUBLISHED' &&
      (a.title.toLowerCase().includes(q) ||
       a.description?.toLowerCase().includes(q))
    )
    .map(a => buildArtwork(a, data));

  return { artists, artworks };
}

// Count functions
export async function countArtists(): Promise<number> {
  const data = await getCache();
  return (data.artists || []).filter(a => a.status === 'PUBLISHED').length;
}

export async function countArtworks(): Promise<number> {
  const data = await getCache();
  return (data.artworks || []).filter(a => a.status === 'PUBLISHED').length;
}

export async function countMovements(): Promise<number> {
  const data = await getCache();
  return (data.movements || []).length;
}

export async function countThemes(): Promise<number> {
  const data = await getCache();
  return (data.themes || []).length;
}

export async function countCities(): Promise<number> {
  const data = await getCache();
  return (data.cities || []).length;
}

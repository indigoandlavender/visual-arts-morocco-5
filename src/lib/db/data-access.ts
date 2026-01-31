import { readSheet, SHEETS } from './sheets-client';
import type {
  Artist,
  Artwork,
  ObjectType,
  Genre,
  Movement,
  Theme,
  SubjectTerm,
  City,
  Institution,
  ContentStatus,
  CityRelationType,
  ArtistRelationType,
  InstitutionType,
  SubjectCategory,
} from '@/types';

// =============================================================================
// ROW TYPES (flat structure from sheets)
// =============================================================================

interface ObjectTypeRow {
  id: string;
  slug: string;
  name: string;
  description: string | null;
}

interface GenreRow {
  id: string;
  slug: string;
  name: string;
  description: string | null;
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
  description: string | null;
}

interface SubjectTermRow {
  id: string;
  slug: string;
  name: string;
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

interface InstitutionRow {
  id: string;
  slug: string;
  name: string;
  nameAr: string | null;
  type: string;
  cityId: string;
  address: string | null;
  description: string | null;
  descriptionLong: string | null;
  website: string | null;
  phone: string | null;
  email: string | null;
  hours: string | null;
  admission: string | null;
  latitude: number | null;
  longitude: number | null;
  yearEstablished: number | null;
  highlights: string | null;
  status: string;
}

interface ArtistRow {
  id: string;
  slug: string;
  name: string;
  nameAr: string | null;
  primaryObjectTypeId: string | null;
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
  objectTypeId: string | null;
  genreId: string | null;
  materials: string | null;
  dimensions: string | null;
  year: number | null;
  yearEnd: number | null;
  description: string | null;
  currentLocation: string | null;
  imageUrl: string | null;
  isIconic: boolean;
  movementId: string | null;
  status: string;
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

interface ArtworkSubjectRow {
  artworkId: string;
  subjectId: string;
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

// =============================================================================
// CACHE
// =============================================================================

let cache: {
  objectTypes?: ObjectTypeRow[];
  genres?: GenreRow[];
  movements?: MovementRow[];
  themes?: ThemeRow[];
  subjectTerms?: SubjectTermRow[];
  cities?: CityRow[];
  institutions?: InstitutionRow[];
  artists?: ArtistRow[];
  artworks?: ArtworkRow[];
  artistCities?: ArtistCityRow[];
  artistThemes?: ArtistThemeRow[];
  artistMovements?: ArtistMovementRow[];
  artistRelations?: ArtistRelationRow[];
  artworkThemes?: ArtworkThemeRow[];
  artworkSubjects?: ArtworkSubjectRow[];
  artworkCities?: ArtworkCityRow[];
  iconicImages?: IconicImageRow[];
  timestamp?: number;
} = {};

const CACHE_TTL = process.env.NODE_ENV === 'production' ? 60000 : 5000;

async function getCache() {
  const now = Date.now();
  if (cache.timestamp && now - cache.timestamp < CACHE_TTL) {
    return cache;
  }

  try {
    const [
      objectTypes,
      genres,
      movements,
      themes,
      subjectTerms,
      cities,
      institutions,
      artists,
      artworks,
      artistCities,
      artistThemes,
      artistMovements,
      artistRelations,
      artworkThemes,
      artworkSubjects,
      artworkCities,
      iconicImages,
    ] = await Promise.all([
      readSheet<ObjectTypeRow>(SHEETS.OBJECT_TYPES),
      readSheet<GenreRow>(SHEETS.GENRES),
      readSheet<MovementRow>(SHEETS.MOVEMENTS),
      readSheet<ThemeRow>(SHEETS.THEMES),
      readSheet<SubjectTermRow>(SHEETS.SUBJECT_TERMS),
      readSheet<CityRow>(SHEETS.CITIES),
      readSheet<InstitutionRow>(SHEETS.INSTITUTIONS),
      readSheet<ArtistRow>(SHEETS.ARTISTS),
      readSheet<ArtworkRow>(SHEETS.ARTWORKS),
      readSheet<ArtistCityRow>(SHEETS.ARTIST_CITIES),
      readSheet<ArtistThemeRow>(SHEETS.ARTIST_THEMES),
      readSheet<ArtistMovementRow>(SHEETS.ARTIST_MOVEMENTS),
      readSheet<ArtistRelationRow>(SHEETS.ARTIST_RELATIONS),
      readSheet<ArtworkThemeRow>(SHEETS.ARTWORK_THEMES),
      readSheet<ArtworkSubjectRow>(SHEETS.ARTWORK_SUBJECTS),
      readSheet<ArtworkCityRow>(SHEETS.ARTWORK_CITIES),
      readSheet<IconicImageRow>(SHEETS.ICONIC_IMAGES),
    ]);

    cache = {
      objectTypes,
      genres,
      movements,
      themes,
      subjectTerms,
      cities,
      institutions,
      artists,
      artworks,
      artistCities,
      artistThemes,
      artistMovements,
      artistRelations,
      artworkThemes,
      artworkSubjects,
      artworkCities,
      iconicImages,
      timestamp: now,
    };
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
    if (!cache.timestamp) {
      throw new Error(`Failed to fetch data from Google Sheets: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  return cache;
}

// =============================================================================
// BUILD FUNCTIONS
// =============================================================================

function buildObjectType(row: ObjectTypeRow): ObjectType {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
  };
}

function buildGenre(row: GenreRow): Genre {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
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
    description: row.description,
  };
}

function buildSubjectTerm(row: SubjectTermRow): SubjectTerm {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category as SubjectCategory,
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

function buildInstitution(
  row: InstitutionRow,
  data: Awaited<ReturnType<typeof getCache>>
): Institution {
  const cityRow = data.cities?.find(c => c.id === row.cityId);
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    nameArabic: row.nameAr,
    type: row.type as InstitutionType,
    cityId: row.cityId,
    city: cityRow ? buildCity(cityRow) : undefined,
    address: row.address,
    description: row.description,
    descriptionLong: row.descriptionLong,
    website: row.website,
    phone: row.phone,
    email: row.email,
    hours: row.hours,
    admission: row.admission,
    latitude: row.latitude,
    longitude: row.longitude,
    yearEstablished: row.yearEstablished,
    highlights: row.highlights,
    status: row.status as ContentStatus,
  };
}

function buildArtist(
  row: ArtistRow,
  data: Awaited<ReturnType<typeof getCache>>
): Artist {
  // Get object type
  const objectTypeRow = data.objectTypes?.find(o => o.id === row.primaryObjectTypeId);
  
  // Get cities
  const cityRelations = data.artistCities?.filter(ac => ac.artistId === row.id) || [];
  const cities = cityRelations.map(rel => {
    const cityRow = data.cities?.find(c => c.id === rel.cityId);
    return cityRow ? {
      city: buildCity(cityRow),
      relationType: rel.relationType as CityRelationType,
    } : null;
  }).filter(Boolean) as { city: City; relationType: CityRelationType }[];

  // Get themes
  const themeIds = data.artistThemes?.filter(at => at.artistId === row.id).map(at => at.themeId) || [];
  const themes = themeIds
    .map(id => data.themes?.find(t => t.id === id))
    .filter(Boolean)
    .map(t => buildTheme(t!));

  // Get movements
  const movementIds = data.artistMovements?.filter(am => am.artistId === row.id).map(am => am.movementId) || [];
  const movements = movementIds
    .map(id => data.movements?.find(m => m.id === id))
    .filter(Boolean)
    .map(m => buildMovement(m!));

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    nameArabic: row.nameAr,
    primaryObjectTypeId: row.primaryObjectTypeId,
    primaryObjectType: objectTypeRow ? buildObjectType(objectTypeRow) : undefined,
    birthYear: row.birthYear,
    deathYear: row.deathYear,
    biographyShort: row.biographyShort,
    biography: row.biography,
    activePeriodStart: row.activePeriodStart,
    activePeriodEnd: row.activePeriodEnd,
    photoUrl: row.photoUrl,
    websiteUrl: row.websiteUrl,
    status: row.status as ContentStatus,
    cities,
    themes,
    movements,
  };
}

function buildArtwork(
  row: ArtworkRow,
  data: Awaited<ReturnType<typeof getCache>>
): Artwork {
  // Get artist
  const artistRow = data.artists?.find(a => a.id === row.artistId);

  // Get object type
  const objectTypeRow = data.objectTypes?.find(o => o.id === row.objectTypeId);

  // Get genre
  const genreRow = data.genres?.find(g => g.id === row.genreId);

  // Get movement
  const movementRow = data.movements?.find(m => m.id === row.movementId);

  // Get themes
  const themeIds = data.artworkThemes?.filter(at => at.artworkId === row.id).map(at => at.themeId) || [];
  const themes = themeIds
    .map(id => data.themes?.find(t => t.id === id))
    .filter(Boolean)
    .map(t => buildTheme(t!));

  // Get subjects
  const subjectIds = data.artworkSubjects?.filter(as => as.artworkId === row.id).map(as => as.subjectId) || [];
  const subjects = subjectIds
    .map(id => data.subjectTerms?.find(s => s.id === id))
    .filter(Boolean)
    .map(s => buildSubjectTerm(s!));

  // Get cities
  const cityRelations = data.artworkCities?.filter(ac => ac.artworkId === row.id) || [];
  const cities = cityRelations.map(rel => {
    const cityRow = data.cities?.find(c => c.id === rel.cityId);
    return cityRow ? {
      city: buildCity(cityRow),
      relationType: rel.relationType as CityRelationType,
    } : null;
  }).filter(Boolean) as { city: City; relationType: CityRelationType }[];

  // Get iconic image
  const iconicRow = data.iconicImages?.find(i => i.artworkId === row.id);
  const iconicImage = iconicRow ? {
    subject: iconicRow.subject,
    composition: iconicRow.composition,
    colorPalette: iconicRow.colorPalette,
    technique: iconicRow.technique,
    historicalContext: iconicRow.historicalContext,
    significance: iconicRow.significance,
    interpretation: iconicRow.interpretation,
  } : undefined;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    titleArabic: row.titleAr,
    artistId: row.artistId,
    artist: artistRow ? {
      id: artistRow.id,
      slug: artistRow.slug,
      name: artistRow.name,
      primaryObjectTypeId: artistRow.primaryObjectTypeId || undefined,
    } : undefined,
    objectTypeId: row.objectTypeId,
    objectType: objectTypeRow ? buildObjectType(objectTypeRow) : undefined,
    genreId: row.genreId,
    genre: genreRow ? buildGenre(genreRow) : undefined,
    materials: row.materials,
    dimensions: row.dimensions,
    year: row.year,
    yearEnd: row.yearEnd,
    description: row.description,
    currentLocation: row.currentLocation,
    imageUrl: row.imageUrl,
    isIconic: row.isIconic,
    movementId: row.movementId,
    movement: movementRow ? buildMovement(movementRow) : undefined,
    status: row.status as ContentStatus,
    themes,
    subjects,
    cities,
    iconicImage,
  };
}

// =============================================================================
// PUBLIC API - LOOKUP TABLES
// =============================================================================

export async function getAllObjectTypes(): Promise<ObjectType[]> {
  const data = await getCache();
  return (data.objectTypes || []).map(buildObjectType);
}

export async function getObjectTypeBySlug(slug: string): Promise<ObjectType | null> {
  const data = await getCache();
  const row = data.objectTypes?.find(o => o.slug === slug);
  return row ? buildObjectType(row) : null;
}

export async function getAllGenres(): Promise<Genre[]> {
  const data = await getCache();
  return (data.genres || []).map(buildGenre);
}

export async function getGenreBySlug(slug: string): Promise<Genre | null> {
  const data = await getCache();
  const row = data.genres?.find(g => g.slug === slug);
  return row ? buildGenre(row) : null;
}

export async function getAllMovements(): Promise<Movement[]> {
  const data = await getCache();
  return (data.movements || []).map(buildMovement);
}

export async function getMovementBySlug(slug: string): Promise<Movement | null> {
  const data = await getCache();
  const row = data.movements?.find(m => m.slug === slug);
  return row ? buildMovement(row) : null;
}

export async function getAllThemes(): Promise<Theme[]> {
  const data = await getCache();
  return (data.themes || []).map(buildTheme);
}

export async function getThemeBySlug(slug: string): Promise<Theme | null> {
  const data = await getCache();
  const row = data.themes?.find(t => t.slug === slug);
  return row ? buildTheme(row) : null;
}

export async function getAllSubjectTerms(): Promise<SubjectTerm[]> {
  const data = await getCache();
  return (data.subjectTerms || []).map(buildSubjectTerm);
}

export async function getSubjectTermBySlug(slug: string): Promise<SubjectTerm | null> {
  const data = await getCache();
  const row = data.subjectTerms?.find(s => s.slug === slug);
  return row ? buildSubjectTerm(row) : null;
}

export async function getSubjectTermsByCategory(category: SubjectCategory): Promise<SubjectTerm[]> {
  const data = await getCache();
  return (data.subjectTerms || [])
    .filter(s => s.category === category)
    .map(buildSubjectTerm);
}

export async function getAllCities(): Promise<City[]> {
  const data = await getCache();
  return (data.cities || []).map(buildCity);
}

export async function getCityBySlug(slug: string): Promise<City | null> {
  const data = await getCache();
  const row = data.cities?.find(c => c.slug === slug);
  return row ? buildCity(row) : null;
}

// =============================================================================
// PUBLIC API - INSTITUTIONS
// =============================================================================

export async function getAllInstitutions(): Promise<Institution[]> {
  const data = await getCache();
  return (data.institutions || [])
    .filter(i => i.status === 'PUBLISHED')
    .map(i => buildInstitution(i, data));
}

export async function getInstitutionBySlug(slug: string): Promise<Institution | null> {
  const data = await getCache();
  const row = data.institutions?.find(i => i.slug === slug);
  return row ? buildInstitution(row, data) : null;
}

export async function getInstitutionsByCity(cityId: string): Promise<Institution[]> {
  const data = await getCache();
  return (data.institutions || [])
    .filter(i => i.cityId === cityId && i.status === 'PUBLISHED')
    .map(i => buildInstitution(i, data));
}

export async function getInstitutionsByCitySlug(citySlug: string): Promise<Institution[]> {
  const data = await getCache();
  const city = data.cities?.find(c => c.slug === citySlug);
  if (!city) return [];
  return (data.institutions || [])
    .filter(i => i.cityId === city.id && i.status === 'PUBLISHED')
    .map(i => buildInstitution(i, data));
}

export async function getInstitutionsByType(type: InstitutionType): Promise<Institution[]> {
  const data = await getCache();
  return (data.institutions || [])
    .filter(i => i.type === type && i.status === 'PUBLISHED')
    .map(i => buildInstitution(i, data));
}

// =============================================================================
// PUBLIC API - ARTISTS
// =============================================================================

export async function getAllArtists(): Promise<Artist[]> {
  const data = await getCache();
  return (data.artists || [])
    .filter(a => a.status === 'PUBLISHED')
    .map(a => buildArtist(a, data));
}

export async function getArtistBySlug(slug: string): Promise<Artist | null> {
  const data = await getCache();
  const row = data.artists?.find(a => a.slug === slug);
  return row ? buildArtist(row, data) : null;
}

export async function getArtistById(id: string): Promise<Artist | null> {
  const data = await getCache();
  const row = data.artists?.find(a => a.id === id);
  return row ? buildArtist(row, data) : null;
}

export async function getArtistsByObjectType(objectTypeId: string): Promise<Artist[]> {
  const data = await getCache();
  return (data.artists || [])
    .filter(a => a.primaryObjectTypeId === objectTypeId && a.status === 'PUBLISHED')
    .map(a => buildArtist(a, data));
}

export async function getArtistsByMovement(movementId: string): Promise<Artist[]> {
  const data = await getCache();
  const artistIds = data.artistMovements
    ?.filter(am => am.movementId === movementId)
    .map(am => am.artistId) || [];
  return (data.artists || [])
    .filter(a => artistIds.includes(a.id) && a.status === 'PUBLISHED')
    .map(a => buildArtist(a, data));
}

export async function getArtistsByTheme(themeId: string): Promise<Artist[]> {
  const data = await getCache();
  const artistIds = data.artistThemes
    ?.filter(at => at.themeId === themeId)
    .map(at => at.artistId) || [];
  return (data.artists || [])
    .filter(a => artistIds.includes(a.id) && a.status === 'PUBLISHED')
    .map(a => buildArtist(a, data));
}

export async function getArtistsByCity(cityId: string): Promise<Artist[]> {
  const data = await getCache();
  const artistIds = data.artistCities
    ?.filter(ac => ac.cityId === cityId)
    .map(ac => ac.artistId) || [];
  return (data.artists || [])
    .filter(a => artistIds.includes(a.id) && a.status === 'PUBLISHED')
    .map(a => buildArtist(a, data));
}

export async function getRelatedArtists(artistId: string): Promise<Artist[]> {
  const data = await getCache();
  const relatedIds = data.artistRelations
    ?.filter(r => r.fromArtistId === artistId || r.toArtistId === artistId)
    .map(r => r.fromArtistId === artistId ? r.toArtistId : r.fromArtistId) || [];
  return (data.artists || [])
    .filter(a => relatedIds.includes(a.id) && a.status === 'PUBLISHED')
    .map(a => buildArtist(a, data));
}

// =============================================================================
// PUBLIC API - ARTWORKS
// =============================================================================

export async function getAllArtworks(): Promise<Artwork[]> {
  const data = await getCache();
  return (data.artworks || [])
    .filter(a => a.status === 'PUBLISHED')
    .map(a => buildArtwork(a, data));
}

export async function getArtworkBySlug(slug: string): Promise<Artwork | null> {
  const data = await getCache();
  const row = data.artworks?.find(a => a.slug === slug);
  return row ? buildArtwork(row, data) : null;
}

export async function getArtworkById(id: string): Promise<Artwork | null> {
  const data = await getCache();
  const row = data.artworks?.find(a => a.id === id);
  return row ? buildArtwork(row, data) : null;
}

export async function getArtworksByArtist(artistId: string): Promise<Artwork[]> {
  const data = await getCache();
  return (data.artworks || [])
    .filter(a => a.artistId === artistId && a.status === 'PUBLISHED')
    .map(a => buildArtwork(a, data));
}

export async function getArtworksByObjectType(objectTypeId: string): Promise<Artwork[]> {
  const data = await getCache();
  return (data.artworks || [])
    .filter(a => a.objectTypeId === objectTypeId && a.status === 'PUBLISHED')
    .map(a => buildArtwork(a, data));
}

export async function getArtworksByGenre(genreId: string): Promise<Artwork[]> {
  const data = await getCache();
  return (data.artworks || [])
    .filter(a => a.genreId === genreId && a.status === 'PUBLISHED')
    .map(a => buildArtwork(a, data));
}

export async function getArtworksByTheme(themeId: string): Promise<Artwork[]> {
  const data = await getCache();
  const artworkIds = data.artworkThemes
    ?.filter(at => at.themeId === themeId)
    .map(at => at.artworkId) || [];
  return (data.artworks || [])
    .filter(a => artworkIds.includes(a.id) && a.status === 'PUBLISHED')
    .map(a => buildArtwork(a, data));
}

export async function getArtworksBySubject(subjectId: string): Promise<Artwork[]> {
  const data = await getCache();
  const artworkIds = data.artworkSubjects
    ?.filter(as => as.subjectId === subjectId)
    .map(as => as.artworkId) || [];
  return (data.artworks || [])
    .filter(a => artworkIds.includes(a.id) && a.status === 'PUBLISHED')
    .map(a => buildArtwork(a, data));
}

export async function getArtworksByCity(cityId: string): Promise<Artwork[]> {
  const data = await getCache();
  const artworkIds = data.artworkCities
    ?.filter(ac => ac.cityId === cityId)
    .map(ac => ac.artworkId) || [];
  return (data.artworks || [])
    .filter(a => artworkIds.includes(a.id) && a.status === 'PUBLISHED')
    .map(a => buildArtwork(a, data));
}

export async function getIconicArtworks(): Promise<Artwork[]> {
  const data = await getCache();
  return (data.artworks || [])
    .filter(a => a.isIconic && a.status === 'PUBLISHED')
    .map(a => buildArtwork(a, data));
}

// =============================================================================
// PUBLIC API - SEARCH
// =============================================================================

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

// =============================================================================
// PUBLIC API - COUNTS
// =============================================================================

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

export async function countInstitutions(): Promise<number> {
  const data = await getCache();
  return (data.institutions || []).filter(i => i.status === 'PUBLISHED').length;
}

export async function countInstitutionsByCity(cityId: string): Promise<number> {
  const data = await getCache();
  return (data.institutions || []).filter(i => i.cityId === cityId && i.status === 'PUBLISHED').length;
}

export async function countObjectTypes(): Promise<number> {
  const data = await getCache();
  return (data.objectTypes || []).length;
}

export async function countGenres(): Promise<number> {
  const data = await getCache();
  return (data.genres || []).length;
}

export async function countSubjectTerms(): Promise<number> {
  const data = await getCache();
  return (data.subjectTerms || []).length;
}

// =============================================================================
// LEGACY COMPATIBILITY
// =============================================================================

/** @deprecated Use getArtistsByObjectType instead */
export const getArtistsByMedium = getArtistsByObjectType;

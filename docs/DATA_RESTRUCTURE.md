# Morocco Art Archive — Data Model Restructure
## Following Museum/Curatorial Standards

---

## Current Problems

| Issue | Current State | Problem |
|-------|--------------|---------|
| Object Type vs Medium | `medium` field = "PAINTING" or "PHOTOGRAPHY" | Conflates physical form with materials |
| Materials | `materialsAndTechniques` exists but underused | Should be primary medium field |
| Genre | Missing entirely | Subject classification (Portrait, Landscape) buried in Themes |
| Themes | Mixes 4 different things | SUBJECT, STYLE, TECHNIQUE, CONCEPTUAL all in one table |
| Subject Terms | Missing | No controlled vocabulary for depicted content |

---

## Proposed Structure (Getty/Museum Standard)

### 1. OBJECT TYPES (Lookup Table)
The physical form of the artwork.

| id | slug | name | description |
|----|------|------|-------------|
| obj-1 | painting | Painting | Pigment applied to surface |
| obj-2 | photograph | Photograph | Light-captured image |
| obj-3 | print | Print | Lithograph, screenprint, etching |
| obj-4 | drawing | Drawing | Pencil, charcoal, ink on paper |
| obj-5 | sculpture | Sculpture | Three-dimensional form |
| obj-6 | mixed-media | Mixed Media | Multiple materials combined |
| obj-7 | installation | Installation | Site-specific or immersive work |
| obj-8 | video | Video | Time-based moving image |
| obj-9 | textile | Textile | Woven, embroidered, fiber art |

---

### 2. GENRES (Lookup Table)
Traditional art historical subject classification.

| id | slug | name | description |
|----|------|------|-------------|
| gen-1 | portrait | Portrait | Representation of a person or group |
| gen-2 | landscape | Landscape | Natural scenery, rural views |
| gen-3 | cityscape | Cityscape | Urban scenes, architecture, medina views |
| gen-4 | still-life | Still Life | Inanimate objects arranged |
| gen-5 | genre-scene | Genre Scene | Scenes of everyday life |
| gen-6 | history | History/Narrative | Historical, religious, mythological events |
| gen-7 | abstract | Abstract | Non-representational |
| gen-8 | figurative | Figurative | Human form, not portrait-focused |
| gen-9 | documentary | Documentary | Recording real events/conditions |

---

### 3. MOVEMENTS (Keep, Enhance)
Art historical periods, schools, and stylistic groupings.

| id | slug | name | periodStart | periodEnd | description |
|----|------|------|-------------|-----------|-------------|
| mov-1 | casablanca-school | Casablanca School | 1962 | 1974 | ... |
| mov-2 | presence-plastique | Présence Plastique | 1966 | 1971 | ... |
| mov-3 | naive-art | Naïve Art Movement | 1950 | 1980 | ... |
| mov-4 | post-independence-modernism | Post-Independence Modernism | 1956 | 1985 | ... |
| mov-5 | photography-pioneers | Moroccan Photography Pioneers | 1900 | 1960 | ... |
| mov-6 | contemporary | Contemporary Moroccan Art | 1990 | - | ... |

---

### 4. THEMES (Interpretive/Curatorial Only)
Conceptual and interpretive frameworks — the curatorial lens.

| id | slug | name | description |
|----|------|------|-------------|
| thm-1 | identity | Identity | Personal, cultural, national identity |
| thm-2 | memory | Memory | Collective memory, nostalgia, loss |
| thm-3 | diaspora | Diaspora | Migration, exile, displacement |
| thm-4 | tradition-modernity | Tradition & Modernity | Tension between heritage and change |
| thm-5 | postcolonialism | Postcolonialism | Colonial legacy, decolonization |
| thm-6 | feminism | Feminism & Gender | Women's experience, gender roles |
| thm-7 | spirituality | Spirituality | Sacred, mystical, Sufi traditions |
| thm-8 | urbanization | Urbanization | City growth, rural-urban migration |
| thm-9 | globalization | Globalization | Cross-cultural exchange, homogenization |
| thm-10 | ecology | Ecology & Land | Environmental concerns, relationship to earth |

---

### 5. SUBJECT TERMS (New — Controlled Vocabulary)
What is depicted — iconographic content. Many-to-many with Artworks.

| id | slug | name | category |
|----|------|------|----------|
| subj-1 | medina | Medina | PLACE |
| subj-2 | souk | Souk/Market | PLACE |
| subj-3 | atlas-mountains | Atlas Mountains | PLACE |
| subj-4 | desert | Desert/Sahara | PLACE |
| subj-5 | coast | Coast/Sea | PLACE |
| subj-6 | amazigh | Amazigh/Berber | PEOPLE |
| subj-7 | women | Women | PEOPLE |
| subj-8 | craftspeople | Craftspeople/Artisans | PEOPLE |
| subj-9 | musicians | Musicians | PEOPLE |
| subj-10 | children | Children | PEOPLE |
| subj-11 | calligraphy | Calligraphy/Script | MOTIF |
| subj-12 | geometric | Geometric Patterns | MOTIF |
| subj-13 | textiles | Textiles/Carpets | OBJECT |
| subj-14 | architecture | Architecture | OBJECT |
| subj-15 | ritual | Ritual/Ceremony | ACTIVITY |
| subj-16 | labor | Labor/Work | ACTIVITY |

---

### 6. REVISED ARTWORKS TABLE

```
Artworks
├── id
├── slug
├── title
├── titleAr
├── artistId → Artists
├── objectTypeId → ObjectTypes (NEW - replaces "medium")
├── genreId → Genres (NEW)
├── medium (text) — Materials: "Oil on canvas", "Chromogenic print"
├── dimensions
├── year
├── yearEnd
├── description
├── currentLocation
├── imageUrl
├── isIconic
├── movementId → Movements
├── status
```

**Junction Tables:**
- ArtworkThemes (artworkId, themeId)
- ArtworkSubjects (artworkId, subjectId) — NEW
- ArtworkCities (artworkId, cityId, relationType)

---

### 7. REVISED ARTISTS TABLE

```
Artists
├── id
├── slug
├── name
├── nameAr
├── primaryObjectType → ObjectTypes (NEW - "primarily a painter")
├── birthYear
├── deathYear
├── birthPlaceId → Cities
├── basedInId → Cities
├── biographyShort
├── biography
├── activePeriodStart
├── activePeriodEnd
├── photoUrl
├── websiteUrl
├── status
```

**Junction Tables:**
- ArtistMovements (artistId, movementId)
- ArtistThemes (artistId, themeId)
- ArtistObjectTypes (artistId, objectTypeId) — for artists working in multiple forms

---

## Migration Map

### Current Themes → New Location

| Current Theme | Current Category | New Location |
|--------------|------------------|--------------|
| Portrait | SUBJECT | **Genre**: Portrait |
| Landscape | SUBJECT | **Genre**: Landscape |
| Street | SUBJECT | **Genre**: Cityscape + **Subject**: Medina/Souk |
| Daily Life | SUBJECT | **Genre**: Genre Scene |
| Ritual | SUBJECT | **Subject Term**: Ritual |
| Body | SUBJECT | **Genre**: Figurative |
| Identity | CONCEPTUAL | **Theme**: Identity ✓ |
| Diaspora | CONCEPTUAL | **Theme**: Diaspora ✓ |
| Memory | CONCEPTUAL | **Theme**: Memory ✓ |
| Tradition & Modernity | CONCEPTUAL | **Theme**: Tradition & Modernity ✓ |
| Colonialism | CONCEPTUAL | **Theme**: Postcolonialism ✓ |
| Feminism | CONCEPTUAL | **Theme**: Feminism ✓ |
| Spirituality | CONCEPTUAL | **Theme**: Spirituality ✓ |
| Abstraction | STYLE | **Genre**: Abstract |
| Figuration | STYLE | **Genre**: Figurative |
| Calligraphic | STYLE | **Subject Term**: Calligraphy + Movement context |
| Expressionism | STYLE | Movement association (if applicable) |
| Documentary | TECHNIQUE | **Genre**: Documentary |
| Staged | TECHNIQUE | Process note in description |
| Mixed Media | TECHNIQUE | **Object Type**: Mixed Media |

---

## New Sheet Structure

1. **ObjectTypes** — lookup
2. **Genres** — lookup  
3. **Movements** — enhanced
4. **Themes** — cleaned (conceptual only)
5. **SubjectTerms** — new controlled vocabulary
6. **Cities** — keep
7. **Institutions** — keep
8. **Artists** — revised
9. **Artworks** — revised
10. **ArtistMovements** — keep
11. **ArtistThemes** — keep
12. **ArtistObjectTypes** — new
13. **ArtworkThemes** — keep
14. **ArtworkSubjects** — new
15. **ArtworkCities** — keep
16. **IconicImages** — keep

---

## Benefits

1. **Proper faceted search**: Filter by Object Type, Genre, Movement, Theme, Subject independently
2. **Getty/AAT compatible**: Aligns with Art & Architecture Thesaurus standards
3. **Scalable**: Easy to add new terms without restructuring
4. **Curatorial clarity**: Theme = interpretation, Genre = classification, Subject = iconography
5. **AI-ready**: Clean structured data for machine learning and semantic search

# Database Schema & Relationships

## Entity Relationship Diagram (Text-Based)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CORE ENTITIES                                  │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────┐       1:N        ┌──────────────┐
│    Artist    │─────────────────►│   Artwork    │
│              │                  │              │
│ id           │                  │ id           │
│ slug         │                  │ slug         │
│ name         │                  │ title        │
│ medium       │                  │ medium       │
│ birthYear    │                  │ year         │
│ deathYear    │                  │ artistId ────┼──► FK to Artist
│ biography    │                  │ movementId ──┼──► FK to Movement
│ ...          │                  │ ...          │
└──────┬───────┘                  └──────┬───────┘
       │                                 │
       │ M:N                             │ M:N
       │                                 │
       ▼                                 ▼
┌──────────────┐                  ┌──────────────┐
│    City      │                  │    Theme     │
│              │                  │              │
│ id           │                  │ id           │
│ slug         │                  │ slug         │
│ name         │                  │ name         │
│ region       │                  │ category     │
└──────────────┘                  └──────────────┘

┌──────────────┐
│   Movement   │
│              │
│ id           │
│ slug         │
│ name         │
│ periodStart  │
│ periodEnd    │
└──────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│                         JOIN TABLES (M:N)                                │
└─────────────────────────────────────────────────────────────────────────┘

Artist ◄──────► City          via   artist_cities
Artist ◄──────► Theme         via   artist_themes
Artist ◄──────► Movement      via   artist_movements
Artist ◄──────► Artist        via   artist_relations (self-referential)

Artwork ◄─────► Theme         via   artwork_themes
Artwork ◄─────► City          via   artwork_cities


┌─────────────────────────────────────────────────────────────────────────┐
│                         SUPPORTING ENTITIES                              │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────┐       1:1        ┌──────────────┐
│   Artwork    │─────────────────►│ IconicImage  │
│ (isIconic)   │                  │              │
│              │                  │ subject      │
│              │                  │ significance │
└──────────────┘                  └──────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│                         USER & ACCESS (FUTURE)                           │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────┐       1:N        ┌──────────────┐
│    User      │─────────────────►│ SavedArtist  │
│              │                  │ SavedWork    │
│ id           │                  │ SavedSearch  │
│ email        │                  │ ApiKey       │
│ tier         │                  │              │
└──────────────┘                  └──────────────┘
```

## Relationship Details

### Artist ↔ City (Many-to-Many)
```
artist_cities {
  artistId   → Artist.id
  cityId     → City.id
  relationType: BORN | BASED | WORKED
}
```
An artist can be associated with multiple cities with different relationship types.

### Artist ↔ Theme (Many-to-Many)
```
artist_themes {
  artistId   → Artist.id
  themeId    → Theme.id
}
```
Artists are tagged with themes that characterize their work.

### Artist ↔ Movement (Many-to-Many)
```
artist_movements {
  artistId   → Artist.id
  movementId → Movement.id
}
```
Artists can belong to multiple movements throughout their career.

### Artist ↔ Artist (Self-Referential Many-to-Many)
```
artist_relations {
  fromArtistId → Artist.id
  toArtistId   → Artist.id
  relationType: CONTEMPORARY | INFLUENCED_BY | TEACHER_STUDENT | COLLABORATED
}
```
Captures relationships between artists.

### Artwork ↔ Theme (Many-to-Many)
```
artwork_themes {
  artworkId  → Artwork.id
  themeId    → Theme.id
}
```
Individual artworks are tagged with relevant themes.

### Artwork ↔ City (Many-to-Many)
```
artwork_cities {
  artworkId  → Artwork.id
  cityId     → City.id
  relationType: DEPICTED | CREATED
}
```
Artworks can be associated with cities (where created or what they depict).

### Artwork → Artist (Many-to-One)
```
Artwork.artistId → Artist.id
```
Each artwork belongs to exactly one artist.

### Artwork → Movement (Many-to-One, Optional)
```
Artwork.movementId → Movement.id (nullable)
```
An artwork may optionally be associated with a movement.

### Artwork → IconicImage (One-to-One, Optional)
```
IconicImage.artworkId → Artwork.id (unique)
```
Only artworks with `isIconic = true` have associated IconicImage details.

## Query Patterns

### Cross-Entity Search Query
Find all photographers from Casablanca who worked on identity themes in the post-independence era:

```sql
SELECT DISTINCT a.*
FROM artists a
JOIN artist_cities ac ON a.id = ac.artist_id
JOIN cities c ON ac.city_id = c.id
JOIN artist_themes at ON a.id = at.artist_id
JOIN themes t ON at.theme_id = t.id
WHERE a.medium IN ('PHOTOGRAPHY', 'BOTH')
  AND a.status = 'PUBLISHED'
  AND c.slug = 'casablanca'
  AND t.slug = 'identity'
  AND a.active_period_start >= 1956
  AND (a.active_period_end <= 1980 OR a.active_period_end IS NULL);
```

### Related Artists Query
Find artists related by movement, era, or city:

```sql
-- By shared movement
SELECT DISTINCT a2.*
FROM artists a1
JOIN artist_movements am1 ON a1.id = am1.artist_id
JOIN artist_movements am2 ON am1.movement_id = am2.movement_id
JOIN artists a2 ON am2.artist_id = a2.id
WHERE a1.slug = 'artist-slug'
  AND a2.id != a1.id
  AND a2.status = 'PUBLISHED';
```

## Indexes

Key indexes for query performance:

```sql
-- Artist lookups
CREATE INDEX idx_artists_slug ON artists(slug);
CREATE INDEX idx_artists_medium ON artists(medium);
CREATE INDEX idx_artists_status ON artists(status);
CREATE INDEX idx_artists_period ON artists(active_period_start);

-- Artwork lookups
CREATE INDEX idx_artworks_slug ON artworks(slug);
CREATE INDEX idx_artworks_artist ON artworks(artist_id);
CREATE INDEX idx_artworks_medium ON artworks(medium);
CREATE INDEX idx_artworks_year ON artworks(year);
CREATE INDEX idx_artworks_iconic ON artworks(is_iconic);

-- Full-text search (PostgreSQL)
CREATE INDEX idx_artists_name_fts ON artists USING GIN(to_tsvector('english', name));
CREATE INDEX idx_artworks_title_fts ON artworks USING GIN(to_tsvector('english', title));
```

## Access Control

Content access is controlled by two fields:

1. **ContentStatus**: Controls visibility
   - `DRAFT`: Not visible to any user
   - `PUBLISHED`: Visible per access tier rules
   - `ARCHIVED`: Hidden but preserved

2. **AccessTier**: Controls detail level
   - `FREE`: Basic information visible to all
   - `PREMIUM`: Full details for premium users

Query pattern for access control:

```sql
-- Free tier: limited data
SELECT id, slug, name, biography_short, medium
FROM artists
WHERE status = 'PUBLISHED';

-- Premium tier: full data
SELECT *
FROM artists
WHERE status = 'PUBLISHED';
```

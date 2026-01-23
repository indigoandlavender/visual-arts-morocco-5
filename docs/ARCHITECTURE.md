# Morocco Art Archive — Architecture Overview

## Project Structure

```
moroccan-art-platform/
├── prisma/
│   └── schema.prisma              # Database schema (Prisma ORM)
│
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── (main)/                # Main route group
│   │   │   ├── layout.tsx         # Shared layout
│   │   │   ├── page.tsx           # Homepage
│   │   │   ├── artists/
│   │   │   │   ├── page.tsx       # Artists index
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx   # Artist detail
│   │   │   ├── works/
│   │   │   │   ├── page.tsx       # Works index
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx   # Work detail
│   │   │   ├── photography/
│   │   │   │   └── page.tsx       # Photography overview
│   │   │   ├── painting/
│   │   │   │   └── page.tsx       # Painting overview
│   │   │   ├── movements/
│   │   │   │   ├── page.tsx       # Movements index
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx   # Movement detail
│   │   │   ├── themes/
│   │   │   │   ├── page.tsx       # Themes index
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx   # Theme detail
│   │   │   ├── cities/
│   │   │   │   ├── page.tsx       # Cities index
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx   # City detail
│   │   │   ├── search/
│   │   │   │   └── page.tsx       # Search interface
│   │   │   ├── timeline/
│   │   │   │   └── page.tsx       # Chronological view
│   │   │   ├── about/
│   │   │   │   └── page.tsx       # About page
│   │   │   └── methodology/
│   │   │       └── page.tsx       # Editorial standards
│   │   │
│   │   └── api/
│   │       └── v1/
│   │           ├── artists/
│   │           │   ├── route.ts   # GET /api/v1/artists
│   │           │   └── [id]/
│   │           │       └── route.ts
│   │           ├── works/
│   │           │   ├── route.ts   # GET /api/v1/works
│   │           │   └── [id]/
│   │           │       └── route.ts
│   │           ├── search/
│   │           │   └── route.ts   # GET /api/v1/search
│   │           └── export/
│   │               └── route.ts   # GET /api/v1/export (future)
│   │
│   ├── lib/
│   │   ├── db/
│   │   │   └── client.ts          # Prisma client singleton
│   │   ├── queries/
│   │   │   ├── index.ts           # Query exports
│   │   │   ├── artists.ts         # Artist queries
│   │   │   ├── artworks.ts        # Artwork queries
│   │   │   ├── movements.ts       # Movement queries
│   │   │   ├── themes.ts          # Theme queries
│   │   │   └── cities.ts          # City queries
│   │   ├── search/
│   │   │   ├── index.ts           # Search exports
│   │   │   ├── engine.ts          # Search execution
│   │   │   └── query-builder.ts   # Query parsing/building
│   │   ├── seo/
│   │   │   ├── index.ts           # SEO exports
│   │   │   ├── metadata.ts        # Page metadata generators
│   │   │   └── json-ld.ts         # Structured data generators
│   │   ├── permissions/
│   │   │   └── index.ts           # Access control (future)
│   │   ├── auth/                  # Authentication (future)
│   │   └── utils/                 # Utility functions
│   │
│   ├── types/
│   │   ├── index.ts               # Core type definitions
│   │   └── search.ts              # Search-specific types
│   │
│   ├── components/                # React components (structure only)
│   │   ├── artists/
│   │   ├── works/
│   │   ├── search/
│   │   ├── filters/
│   │   ├── layout/
│   │   └── shared/
│   │
│   └── config/
│       └── constants.ts           # Application constants
│
├── docs/
│   ├── DATABASE.md                # Database documentation
│   └── ARCHITECTURE.md            # This file
│
└── .env.example                   # Environment variables template
```

## Route Map

### Public Pages

| Route | Page Type | Purpose |
|-------|-----------|---------|
| `/` | Homepage | Entry point, featured content |
| `/photography` | Medium Index | Photography overview & photographers |
| `/painting` | Medium Index | Painting overview & painters |
| `/artists` | Entity Index | Searchable artist directory |
| `/artists/[slug]` | Entity Detail | Individual artist profile |
| `/works` | Entity Index | Searchable artwork directory |
| `/works/[slug]` | Entity Detail | Individual artwork page |
| `/movements` | Entity Index | Art movements directory |
| `/movements/[slug]` | Entity Detail | Individual movement page |
| `/themes` | Entity Index | Thematic categories |
| `/themes/[slug]` | Entity Detail | Theme aggregate view |
| `/cities` | Entity Index | Geographic directory |
| `/cities/[slug]` | Entity Detail | City aggregate view |
| `/search` | Search | Unified search interface |
| `/timeline` | Navigation | Chronological exploration |
| `/about` | Static | About the platform |
| `/methodology` | Static | Editorial standards |

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/artists` | GET | List/search artists |
| `/api/v1/artists/[id]` | GET | Get artist by ID or slug |
| `/api/v1/works` | GET | List/search artworks |
| `/api/v1/works/[id]` | GET | Get artwork by ID or slug |
| `/api/v1/search` | GET | Unified search |
| `/api/v1/search?autocomplete=` | GET | Autocomplete suggestions |
| `/api/v1/export` | GET | Data export (institutional) |

## Search Architecture

### Query Flow

```
URL Parameters
     │
     ▼
┌─────────────────┐
│  parseURLParams │  → Convert URL to SearchQuery
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ validateQuery   │  → Sanitize and validate
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ executeSearch   │  → Run parallel queries
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌───────┐ ┌───────┐
│Artists│ │Artworks│  → Entity-specific search
└───┬───┘ └───┬───┘
    │         │
    └────┬────┘
         ▼
┌─────────────────┐
│  Merge & Sort   │  → Combine results by relevance
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Paginate      │  → Apply page/limit
└────────┬────────┘
         │
         ▼
   SearchResultSet
```

### Filter Dimensions

| Dimension | Type | Applies To |
|-----------|------|------------|
| `medium` | Single/Multi Select | Artists, Artworks |
| `period` | Range/Buckets | Artists, Artworks |
| `city` | Multi Select | Artists, Artworks |
| `theme` | Multi Select | Artists, Artworks |
| `movement` | Multi Select | Artists, Artworks |
| `artist` | Autocomplete | Artworks only |
| `iconic` | Boolean | Artworks only |
| `moroccanConnection` | Multi Select | Artists only |

### URL Query Pattern

```
/search?q=keyword&medium=photography&city=casablanca,tangier&period=1956-1980&type=artists&page=1&limit=24&sort=relevance
```

## Paywall Integration Points

### Content Level

| Feature | Free | Premium | Institutional |
|---------|------|---------|---------------|
| Artist basic info | ✓ | ✓ | ✓ |
| Artist full biography | ✗ | ✓ | ✓ |
| External references | ✗ | ✓ | ✓ |
| Works per artist | 3 | All | All |
| High-res images | ✗ | ✓ | ✓ |
| Advanced filters | ✗ | ✓ | ✓ |
| Data export | ✗ | ✗ | ✓ |
| API access | ✗ | ✗ | ✓ |

### Implementation Hooks

```typescript
// In queries
const artist = await getArtistBySlug(slug);
const filteredArtist = applyAccessFilter(artist, userTier);

// In components
{shouldShowPaywall('full_biography', userTier) ? (
  <PaywallPrompt feature="full_biography" />
) : (
  <Biography text={artist.biography} />
)}
```

## SEO Strategy

### Per-Page Metadata

Each page type has dedicated metadata generation:

```typescript
// Artist page
export async function generateMetadata({ params }) {
  const artist = await getArtistBySlug(params.slug);
  return generateArtistMetadata(artist);
}
```

### JSON-LD Structured Data

Every detail page includes appropriate schema:

- **Artist**: `schema.org/Person`
- **Artwork**: `schema.org/VisualArtwork`
- **Movement**: `schema.org/VisualArtsEvent`
- **City**: `schema.org/City`
- **Homepage**: `schema.org/WebSite` with SearchAction

### Canonical URLs

All pages have canonical URLs to prevent duplicate content:

```typescript
alternates: {
  canonical: `${SITE_URL}/artists/${artist.slug}`,
}
```

## Data Flow

### Server Components (Default)

```
Page Request
     │
     ▼
Server Component
     │
     ├── Query Database (via Prisma)
     │
     ├── Generate Metadata
     │
     ├── Generate JSON-LD
     │
     └── Render HTML
           │
           ▼
      Response to Client
```

### Client Interactions

```
User Action (Filter Change)
     │
     ▼
URL Update (via router.push)
     │
     ▼
Page Re-render (Server Component)
     │
     ▼
New Query Execution
     │
     ▼
Updated Results
```

## Future Considerations

### User Accounts

```
User → Session → Tier → Permissions → Content Access
```

### Saved Items

```
User → SavedArtist/SavedWork/SavedSearch → Quick Access
```

### API Keys (Institutional)

```
User (Institutional) → ApiKey → Rate-Limited API Access
```

### Content Workflow

```
Draft → Review → Published → Archived
```

# Seed Data Reference

## Overview

The seed script (`prisma/seed.ts`) populates the database with realistic test data for Moroccan visual art. All data is historically accurate and representative of the actual Moroccan art scene.

## Data Summary

| Entity | Count | Description |
|--------|-------|-------------|
| Cities | 10 | 8 Moroccan + 2 diaspora (Paris, New York) |
| Themes | 20 | Organized by category (Subject, Concept, Style, Technique) |
| Movements | 6 | Key periods in Moroccan art history |
| Artists | 15 | Painters and photographers (1929-present) |
| Artworks | 22 | Canonical works with full metadata |
| Users | 3 | Test users for each tier (Free, Premium, Institutional) |

## Running the Seed

```bash
# Prerequisites: Node.js 20+, PostgreSQL running

# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your DATABASE_URL

# 3. Generate Prisma client
npm run db:generate

# 4. Push schema to database
npm run db:push

# 5. Run seed
npm run db:seed

# Alternative: Reset and reseed
npm run db:reset
```

## Artists Included

### Painters

| Name | Years | Movement | Key Themes |
|------|-------|----------|------------|
| Farid Belkahia | 1934-2014 | Casablanca School | Abstraction, Berber symbols, leather works |
| Mohamed Melehi | 1936-2020 | Casablanca School | Wave motif, Op Art influence |
| Mohamed Chabâa | 1935-2013 | Casablanca School | Geometric abstraction, murals |
| Chaïbia Talal | 1929-2004 | Naïve Art | Women, daily life, vibrant colors |
| Ahmed Cherkaoui | 1934-1967 | Post-Independence | Berber signs, abstraction |
| Mahi Binebine | 1959- | Contemporary | Migration, fragmented figures |
| Mohamed Kacimi | 1942-2003 | Post-Independence | Lyrical abstraction, spirituality |
| Mohamed Abouelouakar | 1939- | Post-Independence | Abstract expressionism |

### Photographers

| Name | Years | Focus | Key Themes |
|------|-------|-------|------------|
| Lalla Essaydi | 1956- | Fine Art | Orientalism critique, calligraphy on bodies |
| Daoud Aoulad-Syad | 1953- | Documentary | Moroccan life, black-and-white |
| Hicham Benohoud | 1968- | Conceptual | Staged, surreal, classroom series |
| Yto Barrada | 1971- | Documentary/Art | Tangier, migration, urbanism |
| Hassan Hajjaj | 1961- | Pop Art | Portraits, African aesthetics |
| Leila Alaoui | 1982-2016 | Documentary | Moroccan identity, migration |

## Movements Included

1. **Casablanca School** (1962-1974)
   - Key figures: Belkahia, Melehi, Chabâa
   - Rejected orientalism, sought Moroccan modernism

2. **Présence Plastique** (1966-1971)
   - Collective exhibitions
   - Social engagement through art

3. **Naïve Art Movement** (1950-1980)
   - Self-taught artists
   - Chaïbia Talal as key figure

4. **Post-Independence Modernism** (1956-1985)
   - National identity formation
   - Dialogue with Western modernism

5. **Moroccan Photography Pioneers** (1900-1960)
   - Colonial to independence documentation

6. **Contemporary Moroccan Art** (1990-present)
   - International presence
   - Diverse media, diaspora perspectives

## Themes Taxonomy

### Subject Matter
- Portrait, Landscape, Street, Daily Life, Ritual, Body

### Conceptual
- Identity, Diaspora, Memory, Tradition & Modernity, Colonialism, Feminism, Spirituality

### Style
- Abstraction, Figuration, Calligraphic, Expressionism

### Technique
- Documentary, Staged, Mixed Media

## Cities

### Morocco
- Casablanca (artistic hub)
- Marrakech (galleries, biennale)
- Tangier (international influence)
- Rabat (national museum)
- Fez (traditional heritage)
- Tetouan (art school)
- Essaouira (artists' community)
- Asilah (cultural festival)

### Diaspora
- Paris (major Moroccan artist presence)
- New York (contemporary art market)

## Test Users

| Email | Tier | Purpose |
|-------|------|---------|
| test@moroccoartarchive.com | FREE | Basic access testing |
| premium@moroccoartarchive.com | PREMIUM | Full content testing |
| institution@museum.org | INSTITUTIONAL | API/export testing |

## Relationships Created

The seed establishes:
- Artist ↔ City connections (birth, based, worked)
- Artist ↔ Theme associations
- Artist ↔ Movement memberships
- Artist ↔ Artist relationships (contemporary, influenced by, collaborated)
- Artwork ↔ Theme tags
- Artwork ↔ City associations (created, depicted)
- Iconic Image details for key works

## Iconic Works

The following artworks have `isIconic: true` with detailed IconicImage records:

1. **Converging Territories #1** (Lalla Essaydi, 2003)
   - Challenges orientalist imagery, Arab women's identity

2. **Kesh Angels** (Hassan Hajjaj, 2010)
   - Modern Moroccan women, pop aesthetic

3. **The Moroccans #1** (Leila Alaoui, 2011)
   - National identity documentation

Additional iconic works without detailed records:
- Hommage à Gaston Bachelard (Belkahia)
- Composition with Waves (Melehi)
- Femmes au marché (Chaïbia)
- Signes Berbères (Cherkaoui)
- Les Migrants (Binebine)
- Marrakech Medina (Aoulad-Syad)
- The Classroom #1 (Benohoud)
- Ferry, Tangier (Barrada)
- Lumière Intérieure (Kacimi)

## Extending the Seed

To add more data, modify `prisma/seed.ts`:

```typescript
// Add new artist
prisma.artist.create({
  data: {
    slug: 'new-artist-name',
    name: 'New Artist Name',
    medium: 'PAINTING',
    // ... other fields
  },
});

// Add relationships
prisma.artistCity.create({
  data: {
    artistId: artistMap['new-artist-name'].id,
    cityId: cityMap['casablanca'].id,
    relationType: 'BASED',
  },
});
```

Re-run seed after modifications:

```bash
npm run db:seed
```

Note: The seed script clears existing data before inserting. For incremental additions, comment out the deletion block.

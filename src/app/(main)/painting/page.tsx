// =============================================================================
// Painting Index Page
// Moroccan Art Platform
// =============================================================================

import type { Metadata } from 'next';
import { getArtistsByMedium, getArtistCount } from '@/lib/queries/artists';
import { getIconicWorks, getArtworkCount } from '@/lib/queries/artworks';
import { getMovements } from '@/lib/queries/movements';

export const metadata: Metadata = {
  title: 'Moroccan Painting | Morocco Art Archive',
  description:
    'Explore Moroccan painters and notable paintings. A comprehensive database of painting in Morocco from traditional to contemporary.',
  alternates: {
    canonical: 'https://moroccoartarchive.com/painting',
  },
};

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default async function PaintingPage() {
  // Fetch data in parallel
  const [
    paintersResult,
    notablePaintings,
    painterCount,
    paintingCount,
    movements,
  ] = await Promise.all([
    getArtistsByMedium('PAINTING', { limit: 24 }),
    getIconicWorks({ medium: 'PAINTING' as any, limit: 6 }),
    getArtistCount({ medium: 'PAINTING' as any }),
    getArtworkCount({ medium: 'PAINTING' as any }),
    getMovements({ limit: 10 }),
  ]);

  return (
    <div>
      {/* Section 1: Introduction */}
      <section data-section="introduction">
        {/*
          Content:
          - Title: "Moroccan Painting"
          - Description: Overview of painting in Morocco (200-300 words)
          - Scope: Traditional, modern, contemporary
          - Historical context: Pre-colonial to present
        */}
      </section>

      {/* Section 2: Statistics */}
      <section data-section="statistics">
        {/*
          Data:
          - Painters: {painterCount}
          - Paintings: {paintingCount}
        */}
      </section>

      {/* Section 3: Key Painters */}
      <section data-section="painters">
        {/*
          Data: {paintersResult.data}
          Display: Grid of painter cards
          Links:
          - Each painter → /artists/[slug]
          - "View All Painters" → /artists?medium=painting
        */}
      </section>

      {/* Section 4: Timeline / Historical Periods */}
      <section data-section="timeline">
        {/*
          Content: Major periods in Moroccan painting
          - Pre-independence era
          - Casablanca School (1960s)
          - Post-independence modernism
          - Contemporary period

          Note: Key historical context for understanding Moroccan painting
        */}
      </section>

      {/* Section 5: Notable Paintings */}
      <section data-section="notable-works">
        {/*
          Data: {notablePaintings.data}
          Display: Featured notable paintings
          Links:
          - Each painting → /works/[slug]
          - "View All Notable Paintings" → /works?medium=painting&iconic=true
        */}
      </section>

      {/* Section 6: Thematic Groupings */}
      <section data-section="themes">
        {/*
          Categories:
          - Abstraction
          - Figuration
          - Calligraphic / Sign-based
          - Landscape
          - Portrait
          - Identity / Diaspora

          Links: Each theme → /themes/[slug]?medium=painting
        */}
      </section>

      {/* Section 7: Movements */}
      <section data-section="movements">
        {/*
          Data: {movements.data} filtered for painting relevance
          Key movements:
          - Casablanca School
          - Presence Plastique
          - Contemporary movements

          Links: Each movement → /movements/[slug]
        */}
      </section>

      {/* Section 8: Browse by City */}
      <section data-section="cities">
        {/*
          Links to cities with significant painting scenes:
          - Casablanca (artistic hub)
          - Marrakech
          - Tangier
          - Rabat
          - Asilah
        */}
      </section>

      {/* Section 9: Search CTA */}
      <section data-section="search-cta">
        {/*
          Link: /search?medium=painting
        */}
      </section>
    </div>
  );
}

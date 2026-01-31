export const dynamic = 'force-dynamic';
// =============================================================================
// Painting Index Page
// Moroccan Art Platform
// =============================================================================

import type { Metadata } from 'next';
import {
  getArtistsByObjectType,
  getArtworksByObjectType,
  getMovements,
  countArtists,
  countArtworks,
} from '@/lib/queries';

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
    painters,
    paintingWorks,
    movements,
    totalArtists,
    totalArtworks,
  ] = await Promise.all([
    getArtistsByObjectType('obj-1'), // painting
    getArtworksByObjectType('obj-1'),
    getMovements(),
    countArtists(),
    countArtworks(),
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
          - Painters: {painters.length}
          - Paintings: {paintingWorks.length}
        */}
      </section>

      {/* Section 3: Key Painters */}
      <section data-section="painters">
        {/*
          Data: {painters}
          Display: Grid of painter cards
          Links:
          - Each painter → /artists/[slug]
          - "View All Painters" → /artists?objectType=painting
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
          Data: {paintingWorks}
          Display: Featured notable paintings
          Links:
          - Each painting → /works/[slug]
          - "View All Notable Paintings" → /works?objectType=painting&iconic=true
        */}
      </section>

      {/* Section 6: Genre Groupings */}
      <section data-section="genres">
        {/*
          Categories:
          - Abstract
          - Figurative
          - Portrait
          - Landscape
          - Genre Scene

          Links: Each genre → /genres/[slug]?objectType=painting
        */}
      </section>

      {/* Section 7: Movements */}
      <section data-section="movements">
        {/*
          Data: {movements} filtered for painting relevance
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
          Link: /search?objectType=painting
        */}
      </section>
    </div>
  );
}

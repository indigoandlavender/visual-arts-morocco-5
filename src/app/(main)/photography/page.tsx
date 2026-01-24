export const dynamic = 'force-dynamic';
// =============================================================================
// Photography Index Page
// Moroccan Art Platform
// =============================================================================

import type { Metadata } from 'next';
import {
  getArtistsByMedium,
  getIconicWorks,
  getMovements,
  countArtists,
  countArtworks,
} from '@/lib/queries';

export const metadata: Metadata = {
  title: 'Moroccan Photography | Morocco Art Archive',
  description:
    'Explore Moroccan photographers and iconic photographs. A comprehensive database of photography in Morocco.',
  alternates: {
    canonical: 'https://moroccoartarchive.com/photography',
  },
};

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default async function PhotographyPage() {
  // Fetch data in parallel
  const [
    photographers,
    iconicPhotos,
    movements,
    totalArtists,
    totalArtworks,
  ] = await Promise.all([
    getArtistsByMedium('PHOTOGRAPHY'),
    getIconicWorks(),
    getMovements(),
    countArtists(),
    countArtworks(),
  ]);

  // Filter for photography
  const photographyWorks = iconicPhotos.filter(w => w.medium === 'PHOTOGRAPHY');

  return (
    <div>
      {/* Section 1: Introduction */}
      <section data-section="introduction">
        {/*
          Content:
          - Title: "Moroccan Photography"
          - Description: Overview of photography in Morocco (200-300 words)
          - Scope: Documentary, portrait, street, landscape, etc.
          - Historical context: Colonial era to contemporary
        */}
      </section>

      {/* Section 2: Statistics */}
      <section data-section="statistics">
        {/*
          Data:
          - Photographers: {photographers.length}
          - Photographs: {photographyWorks.length}
        */}
      </section>

      {/* Section 3: Key Photographers */}
      <section data-section="photographers">
        {/*
          Data: {photographers}
          Display: Grid of photographer cards
          Links:
          - Each photographer → /artists/[slug]
          - "View All Photographers" → /artists?medium=photography
        */}
      </section>

      {/* Section 4: Timeline Markers */}
      <section data-section="timeline">
        {/*
          Content: Major periods/events in Moroccan photography
          - Colonial era documentation
          - Independence period
          - Contemporary photography
          Note: Static content or derived from movements
        */}
      </section>

      {/* Section 5: Iconic Photographs */}
      <section data-section="iconic-works">
        {/*
          Data: {photographyWorks}
          Display: Featured iconic images with cultural context
          Links:
          - Each photo → /works/[slug]
          - "View All Iconic Photos" → /works?medium=photography&iconic=true
        */}
      </section>

      {/* Section 6: Thematic Groupings */}
      <section data-section="themes">
        {/*
          Categories:
          - Documentary
          - Portrait
          - Street Photography
          - Landscape
          - Fashion
          - Political

          Links: Each theme → /themes/[slug]?medium=photography
        */}
      </section>

      {/* Section 7: Related Movements */}
      <section data-section="movements">
        {/*
          Data: {movements} filtered for photography relevance
          Links: Each movement → /movements/[slug]
        */}
      </section>

      {/* Section 8: Browse by City */}
      <section data-section="cities">
        {/*
          Links to cities with significant photography:
          - Casablanca
          - Marrakech
          - Tangier
          - Fez
          etc.
        */}
      </section>

      {/* Section 9: Search CTA */}
      <section data-section="search-cta">
        {/*
          Link: /search?medium=photography
        */}
      </section>
    </div>
  );
}

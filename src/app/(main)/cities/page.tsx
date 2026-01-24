export const dynamic = 'force-dynamic';
// =============================================================================
// Cities Index Page
// Moroccan Art Platform
// =============================================================================

import type { Metadata } from 'next';
import { generateListMetadata } from '@/lib/seo';
import { getCities, getRegions, getCityFacets } from '@/lib/queries';

export const metadata: Metadata = generateListMetadata('cities');

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default async function CitiesPage() {
  const [cities, regions, cityFacets] = await Promise.all([
    getCities(),
    getRegions(),
    getCityFacets(),
  ]);

  return (
    <div>
      {/* Section 1: Page Header */}
      <section data-section="header">
        {/*
          Content:
          - Title: "Cities"
          - Description: Explore Moroccan art by location
        */}
      </section>

      {/* Section 2: Map View (optional future enhancement) */}
      <section data-section="map">
        {/*
          Future: Interactive map of Morocco with city markers
          Each marker shows artist/artwork count
        */}
      </section>

      {/* Section 3: Major Art Centers */}
      <section data-section="major-cities">
        {/*
          Data: Top cities from {cityFacets} by count
          Featured cities:
          - Casablanca (major artistic hub)
          - Marrakech
          - Tangier
          - Rabat
          - Fez

          Display: Large cards with:
          - City name
          - Artist count
          - Brief art-historical context

          Links: Each city → /cities/[slug]
        */}
      </section>

      {/* Section 4: Cities by Region */}
      <section data-section="by-region">
        {/*
          Data: {regions} with cities grouped
          Regions:
          - Grand Casablanca
          - Marrakech-Safi
          - Tanger-Tetouan-Al Hoceima
          - Rabat-Sale-Kenitra
          - Fes-Meknes
          - Souss-Massa
          - Oriental
          - etc.

          Links: Each city → /cities/[slug]
        */}
      </section>

      {/* Section 5: All Cities List */}
      <section data-section="all-cities">
        {/*
          Data: {cities}
          Display: Alphabetical list or grid
          Shows: City name, region, count

          Links: Each city → /cities/[slug]
        */}
      </section>

      {/* Section 6: International Cities (Diaspora) */}
      <section data-section="international">
        {/*
          Content: Cities outside Morocco with significant
          Moroccan artist presence (diaspora)
          - Paris
          - Brussels
          - Amsterdam
          - New York
          - etc.

          Note: These may be separate or filtered differently
        */}
      </section>
    </div>
  );
}

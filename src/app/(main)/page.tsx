export const dynamic = 'force-dynamic';
// =============================================================================
// Homepage
// Moroccan Art Platform
// =============================================================================

import type { Metadata } from 'next';
import { generateHomeMetadata } from '@/lib/seo';
import { generateSearchActionJsonLd, generateOrganizationJsonLd } from '@/lib/seo';
import {
  getFeaturedArtists,
  getFeaturedWorks,
  getArtistCount,
  getArtworkCount,
} from '@/lib/queries';

export const metadata: Metadata = generateHomeMetadata();

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default async function HomePage() {
  // Fetch data in parallel
  const [
    allFeaturedArtists,
    allFeaturedWorks,
    artistCount,
    artworkCount,
  ] = await Promise.all([
    getFeaturedArtists(),
    getFeaturedWorks(),
    getArtistCount(),
    getArtworkCount(),
  ]);

  // Limit for display
  const featuredArtists = allFeaturedArtists.slice(0, 6);
  const featuredWorks = allFeaturedWorks.slice(0, 4);

  // JSON-LD structured data
  const jsonLd = [generateSearchActionJsonLd(), generateOrganizationJsonLd()];

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Page Content Structure */}
      <div>
        {/* Section 1: Hero / Introduction */}
        <section data-section="introduction">
          {/*
            Purpose: Define site scope (Moroccan painting & photography)
            Content: Site title, brief description
          */}
        </section>

        {/* Section 2: Medium Entry Points */}
        <section data-section="medium-navigation">
          {/*
            Purpose: Primary navigation by medium
            Links:
            - /photography → Photography overview
            - /painting → Painting overview
          */}
        </section>

        {/* Section 3: Stats Overview */}
        <section data-section="statistics">
          {/*
            Data:
            - Total artists: {artistCount}
            - Total artworks: {artworkCount}
          */}
        </section>

        {/* Section 4: Featured Artists */}
        <section data-section="featured-artists">
          {/*
            Data: {featuredArtists}
            Links: Each artist → /artists/[slug]
          */}
        </section>

        {/* Section 5: Featured Iconic Works */}
        <section data-section="featured-works">
          {/*
            Data: {featuredWorks}
            Links: Each work → /works/[slug]
          */}
        </section>

        {/* Section 6: Browse Navigation */}
        <section data-section="browse-navigation">
          {/*
            Links:
            - Browse by Era → /artists?sort=activePeriodStart
            - Browse by City → /cities
            - Browse by Theme → /themes
            - Browse by Movement → /movements
          */}
        </section>

        {/* Section 7: Search Prompt */}
        <section data-section="search-cta">
          {/*
            Purpose: Encourage search usage
            Link: /search
          */}
        </section>
      </div>
    </>
  );
}

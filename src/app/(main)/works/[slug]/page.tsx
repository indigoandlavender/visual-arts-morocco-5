// =============================================================================
// Artwork Detail Page
// Moroccan Art Platform
// =============================================================================

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getArtworkBySlug, getRelatedArtworks } from '@/lib/queries';
import { generateArtworkMetadata, generateBreadcrumbs } from '@/lib/seo';
import { generateArtworkJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo';

// =============================================================================
// METADATA
// =============================================================================

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const artwork = await getArtworkBySlug(slug);

  if (!artwork) {
    return { title: 'Artwork Not Found' };
  }

  return generateArtworkMetadata(artwork);
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default async function ArtworkPage({ params }: PageProps) {
  const { slug } = await params;
  const artwork = await getArtworkBySlug(slug);

  if (!artwork) {
    notFound();
  }

  // Fetch related artworks
  const relatedArtworks = await getRelatedArtworks(artwork.id, 6);

  // Generate structured data
  const breadcrumbs = generateBreadcrumbs(`/works/${slug}`, artwork.title);
  const jsonLd = [
    generateArtworkJsonLd(artwork),
    generateBreadcrumbJsonLd(breadcrumbs),
  ];

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        {/* Section 1: Breadcrumbs */}
        <nav data-section="breadcrumbs">
          {/*
            Data: {breadcrumbs}
            Links: Home → Works → [Artwork Title]
          */}
        </nav>

        {/* Section 2: Artwork Header */}
        <header data-section="artwork-header">
          {/*
            Data:
            - Title: {artwork.title}
            - Title Arabic: {artwork.titleArabic}
            - Artist: {artwork.artist.name} → Link to /artists/[slug]
            - Year: {artwork.year} (approximate: {artwork.yearApproximate})
            - Medium: {artwork.medium}
            - Technique: {artwork.technique}
          */}
        </header>

        {/* Section 3: Primary Image */}
        <section data-section="image">
          {/*
            Data:
            - URL: {artwork.imageUrl}
            - Alt: {artwork.imageAlt}

            Paywall Hook:
            - Free: Standard resolution
            - Premium: High resolution
          */}
        </section>

        {/* Section 4: Description */}
        <section data-section="description">
          {/*
            Data: {artwork.description}
            Content: Contextual, factual description of the work
          */}
        </section>

        {/* Section 5: Technical Details */}
        <section data-section="technical-details">
          {/*
            Data:
            - Dimensions: {artwork.dimensions}
            - Current Location: {artwork.locationCurrent}
            - Created In: {artwork.locationCreated}
          */}
        </section>

        {/* Section 6: Iconic Significance (if applicable) */}
        {artwork.isIconic && artwork.iconicDetails && (
          <section data-section="iconic-significance">
            {/*
              Data: {artwork.iconicDetails}
              - Subject: {artwork.iconicDetails.subject}
              - Historical Context: {artwork.iconicDetails.historicalContext}
              - Cultural Significance: {artwork.iconicDetails.culturalSignificance}
              - Publication History: {artwork.iconicDetails.publicationHistory}
              - Related Event: {artwork.iconicDetails.relatedEvent}
            */}
          </section>
        )}

        {/* Section 7: Movement Context */}
        {artwork.movement && (
          <section data-section="movement">
            {/*
              Data: {artwork.movement}
              Link: /movements/[slug]
            */}
          </section>
        )}

        {/* Section 8: Themes / Tags */}
        <section data-section="themes">
          {/*
            Data: {artwork.themes}
            Links: Each theme → /themes/[slug]
          */}
        </section>

        {/* Section 9: Cities */}
        <section data-section="cities">
          {/*
            Data: {artwork.cities}
            Links: Each city → /cities/[slug]
          */}
        </section>

        {/* Section 10: Other Works by Artist */}
        <section data-section="artist-works">
          {/*
            Link: See all works → /works?artist={artwork.artist.slug}
          */}
        </section>

        {/* Section 11: Related Works */}
        <section data-section="related-works">
          {/*
            Data: {relatedArtworks}
            Criteria: Same theme, movement, or period
            Links: Each work → /works/[slug]
          */}
        </section>

        {/* Section 12: External References (if in collection) */}
        <section data-section="external-references">
          {/*
            If artwork is in a known museum collection,
            link to external catalog page
          */}
        </section>
      </article>
    </>
  );
}

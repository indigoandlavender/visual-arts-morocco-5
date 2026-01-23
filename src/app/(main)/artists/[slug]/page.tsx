// =============================================================================
// Artist Detail Page
// Moroccan Art Platform
// =============================================================================

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getArtistBySlug, getRelatedArtists } from '@/lib/queries/artists';
import { generateArtistMetadata, generateBreadcrumbs } from '@/lib/seo';
import { generateArtistJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo';

// =============================================================================
// METADATA
// =============================================================================

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const artist = await getArtistBySlug(slug);

  if (!artist) {
    return { title: 'Artist Not Found' };
  }

  return generateArtistMetadata(artist);
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default async function ArtistPage({ params }: PageProps) {
  const { slug } = await params;
  const artist = await getArtistBySlug(slug);

  if (!artist) {
    notFound();
  }

  // Fetch additional related data
  const relatedArtists = await getRelatedArtists(artist.id, 6);

  // Generate structured data
  const breadcrumbs = generateBreadcrumbs(`/artists/${slug}`, artist.name);
  const jsonLd = [
    generateArtistJsonLd(artist),
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
            Links: Home → Artists → [Artist Name]
          */}
        </nav>

        {/* Section 2: Artist Header */}
        <header data-section="artist-header">
          {/*
            Data:
            - Name: {artist.name}
            - Name Arabic: {artist.nameArabic}
            - Birth/Death: {artist.birthYear} - {artist.deathYear}
            - Medium Badge(s): {artist.medium}
            - Active Period: {artist.activePeriodStart} - {artist.activePeriodEnd}
            - Cities: {artist.cities}
            - Moroccan Connection: {artist.moroccanConnection}
          */}
        </header>

        {/* Section 3: Biography */}
        <section data-section="biography">
          {/*
            Data: {artist.biography}
            Note: May be truncated for free tier users (future paywall hook)

            Paywall Hook:
            - Free: {artist.biographyShort}
            - Premium: {artist.biography}
          */}
        </section>

        {/* Section 4: Key Themes */}
        <section data-section="themes">
          {/*
            Data: {artist.themes}
            Links: Each theme → /themes/[slug]
          */}
        </section>

        {/* Section 5: Selected Works */}
        <section data-section="artworks">
          {/*
            Data: {artist.artworks}
            Display: Grid of artwork cards (limited for free tier)
            Links: Each work → /works/[slug]

            Paywall Hook:
            - Free: Limited to 3 works
            - Premium: All works
          */}
        </section>

        {/* Section 6: Timeline (if sufficient data) */}
        <section data-section="timeline">
          {/*
            Content:
            - Major exhibitions
            - Publications
            - Notable events
            Note: Future implementation based on data availability
          */}
        </section>

        {/* Section 7: Associated Movements */}
        <section data-section="movements">
          {/*
            Data: {artist.movements}
            Links: Each movement → /movements/[slug]
          */}
        </section>

        {/* Section 8: External References */}
        <section data-section="external-references">
          {/*
            Data: {artist.externalReferences}
            Types: museum, publication, gallery, archive, wikipedia, official_site

            Paywall Hook:
            - Free: Hidden or limited
            - Premium: Full access
          */}
        </section>

        {/* Section 9: Related Artists */}
        <section data-section="related-artists">
          {/*
            Data: {relatedArtists}
            Criteria: Same movement, era, themes, or city
            Links: Each artist → /artists/[slug]
            Minimum: 3 artists shown
          */}
        </section>

        {/* Section 10: Cities Association */}
        <section data-section="cities">
          {/*
            Data: {artist.cities}
            Links: Each city → /cities/[slug]
          */}
        </section>
      </article>
    </>
  );
}

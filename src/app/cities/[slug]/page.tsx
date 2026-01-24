// =============================================================================
// City Detail Page
// Moroccan Art Platform
// =============================================================================

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCityBySlug } from '@/lib/queries';
import { generateCityMetadata, generateBreadcrumbs } from '@/lib/seo';
import { generateCityJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo';

// =============================================================================
// METADATA
// =============================================================================

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const city = await getCityBySlug(slug);

  if (!city) {
    return { title: 'City Not Found' };
  }

  return generateCityMetadata(city);
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default async function CityPage({ params }: PageProps) {
  const { slug } = await params;
  const city = await getCityBySlug(slug);

  if (!city) {
    notFound();
  }

  // Generate structured data
  const breadcrumbs = generateBreadcrumbs(`/cities/${slug}`, city.name);
  const jsonLd = [
    generateCityJsonLd(city),
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
            Links: Home → Cities → [City Name]
          */}
        </nav>

        {/* Section 2: City Header */}
        <header data-section="city-header">
          {/*
            Data:
            - Name: {city.name}
            - Name Arabic: {city.nameArabic}
            - Region: {city.region}
            - Country: {city.country}
          */}
        </header>

        {/* Section 3: Art Historical Context */}
        <section data-section="description">
          {/*
            Data: {city.description}
            Content: Art-historical significance of the city
          */}
        </section>

        {/* Section 4: Statistics */}
        <section data-section="statistics">
          {/*
            Data:
            - Artists: {city.artists.length}
            - Artworks: {city.artworks.length}
          */}
        </section>

        {/* Section 5: Filter by Medium */}
        <section data-section="medium-filter">
          {/*
            Options:
            - All
            - Photography only
            - Painting only
          */}
        </section>

        {/* Section 6: Artists from/based in City */}
        <section data-section="artists">
          {/*
            Data: {city.artists}
            Display: Grid of artist cards
            Note: Can include artists born here, based here, or who worked here

            Links: Each artist → /artists/[slug]
          */}
        </section>

        {/* Section 7: Artworks Associated with City */}
        <section data-section="artworks">
          {/*
            Data: {city.artworks}
            Display: Grid of artwork cards
            Note: Works created here or depicting this city

            Links: Each work → /works/[slug]
          */}
        </section>

        {/* Section 8: Related Cities */}
        <section data-section="related-cities">
          {/*
            Content: Other cities in same region
            Or cities with artistic connections
          */}
        </section>

        {/* Section 9: Search Within City */}
        <section data-section="search-cta">
          {/*
            Link: /search?city={city.slug}
          */}
        </section>
      </article>
    </>
  );
}

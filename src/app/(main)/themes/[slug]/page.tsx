// =============================================================================
// Theme Detail Page
// Moroccan Art Platform
// =============================================================================

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getThemeBySlug } from '@/lib/queries/themes';
import { generateThemeMetadata, generateBreadcrumbs } from '@/lib/seo';
import { generateBreadcrumbJsonLd } from '@/lib/seo';

// =============================================================================
// METADATA
// =============================================================================

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const theme = await getThemeBySlug(slug);

  if (!theme) {
    return { title: 'Theme Not Found' };
  }

  return generateThemeMetadata(theme);
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default async function ThemePage({ params }: PageProps) {
  const { slug } = await params;
  const theme = await getThemeBySlug(slug);

  if (!theme) {
    notFound();
  }

  // Generate structured data
  const breadcrumbs = generateBreadcrumbs(`/themes/${slug}`, theme.name);
  const jsonLd = [generateBreadcrumbJsonLd(breadcrumbs)];

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
            Links: Home → Themes → [Theme Name]
          */}
        </nav>

        {/* Section 2: Theme Header */}
        <header data-section="theme-header">
          {/*
            Data:
            - Name: {theme.name}
            - Name Arabic: {theme.nameArabic}
            - Category: {theme.category}
          */}
        </header>

        {/* Section 3: Description */}
        <section data-section="description">
          {/*
            Data: {theme.description}
          */}
        </section>

        {/* Section 4: Filter by Medium */}
        <section data-section="medium-filter">
          {/*
            Options:
            - All
            - Photography only
            - Painting only

            Links:
            - /themes/[slug]
            - /themes/[slug]?medium=photography
            - /themes/[slug]?medium=painting
          */}
        </section>

        {/* Section 5: Artists */}
        <section data-section="artists">
          {/*
            Data: {theme.artists}
            Display: Grid of artist cards working in this theme
            Links: Each artist → /artists/[slug]
          */}
        </section>

        {/* Section 6: Artworks */}
        <section data-section="artworks">
          {/*
            Data: {theme.artworks}
            Display: Grid of artwork cards tagged with this theme
            Links: Each work → /works/[slug]
          */}
        </section>

        {/* Section 7: Parent/Child Themes */}
        <section data-section="related-themes">
          {/*
            Data:
            - Parent: {theme.parentTheme}
            - Related: {theme.childThemes}
          */}
        </section>

        {/* Section 8: Search Within Theme */}
        <section data-section="search-cta">
          {/*
            Link: /search?theme={theme.slug}
          */}
        </section>
      </article>
    </>
  );
}

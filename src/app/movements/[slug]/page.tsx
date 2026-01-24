// =============================================================================
// Movement Detail Page
// Moroccan Art Platform
// =============================================================================

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMovementBySlug } from '@/lib/queries';
import { generateMovementMetadata, generateBreadcrumbs } from '@/lib/seo';
import { generateMovementJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo';

// =============================================================================
// METADATA
// =============================================================================

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const movement = await getMovementBySlug(slug);

  if (!movement) {
    return { title: 'Movement Not Found' };
  }

  return generateMovementMetadata(movement);
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default async function MovementPage({ params }: PageProps) {
  const { slug } = await params;
  const movement = await getMovementBySlug(slug);

  if (!movement) {
    notFound();
  }

  // Generate structured data
  const breadcrumbs = generateBreadcrumbs(`/movements/${slug}`, movement.name);
  const jsonLd = [
    generateMovementJsonLd(movement),
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
            Links: Home → Movements → [Movement Name]
          */}
        </nav>

        {/* Section 2: Movement Header */}
        <header data-section="movement-header">
          {/*
            Data:
            - Name: {movement.name}
            - Name Arabic: {movement.nameArabic}
            - Period: {movement.periodStart} - {movement.periodEnd}
            - Geographic Scope: {movement.geographicScope}
          */}
        </header>

        {/* Section 3: Description */}
        <section data-section="description">
          {/*
            Data: {movement.description}
          */}
        </section>

        {/* Section 4: Key Characteristics */}
        <section data-section="characteristics">
          {/*
            Data: {movement.keyCharacteristics}
            Display: Bullet list of defining characteristics
          */}
        </section>

        {/* Section 5: Timeline Position */}
        <section data-section="timeline">
          {/*
            Visual: Position of this movement in broader timeline
            Context: What came before and after
          */}
        </section>

        {/* Section 6: Associated Artists */}
        <section data-section="artists">
          {/*
            Data: {movement.artists}
            Display: Grid of artist cards
            Links: Each artist → /artists/[slug]
          */}
        </section>

        {/* Section 7: Representative Works */}
        <section data-section="artworks">
          {/*
            Data: {movement.artworks}
            Display: Grid of artwork cards
            Links: Each work → /works/[slug]
          */}
        </section>

        {/* Section 8: Parent/Child Movements */}
        <section data-section="related-movements">
          {/*
            Data:
            - Parent: {movement.parentMovement}
            - Children: {movement.childMovements}
            Display: Hierarchical relationship
          */}
        </section>

        {/* Section 9: Search Within Movement */}
        <section data-section="search-cta">
          {/*
            Link: /search?movement={movement.slug}
          */}
        </section>
      </article>
    </>
  );
}

export const dynamic = 'force-dynamic';
// =============================================================================
// Themes Index Page
// Moroccan Art Platform
// =============================================================================

import type { Metadata } from 'next';
import { generateListMetadata } from '@/lib/seo';
import { getThemes, getThemesByCategory } from '@/lib/queries';

export const metadata: Metadata = generateListMetadata('themes');

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default async function ThemesPage() {
  // Fetch themes grouped by category
  const [subjectThemes, styleThemes, conceptThemes, techniqueThemes] =
    await Promise.all([
      getThemesByCategory('SUBJECT'),
      getThemesByCategory('STYLE'),
      getThemesByCategory('CONCEPT'),
      getThemesByCategory('TECHNIQUE'),
    ]);

  return (
    <div>
      {/* Section 1: Page Header */}
      <section data-section="header">
        {/*
          Content:
          - Title: "Themes"
          - Description: Explore thematic categories in Moroccan visual art
        */}
      </section>

      {/* Section 2: Subject Themes */}
      <section data-section="subject-themes">
        {/*
          Data: {subjectThemes}
          Category: What is depicted
          Examples:
          - Portrait
          - Landscape
          - Street
          - Urban
          - Rural
          - Body
          - Ritual
          - Daily Life

          Links: Each theme → /themes/[slug]
        */}
      </section>

      {/* Section 3: Conceptual Themes */}
      <section data-section="concept-themes">
        {/*
          Data: {conceptThemes}
          Category: Ideas and concepts explored
          Examples:
          - Identity
          - Diaspora
          - Memory
          - Tradition
          - Modernity
          - Politics
          - Colonialism
          - Independence

          Links: Each theme → /themes/[slug]
        */}
      </section>

      {/* Section 4: Style Themes */}
      <section data-section="style-themes">
        {/*
          Data: {styleThemes}
          Category: Artistic approaches
          Examples:
          - Abstraction
          - Figuration
          - Realism
          - Expressionism
          - Minimalism
          - Calligraphic

          Links: Each theme → /themes/[slug]
        */}
      </section>

      {/* Section 5: Technique Themes */}
      <section data-section="technique-themes">
        {/*
          Data: {techniqueThemes}
          Category: Technical approaches
          Examples:
          - Mixed Media
          - Collage
          - Sign/Symbol
          - Documentary
          - Staged

          Links: Each theme → /themes/[slug]
        */}
      </section>

      {/* Section 6: Popular Themes */}
      <section data-section="popular-themes">
        {/*
          Display: Themes with most associated artists/works
          Derived from facet counts
        */}
      </section>
    </div>
  );
}

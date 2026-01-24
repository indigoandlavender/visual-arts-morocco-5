// =============================================================================
// Movements Index Page
// Moroccan Art Platform
// =============================================================================

import type { Metadata } from 'next';
import { generateListMetadata } from '@/lib/seo';
import { getMovements } from '@/lib/queries';

export const metadata: Metadata = generateListMetadata('movements');

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default async function MovementsPage() {
  const movements = await getMovements();

  return (
    <div>
      {/* Section 1: Page Header */}
      <section data-section="header">
        {/*
          Content:
          - Title: "Art Movements"
          - Description: Overview of artistic movements in Moroccan visual art
        */}
      </section>

      {/* Section 2: Timeline View */}
      <section data-section="timeline">
        {/*
          Data: {movements}
          Display: Chronological timeline of movements
          - Each movement positioned by periodStart
          - Visual representation of duration (periodStart to periodEnd)
        */}
      </section>

      {/* Section 3: Movements List */}
      <section data-section="movements-list">
        {/*
          Data: {movements}
          Display: List/grid of movement cards
          Each card shows:
          - Name
          - Period (start - end)
          - Brief description excerpt
          - Associated artist count

          Links: Each movement → /movements/[slug]
        */}
      </section>

      {/* Section 4: By Geographic Scope */}
      <section data-section="geographic-scope">
        {/*
          Groupings:
          - Morocco-specific movements
          - Maghreb-wide movements
          - International movements with Moroccan participation
        */}
      </section>
    </div>
  );
}

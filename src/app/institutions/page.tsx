// =============================================================================
// Institutions Index Page
// Museums, Galleries, Art Schools & Cultural Centers in Morocco
// =============================================================================

import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllInstitutions, getAllCities } from '@/lib/queries';
import type { Institution, InstitutionType } from '@/types';

// Force dynamic rendering - don't prerender at build time
export const dynamic = 'force-dynamic';

// =============================================================================
// METADATA
// =============================================================================

export const metadata: Metadata = {
  title: 'Art Institutions in Morocco | Museums, Galleries & Cultural Centers',
  description: 'Explore museums, art galleries, cultural foundations, art schools, and artist residencies across Morocco.',
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const INSTITUTION_TYPE_LABELS: Record<InstitutionType, string> = {
  MUSEUM: 'Museums',
  GALLERY: 'Galleries',
  CULTURAL_CENTER: 'Cultural Centers',
  ART_SCHOOL: 'Art Schools',
  FOUNDATION: 'Foundations',
  RESIDENCY: 'Artist Residencies',
};

const INSTITUTION_TYPE_ICONS: Record<InstitutionType, string> = {
  MUSEUM: '🏛️',
  GALLERY: '🖼️',
  CULTURAL_CENTER: '🎭',
  ART_SCHOOL: '🎨',
  FOUNDATION: '✨',
  RESIDENCY: '🏠',
};

function groupByCity(institutions: Institution[]): Map<string, Institution[]> {
  const grouped = new Map<string, Institution[]>();
  for (const inst of institutions) {
    const cityName = inst.city?.name || 'Other';
    if (!grouped.has(cityName)) {
      grouped.set(cityName, []);
    }
    grouped.get(cityName)!.push(inst);
  }
  return grouped;
}

function groupByType(institutions: Institution[]): Map<InstitutionType, Institution[]> {
  const grouped = new Map<InstitutionType, Institution[]>();
  for (const inst of institutions) {
    if (!grouped.has(inst.type)) {
      grouped.set(inst.type, []);
    }
    grouped.get(inst.type)!.push(inst);
  }
  return grouped;
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default async function InstitutionsPage() {
  const [institutions, cities] = await Promise.all([
    getAllInstitutions(),
    getAllCities(),
  ]);

  const byCity = groupByCity(institutions);
  const byType = groupByType(institutions);
  const sortedCities = Array.from(byCity.entries()).sort((a, b) => b[1].length - a[1].length);

  return (
    <main className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="bg-stone-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <nav className="text-sm text-stone-400 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">→</span>
            <span className="text-white">Institutions</span>
          </nav>
          
          <h1 className="text-4xl md:text-5xl font-light mb-4">Art Institutions</h1>
          <p className="text-xl text-stone-300 max-w-2xl">
            Museums, galleries, cultural foundations, art schools, and artist residencies 
            dedicated to visual arts across Morocco.
          </p>
          
          <div className="flex gap-8 mt-10 pt-10 border-t border-stone-700">
            <div>
              <div className="text-3xl font-light">{institutions.length}</div>
              <div className="text-sm text-stone-400">Institutions</div>
            </div>
            <div>
              <div className="text-3xl font-light">{byCity.size}</div>
              <div className="text-sm text-stone-400">Cities</div>
            </div>
            <div>
              <div className="text-3xl font-light">{byType.size}</div>
              <div className="text-sm text-stone-400">Types</div>
            </div>
          </div>
        </div>
      </section>

      {/* Type Filters */}
      <section className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex flex-wrap gap-3">
            {Array.from(byType.entries()).map(([type, insts]) => (
              <a key={type} href={`#${type.toLowerCase()}`} className="px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-sm transition-colors">
                {INSTITUTION_TYPE_ICONS[type]} {INSTITUTION_TYPE_LABELS[type]} 
                <span className="text-stone-500 ml-1">({insts.length})</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Institutions by City */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        {sortedCities.map(([cityName, cityInstitutions]) => {
          const citySlug = cities.find(c => c.name === cityName)?.slug;
          return (
            <div key={cityName} className="mb-16">
              <div className="flex items-baseline gap-4 mb-6">
                <h2 className="text-2xl font-light">{cityName}</h2>
                <span className="text-stone-500">{cityInstitutions.length} institutions</span>
                {citySlug && (
                  <Link href={`/cities/${citySlug}`} className="text-sm text-amber-700 hover:text-amber-800">
                    View city →
                  </Link>
                )}
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cityInstitutions.map((inst) => (
                  <article key={inst.id} id={inst.type.toLowerCase()} className="bg-white rounded-lg border border-stone-200 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-2xl">{INSTITUTION_TYPE_ICONS[inst.type]}</span>
                      <span className="text-xs px-2 py-1 bg-stone-100 rounded-full text-stone-600">
                        {INSTITUTION_TYPE_LABELS[inst.type].slice(0, -1)}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-medium mb-2">{inst.name}</h3>
                    
                    {inst.description && (
                      <p className="text-sm text-stone-600 mb-4 line-clamp-3">{inst.description}</p>
                    )}
                    
                    <div className="space-y-2 text-sm text-stone-500">
                      {inst.address && (
                        <div className="flex items-start gap-2">
                          <span>📍</span>
                          <span className="line-clamp-2">{inst.address}</span>
                        </div>
                      )}
                      {inst.hours && (
                        <div className="flex items-start gap-2">
                          <span>🕒</span>
                          <span>{inst.hours}</span>
                        </div>
                      )}
                      {inst.admission && (
                        <div className="flex items-start gap-2">
                          <span>🎟️</span>
                          <span>{inst.admission}</span>
                        </div>
                      )}
                    </div>
                    
                    {inst.website && (
                      <a href={inst.website} target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-sm text-amber-700 hover:text-amber-800">
                        Visit website →
                      </a>
                    )}
                    
                    {inst.highlights && (
                      <div className="mt-4 pt-4 border-t border-stone-100">
                        <div className="flex flex-wrap gap-1">
                          {inst.highlights.split(';').map((highlight, i) => (
                            <span key={i} className="text-xs px-2 py-1 bg-amber-50 text-amber-800 rounded">
                              {highlight.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}

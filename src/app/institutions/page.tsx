// =============================================================================
// Institutions Index Page — Fondazione Prada Aesthetic
// Museums, Galleries, Art Schools & Cultural Centers in Morocco
// =============================================================================

import type { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';
import { getAllInstitutions, getAllCities } from '@/lib/queries';
import type { Institution, InstitutionType } from '@/types';

export const dynamic = 'force-dynamic';

// =============================================================================
// METADATA
// =============================================================================

export const metadata: Metadata = {
  title: 'Art Institutions in Morocco | Museums, Galleries & Cultural Centers',
  description: 'Explore museums, art galleries, cultural foundations, art schools, and artist residencies across Morocco.',
};

// =============================================================================
// FLAT SVG ICONS
// =============================================================================

const Icons = {
  museum: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M3 21h18M4 18h16M6 18V9M10 18V9M14 18V9M18 18V9M12 3L2 9h20L12 3z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  gallery: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <rect x="3" y="3" width="18" height="18" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="6" y="6" width="5" height="5" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="13" y="6" width="5" height="5" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="6" y="13" width="12" height="5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  cultural: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 3v18M3 12h18M5.5 5.5l13 13M18.5 5.5l-13 13" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  school: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M12 3L2 8l10 5 10-5-10-5zM2 8v8l10 5 10-5V8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 10.5v6l5 2.5 5-2.5v-6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  foundation: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 22V12M2 7l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  residency: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h12a1 1 0 001-1V10" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 21v-6a1 1 0 011-1h4a1 1 0 011 1v6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  pin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 flex-shrink-0">
      <path d="M12 21c-4-4-8-7.5-8-11a8 8 0 1116 0c0 3.5-4 7-8 11z" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="10" r="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 flex-shrink-0">
      <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  ticket: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 flex-shrink-0">
      <path d="M4 4h16a2 2 0 012 2v3a2 2 0 00-2 2 2 2 0 002 2v3a2 2 0 01-2 2H4a2 2 0 01-2-2v-3a2 2 0 002-2 2 2 0 00-2-2V6a2 2 0 012-2z" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 4v16" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 2"/>
    </svg>
  ),
  arrow: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

const INSTITUTION_ICONS: Record<InstitutionType, React.ReactNode> = {
  MUSEUM: Icons.museum,
  GALLERY: Icons.gallery,
  CULTURAL_CENTER: Icons.cultural,
  ART_SCHOOL: Icons.school,
  FOUNDATION: Icons.foundation,
  RESIDENCY: Icons.residency,
};

const INSTITUTION_TYPE_LABELS: Record<InstitutionType, string> = {
  MUSEUM: 'Museum',
  GALLERY: 'Gallery',
  CULTURAL_CENTER: 'Cultural Center',
  ART_SCHOOL: 'Art School',
  FOUNDATION: 'Foundation',
  RESIDENCY: 'Residency',
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

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
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[60vh] bg-[#1C1917] flex items-end overflow-hidden">
        {/* Minimal grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `
            linear-gradient(to right, white 1px, transparent 1px),
            linear-gradient(to bottom, white 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }} />

        <div className="relative z-10 w-full px-6 md:px-12 pb-16 md:pb-20">
          <div className="max-w-[1800px] mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-8">
              <ol className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-white/40">
                <li><Link href="/" className="hover:text-white/60 transition-colors">Home</Link></li>
                <li><span className="mx-1">/</span></li>
                <li className="text-white/80">Institutions</li>
              </ol>
            </nav>

            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-8">
              <div>
                <span className="text-[10px] tracking-[0.5em] uppercase text-white/40 block mb-4">
                  The Network
                </span>
                <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light text-white leading-none">
                  Institutions
                </h1>
              </div>
              <p className="text-white/50 text-lg max-w-md font-light">
                Museums, galleries, and cultural spaces dedicated to visual arts across Morocco.
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-12 mt-12 pt-8 border-t border-white/10">
              <div>
                <div className="font-serif text-4xl text-white">{institutions.length}</div>
                <div className="text-[10px] tracking-[0.2em] uppercase text-white/40 mt-1">Institutions</div>
              </div>
              <div>
                <div className="font-serif text-4xl text-white">{byCity.size}</div>
                <div className="text-[10px] tracking-[0.2em] uppercase text-white/40 mt-1">Cities</div>
              </div>
              <div>
                <div className="font-serif text-4xl text-white">{byType.size}</div>
                <div className="text-[10px] tracking-[0.2em] uppercase text-white/40 mt-1">Types</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Type Filters */}
      <section className="sticky top-0 z-40 bg-[#FAF9F6] border-b border-[#E7E5E4]">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-4">
          <div className="flex flex-wrap gap-2">
            {Array.from(byType.entries()).map(([type, insts]) => (
              <a 
                key={type} 
                href={`#${type.toLowerCase()}`} 
                className="group flex items-center gap-2 px-4 py-2 text-[11px] tracking-[0.1em] uppercase text-[#78716C] hover:text-[#1C1917] hover:bg-[#E7E5E4] transition-all"
              >
                <span className="text-[#A8A29E] group-hover:text-[#78716C] transition-colors">
                  {INSTITUTION_ICONS[type]}
                </span>
                {INSTITUTION_TYPE_LABELS[type]}s
                <span className="text-[#A8A29E]">({insts.length})</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Institutions by City */}
      <section className="px-6 md:px-12 py-16 md:py-24">
        <div className="max-w-[1800px] mx-auto">
          {sortedCities.map(([cityName, cityInstitutions]) => {
            const citySlug = cities.find(c => c.name === cityName)?.slug;
            return (
              <div key={cityName} className="mb-20">
                {/* City Header */}
                <div className="flex items-baseline justify-between gap-4 mb-10 pb-6 border-b border-[#E7E5E4]">
                  <div className="flex items-baseline gap-4">
                    <h2 className="font-serif text-3xl md:text-4xl text-[#1C1917]">{cityName}</h2>
                    <span className="text-[10px] tracking-[0.2em] uppercase text-[#A8A29E]">
                      {cityInstitutions.length} {cityInstitutions.length === 1 ? 'institution' : 'institutions'}
                    </span>
                  </div>
                  {citySlug && (
                    <Link 
                      href={`/cities/${citySlug}`} 
                      className="flex items-center gap-2 text-[11px] tracking-[0.1em] uppercase text-[#78716C] hover:text-[#1C1917] transition-colors"
                    >
                      View city
                      {Icons.arrow}
                    </Link>
                  )}
                </div>
                
                {/* Institution Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#E7E5E4]">
                  {cityInstitutions.map((inst) => (
                    <article 
                      key={inst.id} 
                      id={inst.type.toLowerCase()} 
                      className="bg-[#FAF9F6] p-8 group hover:bg-white transition-colors"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-6">
                        <span className="text-[#A8A29E] group-hover:text-[#78716C] transition-colors">
                          {INSTITUTION_ICONS[inst.type]}
                        </span>
                        <span className="text-[10px] tracking-[0.15em] uppercase text-[#A8A29E]">
                          {INSTITUTION_TYPE_LABELS[inst.type]}
                        </span>
                      </div>
                      
                      {/* Title */}
                      <h3 className="font-serif text-xl md:text-2xl text-[#1C1917] mb-3 leading-tight">
                        {inst.name}
                      </h3>
                      
                      {/* Description */}
                      {inst.description && (
                        <p className="text-sm text-[#78716C] mb-6 line-clamp-3 leading-relaxed">
                          {inst.description}
                        </p>
                      )}
                      
                      {/* Details */}
                      <div className="space-y-3 text-sm text-[#78716C]">
                        {inst.address && (
                          <div className="flex items-start gap-3">
                            <span className="text-[#A8A29E] mt-0.5">{Icons.pin}</span>
                            <span className="line-clamp-2">{inst.address}</span>
                          </div>
                        )}
                        {inst.hours && (
                          <div className="flex items-start gap-3">
                            <span className="text-[#A8A29E] mt-0.5">{Icons.clock}</span>
                            <span>{inst.hours}</span>
                          </div>
                        )}
                        {inst.admission && (
                          <div className="flex items-start gap-3">
                            <span className="text-[#A8A29E] mt-0.5">{Icons.ticket}</span>
                            <span>{inst.admission}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Website Link */}
                      {inst.website && (
                        <a 
                          href={inst.website} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center gap-2 mt-6 text-[11px] tracking-[0.1em] uppercase text-[#78716C] hover:text-[#1C1917] transition-colors"
                        >
                          Visit website
                          {Icons.arrow}
                        </a>
                      )}
                      
                      {/* Highlights */}
                      {inst.highlights && (
                        <div className="mt-6 pt-6 border-t border-[#E7E5E4]">
                          <div className="flex flex-wrap gap-2">
                            {inst.highlights.split(';').map((highlight, i) => (
                              <span 
                                key={i} 
                                className="text-[10px] tracking-[0.05em] px-3 py-1.5 bg-[#F5F5F0] text-[#78716C]"
                              >
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
        </div>
      </section>
    </div>
  );
}

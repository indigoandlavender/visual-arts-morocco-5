export const dynamic = 'force-dynamic';
// =============================================================================
// Themes Index Page — Curatorial Concepts
// Fondazione Prada Inspired
// =============================================================================

import type { Metadata } from 'next';
import Link from 'next/link';
import { generateListMetadata } from '@/lib/seo';
import { getThemes, getGenres, getSubjectTerms } from '@/lib/queries';
import type { Theme, Genre, SubjectTerm } from '@/types';

export const metadata: Metadata = generateListMetadata('themes');

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default async function ThemesPage() {
  const [themes, genres, subjectTerms] = await Promise.all([
    getThemes(),
    getGenres(),
    getSubjectTerms(),
  ]);

  // Group subject terms by category
  const placeSubjects = subjectTerms.filter((s: SubjectTerm) => s.category === 'PLACE');
  const peopleSubjects = subjectTerms.filter((s: SubjectTerm) => s.category === 'PEOPLE');
  const motifSubjects = subjectTerms.filter((s: SubjectTerm) => s.category === 'MOTIF');
  const objectSubjects = subjectTerms.filter((s: SubjectTerm) => s.category === 'OBJECT');
  const activitySubjects = subjectTerms.filter((s: SubjectTerm) => s.category === 'ACTIVITY');

  const sections = [
    {
      title: 'Curatorial Themes',
      description: 'Interpretive concepts and frameworks',
      items: themes,
      color: '#C4A052', // Gold
      linkPrefix: '/themes',
    },
    {
      title: 'Genres',
      description: 'Traditional subject classification',
      items: genres,
      color: '#8B7355', // Bronze
      linkPrefix: '/genres',
    },
    {
      title: 'Places',
      description: 'Geographic subjects depicted',
      items: placeSubjects,
      color: '#57534E', // Stone
      linkPrefix: '/subjects',
    },
    {
      title: 'People',
      description: 'Human subjects depicted',
      items: peopleSubjects,
      color: '#78716C', // Warm gray
      linkPrefix: '/subjects',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] bg-[#1C1917] flex items-end overflow-hidden">
        {/* Abstract pattern - interconnected themes */}
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            <line x1="10" y1="20" x2="90" y2="80" stroke="#C4A052" strokeWidth="0.3"/>
            <line x1="20" y1="10" x2="80" y2="90" stroke="#8B7355" strokeWidth="0.3"/>
            <line x1="30" y1="90" x2="70" y2="10" stroke="#C4A052" strokeWidth="0.3"/>
            <circle cx="30" cy="40" r="8" fill="none" stroke="#C4A052" strokeWidth="0.3"/>
            <circle cx="70" cy="60" r="12" fill="none" stroke="#8B7355" strokeWidth="0.3"/>
            <circle cx="50" cy="50" r="20" fill="none" stroke="#C4A052" strokeWidth="0.2"/>
          </svg>
        </div>

        <div className="relative z-10 w-full px-6 md:px-12 pb-16 md:pb-24">
          <div className="max-w-[1800px] mx-auto">
            <span className="text-[10px] tracking-[0.5em] uppercase text-white/40 block mb-6">
              Thematic Archive
            </span>
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-8">
              <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl font-light text-white leading-none">
                Themes
              </h1>
              <p className="text-white/50 text-lg max-w-md font-light">
                Identity, landscape, tradition, modernity. 
                The recurring threads woven through Moroccan visual art.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Theme Categories */}
      {sections.map((section, catIndex) => (
        <section 
          key={section.title}
          className={`px-6 md:px-12 py-16 md:py-24 ${
            catIndex % 2 === 1 ? 'bg-[#E8E4DF]' : 'bg-[#FAF9F6]'
          }`}
        >
          <div className="max-w-[1800px] mx-auto">
            {/* Category Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-12 md:mb-16 pb-8 border-b border-[#D4D4D4]">
              <div>
                <span 
                  className="text-[10px] tracking-[0.3em] uppercase block mb-3"
                  style={{ color: section.color }}
                >
                  {section.description}
                </span>
                <h2 className="font-serif text-4xl md:text-6xl text-[#1C1917]">
                  {section.title}
                </h2>
              </div>
              <span className="text-[10px] tracking-[0.2em] text-[#A8A29E]">
                {section.items.length} items
              </span>
            </div>

            {/* Theme Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {section.items.map((item: { id: string; slug: string; name: string; description?: string | null }, index: number) => (
                <Link
                  key={item.id}
                  href={`${section.linkPrefix}/${item.slug}`}
                  className="group"
                >
                  <div className="relative aspect-[4/3] bg-[#1C1917] overflow-hidden">
                    {/* Background accent */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ backgroundColor: section.color }}
                    />

                    {/* Content */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-between">
                      <span className="text-[10px] tracking-[0.2em] text-white/30 group-hover:text-[#1C1917]/50 transition-colors">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h3 className="font-serif text-xl md:text-2xl text-white group-hover:text-[#1C1917] transition-colors">
                          {item.name}
                        </h3>
                        {item.description && (
                          <p className="text-white/40 group-hover:text-[#1C1917]/60 text-sm mt-2 line-clamp-2 transition-colors">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {section.items.length === 0 && (
              <p className="text-[#A8A29E] text-center py-12">
                No {section.title.toLowerCase()} documented yet.
              </p>
            )}
          </div>
        </section>
      ))}

      {/* Bottom Navigation */}
      <section className="bg-[#1C1917] px-6 md:px-12 py-24">
        <div className="max-w-[1800px] mx-auto text-center">
          <span className="text-[10px] tracking-[0.3em] uppercase text-white/30 block mb-6">
            Continue Exploring
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-white mb-12">
            Discover more ways to explore the archive
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { href: '/artists', label: 'By Artist' },
              { href: '/cities', label: 'By City' },
              { href: '/movements', label: 'By Movement' },
              { href: '/works', label: 'All Works' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-8 py-4 border border-white/20 text-white text-sm hover:bg-white hover:text-[#1C1917] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

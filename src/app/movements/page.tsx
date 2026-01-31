export const dynamic = 'force-dynamic';
// =============================================================================
// Movements Index Page — The Timeline Hall
// Fondazione Prada Inspired
// =============================================================================

import type { Metadata } from 'next';
import Link from 'next/link';
import { generateListMetadata } from '@/lib/seo';
import { getMovements } from '@/lib/queries';

export const metadata: Metadata = generateListMetadata('movements');

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default async function MovementsPage() {
  const movements = await getMovements();

  // Sort by period start for chronological display
  const sortedMovements = [...movements].sort((a, b) => 
    (a.periodStart || 0) - (b.periodStart || 0)
  );

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* Hero Section - Exhibition entrance */}
      <section className="relative h-[60vh] md:h-[70vh] bg-[#0A0A0A] flex items-end overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-20" style={{
            background: `linear-gradient(135deg, 
              #C4A052 0%, 
              transparent 40%, 
              transparent 60%, 
              #8B7355 100%
            )`,
          }} />
        </div>

        <div className="relative z-10 w-full px-6 md:px-12 pb-16 md:pb-24">
          <div className="max-w-[1800px] mx-auto">
            <span className="text-[10px] tracking-[0.5em] uppercase text-white/40 block mb-6">
              Art History
            </span>
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-8">
              <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl font-light text-white leading-none">
                Movements
              </h1>
              <p className="text-white/50 text-lg max-w-md font-light">
                A century of artistic evolution. From independence to contemporary expression.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Visual */}
      <section className="bg-[#1C1917] px-6 md:px-12 py-16">
        <div className="max-w-[1800px] mx-auto">
          <div className="flex items-center justify-between text-white/30 text-sm">
            <span>1920</span>
            <div className="flex-1 mx-8 h-px bg-white/10 relative">
              {/* Timeline markers */}
              {[1940, 1960, 1980, 2000, 2020].map((year) => (
                <div 
                  key={year}
                  className="absolute top-0 -translate-y-1/2"
                  style={{ left: `${((year - 1920) / 100) * 100}%` }}
                >
                  <div className="w-2 h-2 rounded-full bg-white/20" />
                </div>
              ))}
            </div>
            <span>2025</span>
          </div>
        </div>
      </section>

      {/* Movements Cards - Exhibition Halls */}
      <section className="px-6 md:px-12 py-16 md:py-24">
        <div className="max-w-[1800px] mx-auto">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {sortedMovements.map((movement, index) => (
              <Link
                key={movement.id}
                href={`/movements/${movement.slug}`}
                className={`group relative ${
                  index === 0 ? 'md:col-span-2' : ''
                }`}
              >
                <div className={`relative overflow-hidden ${
                  index === 0 
                    ? 'aspect-[21/9] bg-[#1C1917]' 
                    : 'aspect-[16/9] bg-[#E7E5E4]'
                }`}>
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: index % 2 === 0
                      ? `radial-gradient(circle at 2px 2px, ${index === 0 ? '#C4A052' : '#1C1917'} 1px, transparent 0)`
                      : 'none',
                    backgroundSize: '32px 32px',
                  }} />

                  {/* Hover overlay */}
                  <div className={`absolute inset-0 transition-opacity duration-500 ${
                    index === 0 
                      ? 'bg-[#C4A052] opacity-0 group-hover:opacity-100' 
                      : 'bg-[#1C1917] opacity-0 group-hover:opacity-90'
                  }`} />

                  {/* Content */}
                  <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between">
                    {/* Top row */}
                    <div className="flex justify-between items-start">
                      <span className={`text-[10px] tracking-[0.3em] uppercase ${
                        index === 0 
                          ? 'text-white/40 group-hover:text-[#1C1917]/60' 
                          : 'text-[#78716C] group-hover:text-white/60'
                      } transition-colors`}>
                        {movement.periodStart}—{movement.periodEnd || 'Present'}
                      </span>
                      <span className={`text-[10px] tracking-[0.2em] ${
                        index === 0 
                          ? 'text-white/30 group-hover:text-[#1C1917]/40' 
                          : 'text-[#A8A29E] group-hover:text-white/40'
                      } transition-colors`}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Bottom row */}
                    <div>
                      <h2 className={`font-serif leading-tight transition-colors ${
                        index === 0 
                          ? 'text-4xl md:text-6xl text-white group-hover:text-[#1C1917]' 
                          : 'text-3xl md:text-4xl text-[#1C1917] group-hover:text-white'
                      }`}>
                        {movement.name}
                      </h2>
                      {movement.description && (
                        <p className={`mt-4 text-sm md:text-base max-w-xl line-clamp-2 transition-colors ${
                          index === 0 
                            ? 'text-white/60 group-hover:text-[#1C1917]/70' 
                            : 'text-[#78716C] group-hover:text-white/70'
                        }`}>
                          {movement.description}
                        </p>
                      )}
                      <div className={`mt-6 flex items-center gap-3 transition-colors ${
                        index === 0 
                          ? 'text-white/40 group-hover:text-[#1C1917]/60' 
                          : 'text-[#A8A29E] group-hover:text-white/60'
                      }`}>
                        <span className="text-sm">Explore movement</span>
                        <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {movements.length === 0 && (
            <div className="text-center py-32">
              <p className="text-[#A8A29E] text-lg">No movements documented yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Context Section */}
      <section className="bg-[#E8E4DF] px-6 md:px-12 py-24 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#8B7355] block mb-6">
            Historical Context
          </span>
          <p className="font-serif text-2xl md:text-3xl text-[#1C1917] leading-relaxed">
            Moroccan art movements reflect a unique dialogue between tradition and modernity, 
            indigenous identity and global influence, independence struggles and contemporary expression.
          </p>
        </div>
      </section>
    </div>
  );
}

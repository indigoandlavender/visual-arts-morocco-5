// =============================================================================
// Cities Index Page — The Geographic Wing
// Fondazione Prada Inspired with Mapbox
// =============================================================================

import type { Metadata } from 'next';
import Link from 'next/link';
import { generateListMetadata } from '@/lib/seo';
import { getCities, countArtists, countArtworks, countInstitutions } from '@/lib/queries';
import { MoroccoOverviewMapWrapper } from '@/components/city-map-wrapper';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export const metadata: Metadata = generateListMetadata('cities');

// Major cities with their data
const MAJOR_CITIES = [
  { name: 'Casablanca', slug: 'casablanca', description: 'Economic capital and artistic hub' },
  { name: 'Rabat', slug: 'rabat', description: 'Political capital and cultural institutions' },
  { name: 'Marrakech', slug: 'marrakech', description: 'Historic medina and gallery scene' },
  { name: 'Tangier', slug: 'tangier', description: 'International artistic crossroads' },
  { name: 'Fez', slug: 'fez', description: 'Ancient medina and traditional crafts' },
  { name: 'Essaouira', slug: 'essaouira', description: 'Coastal art and creative haven' },
  { name: 'Tetouan', slug: 'tetouan', description: 'Andalusian heritage and artisan traditions' },
];

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default async function CitiesPage() {
  const [cities, totalArtists, totalArtworks, totalInstitutions] = await Promise.all([
    getCities(),
    countArtists(),
    countArtworks(),
    countInstitutions(),
  ]);

  // Get other cities not in major list
  const majorSlugs = MAJOR_CITIES.map(c => c.slug);
  const otherCities = cities.filter((city: { slug: string }) => !majorSlugs.includes(city.slug));

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* Hero Section with Morocco Overview Map */}
      <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        {/* Map background */}
        <MoroccoOverviewMapWrapper className="absolute inset-0" />
        
        {/* Content overlay */}
        <div className="relative z-10 h-full flex items-end">
          <div className="w-full px-6 md:px-12 pb-16 md:pb-24">
            <div className="max-w-[1800px] mx-auto">
              <span className="text-[10px] tracking-[0.5em] uppercase text-white/40 block mb-6">
                Geographic Archive
              </span>
              <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-8">
                <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl font-light text-white leading-none">
                  Cities
                </h1>
                <p className="text-white/50 text-lg max-w-md font-light">
                  From Casablanca's modernist studios to Tangier's international salons. 
                  Art rooted in place.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Major Art Centers with Maps */}
      <section className="px-6 md:px-12 py-16 md:py-24 bg-[#0A0A0A]">
        <div className="max-w-[1800px] mx-auto">
          <div className="flex justify-between items-end mb-12 md:mb-16">
            <div>
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#C4A052] block mb-3">
                Art Centers
              </span>
              <h2 className="font-serif text-4xl md:text-5xl text-white">
                Major Cities
              </h2>
            </div>
            <span className="text-[10px] tracking-[0.2em] text-white/30">
              {MAJOR_CITIES.length} locations
            </span>
          </div>

          {/* Cities Grid with Maps */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {MAJOR_CITIES.map((city, index) => (
              <Link
                key={city.slug}
                href={`/cities/${city.slug}`}
                className={`group relative overflow-hidden ${
                  index === 0 ? 'md:col-span-2 lg:col-span-2 lg:row-span-2' : ''
                }`}
              >
                <div className={`relative ${
                  index === 0 ? 'aspect-square md:aspect-[16/9] lg:aspect-square' : 'aspect-[4/3]'
                }`}>
                  {/* Dark background with subtle pattern */}
                  <div className="absolute inset-0 bg-[#1C1917]">
                    <div className="absolute inset-0 opacity-10" style={{
                      backgroundImage: `radial-gradient(circle at 30% 40%, #C4A052 0%, transparent 50%)`
                    }} />
                  </div>
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-[#C4A052] opacity-0 group-hover:opacity-90 transition-opacity duration-500" />

                  {/* Content */}
                  <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between z-10">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] tracking-[0.3em] uppercase text-white/50 group-hover:text-[#1C1917]/60 transition-colors">
                        {city.description}
                      </span>
                      <span className="text-[10px] tracking-[0.2em] text-white/30 group-hover:text-[#1C1917]/40 transition-colors">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <div>
                      <h3 className={`font-serif text-white group-hover:text-[#1C1917] transition-colors ${
                        index === 0 ? 'text-5xl md:text-7xl' : 'text-3xl md:text-4xl'
                      }`}>
                        {city.name}
                      </h3>
                      <div className="mt-4 flex items-center gap-3 text-white/50 group-hover:text-[#1C1917]/70 transition-colors">
                        <span className="text-sm">Explore city</span>
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
        </div>
      </section>

      {/* All Cities List */}
      {otherCities.length > 0 && (
        <section className="bg-[#FAF9F6] border-t border-[#E7E5E4] px-6 md:px-12 py-16 md:py-24">
          <div className="max-w-[1800px] mx-auto">
            <div className="mb-12">
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#A8A29E] block mb-3">
                Complete Index
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-[#1C1917]">
                All Cities
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {otherCities.map((city: { id: string; slug: string; name: string; region?: string | null }) => (
                <Link
                  key={city.id}
                  href={`/cities/${city.slug}`}
                  className="group py-4 border-b border-[#E7E5E4] hover:border-[#1C1917] transition-colors"
                >
                  <span className="font-serif text-lg text-[#1C1917] group-hover:text-[#78716C] transition-colors">
                    {city.name}
                  </span>
                  {city.region && (
                    <span className="block text-xs text-[#A8A29E] mt-1">
                      {city.region}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* International Section */}
      <section className="bg-[#1C1917] px-6 md:px-12 py-24 md:py-32">
        <div className="max-w-[1800px] mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[10px] tracking-[0.3em] uppercase text-white/30 block mb-6">
                Beyond Borders
              </span>
              <h2 className="font-serif text-4xl md:text-5xl text-white mb-6">
                The Diaspora
              </h2>
              <p className="text-white/50 text-lg leading-relaxed">
                Moroccan artists have established significant presences in Paris, Brussels, 
                Amsterdam, and New York. Their work bridges cultures while maintaining 
                deep connections to their origins.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {['Paris', 'Brussels', 'Amsterdam', 'New York'].map((city) => (
                <div 
                  key={city}
                  className="py-6 px-4 border border-white/10 text-center hover:border-[#C4A052]/50 transition-colors"
                >
                  <span className="font-serif text-2xl text-white/70">{city}</span>
                  <span className="block text-[10px] tracking-[0.2em] uppercase text-white/30 mt-2">
                    Coming soon
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {cities.length === 0 && (
        <section className="px-6 md:px-12 py-32">
          <div className="text-center">
            <p className="text-[#A8A29E] text-lg">No cities documented yet.</p>
          </div>
        </section>
      )}
    </div>
  );
}

'use client';

// Use environment variable or fallback to hardcoded token
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoiaW5kaWdvYW5kbGF2ZW5kZXIiLCJhIjoiY21kN3B0OTZvMGllNjJpcXY0MnZlZHVlciJ9.1-jV-Pze3d7HZseOAhmkCg';

// City coordinates - matches data from Google Sheets
const CITY_COORDINATES: Record<string, { lng: number; lat: number; zoom: number }> = {
  casablanca: { lng: -7.5898, lat: 33.5731, zoom: 12 },
  rabat: { lng: -6.8498, lat: 34.0209, zoom: 12 },
  marrakech: { lng: -7.9811, lat: 31.6295, zoom: 12 },
  tangier: { lng: -5.8326, lat: 35.7595, zoom: 12 },
  fes: { lng: -5.0003, lat: 34.0331, zoom: 12 },
  fez: { lng: -5.0003, lat: 34.0331, zoom: 12 },
  tetouan: { lng: -5.3684, lat: 35.5889, zoom: 12 },
  essaouira: { lng: -9.7595, lat: 31.5085, zoom: 12 },
  asilah: { lng: -6.0341, lat: 35.4653, zoom: 12 },
  agadir: { lng: -9.5981, lat: 30.4278, zoom: 12 },
  ouarzazate: { lng: -6.9063, lat: 30.9189, zoom: 12 },
  paris: { lng: 2.3522, lat: 48.8566, zoom: 11 },
  'new-york': { lng: -74.0060, lat: 40.7128, zoom: 11 },
  newyork: { lng: -74.0060, lat: 40.7128, zoom: 11 },
};

interface CityMapProps {
  city: string;
  className?: string;
}

// Simple static map component using Mapbox Static Images API
export function CityMap({ city, className = '' }: CityMapProps) {
  const cityKey = city.toLowerCase().replace(/[^a-z-]/g, '');
  const coords = CITY_COORDINATES[cityKey];

  if (!coords) {
    return (
      <div className={`bg-[#1C1917] flex items-center justify-center relative overflow-hidden ${className}`}>
        <div className="absolute inset-0 opacity-20">
          <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id={`grid-${cityKey}`} width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#C4A052" strokeWidth="0.3"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill={`url(#grid-${cityKey})`} />
            <circle cx="50" cy="50" r="3" fill="#C4A052" opacity="0.8"/>
          </svg>
        </div>
        <span className="relative z-10 text-[10px] tracking-[0.3em] uppercase text-white/30">
          {city}
        </span>
      </div>
    );
  }

  // Mapbox Static Images API with gold marker and tilted view
  const staticMapUrl = `https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/pin-s+c4a052(${coords.lng},${coords.lat})/${coords.lng},${coords.lat},${coords.zoom},0,45/1200x600@2x?access_token=${MAPBOX_TOKEN}`;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src={staticMapUrl}
        alt={`Map of ${city}`}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Gradient overlays for cinematic effect */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-50" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#0A0A0A] via-transparent to-transparent opacity-30" />
    </div>
  );
}

// Morocco overview static map
export function MoroccoOverviewMap({ className = '' }: { className?: string }) {
  // Morocco center coordinates
  const lng = -7.0926;
  const lat = 31.7917;
  const zoom = 5;

  const staticMapUrl = `https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/${lng},${lat},${zoom},0,30/1400x800@2x?access_token=${MAPBOX_TOKEN}`;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src={staticMapUrl}
        alt="Map of Morocco"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Gradient overlays */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/50 opacity-60" />
    </div>
  );
}

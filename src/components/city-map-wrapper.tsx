'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, Component, ReactNode } from 'react';

// =============================================================================
// Error Boundary
// =============================================================================

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
  onError?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError?.();
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// =============================================================================
// Fallback Component
// =============================================================================

function MapFallback({ city, className }: { city?: string; className?: string }) {
  return (
    <div className={`bg-[#1C1917] flex items-center justify-center relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 opacity-20">
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id={`grid-fallback-${city || 'morocco'}`} width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#C4A052" strokeWidth="0.3"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill={`url(#grid-fallback-${city || 'morocco'})`} />
          <circle cx="50" cy="50" r="3" fill="#C4A052" opacity="0.8"/>
        </svg>
      </div>
      {city && (
        <span className="relative z-10 text-[10px] tracking-[0.3em] uppercase text-white/30">
          {city}
        </span>
      )}
    </div>
  );
}

// =============================================================================
// Dynamic Imports (ssr: false)
// =============================================================================

const CityMapComponent = dynamic(
  () => import('./city-map').then(mod => mod.CityMap),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-[#1C1917] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C4A052]/20 border-t-[#C4A052] rounded-full animate-spin" />
      </div>
    ),
  }
);

const MoroccoOverviewMapComponent = dynamic(
  () => import('./city-map').then(mod => mod.MoroccoOverviewMap),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-[#1C1917] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C4A052]/20 border-t-[#C4A052] rounded-full animate-spin" />
      </div>
    ),
  }
);

// =============================================================================
// CityMap Wrapper
// =============================================================================

interface CityMapWrapperProps {
  city: string;
  className?: string;
}

export function CityMapWrapper({ city, className = '' }: CityMapWrapperProps) {
  const [mapError, setMapError] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Server-side or error: show fallback
  if (!isClient || mapError) {
    return <MapFallback city={city} className={className} />;
  }

  return (
    <ErrorBoundary fallback={<MapFallback city={city} className={className} />} onError={() => setMapError(true)}>
      <CityMapComponent city={city} className={className} />
    </ErrorBoundary>
  );
}

// =============================================================================
// MoroccoOverviewMap Wrapper
// =============================================================================

interface MoroccoOverviewMapWrapperProps {
  className?: string;
}

export function MoroccoOverviewMapWrapper({ className = '' }: MoroccoOverviewMapWrapperProps) {
  const [mapError, setMapError] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Server-side or error: show fallback
  if (!isClient || mapError) {
    return <MapFallback className={className} />;
  }

  return (
    <ErrorBoundary fallback={<MapFallback className={className} />} onError={() => setMapError(true)}>
      <MoroccoOverviewMapComponent className={className} />
    </ErrorBoundary>
  );
}

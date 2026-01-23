// =============================================================================
// Permission & Access Control Layer
// Moroccan Art Platform
//
// FUTURE IMPLEMENTATION: This module defines the permission structure
// for implementing paywalls and tiered access. Not yet active.
// =============================================================================

import type { UserTier, AccessTier } from '@/types';

// =============================================================================
// PERMISSION DEFINITIONS
// =============================================================================

export interface Permission {
  action: string;
  resource: string;
  tier: UserTier[];
}

export const PERMISSIONS: Permission[] = [
  // Free tier permissions
  { action: 'read', resource: 'artist.basic', tier: ['FREE', 'PREMIUM', 'INSTITUTIONAL'] },
  { action: 'read', resource: 'artwork.basic', tier: ['FREE', 'PREMIUM', 'INSTITUTIONAL'] },
  { action: 'read', resource: 'movement', tier: ['FREE', 'PREMIUM', 'INSTITUTIONAL'] },
  { action: 'read', resource: 'theme', tier: ['FREE', 'PREMIUM', 'INSTITUTIONAL'] },
  { action: 'read', resource: 'city', tier: ['FREE', 'PREMIUM', 'INSTITUTIONAL'] },
  { action: 'search', resource: 'basic', tier: ['FREE', 'PREMIUM', 'INSTITUTIONAL'] },

  // Premium tier permissions
  { action: 'read', resource: 'artist.full', tier: ['PREMIUM', 'INSTITUTIONAL'] },
  { action: 'read', resource: 'artwork.full', tier: ['PREMIUM', 'INSTITUTIONAL'] },
  { action: 'read', resource: 'artist.externalReferences', tier: ['PREMIUM', 'INSTITUTIONAL'] },
  { action: 'search', resource: 'advanced', tier: ['PREMIUM', 'INSTITUTIONAL'] },
  { action: 'filter', resource: 'multiple', tier: ['PREMIUM', 'INSTITUTIONAL'] },
  { action: 'save', resource: 'artist', tier: ['PREMIUM', 'INSTITUTIONAL'] },
  { action: 'save', resource: 'artwork', tier: ['PREMIUM', 'INSTITUTIONAL'] },
  { action: 'save', resource: 'search', tier: ['PREMIUM', 'INSTITUTIONAL'] },

  // Institutional tier permissions
  { action: 'export', resource: 'artists', tier: ['INSTITUTIONAL'] },
  { action: 'export', resource: 'artworks', tier: ['INSTITUTIONAL'] },
  { action: 'api', resource: 'full', tier: ['INSTITUTIONAL'] },
  { action: 'api', resource: 'bulk', tier: ['INSTITUTIONAL'] },
];

// =============================================================================
// PERMISSION CHECKER
// =============================================================================

export function hasPermission(
  userTier: UserTier,
  action: string,
  resource: string
): boolean {
  const permission = PERMISSIONS.find(
    (p) => p.action === action && p.resource === resource
  );

  if (!permission) return false;

  return permission.tier.includes(userTier);
}

export function canAccessContent(
  userTier: UserTier,
  contentTier: AccessTier
): boolean {
  if (contentTier === 'FREE') return true;
  if (contentTier === 'PREMIUM') {
    return userTier === 'PREMIUM' || userTier === 'INSTITUTIONAL';
  }
  return false;
}

// =============================================================================
// CONTENT FILTERING
// =============================================================================

export interface ContentFilter {
  includeFullBiography: boolean;
  includeExternalReferences: boolean;
  maxArtworksPerArtist: number;
  includeHighResImages: boolean;
  allowAdvancedFilters: boolean;
  allowDataExport: boolean;
}

export function getContentFilterForTier(tier: UserTier): ContentFilter {
  switch (tier) {
    case 'INSTITUTIONAL':
      return {
        includeFullBiography: true,
        includeExternalReferences: true,
        maxArtworksPerArtist: -1, // Unlimited
        includeHighResImages: true,
        allowAdvancedFilters: true,
        allowDataExport: true,
      };

    case 'PREMIUM':
      return {
        includeFullBiography: true,
        includeExternalReferences: true,
        maxArtworksPerArtist: -1,
        includeHighResImages: true,
        allowAdvancedFilters: true,
        allowDataExport: false,
      };

    case 'FREE':
    default:
      return {
        includeFullBiography: false,
        includeExternalReferences: false,
        maxArtworksPerArtist: 3,
        includeHighResImages: false,
        allowAdvancedFilters: false,
        allowDataExport: false,
      };
  }
}

// =============================================================================
// PAYWALL HOOKS
// =============================================================================

export interface PaywallConfig {
  feature: string;
  minimumTier: UserTier;
  message: string;
  upgradeUrl: string;
}

export const PAYWALL_CONFIGS: PaywallConfig[] = [
  {
    feature: 'full_biography',
    minimumTier: 'PREMIUM',
    message: 'Upgrade to Premium for full artist biographies',
    upgradeUrl: '/upgrade?feature=biography',
  },
  {
    feature: 'external_references',
    minimumTier: 'PREMIUM',
    message: 'Upgrade to Premium for museum and publication links',
    upgradeUrl: '/upgrade?feature=references',
  },
  {
    feature: 'advanced_filters',
    minimumTier: 'PREMIUM',
    message: 'Upgrade to Premium for advanced search filters',
    upgradeUrl: '/upgrade?feature=filters',
  },
  {
    feature: 'data_export',
    minimumTier: 'INSTITUTIONAL',
    message: 'Institutional access required for data export',
    upgradeUrl: '/contact?inquiry=institutional',
  },
  {
    feature: 'api_access',
    minimumTier: 'INSTITUTIONAL',
    message: 'Institutional access required for API access',
    upgradeUrl: '/contact?inquiry=api',
  },
];

export function getPaywallConfig(feature: string): PaywallConfig | undefined {
  return PAYWALL_CONFIGS.find((p) => p.feature === feature);
}

export function shouldShowPaywall(
  feature: string,
  userTier: UserTier
): PaywallConfig | null {
  const config = getPaywallConfig(feature);
  if (!config) return null;

  const tierRank: Record<UserTier, number> = {
    FREE: 0,
    PREMIUM: 1,
    INSTITUTIONAL: 2,
  };

  if (tierRank[userTier] < tierRank[config.minimumTier]) {
    return config;
  }

  return null;
}

// =============================================================================
// RATE LIMITING (Future Implementation)
// =============================================================================

export interface RateLimitConfig {
  tier: UserTier;
  requestsPerMinute: number;
  searchesPerMinute: number;
  exportsPerDay: number;
}

export const RATE_LIMITS: RateLimitConfig[] = [
  { tier: 'FREE', requestsPerMinute: 30, searchesPerMinute: 10, exportsPerDay: 0 },
  { tier: 'PREMIUM', requestsPerMinute: 100, searchesPerMinute: 50, exportsPerDay: 10 },
  { tier: 'INSTITUTIONAL', requestsPerMinute: 1000, searchesPerMinute: 500, exportsPerDay: 100 },
];

export function getRateLimitForTier(tier: UserTier): RateLimitConfig {
  return RATE_LIMITS.find((r) => r.tier === tier) || RATE_LIMITS[0];
}

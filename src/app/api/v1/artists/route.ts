export const dynamic = 'force-dynamic';
// =============================================================================
// Artists API Route
// Moroccan Art Platform
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getArtists, getArtistFacets } from '@/lib/queries';
import type { ApiResponse, Artist } from '@/types';

// =============================================================================
// GET /api/v1/artists
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Get all artists
    const artists = await getArtists();

    // Optional: filter by object type
    const objectType = searchParams.get('objectType');
    let filtered = artists;
    if (objectType) {
      filtered = artists.filter(a =>
        a.primaryObjectType?.slug === objectType.toLowerCase()
      );
    }

    // Optional: filter by search query
    const q = searchParams.get('q');
    if (q) {
      const query = q.toLowerCase();
      filtered = filtered.filter(a =>
        a.name.toLowerCase().includes(query) ||
        a.biographyShort?.toLowerCase().includes(query)
      );
    }

    // Pagination
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = Math.min(parseInt(searchParams.get('limit') || '24', 10), 100);
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    // Get facets if requested
    const facets = searchParams.get('facets') === 'true'
      ? await getArtistFacets()
      : undefined;

    const response: ApiResponse<{
      data: Artist[];
      pagination: { page: number; limit: number; total: number; totalPages: number };
      facets?: unknown;
    }> = {
      success: true,
      data: {
        data: paginated,
        pagination: {
          page,
          limit,
          total: filtered.length,
          totalPages: Math.ceil(filtered.length / limit),
        },
        facets,
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0',
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Artists API error:', error);

    const response: ApiResponse<null> = {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch artists',
      },
    };

    return NextResponse.json(response, { status: 500 });
  }
}

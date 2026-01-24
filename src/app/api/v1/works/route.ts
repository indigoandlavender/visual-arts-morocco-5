// =============================================================================
// Works API Route
// Moroccan Art Platform
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getArtworks, getArtworkFacets } from '@/lib/queries';
import type { ApiResponse, Artwork } from '@/types';

// =============================================================================
// GET /api/v1/works
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Get all artworks
    const artworks = await getArtworks();

    // Optional: filter by medium
    const medium = searchParams.get('medium');
    let filtered = artworks;
    if (medium) {
      filtered = artworks.filter(a =>
        a.medium === medium.toUpperCase() || a.medium === 'BOTH'
      );
    }

    // Optional: filter by iconic
    const iconic = searchParams.get('iconic');
    if (iconic === 'true') {
      filtered = filtered.filter(a => a.isIconic);
    }

    // Optional: filter by artist
    const artistId = searchParams.get('artist');
    if (artistId) {
      filtered = filtered.filter(a => a.artistId === artistId);
    }

    // Optional: filter by search query
    const q = searchParams.get('q');
    if (q) {
      const query = q.toLowerCase();
      filtered = filtered.filter(a =>
        a.title.toLowerCase().includes(query) ||
        a.description?.toLowerCase().includes(query)
      );
    }

    // Pagination
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = Math.min(parseInt(searchParams.get('limit') || '24', 10), 100);
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    // Get facets if requested
    const facets = searchParams.get('facets') === 'true'
      ? await getArtworkFacets()
      : undefined;

    const response: ApiResponse<{
      data: Artwork[];
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
    console.error('Works API error:', error);

    const response: ApiResponse<null> = {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch works',
      },
    };

    return NextResponse.json(response, { status: 500 });
  }
}

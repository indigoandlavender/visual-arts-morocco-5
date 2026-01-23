// =============================================================================
// Artists API Route
// Moroccan Art Platform
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getArtists, getArtistFacets } from '@/lib/queries/artists';
import type { SearchParams, ApiResponse, PaginatedResult, ArtistBasic } from '@/types';

// =============================================================================
// GET /api/v1/artists
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const params: SearchParams = {
      q: searchParams.get('q') || undefined,
      medium: searchParams.get('medium') as any || undefined,
      periodStart: searchParams.get('periodStart')
        ? parseInt(searchParams.get('periodStart')!, 10)
        : undefined,
      periodEnd: searchParams.get('periodEnd')
        ? parseInt(searchParams.get('periodEnd')!, 10)
        : undefined,
      city: searchParams.get('city') || undefined,
      theme: searchParams.get('theme') || undefined,
      movement: searchParams.get('movement') || undefined,
      page: searchParams.get('page')
        ? parseInt(searchParams.get('page')!, 10)
        : 1,
      limit: searchParams.get('limit')
        ? Math.min(parseInt(searchParams.get('limit')!, 10), 100)
        : 24,
      sort: (searchParams.get('sort') as any) || 'name',
      order: (searchParams.get('order') as 'asc' | 'desc') || 'asc',
    };

    // Fetch data
    const [result, facets] = await Promise.all([
      getArtists(params),
      searchParams.get('facets') === 'true' ? getArtistFacets() : null,
    ]);

    const response: ApiResponse<PaginatedResult<ArtistBasic>> = {
      success: true,
      data: {
        ...result,
        facets: facets || undefined,
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

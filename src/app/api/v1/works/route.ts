// =============================================================================
// Works API Route
// Moroccan Art Platform
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getArtworks, getArtworkFacets } from '@/lib/queries';
import type { SearchParams, ApiResponse, PaginatedResult, ArtworkBasic } from '@/types';

// =============================================================================
// GET /api/v1/works
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
      artist: searchParams.get('artist') || undefined,
      iconic: searchParams.get('iconic') === 'true',
      page: searchParams.get('page')
        ? parseInt(searchParams.get('page')!, 10)
        : 1,
      limit: searchParams.get('limit')
        ? Math.min(parseInt(searchParams.get('limit')!, 10), 100)
        : 24,
      sort: (searchParams.get('sort') as any) || 'year',
      order: (searchParams.get('order') as 'asc' | 'desc') || 'desc',
    };

    // Fetch data
    const [result, facets] = await Promise.all([
      getArtworks(params),
      searchParams.get('facets') === 'true' ? getArtworkFacets() : null,
    ]);

    const response: ApiResponse<PaginatedResult<ArtworkBasic>> = {
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

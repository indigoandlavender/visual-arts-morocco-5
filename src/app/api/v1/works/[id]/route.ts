// =============================================================================
// Work Detail API Route
// Moroccan Art Platform
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getArtworkById, getArtworkBySlug } from '@/lib/queries';
import type { ApiResponse, Artwork } from '@/types';

// =============================================================================
// GET /api/v1/works/[id]
// =============================================================================

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Try to find by ID first, then by slug
    let artwork = await getArtworkById(id);

    if (!artwork) {
      artwork = await getArtworkBySlug(id);
    }

    if (!artwork) {
      const response: ApiResponse<null> = {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Artwork not found: ${id}`,
        },
      };

      return NextResponse.json(response, { status: 404 });
    }

    // TODO: Apply access tier filtering based on user authentication
    // const userTier = await getUserTier(request);
    // const filteredArtwork = applyAccessFilter(artwork, userTier);

    const response: ApiResponse<Artwork> = {
      success: true,
      data: artwork,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0',
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Artwork API error:', error);

    const response: ApiResponse<null> = {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch artwork',
      },
    };

    return NextResponse.json(response, { status: 500 });
  }
}

// =============================================================================
// Artist Detail API Route
// Moroccan Art Platform
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getArtistById, getArtistBySlug } from '@/lib/queries';
import type { ApiResponse, Artist } from '@/types';

// =============================================================================
// GET /api/v1/artists/[id]
// =============================================================================

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Try to find by ID first, then by slug
    let artist = await getArtistById(id);

    if (!artist) {
      artist = await getArtistBySlug(id);
    }

    if (!artist) {
      const response: ApiResponse<null> = {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Artist not found: ${id}`,
        },
      };

      return NextResponse.json(response, { status: 404 });
    }

    // TODO: Apply access tier filtering based on user authentication
    // const userTier = await getUserTier(request);
    // const filteredArtist = applyAccessFilter(artist, userTier);

    const response: ApiResponse<Artist> = {
      success: true,
      data: artist,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0',
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Artist API error:', error);

    const response: ApiResponse<null> = {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch artist',
      },
    };

    return NextResponse.json(response, { status: 500 });
  }
}

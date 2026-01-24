// =============================================================================
// Search API Route
// Moroccan Art Platform
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { searchAll } from '@/lib/queries';
import type { ApiResponse } from '@/types';

// =============================================================================
// GET /api/v1/search
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';

    if (!query.trim()) {
      const response: ApiResponse<{ results: never[]; total: number }> = {
        success: true,
        data: {
          results: [],
          total: 0,
        },
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0',
        },
      };
      return NextResponse.json(response);
    }

    // Execute search across all entities
    const results = await searchAll(query);

    const response: ApiResponse<typeof results> = {
      success: true,
      data: results,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0',
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Search API error:', error);

    const response: ApiResponse<null> = {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Search failed',
      },
    };

    return NextResponse.json(response, { status: 500 });
  }
}

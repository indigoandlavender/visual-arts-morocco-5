// =============================================================================
// Search API Route
// Moroccan Art Platform
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { executeSearch, parseURLParams, getAutocompleteSuggestions } from '@/lib/search';
import type { ApiResponse, SearchResultSet, AutocompleteSuggestion } from '@/types/search';

// =============================================================================
// GET /api/v1/search
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Check if this is an autocomplete request
    const autocomplete = searchParams.get('autocomplete');
    if (autocomplete) {
      return handleAutocomplete(autocomplete, searchParams);
    }

    // Parse URL params into search query
    const urlParams: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      urlParams[key] = value;
    });

    const query = parseURLParams(urlParams);

    // Execute search
    const results = await executeSearch(query);

    const response: ApiResponse<SearchResultSet> = {
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

// =============================================================================
// AUTOCOMPLETE HANDLER
// =============================================================================

async function handleAutocomplete(
  prefix: string,
  searchParams: URLSearchParams
): Promise<NextResponse> {
  try {
    const entityTypes = searchParams.get('types')?.split(',') as any[] | undefined;
    const limit = searchParams.get('limit')
      ? parseInt(searchParams.get('limit')!, 10)
      : 10;

    const suggestions = await getAutocompleteSuggestions({
      prefix,
      entityTypes,
      limit,
    });

    const response: ApiResponse<AutocompleteSuggestion[]> = {
      success: true,
      data: suggestions,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0',
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Autocomplete API error:', error);

    const response: ApiResponse<null> = {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Autocomplete failed',
      },
    };

    return NextResponse.json(response, { status: 500 });
  }
}

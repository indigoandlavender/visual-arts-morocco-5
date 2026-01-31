// =============================================================================
// Institutions API Route
// GET /api/v1/institutions
// =============================================================================

import { NextResponse } from 'next/server';
import { getAllInstitutions, getInstitutionsByCitySlug, getInstitutionsByType } from '@/lib/queries';
import type { InstitutionType } from '@/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const type = searchParams.get('type') as InstitutionType | null;

    let institutions;

    if (city) {
      institutions = await getInstitutionsByCitySlug(city);
    } else if (type) {
      institutions = await getInstitutionsByType(type);
    } else {
      institutions = await getAllInstitutions();
    }

    return NextResponse.json({
      success: true,
      data: institutions,
      meta: {
        total: institutions.length,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching institutions:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: 'Failed to fetch institutions',
        },
      },
      { status: 500 }
    );
  }
}

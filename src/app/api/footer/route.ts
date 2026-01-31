// =============================================================================
// Footer API - Fetches Legal Links from Nexus
// =============================================================================

import { NextResponse } from 'next/server';
import { readSheetValues } from '@/lib/db/sheets-client';

const NEXUS_SHEET_ID = process.env.NEXUS_SHEET_ID || '1OIw-cgup17vdimqveVNOmSBSrRbykuTVM39Umm-PJtQ';

const DEFAULT_LEGAL_LINKS = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Disclaimer', href: '/disclaimer' },
];

async function getLegalPages(): Promise<Array<{ label: string; href: string }>> {
  try {
    const rows = await readSheetValues(NEXUS_SHEET_ID, 'Legal_Pages!A:D');

    if (!rows || rows.length < 2) {
      return DEFAULT_LEGAL_LINKS;
    }

    const headers = rows[0] as string[];
    const slugIdx = headers.indexOf('slug');
    const titleIdx = headers.indexOf('title');

    if (slugIdx === -1 || titleIdx === -1) {
      return DEFAULT_LEGAL_LINKS;
    }

    return rows.slice(1).map((row) => ({
      label: row[titleIdx] || row[slugIdx],
      href: `/${row[slugIdx]}`,
    }));
  } catch (error) {
    console.error('Error fetching legal pages from Nexus:', error);
    return DEFAULT_LEGAL_LINKS;
  }
}

export async function GET() {
  const legalPages = await getLegalPages();

  return NextResponse.json({
    legal: legalPages,
    poweredBy: {
      name: 'Slow Morocco',
      url: 'https://slowmorocco.com',
    },
    copyright: {
      year: new Date().getFullYear(),
      name: 'Slow Morocco',
    },
  });
}

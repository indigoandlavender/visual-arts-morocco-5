// =============================================================================
// Footer API - Fetches Legal Links from Nexus
// =============================================================================

import { NextResponse } from 'next/server';
import { getSheetsClient } from '@/lib/db/sheets-client';

const NEXUS_SHEET_ID = process.env.NEXUS_SHEET_ID || '1OIw-cgup17vdimqveVNOmSBSrRbykuTVM39Umm-PJtQ';

async function getLegalPages(): Promise<Array<{ label: string; href: string }>> {
  try {
    const sheets = await getSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: NEXUS_SHEET_ID,
      range: 'Legal_Pages!A:D',
    });

    const rows = response.data.values;
    if (!rows || rows.length < 2) {
      // Return default legal links if sheet is empty
      return [
        { label: 'Privacy', href: '/privacy' },
        { label: 'Terms', href: '/terms' },
        { label: 'Disclaimer', href: '/disclaimer' },
      ];
    }

    const headers = rows[0] as string[];
    const slugIdx = headers.indexOf('slug');
    const titleIdx = headers.indexOf('title');

    if (slugIdx === -1 || titleIdx === -1) {
      return [
        { label: 'Privacy', href: '/privacy' },
        { label: 'Terms', href: '/terms' },
        { label: 'Disclaimer', href: '/disclaimer' },
      ];
    }

    return rows.slice(1).map((row) => ({
      label: row[titleIdx] || row[slugIdx],
      href: `/${row[slugIdx]}`,
    }));
  } catch (error) {
    console.error('Error fetching legal pages from Nexus:', error);
    // Return fallback
    return [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Disclaimer', href: '/disclaimer' },
    ];
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

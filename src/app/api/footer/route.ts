// =============================================================================
// Footer API - Fetches Legal Links from Nexus
// =============================================================================

import { NextResponse } from 'next/server';
import { google } from 'googleapis';

const NEXUS_SHEET_ID = '1OIw-cgup17vdimqveVNOmSBSrRbykuTVM39Umm-PJtQ';

async function getSheetsClient() {
  let auth;

  if (process.env.GOOGLE_SERVICE_ACCOUNT_BASE64) {
    const decoded = Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf-8');
    const credentials = JSON.parse(decoded);
    auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
  } else if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
  } else {
    throw new Error('No Google credentials found');
  }

  return google.sheets({ version: 'v4', auth });
}

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

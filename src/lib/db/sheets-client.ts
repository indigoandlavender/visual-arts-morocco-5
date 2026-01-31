import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

let sheetsClient: ReturnType<typeof google.sheets> | null = null;

export async function getSheetsClient() {
  if (sheetsClient) return sheetsClient;

  let auth;

  // Check for base64 encoded credentials (Slow Morocco pattern)
  if (process.env.GOOGLE_SERVICE_ACCOUNT_BASE64) {
    const decoded = Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf-8');
    const credentials = JSON.parse(decoded);
    auth = new google.auth.GoogleAuth({
      credentials,
      scopes: SCOPES,
    });
  }
  // Check for raw JSON credentials
  else if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    auth = new google.auth.GoogleAuth({
      credentials,
      scopes: SCOPES,
    });
  }
  // Fall back to credentials file (local dev)
  else {
    const keyFilePath = path.join(process.cwd(), 'credentials/google-service-account.json');
    if (fs.existsSync(keyFilePath)) {
      auth = new google.auth.GoogleAuth({
        keyFile: keyFilePath,
        scopes: SCOPES,
      });
    } else {
      throw new Error('No Google credentials found. Set GOOGLE_SERVICE_ACCOUNT_BASE64 or GOOGLE_SERVICE_ACCOUNT_KEY env var.');
    }
  }

  sheetsClient = google.sheets({ version: 'v4', auth });
  return sheetsClient;
}

export function getSheetId() {
  return process.env.GOOGLE_SHEET_ID!;
}

// Sheet names matching our data model
export const SHEETS = {
  ARTISTS: 'Artists',
  ARTWORKS: 'Artworks',
  MOVEMENTS: 'Movements',
  THEMES: 'Themes',
  CITIES: 'Cities',
  INSTITUTIONS: 'Institutions',
  ARTIST_CITIES: 'ArtistCities',
  ARTIST_THEMES: 'ArtistThemes',
  ARTIST_MOVEMENTS: 'ArtistMovements',
  ARTIST_RELATIONS: 'ArtistRelations',
  ARTWORK_THEMES: 'ArtworkThemes',
  ARTWORK_CITIES: 'ArtworkCities',
  ICONIC_IMAGES: 'IconicImages',
} as const;

export type SheetName = typeof SHEETS[keyof typeof SHEETS];

// Generic function to read all rows from a sheet
export async function readSheet<T>(sheetName: SheetName): Promise<T[]> {
  const sheets = await getSheetsClient();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: getSheetId(),
    range: `${sheetName}!A:ZZ`,
  });

  const rows = response.data.values;
  if (!rows || rows.length < 2) return [];

  const headers = rows[0] as string[];
  const data = rows.slice(1);

  return data.map((row) => {
    const obj: Record<string, unknown> = {};
    headers.forEach((header, index) => {
      const value = row[index];
      // Parse JSON fields, numbers, booleans
      if (value === undefined || value === '') {
        obj[header] = null;
      } else if (value === 'TRUE' || value === 'true') {
        obj[header] = true;
      } else if (value === 'FALSE' || value === 'false') {
        obj[header] = false;
      } else if (!isNaN(Number(value)) && value !== '') {
        obj[header] = Number(value);
      } else {
        obj[header] = value;
      }
    });
    return obj as T;
  });
}

// Generic function to write data to a sheet
export async function writeSheet<T extends Record<string, unknown>>(
  sheetName: SheetName,
  data: T[],
  headers?: string[]
): Promise<void> {
  const sheets = await getSheetsClient();

  if (data.length === 0) return;

  const cols = headers || Object.keys(data[0]);
  const values = [
    cols,
    ...data.map((row) =>
      cols.map((col) => {
        const val = row[col];
        if (val === null || val === undefined) return '';
        if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
        return String(val);
      })
    ),
  ];

  // Clear existing data first
  await sheets.spreadsheets.values.clear({
    spreadsheetId: getSheetId(),
    range: `${sheetName}!A:ZZ`,
  });

  // Write new data
  await sheets.spreadsheets.values.update({
    spreadsheetId: getSheetId(),
    range: `${sheetName}!A1`,
    valueInputOption: 'RAW',
    requestBody: { values },
  });
}

// Append rows to a sheet
export async function appendToSheet<T extends Record<string, unknown>>(
  sheetName: SheetName,
  data: T[],
  headers?: string[]
): Promise<void> {
  const sheets = await getSheetsClient();

  if (data.length === 0) return;

  const cols = headers || Object.keys(data[0]);
  const values = data.map((row) =>
    cols.map((col) => {
      const val = row[col];
      if (val === null || val === undefined) return '';
      if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
      return String(val);
    })
  );

  await sheets.spreadsheets.values.append({
    spreadsheetId: getSheetId(),
    range: `${sheetName}!A1`,
    valueInputOption: 'RAW',
    requestBody: { values },
  });
}

// Create all required sheets if they don't exist
export async function initializeSheets(): Promise<void> {
  const sheets = await getSheetsClient();

  // Get existing sheets
  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId: getSheetId(),
  });

  const existingSheets = spreadsheet.data.sheets?.map(s => s.properties?.title) || [];
  const requiredSheets = Object.values(SHEETS);
  const missingSheets = requiredSheets.filter(s => !existingSheets.includes(s));

  if (missingSheets.length > 0) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: getSheetId(),
      requestBody: {
        requests: missingSheets.map(title => ({
          addSheet: { properties: { title } }
        }))
      }
    });
  }
}

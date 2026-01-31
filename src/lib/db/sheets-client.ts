import { google } from 'googleapis';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

let sheetsClient: ReturnType<typeof google.sheets> | null = null;
let cachedAccessToken: { token: string; expiry: number } | null = null;

// Fix private key that may have been corrupted during encoding/copying
function fixPrivateKey(key: string): string {
  if (!key) return key;

  let fixed = key;

  // Remove carriage returns
  fixed = fixed.replace(/\r/g, '');

  // Handle multiple levels of escaping: \\\\n -> \\n -> \n
  while (fixed.includes('\\\\n')) {
    fixed = fixed.replace(/\\\\n/g, '\\n');
  }

  // Replace literal \n strings with actual newlines
  fixed = fixed.replace(/\\n/g, '\n');

  // Ensure proper PEM format with line breaks every 64 chars in the body
  if (!fixed.includes('\n') && fixed.includes('-----BEGIN')) {
    const match = fixed.match(/-----BEGIN PRIVATE KEY-----(.*?)-----END PRIVATE KEY-----/);
    if (match) {
      const body = match[1].replace(/\s/g, '');
      const formatted = body.match(/.{1,64}/g)?.join('\n') || body;
      fixed = `-----BEGIN PRIVATE KEY-----\n${formatted}\n-----END PRIVATE KEY-----\n`;
    }
  }

  return fixed;
}

// Parse credentials from string, handling double-stringified JSON
function parseCredentials(str: string): Record<string, unknown> {
  let parsed = str;

  // Handle double-stringified JSON (when JSON.stringify was called twice)
  while (typeof parsed === 'string') {
    try {
      parsed = JSON.parse(parsed);
    } catch {
      break;
    }
  }

  if (typeof parsed === 'string') {
    throw new Error('Failed to parse credentials JSON');
  }

  return parsed as Record<string, unknown>;
}

// Create JWT and sign it manually for OpenSSL 3.0 compatibility
function createSignedJwt(email: string, privateKey: string, scopes: string[]): string {
  const now = Math.floor(Date.now() / 1000);
  const expiry = now + 3600; // 1 hour

  const header = {
    alg: 'RS256',
    typ: 'JWT',
  };

  const payload = {
    iss: email,
    scope: scopes.join(' '),
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: expiry,
  };

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signatureInput = `${encodedHeader}.${encodedPayload}`;

  // Sign using crypto.sign with explicit algorithm
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(signatureInput);
  const signature = sign.sign(privateKey, 'base64url');

  return `${signatureInput}.${signature}`;
}

// Get access token using signed JWT
async function getAccessToken(email: string, privateKey: string): Promise<string> {
  // Check cache
  if (cachedAccessToken && cachedAccessToken.expiry > Date.now() + 60000) {
    return cachedAccessToken.token;
  }

  const jwt = createSignedJwt(email, privateKey, SCOPES);

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get access token: ${error}`);
  }

  const data = await response.json();
  cachedAccessToken = {
    token: data.access_token,
    expiry: Date.now() + (data.expires_in * 1000),
  };

  return data.access_token;
}

// Custom auth client that uses our manual JWT signing
class ManualAuthClient {
  private email: string;
  private privateKey: string;

  constructor(email: string, privateKey: string) {
    this.email = email;
    this.privateKey = privateKey;
  }

  async getAccessToken(): Promise<{ token: string }> {
    const token = await getAccessToken(this.email, this.privateKey);
    return { token };
  }

  async getRequestHeaders(): Promise<{ Authorization: string }> {
    const token = await getAccessToken(this.email, this.privateKey);
    return { Authorization: `Bearer ${token}` };
  }
}

export async function getSheetsClient() {
  if (sheetsClient) return sheetsClient;

  let auth: ManualAuthClient | ReturnType<typeof google.auth.GoogleAuth>;

  // Check for base64 encoded credentials
  if (process.env.GOOGLE_SERVICE_ACCOUNT_BASE64) {
    const decoded = Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf-8');
    const credentials = parseCredentials(decoded);
    if (credentials.private_key && typeof credentials.private_key === 'string') {
      credentials.private_key = fixPrivateKey(credentials.private_key);
    }
    auth = new ManualAuthClient(
      credentials.client_email as string,
      credentials.private_key as string
    );
  }
  // Check for raw JSON credentials
  else if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    const credentials = parseCredentials(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    if (credentials.private_key && typeof credentials.private_key === 'string') {
      credentials.private_key = fixPrivateKey(credentials.private_key);
    }
    auth = new ManualAuthClient(
      credentials.client_email as string,
      credentials.private_key as string
    );
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

  sheetsClient = google.sheets({ version: 'v4', auth: auth as never });
  return sheetsClient;
}

export function getSheetId() {
  return process.env.GOOGLE_SHEET_ID!;
}

// Sheet names matching our data model
export const SHEETS = {
  // Lookup/Taxonomy tables
  OBJECT_TYPES: 'ObjectTypes',
  GENRES: 'Genres',
  MOVEMENTS: 'Movements',
  THEMES: 'Themes',
  SUBJECT_TERMS: 'SubjectTerms',
  CITIES: 'Cities',
  INSTITUTIONS: 'Institutions',
  // Entity tables
  ARTISTS: 'Artists',
  ARTWORKS: 'Artworks',
  // Junction tables
  ARTIST_CITIES: 'ArtistCities',
  ARTIST_THEMES: 'ArtistThemes',
  ARTIST_MOVEMENTS: 'ArtistMovements',
  ARTIST_RELATIONS: 'ArtistRelations',
  ARTWORK_THEMES: 'ArtworkThemes',
  ARTWORK_SUBJECTS: 'ArtworkSubjects',
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

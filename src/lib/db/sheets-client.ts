import crypto from 'crypto';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const SHEETS_API_BASE = 'https://sheets.googleapis.com/v4/spreadsheets';

let cachedAccessToken: { token: string; expiry: number } | null = null;
let cachedCredentials: { email: string; privateKey: string } | null = null;

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

// Get credentials from environment
function getCredentials(): { email: string; privateKey: string } {
  if (cachedCredentials) return cachedCredentials;

  if (process.env.GOOGLE_SERVICE_ACCOUNT_BASE64) {
    const decoded = Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf-8');
    const credentials = parseCredentials(decoded);
    cachedCredentials = {
      email: credentials.client_email as string,
      privateKey: fixPrivateKey(credentials.private_key as string),
    };
    return cachedCredentials;
  }

  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    const credentials = parseCredentials(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    cachedCredentials = {
      email: credentials.client_email as string,
      privateKey: fixPrivateKey(credentials.private_key as string),
    };
    return cachedCredentials;
  }

  throw new Error('No Google credentials found. Set GOOGLE_SERVICE_ACCOUNT_BASE64 or GOOGLE_SERVICE_ACCOUNT_KEY env var.');
}

// Get access token using signed JWT
async function getAccessToken(): Promise<string> {
  const { email, privateKey } = getCredentials();

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

// Make authenticated request to Sheets API
async function sheetsRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const token = await getAccessToken();
  const response = await fetch(`${SHEETS_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response;
}

// Legacy export for compatibility - not actually used anymore
export async function getSheetsClient() {
  // This is kept for any code that might import it, but we use direct API calls now
  return null;
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
  const sheetId = getSheetId();
  const range = encodeURIComponent(`${sheetName}!A:ZZ`);
  const response = await sheetsRequest(`/${sheetId}/values/${range}`);

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to read sheet ${sheetName}: ${error}`);
  }

  const data = await response.json();
  const rows = data.values;
  if (!rows || rows.length < 2) return [];

  const headers = rows[0] as string[];
  const rowData = rows.slice(1);

  return rowData.map((row: string[]) => {
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
  if (data.length === 0) return;

  const sheetId = getSheetId();
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
  const clearRange = encodeURIComponent(`${sheetName}!A:ZZ`);
  await sheetsRequest(`/${sheetId}/values/${clearRange}:clear`, {
    method: 'POST',
  });

  // Write new data
  const writeRange = encodeURIComponent(`${sheetName}!A1`);
  await sheetsRequest(`/${sheetId}/values/${writeRange}?valueInputOption=RAW`, {
    method: 'PUT',
    body: JSON.stringify({ values }),
  });
}

// Append rows to a sheet
export async function appendToSheet<T extends Record<string, unknown>>(
  sheetName: SheetName,
  data: T[],
  headers?: string[]
): Promise<void> {
  if (data.length === 0) return;

  const sheetId = getSheetId();
  const cols = headers || Object.keys(data[0]);
  const values = data.map((row) =>
    cols.map((col) => {
      const val = row[col];
      if (val === null || val === undefined) return '';
      if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
      return String(val);
    })
  );

  const range = encodeURIComponent(`${sheetName}!A1`);
  await sheetsRequest(`/${sheetId}/values/${range}:append?valueInputOption=RAW`, {
    method: 'POST',
    body: JSON.stringify({ values }),
  });
}

// Create all required sheets if they don't exist
export async function initializeSheets(): Promise<void> {
  const sheetId = getSheetId();

  // Get existing sheets
  const response = await sheetsRequest(`/${sheetId}`);
  if (!response.ok) {
    throw new Error('Failed to get spreadsheet info');
  }

  const spreadsheet = await response.json();
  const existingSheets = spreadsheet.sheets?.map((s: { properties?: { title?: string } }) => s.properties?.title) || [];
  const requiredSheets = Object.values(SHEETS);
  const missingSheets = requiredSheets.filter(s => !existingSheets.includes(s));

  if (missingSheets.length > 0) {
    await sheetsRequest(`/${sheetId}:batchUpdate`, {
      method: 'POST',
      body: JSON.stringify({
        requests: missingSheets.map(title => ({
          addSheet: { properties: { title } }
        }))
      }),
    });
  }
}

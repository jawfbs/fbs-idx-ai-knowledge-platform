type SheetValue = string | number | boolean | null;

const spreadsheetId = process.env.KNOWLEDGE_CONTROL_SHEET_ID || "1G9mRLSuBQm4Uz4sMO_8_lQLGdzP5kjCv-1pI7vyQ0lw";
const sheetsBase = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`;

function required(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

async function getAccessToken() {
  const clientEmail = required("GOOGLE_SERVICE_ACCOUNT_EMAIL");
  const privateKey = required("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY").replace(/\\n/g, "\n");
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: clientEmail,
    scope: "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.readonly",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600
  };
  const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString("base64url");
  const unsigned = `${encode(header)}.${encode(payload)}`;
  const key = await crypto.subtle.importKey(
    "pkcs8",
    Buffer.from(privateKey.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\\s/g, ""), "base64"),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, Buffer.from(unsigned));
  const assertion = `${unsigned}.${Buffer.from(signature).toString("base64url")}`;
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion })
  });
  if (!response.ok) throw new Error(`Google token request failed: ${await response.text()}`);
  return (await response.json() as { access_token: string }).access_token;
}

async function sheetsFetch(path: string, init?: RequestInit) {
  const token = await getAccessToken();
  const response = await fetch(`${sheetsBase}${path}`, {
    ...init,
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json", ...(init?.headers || {}) },
    cache: "no-store"
  });
  if (!response.ok) throw new Error(`Sheets API failed: ${response.status} ${await response.text()}`);
  return response.json();
}

export async function readRange(range: string): Promise<SheetValue[][]> {
  const data = await sheetsFetch(`/values/${encodeURIComponent(range)}`) as { values?: SheetValue[][] };
  return data.values || [];
}

export async function replaceRange(range: string, values: SheetValue[][]) {
  return sheetsFetch(`/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`, {
    method: "PUT",
    body: JSON.stringify({ range, majorDimension: "ROWS", values })
  });
}

export async function appendRows(range: string, values: SheetValue[][]) {
  return sheetsFetch(`/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`, {
    method: "POST",
    body: JSON.stringify({ range, majorDimension: "ROWS", values })
  });
}

export async function clearRange(range: string) {
  return sheetsFetch(`/values/${encodeURIComponent(range)}:clear`, { method: "POST", body: "{}" });
}

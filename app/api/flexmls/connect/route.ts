import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";

export const runtime = "nodejs";

function base64url(value: Buffer) {
  return value.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

export async function GET(request: NextRequest) {
  const authorizationUrl = process.env.FLEXMLS_AUTHORIZATION_URL;
  const clientId = process.env.FLEXMLS_CLIENT_ID;
  const redirectUri = process.env.FLEXMLS_REDIRECT_URI || new URL("/api/flexmls/callback", request.url).toString();
  if (!authorizationUrl || !clientId) {
    return NextResponse.json({ error: "Flexmls OAuth is not configured. Set FLEXMLS_AUTHORIZATION_URL and FLEXMLS_CLIENT_ID." }, { status: 503 });
  }

  const state = base64url(crypto.randomBytes(24));
  const verifier = base64url(crypto.randomBytes(48));
  const challenge = base64url(crypto.createHash("sha256").update(verifier).digest());
  const url = new URL(authorizationUrl);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", challenge);
  url.searchParams.set("code_challenge_method", "S256");
  if (process.env.FLEXMLS_SCOPES) url.searchParams.set("scope", process.env.FLEXMLS_SCOPES);

  const response = NextResponse.redirect(url);
  const options = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, maxAge: 600, path: "/" };
  response.cookies.set("flexmls_oauth_state", state, options);
  response.cookies.set("flexmls_pkce_verifier", verifier, options);
  return response;
}

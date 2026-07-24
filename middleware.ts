import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const username = process.env.SITE_USERNAME;
  const password = process.env.SITE_PASSWORD;

  if (!username || !password) {
    return new NextResponse(
      "Site authentication is not configured.",
      { status: 500 }
    );
  }

  const authorization = request.headers.get("authorization");

  if (authorization) {
    const [scheme, encodedCredentials] = authorization.split(" ");

    if (scheme === "Basic" && encodedCredentials) {
      try {
        const decodedCredentials = atob(encodedCredentials);
        const separatorIndex = decodedCredentials.indexOf(":");

        const enteredUsername = decodedCredentials.slice(0, separatorIndex);
        const enteredPassword = decodedCredentials.slice(separatorIndex + 1);

        if (
          enteredUsername === username &&
          enteredPassword === password
        ) {
          return NextResponse.next();
        }
      } catch {
        // Invalid authorization header; show the login prompt again.
      }
    }
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="FBS AI Knowledge Platform"',
      "Cache-Control": "no-store",
    },
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt).*)",
  ],
};

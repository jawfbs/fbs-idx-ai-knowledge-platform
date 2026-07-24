import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const sitePassword = process.env.SITE_PASSWORD;

  if (!sitePassword) {
    return new NextResponse(
      "SITE_PASSWORD environment variable is not configured.",
      { status: 500 }
    );
  }

  const authorization = request.headers.get("authorization");

  if (authorization) {
    const [scheme, encoded] = authorization.split(" ");

    if (scheme === "Basic" && encoded) {
      try {
        const decoded = atob(encoded);
        const enteredPassword = decoded.split(":")[1];

        if (enteredPassword === sitePassword) {
          return NextResponse.next();
        }
      } catch {
        // Ignore malformed credentials
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
    /*
     * Protect everything except Next.js internals and common static assets.
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};

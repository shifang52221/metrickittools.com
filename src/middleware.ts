import { NextRequest, NextResponse } from "next/server";

const PASS_THROUGH_PATHS = new Set([
  "/ads.txt",
  "/robots.txt",
  "/sitemap.xml",
  "/favicon.ico",
]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (PASS_THROUGH_PATHS.has(pathname) || pathname.startsWith("/.well-known/")) {
    return NextResponse.next();
  }

  /**
   * Domain canonicalization should be owned by the hosting platform (Vercel),
   * otherwise it's easy to accidentally create a redirect loop if the platform
   * also redirects between apex and www.
   *
   * If you still want to force a canonical host at the app level, set:
   * `CANONICAL_HOST=www.metrickittools.com` (or `metrickittools.com`)
   */
  const canonicalHost = (process.env.CANONICAL_HOST || "").trim().toLowerCase();
  if (!canonicalHost) return NextResponse.next();

  const hostHeader = (request.headers.get("host") || "").toLowerCase();
  const requestHost = hostHeader.split(":")[0];
  if (!requestHost || requestHost === canonicalHost) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.protocol = "https";
  url.host = canonicalHost;
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/((?!_next/).*)"],
};

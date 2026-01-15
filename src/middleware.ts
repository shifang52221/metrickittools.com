import { NextRequest, NextResponse } from "next/server";

const APEX_HOST = "metrickittools.com";
const WWW_HOST = "www.metrickittools.com";

const PASS_THROUGH_PATHS = new Set([
  "/ads.txt",
  "/robots.txt",
  "/sitemap.xml",
  "/favicon.ico",
]);

export function middleware(request: NextRequest) {
  const hostHeader = (request.headers.get("host") || "").toLowerCase();
  const host = hostHeader.split(":")[0];
  if (host !== APEX_HOST) return NextResponse.next();

  const { pathname } = request.nextUrl;
  if (PASS_THROUGH_PATHS.has(pathname) || pathname.startsWith("/.well-known/")) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.protocol = "https";
  url.host = WWW_HOST;
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/((?!_next/).*)"],
};

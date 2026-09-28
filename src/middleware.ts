import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, locales } from "@/i18n/config";

const CANONICAL_ORIGIN = "https://finitionpeinture.com";
const APP_HOSTING_HOST =
  "craft-services-web--artisan-craft-services.us-central1.hosted.app";

function isAppHostingDefaultRequest(request: NextRequest): boolean {
  const candidates = [
    request.url,
    request.nextUrl.href,
    request.nextUrl.host,
    request.nextUrl.hostname,
    request.headers.get("host"),
    request.headers.get("x-forwarded-host"),
    request.headers.get("x-original-host"),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    candidates.includes(APP_HOSTING_HOST) || candidates.includes(".hosted.app")
  );
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Never let the Firebase default URL stay in the address bar.
  if (isAppHostingDefaultRequest(request)) {
    return NextResponse.redirect(
      new URL(`${CANONICAL_ORIGIN}${pathname}${search}`),
      308
    );
  }

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Locale redirect — keep the same host (custom domain).
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images).*)"],
};

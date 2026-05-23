import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const LAYER_ROUTES: Record<string, string> = {
  superadmin: "/superadmin",
  senior: "/senior",
  user: "/user",
};

function getLocaleFromPathname(pathname: string): string {
  const segments = pathname.split("/");
  const maybeLocale = segments[1];
  if (routing.locales.includes(maybeLocale as typeof routing.locales[number])) {
    return maybeLocale;
  }
  return routing.defaultLocale;
}

function getLayerFromPathname(pathname: string, locale: string): string | null {
  const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";
  const segments = pathWithoutLocale.split("/").filter(Boolean);
  const maybeLayer = segments[0];
  if (maybeLayer in LAYER_ROUTES) {
    return maybeLayer;
  }
  return null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let next-intl handle locale routing first
  const intlResponse = intlMiddleware(request);
  if (intlResponse.status === 307 || intlResponse.status === 308) {
    return intlResponse;
  }

  const locale = getLocaleFromPathname(pathname);
  const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";

  // Redirect old /dashboard path (no layer prefix) to role-based path
  if (pathWithoutLocale === "/dashboard" || pathWithoutLocale === "/dashboard/") {
    const token = request.cookies.get("auth_token")?.value;
    const role = request.cookies.get("role")?.value;

    if (!token) {
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }

    const layerPath = LAYER_ROUTES[role || "user"] || LAYER_ROUTES["user"];
    return NextResponse.redirect(new URL(`/${locale}${layerPath}/dashboard`, request.url));
  }

  // Check if this is a protected route (under a layer)
  const layer = getLayerFromPathname(pathname, locale);
  if (!layer) {
    // Not a layer route — could be login page or other public page, let it through
    return intlResponse;
  }

  const token = request.cookies.get("auth_token")?.value;
  const role = request.cookies.get("role")?.value;

  // No token — redirect to login
  if (!token) {
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  // No role cookie — redirect to /dashboard which triggers the smart redirect above
  if (!role) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  // Role doesn't match the URL layer — redirect to correct layer dashboard
  const expectedPath = LAYER_ROUTES[role];
  if (!pathWithoutLocale.startsWith(expectedPath)) {
    return NextResponse.redirect(new URL(`/${locale}${expectedPath}/dashboard`, request.url));
  }

  // All checks passed — let the request through
  return intlResponse;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
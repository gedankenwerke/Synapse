import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);

const localePattern = new RegExp(`^/(${routing.locales.join("|")})(/.*)?$`);

const LAYER_ROUTES: Record<string, string> = {
  superadmin: "/superadmin",
  senior: "/senior",
  user: "/user",
};

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes, static files, and internal paths
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("auth_token")?.value;
  const role = request.cookies.get("role")?.value;

  // Extract locale from pathname
  const localeMatch = pathname.match(localePattern);
  const locale = localeMatch?.[1] || routing.defaultLocale;
  const subPath = localeMatch?.[2] || "/";

  // Authenticated user accessing login page -> redirect to role-based dashboard
  const isLoginPage = subPath === "/" || subPath === "" || subPath === "/login";
  if (isLoginPage && token) {
    const layerPath = LAYER_ROUTES[role || "user"] || LAYER_ROUTES["user"];
    return NextResponse.redirect(new URL(`/${locale}${layerPath}/dashboard`, request.url));
  }

  // Redirect old /dashboard path to role-based path
  if (subPath === "/dashboard" || subPath === "/dashboard/") {
    if (!token) {
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }
    const layerPath = LAYER_ROUTES[role || "user"] || LAYER_ROUTES["user"];
    return NextResponse.redirect(new URL(`/${locale}${layerPath}/dashboard`, request.url));
  }

  // Check if this is a protected route (under a layer)
  const layer = Object.keys(LAYER_ROUTES).find((l) =>
    subPath.startsWith(LAYER_ROUTES[l])
  );

  if (!layer) {
    // Not a layer route — could be login page or other public page
    // Also handle old protected routes that aren't under a layer prefix
    const isOldProtectedRoute =
      subPath.startsWith("/account-statement") ||
      subPath.startsWith("/net-balance") ||
      subPath.startsWith("/deposits-withdrawals") ||
      subPath.startsWith("/customer-settlement") ||
      subPath.startsWith("/user-management") ||
      subPath.startsWith("/pay-agent") ||
      subPath.startsWith("/transactions") ||
      subPath.startsWith("/account") ||
      subPath.startsWith("/api-keys");

    if (isOldProtectedRoute && !token) {
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }

    if (isOldProtectedRoute && token) {
      // Redirect old URLs to role-based paths
      const layerPath = LAYER_ROUTES[role || "user"] || LAYER_ROUTES["user"];
      return NextResponse.redirect(new URL(`/${locale}${layerPath}/dashboard`, request.url));
    }

    return intlMiddleware(request);
  }

  // Layer route — enforce role-based access
  if (!token) {
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  // No role cookie — redirect to /dashboard which triggers the smart redirect above
  if (!role) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  // Role doesn't match the URL layer — redirect to correct layer dashboard
  const expectedPath = LAYER_ROUTES[role];
  if (!subPath.startsWith(expectedPath)) {
    return NextResponse.redirect(new URL(`/${locale}${expectedPath}/dashboard`, request.url));
  }

  // All checks passed — let intl middleware handle locale and pass through
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
    "/([\\w-]+)?/dashboard/:path*",
  ],
};
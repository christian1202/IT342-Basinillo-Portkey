/* ================================================================== */
/*  PORTKEY — Proxy                                                    */
/*  Edge-runtime proxy for route protection.                           */
/* ================================================================== */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/dashboard"];
const AUTH_ROUTES = ["/login", "/register"];

function matchesAny(pathname: string, routes: string[]): boolean {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // We check for the access token in cookies.
  // Note: localStorage isn't available in Next.js proxy.
  // Supabase proxy is removed, so we'll enforce that the client
  // sets a generic 'portkey_session' cookie for simple edge routing,
  // or we'll rely on the API 401 interceptor for strict protection.
  // For now, allow passthrough if it's the root page (it will redirect to /login).

  if (pathname === "/") return NextResponse.next();

  // The actual layout.tsx or useAuth will handle client-side kicks if no token in localStorage.
  // Edge proxy without cookies relies on the client.

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

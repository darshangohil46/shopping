import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_ACCESS_TOKEN } from "./utils/constant";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(COOKIE_ACCESS_TOKEN)?.value;
  const isAuthenticated = Boolean(token);

  const authPaths = ["/login", "/signup"];
  const isAuthPage = authPaths.some((path) => pathname.startsWith(path));

  // If user is authenticated
  if (isAuthenticated) {
    // If authenticated user visits login, signup, redirect to /
    if (isAuthPage) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // If user is NOT authenticated
  if (!isAuthenticated) {
    // Allow access to login and signup pages
    if (isAuthPage) {
      return NextResponse.next();
    }

    // Any other page (including root `/`), redirect to /login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api routes
     */
    "/((?!_next/static|_next/image|favicon.ico|api).*)",
  ],
};

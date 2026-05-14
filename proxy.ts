import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PRIVATE_ROUTES = ["/profile", "/notes"];
const AUTH_ROUTES = ["/sign-in", "/sign-up"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  const isPrivate = PRIVATE_ROUTES.some((route) => pathname.startsWith(route));
  const isAuth = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (isPrivate && !token) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isAuth && token) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
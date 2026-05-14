import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PRIVATE_ROUTES = ["/profile", "/notes"];
const AUTH_ROUTES = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isPrivate = PRIVATE_ROUTES.some((route) => pathname.startsWith(route));
  const isAuth = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (isPrivate) {
    if (!accessToken && !refreshToken) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    if (!accessToken && refreshToken) {
      try {
        const baseURL = process.env.NEXT_PUBLIC_API_URL + "/api";
        const res = await fetch(`${baseURL}/auth/session`, {
          headers: { Cookie: `refreshToken=${refreshToken}` },
        });

        if (!res.ok) {
          return NextResponse.redirect(new URL("/sign-in", request.url));
        }

        const setCookieHeader = res.headers.get("set-cookie");
        const response = NextResponse.next();

        if (setCookieHeader) {
          response.headers.set("set-cookie", setCookieHeader);
        }

        return response;
      } catch {
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }
    }
  }

  if (isAuth && (accessToken || refreshToken)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};

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

        const response = NextResponse.next();
        const setCookieHeader = res.headers.get("set-cookie");

        if (setCookieHeader) {
          const cookies = setCookieHeader.split(",").map((c) => c.trim());
          cookies.forEach((cookie) => {
            const [nameValue, ...attributes] = cookie.split(";").map((s) => s.trim());
            const [name, value] = nameValue.split("=");
            const httpOnly = attributes.some((a) => a.toLowerCase() === "httponly");
            const secure = attributes.some((a) => a.toLowerCase() === "secure");
            const sameSiteAttr = attributes.find((a) => a.toLowerCase().startsWith("samesite"));
            const sameSite = sameSiteAttr
              ? (sameSiteAttr.split("=")[1].trim().toLowerCase() as "lax" | "strict" | "none")
              : "lax";
            const pathAttr = attributes.find((a) => a.toLowerCase().startsWith("path"));
            const path = pathAttr ? pathAttr.split("=")[1].trim() : "/";

            response.cookies.set(name, value, { httpOnly, secure, sameSite, path });
          });
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
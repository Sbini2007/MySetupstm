import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_FILE = /\.(.*)$/;

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/paypal") ||
    pathname.startsWith("/api/") ||
    pathname === "/login" ||
    pathname === "/checkout" ||
    pathname === "/admin/login" ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/manifest.json" ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!token.premium && !token.admin) {
    const checkoutUrl = new URL("/checkout", request.url);
    checkoutUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(checkoutUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/(:path*)",
};

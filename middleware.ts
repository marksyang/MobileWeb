import { NextRequest, NextResponse } from "next/server";
import { sessionCookieName } from "@/lib/auth-config";

export async function middleware(req: NextRequest) {
  const sessionToken = req.cookies.get(sessionCookieName)?.value;

  if (!sessionToken) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile", "/favorites", "/cart", "/checkout", "/checkout/success", "/account", "/orders", "/orders/:path*"],
};

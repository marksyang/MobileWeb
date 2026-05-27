import { NextRequest, NextResponse } from "next/server";
import { sessionCookieName, getSessionFromToken } from "@/lib/auth-config";

export async function middleware(req: NextRequest) {
  const sessionToken = req.cookies.get(sessionCookieName)?.value;
  const session = await getSessionFromToken(sessionToken);

  if (!session) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile", "/favorites"],
};

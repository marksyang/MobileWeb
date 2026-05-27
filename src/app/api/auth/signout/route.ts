import { NextRequest, NextResponse } from "next/server";
import {
  handleSignOut,
  sessionCookieName,
  getCookieOptions,
  getRequestMetadata,
} from "@/lib/auth-config";

export async function POST(req: NextRequest) {
  const { isHttps } = getRequestMetadata(req);
  const cookieOpts = getCookieOptions(isHttps);

  // Get session token from cookie
  const sessionToken = req.cookies.get(sessionCookieName)?.value;

  if (sessionToken) {
    await handleSignOut(sessionToken);
  }

  // Parse callback URL from body
  const contentType = req.headers.get("content-type");
  let callbackUrl = "/";

  if (contentType?.includes("application/x-www-form-urlencoded")) {
    const body = await req.text();
    const params = new URLSearchParams(body);
    callbackUrl = params.get("callbackUrl") || "/";
  }

  const response = NextResponse.redirect(new URL(callbackUrl, req.url));

  // Clear session cookie
  response.cookies.set(sessionCookieName, "", {
    ...cookieOpts,
    maxAge: 0,
  });

  return response;
}

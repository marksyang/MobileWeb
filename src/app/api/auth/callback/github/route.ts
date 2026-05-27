import { NextRequest, NextResponse } from "next/server";
import {
  handleOAuthCallback,
  stateCookieName,
  pkceCookieName,
  sessionCookieName,
  getCookieOptions,
  getRequestMetadata,
  signSessionToken,
} from "@/lib/auth-config";

export async function GET(req: NextRequest) {
  const { isHttps, redirectUri } = getRequestMetadata(req);
  const cookieOpts = getCookieOptions(isHttps);

  const { searchParams } = req.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  // Handle user denial
  if (error) {
    return NextResponse.redirect(new URL("/login?error=access_denied", req.url));
  }

  if (!code || !state) {
    return NextResponse.redirect(new URL("/login?error=missing_code", req.url));
  }

  // Validate state from cookie
  const stateCookie = req.cookies.get(stateCookieName);
  const codeVerifierCookie = req.cookies.get(pkceCookieName);

  if (!stateCookie?.value || stateCookie.value !== state) {
    return NextResponse.redirect(new URL("/login?error=invalid_state", req.url));
  }

  if (!codeVerifierCookie?.value) {
    return NextResponse.redirect(new URL("/login?error=missing_pkce", req.url));
  }

  try {
    const result = await handleOAuthCallback(
      code,
      state,
      codeVerifierCookie.value,
      redirectUri,
    );

    const response = NextResponse.redirect(new URL(result.redirect, req.url));

    // Set session cookie with signed token (NextAuth format)
    const sessionExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const signedToken = await signSessionToken(result.sessionToken);
    response.cookies.set(sessionCookieName, signedToken, {
      ...cookieOpts,
      expires: sessionExpires,
    });

    // Clear state and PKCE cookies
    response.cookies.set(stateCookieName, "", { ...cookieOpts, maxAge: 0 });
    response.cookies.set(pkceCookieName, "", { ...cookieOpts, maxAge: 0 });

    return response;
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.redirect(new URL("/login?error=oauth_error", req.url));
  }
}

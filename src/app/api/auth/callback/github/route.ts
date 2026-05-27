import { NextRequest, NextResponse } from "next/server";
import {
  handleOAuthCallback,
  stateCookieName,
  pkceCookieName,
  sessionCookieName,
  cookieOptions,
} from "@/lib/auth-config";

export async function GET(req: NextRequest) {
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
      codeVerifierCookie.value
    );

    const response = NextResponse.redirect(new URL(result.redirect, req.url));

    // Set session cookie with the sessionToken
    const sessionExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    response.cookies.set(sessionCookieName, result.sessionToken, {
      ...cookieOptions,
      expires: sessionExpires,
    });

    // Clear state and PKCE cookies
    response.cookies.set(stateCookieName, "", { ...cookieOptions, maxAge: 0 });
    response.cookies.set(pkceCookieName, "", { ...cookieOptions, maxAge: 0 });

    return response;
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.redirect(new URL("/login?error=oauth_error", req.url));
  }
}

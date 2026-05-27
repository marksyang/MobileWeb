import { NextRequest, NextResponse } from "next/server";
import {
  getGitHubAuthUrl,
  stateCookieName,
  pkceCookieName,
  cookieOptions,
} from "@/lib/auth-config";

export async function GET(_req: NextRequest) {
  const { url, state, codeVerifier } = await getGitHubAuthUrl();

  const response = NextResponse.redirect(new URL(url));

  // Store state and PKCE code verifier in cookies for callback validation
  response.cookies.set(stateCookieName, state, {
    ...cookieOptions,
    maxAge: 60 * 15, // 15 minutes
  });
  response.cookies.set(pkceCookieName, codeVerifier, {
    ...cookieOptions,
    maxAge: 60 * 15,
  });

  return response;
}

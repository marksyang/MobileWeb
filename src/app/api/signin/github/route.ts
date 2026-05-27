import { NextRequest, NextResponse } from "next/server";
import {
  getGitHubAuthUrl,
  stateCookieName,
  pkceCookieName,
  getCookieOptions,
  getRequestMetadata,
} from "@/lib/auth-config";

export async function GET(req: NextRequest) {
  const { isHttps, redirectUri } = getRequestMetadata(req);
  const { url, state, codeVerifier } = await getGitHubAuthUrl(redirectUri);

  const response = NextResponse.redirect(new URL(url));
  const cookieOpts = getCookieOptions(isHttps);

  // Store state and PKCE code verifier in cookies for callback validation
  response.cookies.set(stateCookieName, state, {
    ...cookieOpts,
    maxAge: 60 * 15, // 15 minutes
  });
  response.cookies.set(pkceCookieName, codeVerifier, {
    ...cookieOpts,
    maxAge: 60 * 15,
  });

  return response;
}

import { eq } from "drizzle-orm";
import { SignJWT } from "jose";
import { db } from "@/db";
import { user, account, session } from "../../db/schema";

const GITHUB_CLIENT_ID = process.env.AUTH_GITHUB_ID!;
const GITHUB_CLIENT_SECRET = process.env.AUTH_GITHUB_SECRET!;
const AUTH_SECRET = process.env.AUTH_SECRET!;

// Cookie config: detect HTTPS from request for Vercel deployment compatibility
const cookiePrefix = "";
export const sessionCookieName = `${cookiePrefix}authjs.session-token`;
export const stateCookieName = `${cookiePrefix}authjs.state`;
export const pkceCookieName = `${cookiePrefix}authjs.pkce.code_verifier`;

export function getCookieOptions(isHttps: boolean): Record<string, any> {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: isHttps,
  };
}

export function getRedirectUri(req: Request): string {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
  const proto = req.headers.get("x-forwarded-proto") || "http";
  return `${proto}://${host}`;
}

export async function getGitHubAuthUrl(redirectUri: string): Promise<{
  url: string;
  state: string;
  codeVerifier: string;
}> {
  const state = crypto.randomUUID();
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: redirectUri,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    scope: "read:user user:email",
  });

  return {
    url: `https://github.com/login/oauth/authorize?${params}`,
    state,
    codeVerifier,
  };
}

function generateCodeVerifier(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(64));
  return Array.from(bytes)
    .map((b) => b.toString(36).padStart(2, "0"))
    .join("")
    .slice(0, 128);
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const data = new TextEncoder().encode(verifier);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function handleOAuthCallback(
  code: string,
  state: string,
  codeVerifier: string,
  redirectUri: string
): Promise<{ user: any; sessionToken: string; redirect: string }> {
  // Exchange code for token
  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: redirectUri,
      state,
      code_verifier: codeVerifier,
    }),
  });

  const tokenData = (await tokenRes.json()) as any;

  if (tokenData.error || !tokenData.access_token) {
    throw new Error(tokenData.error_description || "Failed to get access token");
  }

  // Get user profile from GitHub
  const userRes = await fetch("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const githubUser = (await userRes.json()) as any;

  // Get user email (GitHub API doesn't always return primary email in /user)
  const emailsRes = await fetch("https://api.github.com/user/emails", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const emails = (await emailsRes.json()) as any[];
  const primaryEmail = emails.find((e: any) => e.primary)?.email || emails[0]?.email;

  if (!primaryEmail) {
    throw new Error("No email found on GitHub account");
  }

  const profile = {
    id: String(githubUser.id),
    name: githubUser.name || githubUser.login,
    email: primaryEmail,
    image: githubUser.avatar_url,
    login: githubUser.login,
  };

  // Find or create user
  const [existingUser] = await db
    .select()
    .from(user)
    .where(eq(user.email, profile.email))
    .limit(1);

  let userId: string;
  if (existingUser) {
    userId = existingUser.id;
    // Update user info
    await db
      .update(user)
      .set({ name: profile.name, image: profile.image })
      .where(eq(user.id, userId));
  } else {
    userId = crypto.randomUUID();
    await db.insert(user).values({
      id: userId,
      name: profile.name,
      email: profile.email,
      image: profile.image,
    });
  }

  // Find or create account
  const [existingAccount] = await db
    .select()
    .from(account)
    .where(
      eq(account.providerAccountId, profile.id)
    )
    .limit(1);

  if (!existingAccount) {
    await db.insert(account).values({
      id: crypto.randomUUID(),
      userId,
      type: "oauth",
      provider: "github",
      providerAccountId: profile.id,
      access_token: tokenData.access_token,
      token_type: tokenData.token_type || "bearer",
      scope: "read:user user:email",
    });
  }

  // Create session
  const sessionToken = crypto.randomUUID();
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  await db.insert(session).values({
    id: crypto.randomUUID(),
    sessionToken,
    userId,
    expires,
  });

  return {
    user: { id: userId, name: profile.name, email: profile.email, image: profile.image },
    sessionToken,
    redirect: "/",
  };
}

export async function handleSignOut(sessionToken: string): Promise<void> {
  await db.delete(session).where(eq(session.sessionToken, sessionToken));
}

// Helper to get environment-aware values from a request
export function getRequestMetadata(req: Request) {
  const proto = req.headers.get("x-forwarded-proto") || "http";
  const isHttps = proto === "https";
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
  const baseUri = `${proto}://${host}`;
  const redirectUri = `${baseUri}/api/auth/callback/github`;
  return { isHttps, baseUri, redirectUri };
}

/**
 * Sign a session token in the format NextAuth (auth.js) expects for cookies.
 * NextAuth uses JWT signing (jose) with HS256/HS384/HS512 based on key length.
 */
export async function signSessionToken(token: string): Promise<string> {
  const key = new TextEncoder().encode(AUTH_SECRET);
  const algorithm = key.length <= 32 ? "HS256" : key.length <= 48 ? "HS384" : "HS512";

  const jwt = await new SignJWT({ state: token })
    .setProtectedHeader({ alg: algorithm, typ: "at+jwt" })
    .setIssuedAt()
    .sign(key);

  return jwt;
}

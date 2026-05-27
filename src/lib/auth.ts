import { cookies } from "next/headers";
import { sessionCookieName, getSessionFromToken } from "./auth-config";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";

// Export NextAuth config for API routes (unused by custom flow, kept for compatibility)
export const { handlers, auth: nextAuth } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [GitHub],
  session: { strategy: "database" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    session: ({ session, user }) => {
      session.user.id = user.id;
      return session;
    },
  },
});

/**
 * Get the current session by reading the raw session token cookie
 * and looking up the user in the database. Works on both localhost and Vercel.
 */
export async function auth() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(sessionCookieName)?.value;
  return getSessionFromToken(sessionToken);
}

export { getSessionFromToken } from "./auth-config";

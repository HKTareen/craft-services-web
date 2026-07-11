import { cookies } from "next/headers";
import { adminAuth } from "./firebase/admin";

const COOKIE_NAME = "admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 5; // 5 days

/**
 * Exchange a freshly-minted Firebase ID token (from client email/password
 * sign-in) for a long-lived, httpOnly session cookie.
 */
export async function createSessionCookie(idToken: string): Promise<string> {
  return adminAuth.createSessionCookie(idToken, {
    expiresIn: MAX_AGE_SECONDS * 1000,
  });
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: MAX_AGE_SECONDS,
    path: "/",
  };
}

/** True when the request carries a valid, non-revoked admin session cookie. */
export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME)?.value;
  if (!session) return false;

  try {
    await adminAuth.verifySessionCookie(session, true);
    return true;
  } catch {
    return false;
  }
}

export { COOKIE_NAME, MAX_AGE_SECONDS };

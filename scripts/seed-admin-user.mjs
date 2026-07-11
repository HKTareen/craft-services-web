/**
 * One-time: create the admin login user in Firebase Auth.
 *
 * Usage (from project root):
 *   node --env-file=.env scripts/seed-admin-user.mjs
 *
 * Requires FIREBASE_SERVICE_ACCOUNT_KEY in .env (the service account JSON on one
 * line). Idempotent — if the user already exists it just resets the password.
 *
 * Alternatively, create the user manually in the Firebase console:
 *   Authentication → Users → Add user.
 */
import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const EMAIL = process.env.ADMIN_SEED_EMAIL || "info@finitionpeinture.com";
const PASSWORD = process.env.ADMIN_SEED_PASSWORD || "12345678";

const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
if (!key) {
  console.error("Missing FIREBASE_SERVICE_ACCOUNT_KEY in the environment.");
  process.exit(1);
}

initializeApp({ credential: cert(JSON.parse(key)) });
const auth = getAuth();

try {
  const existing = await auth.getUserByEmail(EMAIL).catch(() => null);
  if (existing) {
    await auth.updateUser(existing.uid, { password: PASSWORD, emailVerified: true });
    console.log(`Updated existing admin user: ${EMAIL}`);
  } else {
    const user = await auth.createUser({
      email: EMAIL,
      password: PASSWORD,
      emailVerified: true,
    });
    console.log(`Created admin user: ${EMAIL} (uid: ${user.uid})`);
  }
  process.exit(0);
} catch (err) {
  console.error("Failed to seed admin user:", err);
  process.exit(1);
}

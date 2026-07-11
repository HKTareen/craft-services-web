import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getStorage, type Storage } from "firebase-admin/storage";

/**
 * Server-side Firebase Admin SDK.
 *
 * Credentials resolution:
 *  - Production (Firebase App Hosting): Application Default Credentials are
 *    provided automatically by the runtime, so `initializeApp()` needs no args.
 *  - Local dev / seed script: set `FIREBASE_SERVICE_ACCOUNT_KEY` to the JSON
 *    string of a service account key.
 *
 * The Admin SDK bypasses Firestore/Storage security rules, so every write in
 * this app goes through server code guarded by an admin session cookie.
 */
function initAdminApp(): App {
  const existing = getApps();
  if (existing.length) return existing[0];

  const bucket =
    process.env.FIREBASE_STORAGE_BUCKET ??
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (serviceAccountKey) {
    const parsed = JSON.parse(serviceAccountKey);
    return initializeApp({
      credential: cert(parsed),
      storageBucket: bucket,
    });
  }

  // Application Default Credentials (App Hosting runtime).
  return initializeApp({ storageBucket: bucket });
}

const app = initAdminApp();

export const adminDb: Firestore = getFirestore(app);
export const adminAuth: Auth = getAuth(app);

/**
 * Resolve the Storage bucket lazily. `getStorage().bucket()` throws when no
 * bucket is configured, so we defer it to call time (upload) rather than module
 * load — otherwise merely importing this file (for Firestore/Auth) would crash
 * the build when the bucket env is absent.
 */
export function getAdminBucket(): ReturnType<Storage["bucket"]> {
  return getStorage(app).bucket();
}

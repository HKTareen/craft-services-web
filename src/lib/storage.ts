import { randomUUID } from "crypto";
import { getAdminBucket } from "./firebase/admin";

/**
 * Upload an image buffer to Firebase Storage and return a public download URL.
 *
 * Uses a Firebase download token rather than object ACLs, so it works with
 * uniform bucket-level access (the default on modern buckets).
 */
export async function uploadImage(
  buffer: Buffer,
  contentType: string,
  originalName: string
): Promise<string> {
  const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const token = randomUUID();
  const objectPath = `uploads/${randomUUID()}-${safeName}`;

  const bucket = getAdminBucket();
  const file = bucket.file(objectPath);
  await file.save(buffer, {
    resumable: false,
    contentType,
    metadata: {
      contentType,
      metadata: { firebaseStorageDownloadTokens: token },
    },
  });

  return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(
    objectPath
  )}?alt=media&token=${token}`;
}

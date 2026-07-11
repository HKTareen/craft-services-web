import { adminDb } from "./firebase/admin";
import type { SmtpSettings } from "./types";

const SETTINGS_DOC = adminDb.collection("settings").doc("smtp");

export async function getSmtpSettings(): Promise<SmtpSettings | null> {
  try {
    const snap = await SETTINGS_DOC.get();
    return snap.exists ? (snap.data() as SmtpSettings) : null;
  } catch (err) {
    console.error("getSmtpSettings failed:", err);
    return null;
  }
}

export async function saveSmtpSettings(data: SmtpSettings): Promise<void> {
  await SETTINGS_DOC.set(data, { merge: true });
}

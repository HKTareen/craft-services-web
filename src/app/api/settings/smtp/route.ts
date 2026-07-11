import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api";
import { getSmtpSettings, saveSmtpSettings } from "@/lib/settings";
import type { SmtpSettings } from "@/lib/types";

/**
 * GET returns the current settings with the password masked (never sent to the
 * browser). PUT saves; an empty password keeps the previously stored one.
 */
export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const smtp = await getSmtpSettings();
  if (!smtp) return NextResponse.json({ configured: false });

  return NextResponse.json({
    configured: true,
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    user: smtp.user,
    fromEmail: smtp.fromEmail,
    toEmail: smtp.toEmail,
    hasPassword: Boolean(smtp.pass),
  });
}

export async function PUT(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = (await request.json()) as Partial<SmtpSettings>;
  const existing = await getSmtpSettings();

  const merged: SmtpSettings = {
    host: body.host ?? existing?.host ?? "",
    port: body.port ?? existing?.port ?? 587,
    secure: body.secure ?? existing?.secure ?? false,
    user: body.user ?? existing?.user ?? "",
    // Blank password on save keeps the stored one.
    pass: body.pass ? body.pass : existing?.pass ?? "",
    fromEmail: body.fromEmail ?? existing?.fromEmail ?? "",
    toEmail: body.toEmail ?? existing?.toEmail ?? "",
  };

  await saveSmtpSettings(merged);
  return NextResponse.json({ success: true });
}

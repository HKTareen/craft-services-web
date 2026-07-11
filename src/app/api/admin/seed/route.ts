import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api";
import { seedDefaults } from "@/lib/content";

export async function POST() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    await seedDefaults();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Seed failed:", err);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}

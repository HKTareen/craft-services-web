import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api";
import { getSiteContent, saveSiteContent } from "@/lib/content";
import type { SiteContent } from "@/lib/types";

export async function GET() {
  return NextResponse.json(await getSiteContent());
}

export async function PUT(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = (await request.json()) as SiteContent;
  await saveSiteContent(body);
  return NextResponse.json({ success: true });
}

import { NextResponse } from "next/server";
import {
  createSessionCookie,
  sessionCookieOptions,
  COOKIE_NAME,
} from "@/lib/auth";

export async function POST(request: Request) {
  const { idToken } = await request.json();

  if (!idToken || typeof idToken !== "string") {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  try {
    const sessionCookie = await createSessionCookie(idToken);
    const response = NextResponse.json({ success: true });
    response.cookies.set(COOKIE_NAME, sessionCookie, sessionCookieOptions());
    return response;
  } catch (err) {
    console.error("Login failed:", err);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

import { NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/mail";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB per photo

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = (formData.get("name") as string) ?? "";
    const phone = (formData.get("phone") as string) ?? "";
    const email = (formData.get("email") as string) ?? "";
    const message = (formData.get("message") as string) ?? "";
    const photos = formData.getAll("photos") as File[];

    if (!name || !phone || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const attachments = [];
    for (const photo of photos) {
      if (photo.size > 0 && photo.size <= MAX_BYTES) {
        attachments.push({
          filename: photo.name || "photo",
          content: Buffer.from(await photo.arrayBuffer()),
          contentType: photo.type || "application/octet-stream",
        });
      }
    }

    await sendContactEmail({ name, phone, email, message, attachments });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact submission failed:", err);
    return NextResponse.json({ error: "Failed to process submission" }, { status: 500 });
  }
}

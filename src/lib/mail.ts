import nodemailer from "nodemailer";
import { getSmtpSettings } from "./settings";

export interface ContactSubmission {
  name: string;
  phone: string;
  email: string;
  message: string;
  attachments: { filename: string; content: Buffer; contentType: string }[];
}

/**
 * Email a contact-form submission using the SMTP credentials stored in admin
 * settings. Throws if SMTP is not configured or delivery fails, so the API can
 * surface a meaningful error to the visitor.
 */
export async function sendContactEmail(submission: ContactSubmission): Promise<void> {
  const smtp = await getSmtpSettings();
  if (!smtp || !smtp.host || !smtp.user) {
    throw new Error("SMTP is not configured");
  }

  const transport = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: { user: smtp.user, pass: smtp.pass },
  });

  const { name, phone, email, message, attachments } = submission;

  await transport.sendMail({
    from: smtp.fromEmail || smtp.user,
    to: smtp.toEmail || smtp.user,
    replyTo: email,
    subject: `New quote request from ${name}`,
    text: [
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Email: ${email}`,
      "",
      message,
    ].join("\n"),
    html: `
      <h2>New quote request</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
    `,
    attachments,
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

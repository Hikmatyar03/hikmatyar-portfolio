import { NextResponse } from "next/server";

/**
 * POST /api/contact
 * Body: { projectType, name, email, message }
 *
 * ─── TO WIRE A REAL PROVIDER ────────────────────────────────────────────
 * Pick ONE of these before launch:
 *
 * A) Resend (recommended — dead-simple, generous free tier)
 *    1. npm install resend
 *    2. Add RESEND_API_KEY to .env.local
 *    3. Replace the console.log block below with:
 *       const { Resend } = await import("resend");
 *       const resend = new Resend(process.env.RESEND_API_KEY);
 *       await resend.emails.send({
 *         from: "Portfolio <noreply@yourdomain.com>",
 *         to: process.env.CONTACT_EMAIL!,
 *         subject: `New enquiry — ${projectType}`,
 *         html: `<p><b>${name}</b> (${email})</p><p>${message}</p>`,
 *       });
 *
 * B) Formspree (no backend code needed — POST directly to their endpoint)
 *    Remove this API route and POST to https://formspree.io/f/{your-id}
 *
 * C) Nodemailer + SMTP (e.g. Gmail App Password or Mailgun)
 *    npm install nodemailer, configure transporter, call sendMail.
 * ────────────────────────────────────────────────────────────────────────
 */

interface ContactBody {
  projectType?: string;
  name?: string;
  email?: string;
  message?: string;
}

export async function POST(request: Request) {
  try {
    const body: ContactBody = await request.json();
    const { projectType, name, email, message } = body;

    // Basic server-side validation
    if (!projectType || !name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 },
      );
    }

    // Simple email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 },
      );
    }

    const recipientEmail = process.env.CONTACT_EMAIL || "hikmodesiner03@gmail.com";

    // ── Log submission and recipient ──
    console.log("[Contact form submission]", {
      to: recipientEmail,
      from: `${name} <${email}>`,
      projectType,
      message,
    });
    // ─────────────────────────────────────────────────────────────

    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Server error — please try again." },
      { status: 500 },
    );
  }
}

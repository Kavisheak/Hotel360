import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs"; // Ensure standard Node.js runtime on Vercel for TCP SMTP support

export async function POST(req: Request) {
  try {
    const { to, subject, html, key } = await req.json();

    // Security check to ensure only our backend can invoke the email relay
    const expectedKey = process.env.EMAIL_RELAY_KEY || "eascc_relay_secure_2026";
    if (key !== expectedKey) {
      return NextResponse.json({ success: false, message: "Unauthorized relay key" }, { status: 401 });
    }

    if (!to || !subject || !html) {
      return NextResponse.json({ success: false, message: "Missing required fields (to, subject, html)" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER || "easccweddinghall@gmail.com",
        pass: process.env.EMAIL_PASS || "wcplkrbppzwwcpaj",
      },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"EASCCA Wedding Hall" <easccweddinghall@gmail.com>',
      to,
      subject,
      html,
    });

    console.log(`[VERCEL EMAIL RELAY] Dispatched email to ${to}: ${info.messageId}`);
    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error: any) {
    console.error("[VERCEL EMAIL RELAY ERROR]:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

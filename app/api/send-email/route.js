import nodemailer from "nodemailer";

// ✅ FORCE Node.js runtime (CRITICAL)
export const runtime = "nodejs";

export async function POST(req) {
  try {
    const body = await req.json();
    const { to, subject, html } = body;

    if (!to || !subject || !html) {
      return new Response(
        JSON.stringify({ ok: false, error: "Missing email data" }),
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.ZOHO_HOST,
      port: Number(process.env.ZOHO_PORT), // ✅ ensure number
      secure: true, // ✅ 465 = SSL
      auth: {
        user: process.env.ZOHO_USER,
        pass: process.env.ZOHO_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"Santandaer Bank" <${process.env.ZOHO_USER}>`,
      to,
      subject,
      html,
    });

    return new Response(
      JSON.stringify({
        ok: true,
        message: "Email sent successfully ✅",
        messageId: info.messageId,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("💥 Email send error:", error);

    return new Response(
      JSON.stringify({
        ok: false,
        error: error.message || "Internal email server error",
      }),
      { status: 500 }
    );
  }
}

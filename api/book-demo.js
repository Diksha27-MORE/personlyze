import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { name, company, email, phone } = req.body || {};

    // Basic validation — bad input shouldn't silently pass through
    if (!name || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev", // see note below re: custom domain
      to: process.env.RESEND_TO_EMAIL,
      subject: "New Book Demo Request",
      reply_to: email, // lets you hit "reply" and email the lead directly
      html: `
        <h2>New Book Demo Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
      `,
    });

    // THIS is the check your original code was missing
    if (error) {
      console.error("Resend API error:", error);
      return res.status(502).json({
        success: false,
        error: error.message || "Failed to send email",
      });
    }

    console.log("Email sent:", data);

    return res.status(200).json({
      success: true,
      id: data?.id,
    });
  } catch (err) {
    console.error("Unexpected server error:", err);
    return res.status(500).json({
      error: err.message,
    });
  }
}
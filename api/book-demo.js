import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { name, company, email, phone } = req.body;

    const { error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: process.env.RESEND_TO_EMAIL,
      subject: "New Book Demo Request",
      html: `
        <h2>New Book Demo Request</h2>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
      `,
    });

    if (error) {
      return res.status(500).json({ error });
    }

    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
}
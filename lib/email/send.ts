import { resend } from "./config";

interface EmailOptions {
  to: string;
  subject: string;
  from: string;
  html: string;
}

export async function sendEmail(options: EmailOptions) {
  const { to, subject, html, from } = options;

  try {
    await resend.emails.create({
      from,
      to,
      html,
      subject,
    });
  } catch(error) {
    console.error("Resend error: ", error);
  }
}

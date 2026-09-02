import { MagicLinkEmail } from "@/emails/magic-link-email";
import { Resend } from "resend";

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set");
  }
  return new Resend(apiKey);
}

export async function sendMagicLinkEmail({
  email,
  magicLink,
  userName,
}: {
  email: string;
  magicLink: string;
  userName?: string;
}) {
  try {
    const { data, error } = await getResend().emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Logotham <noreply@logotham.app>",
      to: [email],
      subject: "Sign in to Logotham",
      react: MagicLinkEmail({ magicLink, userName }),
    });

    if (error) {
      console.error("Failed to send magic link email:", error);
      throw new Error("Failed to send magic link email");
    }

    return data;
  } catch (error) {
    console.error("Error sending magic link email:", error);
    throw error;
  }
}

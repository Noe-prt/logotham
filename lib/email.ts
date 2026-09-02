import { MagicLinkEmail } from "@/emails/magic-link-email";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
    const { data, error } = await resend.emails.send({
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

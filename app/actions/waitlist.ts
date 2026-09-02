"use server";

import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export type WaitlistState = {
  success?: boolean;
  error?: string;
  message?: string;
};

export async function joinWaitlist(prevState: WaitlistState | null, formData: FormData): Promise<WaitlistState> {
  const email = formData.get("email") as string;

  if (!email || email.trim().length === 0) {
    return { error: "Email is required." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  try {
    await redis.sadd("logotham:waitlist", email);
    return { success: true, message: "You've been added to the waitlist!" };
  } catch (error) {
    console.error("Failed to join waitlist:", error);
    return { error: "Failed to join waitlist. Please try again later." };
  }
}

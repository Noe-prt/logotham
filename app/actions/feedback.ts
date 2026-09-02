"use server";

import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export type FeedbackState = {
  success?: boolean;
  error?: string;
  message?: string;
};

export async function submitFeedback(
  prevState: FeedbackState | null,
  formData: FormData
): Promise<FeedbackState> {
  const message = formData.get("message") as string;
  const email = formData.get("email") as string;

  if (!message || message.trim().length === 0) {
    return { error: "Feedback message is required." };
  }

  const feedbackData = {
    message,
    email: email || "anonymous",
    timestamp: new Date().toISOString(),
  };

  try {
    await redis.lpush("logotham:feedback", JSON.stringify(feedbackData));
    return { success: true, message: "Feedback received. Thank you!" };
  } catch (error) {
    console.error("Failed to submit feedback:", error);
    return { error: "Failed to submit feedback. Please try again later." };
  }
}

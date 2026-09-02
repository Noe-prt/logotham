import { SiteHeaderClient } from "@/components/site-header-client";
import { auth } from "@/lib/auth";
import type { CurrentSession } from "@/types/session";
import { headers } from "next/headers";

export async function SiteHeader() {
  const session = await getCurrentSession();
  return <SiteHeaderClient session={session} />;
}

async function getCurrentSession(): Promise<CurrentSession> {
  try {
    return await auth.api.getSession({
      headers: await headers(),
    });
  } catch (error) {
    console.error("Failed to load session for header:", error);
    return null;
  }
}

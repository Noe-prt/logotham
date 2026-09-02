"use server";

import { incrementLogosGenerated } from "@/lib/site-stats";
import { revalidatePath } from "next/cache";

export async function incrementLogoDownloadCount() {
  try {
    const stats = await incrementLogosGenerated();
    revalidatePath("/", "layout");
    return stats;
  } catch (error) {
    console.error("Failed to increment logo download count:", error);
    return { iconsAvailable: 0, logosGenerated: 0 };
  }
}

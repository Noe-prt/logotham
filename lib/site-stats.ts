import { Redis } from "@upstash/redis";
import { promises as fs } from "fs";
import path from "path";

export type SiteStats = {
  iconsAvailable: number;
  logosGenerated: number;
};

const STATS_PATH = path.join(process.cwd(), "data", "site-stats.json");

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

async function getLocalStats() {
  try {
    const contents = await fs.readFile(STATS_PATH, "utf-8");
    const data = JSON.parse(contents);
    return { iconsAvailable: data.iconsAvailable || 0 };
  } catch (error) {
    console.error("Failed to read local stats file:", error);
    return { iconsAvailable: 0 };
  }
}

export async function getSiteStats(): Promise<SiteStats> {
  const localStats = await getLocalStats();

  try {
    const logosGenerated = await redis.get<number>("logosGenerated");
    return {
      iconsAvailable: localStats.iconsAvailable,
      logosGenerated: logosGenerated || 0,
    };
  } catch (error) {
    console.error("Failed to fetch stats from Redis:", error);
    return {
      iconsAvailable: localStats.iconsAvailable,
      logosGenerated: 0,
    };
  }
}

export async function incrementLogosGenerated(amount = 1): Promise<SiteStats> {
  const localStats = await getLocalStats();

  try {
    const newCount = await redis.incrby("logosGenerated", amount);
    return {
      iconsAvailable: localStats.iconsAvailable,
      logosGenerated: newCount,
    };
  } catch (error) {
    console.error("Failed to increment stats in Redis:", error);
    return {
      iconsAvailable: localStats.iconsAvailable,
      logosGenerated: 0,
    };
  }
}

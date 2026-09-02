import { Redis } from "@upstash/redis";

import { FREE_PLAN, findPlanDefinition } from "@/lib/billing-plans";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const exportKey = (userId: string) => `logotham:exports:${userId}`;
const MS_IN_DAY = 86_400_000;
const UNLIMITED_EXPORTS = -1;

type RawLedger = Record<string, string> | null;

export type ExportLedger = {
  plan: string;
  used: number;
  limit: number;
  resetsAt: number | null;
  updatedAt: number;
};

const limitValue = (value?: number | null) => {
  if (value == null || value < 0) {
    return UNLIMITED_EXPORTS;
  }
  return value;
};

function defaultLedger(): ExportLedger {
  const limit = limitValue(FREE_PLAN.limits.exportsPerMonth);
  const resetWindow = FREE_PLAN.limits.exportResetDays;
  const nextReset = resetWindow ? Date.now() + resetWindow * MS_IN_DAY : null;

  return {
    plan: FREE_PLAN.name,
    used: 0,
    limit,
    resetsAt: nextReset,
    updatedAt: Date.now(),
  };
}

function parseLedger(raw: RawLedger): ExportLedger | null {
  if (!raw || Object.keys(raw).length === 0) {
    return null;
  }

  return {
    plan: raw.plan ?? FREE_PLAN.name,
    used: Number(raw.used ?? 0),
    limit: Number(raw.limit ?? limitValue(FREE_PLAN.limits.exportsPerMonth)),
    resetsAt: raw.resetsAt ? Number(raw.resetsAt) : null,
    updatedAt: raw.updatedAt ? Number(raw.updatedAt) : Date.now(),
  };
}

async function writeLedger(userId: string, ledger: ExportLedger) {
  await redis.hset(exportKey(userId), {
    plan: ledger.plan,
    used: ledger.used,
    limit: ledger.limit,
    resetsAt: ledger.resetsAt ?? "",
    updatedAt: ledger.updatedAt,
  });
  return ledger;
}

function isUnlimited(limit: number) {
  return limit === UNLIMITED_EXPORTS;
}

async function ensureLedger(userId: string): Promise<ExportLedger> {
  const existing = parseLedger(await redis.hgetall(exportKey(userId)));
  if (existing) {
    return maybeResetFreeLedger(userId, existing);
  }
  const fresh = defaultLedger();
  return writeLedger(userId, fresh);
}

function computeNextFreeReset(planName: string) {
  if (planName !== FREE_PLAN.name) {
    return null;
  }
  const resetWindow = FREE_PLAN.limits.exportResetDays;
  return resetWindow ? Date.now() + resetWindow * MS_IN_DAY : null;
}

async function maybeResetFreeLedger(userId: string, ledger: ExportLedger) {
  if (ledger.plan !== FREE_PLAN.name || !ledger.resetsAt) {
    return ledger;
  }

  if (Date.now() < ledger.resetsAt) {
    return ledger;
  }

  const updated: ExportLedger = {
    ...ledger,
    used: 0,
    resetsAt: computeNextFreeReset(ledger.plan),
    updatedAt: Date.now(),
  };
  return writeLedger(userId, updated);
}

export async function getExportLedger(userId: string): Promise<ExportLedger> {
  return ensureLedger(userId);
}

type PlanExportSyncOptions = {
  plan: string;
  limit: number | null;
  resetsAt?: Date | null;
  resetUsage?: boolean;
};

export async function syncPlanExports(
  userId: string,
  options: PlanExportSyncOptions
): Promise<ExportLedger> {
  const existing = await getExportLedger(userId);
  const limit = limitValue(options.limit);
  const shouldReset = options.resetUsage ?? true;

  const nextLedger: ExportLedger = {
    plan: options.plan,
    limit,
    used: shouldReset ? 0 : existing.used,
    resetsAt: options.resetsAt ? options.resetsAt.getTime() : existing.resetsAt,
    updatedAt: Date.now(),
  };

  return writeLedger(userId, nextLedger);
}

export async function resetToFreeExports(userId: string) {
  const resetWindow = FREE_PLAN.limits.exportResetDays;
  return syncPlanExports(userId, {
    plan: FREE_PLAN.name,
    limit: FREE_PLAN.limits.exportsPerMonth,
    resetsAt:
      resetWindow != null && resetWindow > 0
        ? new Date(Date.now() + resetWindow * MS_IN_DAY)
        : null,
    resetUsage: true,
  });
}

export async function consumeExport(
  userId: string,
  amount = 1
): Promise<ExportLedger> {
  if (amount <= 0) {
    return getExportLedger(userId);
  }

  const ledger = await getExportLedger(userId);
  if (!isUnlimited(ledger.limit) && ledger.used + amount > ledger.limit) {
    throw new Error(
      "You're out of export slots for this cycle. Upgrade your plan to keep downloading."
    );
  }

  await redis.hincrby(exportKey(userId), "used", amount);
  const updated: ExportLedger = {
    ...ledger,
    used: ledger.used + amount,
    updatedAt: Date.now(),
  };
  await redis.hset(exportKey(userId), { updatedAt: updated.updatedAt });
  return updated;
}

export function getExportRemaining(ledger: ExportLedger) {
  if (isUnlimited(ledger.limit)) {
    return null;
  }
  return Math.max(0, ledger.limit - ledger.used);
}

/**
 * Determines if exports should include a watermark based on the user's plan.
 * Only free tier exports get watermarked.
 */
export function shouldShowWatermark(planName: string): boolean {
  const plan = findPlanDefinition(planName);
  // Free plan has watermark, all paid plans do not
  return plan?.name === FREE_PLAN.name;
}

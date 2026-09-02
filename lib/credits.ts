import { Redis } from "@upstash/redis";

import { FREE_PLAN } from "@/lib/billing-plans";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const creditKey = (userId: string) => `logotham:credits:${userId}`;

export type CreditsLedger = {
  plan: string;
  balance: number;
  limit: number;
  resetsAt: number | null;
  updatedAt: number;
};

function defaultLedger(): CreditsLedger {
  const limit = FREE_PLAN.limits.generations;
  return {
    plan: FREE_PLAN.name,
    balance: limit,
    limit,
    resetsAt: null,
    updatedAt: Date.now(),
  };
}

function parseLedger(
  raw: Record<string, string> | null
): CreditsLedger | null {
  if (!raw || Object.keys(raw).length === 0) {
    return null;
  }

  return {
    plan: raw.plan ?? FREE_PLAN.name,
    balance: Number(raw.balance ?? FREE_PLAN.limits.generations),
    limit: Number(raw.limit ?? FREE_PLAN.limits.generations),
    resetsAt:
      raw.resetsAt && raw.resetsAt.length > 0
        ? Number(raw.resetsAt)
        : null,
    updatedAt: raw.updatedAt ? Number(raw.updatedAt) : Date.now(),
  };
}

async function writeLedger(
  userId: string,
  ledger: CreditsLedger
): Promise<CreditsLedger> {
  await redis.hset(creditKey(userId), {
    plan: ledger.plan,
    balance: ledger.balance,
    limit: ledger.limit,
    resetsAt: ledger.resetsAt ?? "",
    updatedAt: ledger.updatedAt,
  });
  return ledger;
}

export async function getCreditsLedger(
  userId: string
): Promise<CreditsLedger> {
  const current = parseLedger(await redis.hgetall(creditKey(userId)));
  if (current) {
    return current;
  }

  const fresh = defaultLedger();
  return writeLedger(userId, fresh);
}

type PlanSyncOptions = {
  plan: string;
  limit: number;
  resetsAt?: Date | null;
  resetBalance?: boolean;
};

export async function syncPlanCredits(
  userId: string,
  options: PlanSyncOptions
): Promise<CreditsLedger> {
  const existing = await getCreditsLedger(userId);
  const limit = Math.max(0, options.limit);
  const shouldReset = options.resetBalance ?? true;
  const nextLedger: CreditsLedger = {
    plan: options.plan,
    limit,
    balance: shouldReset
      ? limit
      : Math.min(existing.balance, limit),
    resetsAt: options.resetsAt ? options.resetsAt.getTime() : null,
    updatedAt: Date.now(),
  };

  return writeLedger(userId, nextLedger);
}

export async function resetToFreeCredits(userId: string) {
  return syncPlanCredits(userId, {
    plan: FREE_PLAN.name,
    limit: FREE_PLAN.limits.generations,
    resetBalance: true,
    resetsAt: null,
  });
}

export async function consumeCredits(
  userId: string,
  amount = 1
): Promise<CreditsLedger> {
  if (amount <= 0) {
    return getCreditsLedger(userId);
  }

  const ledger = await getCreditsLedger(userId);
  if (ledger.balance < amount) {
    throw new Error(
      "You're out of credits. Please upgrade your plan to generate more logos."
    );
  }

  const newBalance = ledger.balance - amount;
  await redis.hincrby(creditKey(userId), "balance", -amount);
  const updatedAt = Date.now();
  await redis.hset(creditKey(userId), { updatedAt });

  return {
    ...ledger,
    balance: newBalance,
    updatedAt,
  };
}


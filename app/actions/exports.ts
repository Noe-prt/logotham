"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { findPlanDefinition, FREE_PLAN } from "@/lib/billing-plans";
import {
  consumeExport,
  getExportLedger,
  getExportRemaining,
  shouldShowWatermark,
} from "@/lib/export-ledger";

export type ExportFormat =
  | "png"
  | "svg"
  | "bundle"
  | "brand"
  | "favicon"
  | "json"
  | "mockup";

const EXPORT_COST: Partial<Record<ExportFormat, number>> = {
  bundle: 2,
  brand: 3,
  json: 0,
};

type ExportSlotOptions = {
  maxDimension?: number | null;
};

export async function requestExportSlot(
  format: ExportFormat,
  options?: ExportSlotOptions
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      success: false,
      error: "Sign in to export logos.",
    };
  }

  const amount = EXPORT_COST[format] ?? 1;
  const baseLedger = await getExportLedger(session.user.id);
  const planDefinition = findPlanDefinition(baseLedger.plan) ?? FREE_PLAN;

  const planMaxExportSize = planDefinition.limits.maxExportSize ?? null;
  const requestedSize = options?.maxDimension ?? null;

  if (planMaxExportSize && requestedSize && requestedSize > planMaxExportSize) {
    return {
      success: false,
      error: `${planDefinition.label} supports exports up to ${planMaxExportSize}px. Upgrade to go bigger.`,
    };
  }

  // Determine if watermark should be applied
  // Watermark applies to free plan only, and only for PNG/SVG exports (not favicon/json)
  const watermarkFormats: ExportFormat[] = ["png", "svg", "bundle", "brand"];
  const watermark =
    watermarkFormats.includes(format) && shouldShowWatermark(baseLedger.plan);

  try {
    const ledger =
      amount > 0 ? await consumeExport(session.user.id, amount) : baseLedger;
    return {
      success: true,
      plan: ledger.plan,
      used: ledger.used,
      limit: ledger.limit < 0 ? null : ledger.limit,
      remaining: getExportRemaining(ledger),
      resetsAt: ledger.resetsAt,
      watermark,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to process export. Please try again.",
    };
  }
}

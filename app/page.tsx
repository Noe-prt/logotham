import { LogoGenerator } from "@/components/logo-generator";
import { auth } from "@/lib/auth";
import { findPlanDefinition, FREE_PLAN } from "@/lib/billing-plans";
import { getExportLedger, getExportRemaining } from "@/lib/export-ledger";
import { headers } from "next/headers";

export default async function Home() {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  let planDefinition = FREE_PLAN;
  let exportsRemaining: number | null = null;

  if (session) {
    const exportLedger = await getExportLedger(session.user.id);
    planDefinition = findPlanDefinition(exportLedger.plan) ?? FREE_PLAN;
    exportsRemaining = getExportRemaining(exportLedger);
  }

  return (
    <LogoGenerator
      planLimits={{
        planName: planDefinition.name,
        maxExportSize: planDefinition.limits.maxExportSize ?? null,
        exportsRemaining,
        isAuthenticated: !!session,
      }}
    />
  );
}

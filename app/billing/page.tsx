import { ManageBillingButton } from "@/components/pricing/manage-billing-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { auth } from "@/lib/auth";
import {
  FREE_PLAN,
  findPlanDefinition,
  getPricingPlans,
} from "@/lib/billing-plans";
import { getCreditsLedger } from "@/lib/credits";
import { getExportLedger } from "@/lib/export-ledger";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Billing | Logotham",
  description: "Manage your Logotham subscription and Stripe billing portal.",
};

async function getBillingDetails() {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session) {
    redirect("/login");
  }

  const [ledger, exportLedger, userSubscriptions] = await Promise.all([
    getCreditsLedger(session.user.id),
    getExportLedger(session.user.id),
    db.query.subscriptions.findMany({
      where: eq(subscriptions.userId, session.user.id),
    }),
  ]);

  const getTimestamp = (value: Date | null | undefined) => {
    if (value instanceof Date) {
      return value.getTime();
    }
    return 0;
  };
  const activeSubscription = userSubscriptions
    .slice()
    .sort((a, b) => getTimestamp(b.updatedAt) - getTimestamp(a.updatedAt))[0];

  const ledgerPlanDefinition =
    findPlanDefinition(ledger.plan) ??
    (ledger.plan === FREE_PLAN.name ? FREE_PLAN : undefined);

  const planDefinition =
    findPlanDefinition(activeSubscription?.plan) ??
    ledgerPlanDefinition ??
    FREE_PLAN;

  return {
    session,
    ledger,
    exportLedger,
    planDefinition: planDefinition ?? FREE_PLAN,
    planStatus:
      activeSubscription?.status ??
      (planDefinition.name === FREE_PLAN.name ? "free" : "active"),
  };
}

export default async function BillingPage() {
  const { session, ledger, exportLedger, planDefinition, planStatus } =
    await getBillingDetails();
  const plans = getPricingPlans();
  const nextReset = ledger.resetsAt
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(ledger.resetsAt)
    : null;
  const exportReset = exportLedger.resetsAt
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(exportLedger.resetsAt)
    : null;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-10">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
          Billing
        </p>
        <h1 className="text-3xl font-semibold leading-tight">
          Manage your subscription
        </h1>
        <p className="text-sm text-muted-foreground">
          Update your plan, review invoices, or change payment details through
          Stripe.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Current plan</CardTitle>
          <CardDescription>
            {planDefinition?.description ??
              "Your current credit allowance and billing status."}
          </CardDescription>
        </CardHeader>
        <CardPanel className="grid gap-6 md:grid-cols-3">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Plan
            </p>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">
                {planDefinition?.label ?? "Free"}
              </span>
              <Badge variant="outline" className="capitalize">
                {planStatus}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {nextReset
                ? `Renews on ${nextReset}`
                : "Upgrade to unlock higher monthly credits."}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Credits remaining
            </p>
            <p className="text-3xl font-semibold">
              {ledger.balance}
              <span className="text-base font-normal text-muted-foreground">
                {" "}
                / {ledger.limit}
              </span>
            </p>
            <p className="text-sm text-muted-foreground">
              1 AI logo prompt = 1 credit. Credits refresh every billing cycle.
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Exports this month
            </p>
            {exportLedger.limit < 0 ? (
              <p className="text-3xl font-semibold">Unlimited</p>
            ) : (
              <p className="text-3xl font-semibold">
                {Math.max(0, exportLedger.limit - exportLedger.used)}
                <span className="text-base font-normal text-muted-foreground">
                  {" "}
                  / {exportLedger.limit}
                </span>
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              {exportLedger.limit < 0
                ? "Unlimited exports + premium bundles."
                : exportReset
                  ? `Resets on ${exportReset}`
                  : "Resets with your billing cycle."}
            </p>
          </div>
        </CardPanel>
        <CardPanel className="flex flex-wrap gap-3 border-t py-2">
          <ManageBillingButton />
          <Button asChild variant="outline">
            <Link href="/pricing">Change plan</Link>
          </Button>
        </CardPanel>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available plans</CardTitle>
          <CardDescription>
            Compare what&apos;s included before you switch.
          </CardDescription>
        </CardHeader>
        <CardPanel className="grid gap-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="flex flex-col gap-1 border rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-semibold">{plan.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {plan.creditCopy}
                  </p>
                </div>
                <p className="text-lg font-semibold">{plan.price}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                {plan.description}
              </p>
            </div>
          ))}
        </CardPanel>
      </Card>

      <div className="text-xs text-muted-foreground">
        Signed in as <span className="font-medium">{session.user.email}</span>
      </div>
    </div>
  );
}

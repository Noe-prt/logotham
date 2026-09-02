import { DeleteAccountButton } from "@/components/settings/delete-account-button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { auth } from "@/lib/auth";
import { getCreditsLedger } from "@/lib/credits";
import { getExportLedger } from "@/lib/export-ledger";
import { db } from "@/db";
import { accounts } from "@/db/schema";
import { findPlanDefinition, FREE_PLAN } from "@/lib/billing-plans";
import { eq, inArray, or } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";

export const metadata = {
  title: "Settings | Logotham",
};

const PROVIDER_LABELS: Record<string, string> = {
  google: "Google",
  github: "GitHub",
};

const ACTIVE_SUBSCRIPTION_STATUSES = ["active", "trialing"];

type UsageSummary = {
  planLabel: string;
  planName: string;
  status: string;
  creditsRemaining: number;
  creditLimit: number;
  resetsAt: number | null;
  exportsUsed: number;
  exportLimit: number | null;
  exportResetsAt: number | null;
  billingType: "subscription" | "one-time";
};

async function getSettingsData() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const [linkedAccounts, credits, exportLedger, activeSubscription] = await Promise.all([
    db
      .select({
        id: accounts.id,
        providerId: accounts.providerId,
      })
      .from(accounts)
      .where(eq(accounts.userId, session.user.id)),
    getCreditsLedger(session.user.id),
    getExportLedger(session.user.id),
    db.query.subscriptions.findFirst({
      where: (subscription, { and }) =>
        and(
          inArray(subscription.status, ACTIVE_SUBSCRIPTION_STATUSES),
          or(
            eq(subscription.userId, session.user.id),
            eq(subscription.referenceId, session.user.id)
          )
        ),
      orderBy: (subscription, { desc }) => desc(subscription.updatedAt),
    }),
  ]);

  const planDefinition = activeSubscription
    ? findPlanDefinition(activeSubscription.plan) ?? {
        ...FREE_PLAN,
        name: activeSubscription.plan,
        label: activeSubscription.plan,
      }
    : FREE_PLAN;

  const exportLimit =
    exportLedger.limit != null && exportLedger.limit >= 0
      ? exportLedger.limit
      : null;

  const usage: UsageSummary = {
    planLabel: planDefinition.label,
    planName: planDefinition.name,
    status: activeSubscription?.status ?? "free",
    creditsRemaining: credits.balance,
    creditLimit: credits.limit ?? planDefinition.limits.generations,
    resetsAt: credits.resetsAt,
    exportsUsed: exportLedger.used,
    exportLimit,
    exportResetsAt: exportLedger.resetsAt,
    billingType: planDefinition.billingType ?? "subscription",
  };

  return {
    session,
    linkedAccounts,
    usage,
  };
}

type SettingsSearchParams = {
  billing?: string;
  plan?: string;
};

type SettingsPageProps = {
  searchParams?: SettingsSearchParams | Promise<SettingsSearchParams | undefined>;
};

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const resolvedSearchParams =
    (await Promise.resolve(searchParams)) ?? ({} as SettingsSearchParams);
  const { session, linkedAccounts, usage } = await getSettingsData();
  const billingStatus = resolvedSearchParams.billing;
  const planQuery = resolvedSearchParams.plan
    ? findPlanDefinition(resolvedSearchParams.plan)
    : undefined;
  const displayUsage = planQuery
    ? {
        ...usage,
        planLabel: planQuery.label,
        planName: planQuery.name,
        creditLimit: planQuery.limits.generations,
        exportLimit:
          planQuery.limits.exportsPerMonth != null &&
          planQuery.limits.exportsPerMonth >= 0
            ? planQuery.limits.exportsPerMonth
            : null,
        billingType: planQuery.billingType ?? "subscription",
      }
    : usage;
  const providerLabels =
    linkedAccounts.length > 0
      ? linkedAccounts.map((account) => ({
          id: account.id,
          label: PROVIDER_LABELS[account.providerId] ?? account.providerId,
        }))
      : [];

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10">
      {billingStatus === "success" ? (
        <Alert variant="success">
          <Sparkles className="h-4 w-4" />
          <div>
            <AlertTitle>Plan updated</AlertTitle>
            <AlertDescription>
              You&apos;re now on the {planQuery?.label ?? "new"} plan. Credits refresh
              within a few moments.
            </AlertDescription>
          </div>
        </Alert>
      ) : null}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Account
        </p>
        <h1 className="text-3xl font-semibold leading-tight">Settings</h1>
        <p className="text-muted-foreground text-sm">
          Manage your profile, connected providers, and account security.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your basic account details</CardDescription>
        </CardHeader>
        <CardPanel className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Name
            </p>
            <p className="text-base">
              {session.user.name ?? "Unnamed user"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Email
            </p>
            <p className="text-base break-all">
              {session.user.email ?? "—"}
            </p>
          </div>
        </CardPanel>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usage & credits</CardTitle>
          <CardDescription>Every AI prompt costs 1 credit.</CardDescription>
        </CardHeader>
        <CardPanel className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Plan
            </p>
            <div className="flex items-center gap-2">
              <p className="text-base font-medium capitalize">
                {displayUsage.planLabel}
              </p>
              <Badge variant="outline" className="capitalize">
                {displayUsage.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {displayUsage.billingType === "one-time"
                ? "Lifetime license active."
                : displayUsage.resetsAt
                ? `Renews on ${formatDate(displayUsage.resetsAt)}`
                : "Upgrade to unlock higher limits and automatic renewals."}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Credits remaining
            </p>
            <p className="text-2xl font-semibold">
              {displayUsage.creditsRemaining}
              <span className="text-base font-normal text-muted-foreground">
                {" "}
                / {displayUsage.creditLimit}
              </span>
            </p>
            <p className="text-sm text-muted-foreground">
              Need more? Upgrade via the billing portal in your account menu.
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Exports this month
            </p>
            {displayUsage.exportLimit == null ? (
              <p className="text-2xl font-semibold">Unlimited</p>
            ) : (
              <p className="text-2xl font-semibold">
                {Math.max(
                  0,
                  displayUsage.exportLimit - displayUsage.exportsUsed
                )}
                <span className="text-base font-normal text-muted-foreground">
                  {" "}
                  / {displayUsage.exportLimit}
                </span>
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              {displayUsage.exportLimit == null
                ? "Unlimited exports on your current plan."
                : displayUsage.exportResetsAt
                  ? `Resets on ${formatDate(displayUsage.exportResetsAt)}`
                  : "Resets with your billing cycle."}
            </p>
          </div>
        </CardPanel>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Connected providers</CardTitle>
          <CardDescription>
            You currently sign in using OAuth only.
          </CardDescription>
        </CardHeader>
        <CardPanel>
          {providerLabels.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {providerLabels.map((provider) => (
                <Badge key={provider.id} variant="outline" size="lg">
                  {provider.label}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No providers linked. Please contact support.
            </p>
          )}
        </CardPanel>
      </Card>

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle>Danger zone</CardTitle>
          <CardDescription>
            Permanently remove your Logotham account and usage data.
          </CardDescription>
        </CardHeader>
        <CardPanel className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground max-w-lg">
            Deleting your account immediately signs you out and revokes access
            to any saved logo projects and credits. This cannot be undone.
          </p>
          <DeleteAccountButton />
        </CardPanel>
      </Card>
    </div>
  );
}

function formatDate(timestamp: number | null) {
  if (!timestamp) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(timestamp));
}

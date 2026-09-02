import { UpgradePlanButton } from "@/components/pricing/upgrade-plan-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { FREE_PLAN, getPricingPlans } from "@/lib/billing-plans";
import { getCreditsLedger } from "@/lib/credits";
import { headers } from "next/headers";
import Link from "next/link";

export const metadata = {
  title: "Pricing | Logotham",
  description:
    "Choose a plan that fits your creative flow and unlock more AI logo credits.",
};

export default async function PricingPage() {
  const [session, plans] = await Promise.all([
    auth.api.getSession({
      headers: await headers(),
    }),
    Promise.resolve(getPricingPlans()),
  ]);

  const currentPlan =
    session != null
      ? (await getCreditsLedger(session.user.id)).plan
      : FREE_PLAN.name;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-12">
      <header className="text-center space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
          Simple Pricing
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">
          Pay once, design forever.
        </h1>
        <p className="text-muted-foreground text-base max-w-2xl mx-auto">
          Logotham gives you 1 free credit to start. Upgrade for more AI power
          and watermark-free exports.
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch">
        {plans.map((plan) => {
          const isCurrent =
            currentPlan.toLowerCase() === plan.name.toLowerCase();
          const isFree = plan.name === FREE_PLAN.name;
          const requireAuth = !session;

          return (
            <Card
              key={plan.name}
              className={`flex flex-col flex-1 max-w-md border-border/70 ${
                plan.highlight
                  ? "border-primary/40 shadow-lg shadow-primary/10"
                  : ""
              }`}
            >
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-semibold">
                      {plan.label}
                    </CardTitle>
                    <p className="mt-1 text-3xl font-bold tracking-tight">
                      {plan.price}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {plan.creditCopy}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {plan.badge && !isCurrent ? (
                      <Badge variant="outline">{plan.badge}</Badge>
                    ) : null}
                    {isCurrent ? (
                      <Badge variant="default">Current plan</Badge>
                    ) : null}
                  </div>
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardPanel className="flex flex-1 flex-col gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    What&apos;s included
                  </p>
                  <ul className="space-y-2 text-sm text-foreground/90">
                    {plan.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/70" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-auto pt-4">
                  {isFree ? (
                    session ? (
                      <Button className="w-full" variant="outline" disabled>
                        You&apos;re on this plan
                      </Button>
                    ) : (
                      <Button asChild className="w-full">
                        <Link href="/login">Sign in to claim credits</Link>
                      </Button>
                    )
                  ) : !plan.available ? (
                    <Button className="w-full" variant="outline" disabled>
                      Coming soon
                    </Button>
                  ) : requireAuth ? (
                    <Button asChild className="w-full" variant="outline">
                      <Link href="/login">Sign in to upgrade</Link>
                    </Button>
                  ) : isCurrent ? (
                    <Button className="w-full" variant="outline" disabled>
                      Active subscription
                    </Button>
                  ) : (
                    <UpgradePlanButton
                      planName={plan.name}
                      className="w-full"
                      label="Upgrade"
                      variant={plan.highlight ? "default" : "secondary"}
                    />
                  )}
                </div>
              </CardPanel>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

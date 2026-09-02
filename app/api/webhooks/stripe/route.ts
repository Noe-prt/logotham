import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { findPlanDefinition } from "@/lib/billing-plans";
import { syncPlanCredits } from "@/lib/credits";
import { syncPlanExports } from "@/lib/export-ledger";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("Missing signature or STRIPE_WEBHOOK_SECRET");
    return NextResponse.json(
      { error: "Missing signature or secret" },
      { status: 400 }
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-02-25.clover",
  });

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook signature verification failed:`, err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { userId, plan } = session.metadata || {};

    if (!userId || !plan) {
      console.error("Missing metadata in checkout session");
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    const planDef = findPlanDefinition(plan);
    if (!planDef) {
      console.error("Unknown plan:", plan);
      return NextResponse.json({ error: "Unknown plan" }, { status: 400 });
    }

    try {
      await db.insert(subscriptions).values({
        id: crypto.randomUUID(),
        userId: userId,
        referenceId: userId,
        plan: plan,
        status: "active",
        stripeCustomerId: session.customer as string,
        stripeSubscriptionId: (session.subscription as string) || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const creditLimit = Number(planDef.limits.generations ?? 0);
      if (creditLimit) {
        await syncPlanCredits(userId, {
          plan: planDef.name,
          limit: creditLimit,
          resetsAt: null,
          resetBalance: true,
        });
      }

      const exportsPerMonth =
        typeof planDef.limits.exportsPerMonth === "number"
          ? planDef.limits.exportsPerMonth
          : null;
      await syncPlanExports(userId, {
        plan: planDef.name,
        limit: exportsPerMonth,
        resetsAt: null,
        resetUsage: true,
      });
    } catch (error) {
      console.error("Failed to process checkout session:", error);
      return NextResponse.json(
        { error: "Failed to process checkout" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}

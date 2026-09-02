type PlanLimits = {
  generations: number;
  exportsPerMonth: number | null;
  exportResetDays?: number | null;
  maxExportSize?: number;
  brandKitDownloads?: number | null;
};

type PlanDefinition = {
  name: string;
  label: string;
  description: string;
  limits: PlanLimits;
  benefits: string[];
  price: string;
  creditCopy: string;
  badge?: string;
  highlight?: boolean;
  envVar?: string;
  billingType?: "subscription" | "one-time";
};

const PLAN_DEFINITIONS: PlanDefinition[] = [
  {
    name: "starter",
    label: "Starter",
    envVar: "STRIPE_PRICE_STARTER",
    description: "Perfect for your next project. One logo, done right.",
    limits: {
      generations: 30,
      exportsPerMonth: 15,
      exportResetDays: null, // No reset - lifetime total
      maxExportSize: 1024,
      brandKitDownloads: 0,
    },
    benefits: [
      "30 AI credits (90 logo concepts)",
      "15 exports up to 1024px",
      "No watermark",
    ],
    price: "$5 one-time",
    creditCopy: "30 credits · never expires",
    badge: "Most Popular",
    highlight: true,
    billingType: "one-time",
  },
  {
    name: "pro",
    label: "Pro License",
    envVar: "STRIPE_PRICE_PRO",
    description:
      "For freelancers and serial builders. Every project, forever.",
    limits: {
      generations: 200,
      exportsPerMonth: null, // Unlimited
      exportResetDays: null,
      maxExportSize: 4096,
      brandKitDownloads: null, // Unlimited
    },
    benefits: [
      "200 AI credits (600 logo concepts)",
      "Unlimited high-res exports",
      "Vector (SVG) & Brand Kits",
    ],
    price: "$19 one-time",
    creditCopy: "200 credits · never expires",
    badge: "Best Value",
    highlight: false,
    billingType: "one-time",
  },
];

export const FREE_PLAN: PlanDefinition = {
  name: "free",
  label: "Free",
  description:
    "Try Logotham free—unlimited editing, 1 AI generation to see the magic.",
  limits: {
    generations: 1,
    exportsPerMonth: 1,
    exportResetDays: 30,
    maxExportSize: 256,
    brandKitDownloads: 0,
  },
  benefits: [
    "Unlimited editor + sharing",
    "1 export per month (256px max, with watermark)",
    "1 AI credit (one-time) to try AI",
  ],
  price: "Free",
  creditCopy: "1 credit total",
  badge: "Start here",
  billingType: "subscription",
};

export type StripeBillingPlan = PlanDefinition & {
  priceId: string;
};

export type PricingPlan = PlanDefinition & {
  available: boolean;
  billingType: "subscription" | "one-time";
};

export const activeStripePlans: StripeBillingPlan[] = PLAN_DEFINITIONS.flatMap(
  (plan) => {
    const priceId = plan.envVar ? process.env[plan.envVar] : undefined;
    if (!priceId) {
      return [];
    }

    return [
      {
        ...plan,
        priceId,
      },
    ];
  }
);

export function getPricingPlans(): PricingPlan[] {
  return [
    { ...FREE_PLAN, available: true, billingType: "subscription" },
    ...PLAN_DEFINITIONS.map((plan) => ({
      ...plan,
      available: plan.envVar ? Boolean(process.env[plan.envVar]) : true,
      billingType: plan.billingType ?? "subscription",
    })),
  ];
}

export function findPlanDefinition(planName?: string | null) {
  if (!planName) {
    return undefined;
  }

  const normalized = planName.toLowerCase();
  return [...PLAN_DEFINITIONS, FREE_PLAN].find(
    (plan) => plan.name.toLowerCase() === normalized
  );
}

# PRD: Pricing Restructure for Logotham

**Version:** 1.0  
**Author:** John (PM Agent)  
**Date:** 2026-01-21  
**Status:** Ready for Implementation

---

## 1. Problem Statement

Logotham's current pricing model fails to convert visitors to paying users. With 11 pricing page visits in 30 days and 0 conversions, the funnel is leaking because:

1. **Free tier is too generous** — 2 AI credits + 3 exports at 512px gives users everything they need for one logo
2. **No middle tier** — $19 is too high a commitment for first-time buyers testing a new tool
3. **No friction** — Users complete their goal without hitting a meaningful paywall

The result: users get value, leave satisfied, and never pay.

---

## 2. Goals & Success Metrics

### Goals
- Create meaningful friction in the free tier that drives upgrades
- Introduce a low-commitment entry tier ($5) to capture hesitant buyers
- Maintain healthy margins (95%+ on AI credits)

### Success Metrics
| Metric | Current | Target (90 days) |
|--------|---------|------------------|
| Pricing page → purchase conversion | 0% | 3-5% |
| Monthly revenue | $0 | $30+ |
| Free users hitting paywall | Unknown | 40%+ |

---

## 3. User Stories

### US-1: Free User Hits Export Wall
**As a** free user who made a logo,  
**I want to** export my creation,  
**So that** I can use it for my project.

**Acceptance Criteria:**
- Free users can export 1 logo/month at 256px max
- Exports include a small "Made with Logotham" watermark in bottom-right corner
- Watermark is visible but not obnoxious (~8-10px text, 30% opacity)
- User sees clear upgrade CTA when export limit reached or when trying larger sizes

### US-2: Free User Wants More AI Generations
**As a** free user who used my 1 AI credit,  
**I want to** generate more logo concepts,  
**So that** I can explore different directions.

**Acceptance Criteria:**
- Free users get 1 AI credit (down from 2)
- After using the credit, user sees "Upgrade to generate more" CTA
- CTA links directly to pricing page with Starter tier highlighted

### US-3: Budget-Conscious Buyer Wants Low Commitment
**As a** first-time visitor skeptical of new tools,  
**I want to** pay a small amount to finish my project,  
**So that** I'm not locked into an expensive purchase.

**Acceptance Criteria:**
- Starter tier available at $5 lifetime
- Includes 30 AI credits (90 logo concepts)
- Includes 15 exports up to 1024px, no watermark
- Clear "Most Popular" badge on Starter tier

### US-4: Power User Wants Full Access
**As a** freelancer or serial builder,  
**I want to** have unlimited exports and plenty of credits,  
**So that** I can use Logotham across multiple projects.

**Acceptance Criteria:**
- Pro tier remains at $19 lifetime
- Includes 200 AI credits
- Unlimited exports up to 4096px, no watermark
- Includes brand kit downloads
- "Best Value" badge on Pro tier

---

## 4. Pricing Tiers (Final Structure)

### Free Tier
| Feature | Value |
|---------|-------|
| AI Credits | 1 (one-time) |
| Exports | 1/month, max 256px, **with watermark** |
| Editor | Full access |
| Templates | All |
| Sharing | Unlimited |

**Messaging:** *"Try Logotham free—unlimited editing, 1 AI generation to see the magic."*

---

### Starter Tier — $5 Lifetime (NEW)
| Feature | Value |
|---------|-------|
| AI Credits | 30 (90 logo concepts) |
| Exports | 15 total, max 1024px, no watermark |
| Brand Kits | ❌ |

**Messaging:** *"Perfect for your next project. One logo, done right."*  
**Badge:** "Most Popular"  
**Highlight:** Yes (primary visual emphasis)

---

### Pro Tier — $19 Lifetime
| Feature | Value |
|---------|-------|
| AI Credits | 200 (600 logo concepts) |
| Exports | Unlimited, max 4096px, no watermark |
| Brand Kits | ✅ Unlimited |
| Commercial Rights | ✅ |

**Messaging:** *"For freelancers and serial builders. Every project, forever."*  
**Badge:** "Best Value"

---

### Boost Pack — REMOVED
Remove from codebase. Reintroduce when 50+ Pro customers exist.

---

## 5. Technical Implementation

### 5.1 Files to Modify

#### `lib/billing-plans.ts`
- Update `FREE_PLAN.limits`:
  - `generations: 1` (was 2)
  - `exportsPerMonth: 1` (was 3)
  - `maxExportSize: 256` (was 512)
- Add new `starter` plan to `PLAN_DEFINITIONS`:
  ```typescript
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
      "Commercial usage rights",
    ],
    price: "$5 one-time",
    creditCopy: "30 credits · never expires",
    badge: "Most Popular",
    highlight: true,
    billingType: "one-time",
  }
  ```
- Update `pro` plan:
  - Set `highlight: false`
  - Keep `badge: "Best Value"`
- Remove `BOOST_PACK` export and `getAddOnPlans()` function

#### `lib/export-ledger.ts`
- Add `watermark: boolean` field to `ExportLedger` type
- Update `defaultLedger()` to set `watermark: true` for free plan
- Add helper `shouldShowWatermark(ledger: ExportLedger): boolean`

#### `app/actions/exports.ts`
- Update `requestExportSlot` return type to include `watermark: boolean`
- Return watermark status based on plan

#### `components/logo/preview/index.tsx` (or create new `watermark-utils.ts`)
- Create watermark rendering function:
  ```typescript
  function renderWatermark(
    canvas: HTMLCanvasElement,
    size: number
  ): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const text = "Made with Logotham";
    const fontSize = Math.max(8, Math.floor(size * 0.03));
    ctx.font = `${fontSize}px system-ui, sans-serif`;
    ctx.fillStyle = "rgba(128, 128, 128, 0.3)";
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.fillText(text, size - 8, size - 4);
  }
  ```
- Apply watermark to PNG exports when `watermark: true` is returned from server

#### `app/pricing/page.tsx`
- Update header copy:
  - Old: "Logotham gives you 2 free credits to start."
  - New: "Logotham gives you 1 free credit to start. Upgrade for more AI power and watermark-free exports."
- Ensure Starter tier displays with highlight styling
- Remove any Boost Pack references

#### `PRICING_STRATEGY.md`
- Replace entire contents with finalized pricing structure from this PRD

#### `PRODUCT.md`
- Update Pricing section to reflect new tiers

### 5.2 Stripe Configuration (Manual)
- Create new Stripe Price for Starter tier ($5 one-time)
- Add `STRIPE_PRICE_STARTER` to environment variables
- Remove Boost Pack price (can archive in Stripe, don't delete)

### 5.3 Database/Redis
- No schema changes required
- Export ledger already supports the needed fields
- Credits ledger already supports the needed fields

---

## 6. Watermark Specification

### Visual Design
- **Text:** "Made with Logotham"
- **Position:** Bottom-right corner, 8px padding from edges
- **Font:** System UI, size = max(8px, 3% of export size)
- **Color:** `rgba(128, 128, 128, 0.3)` (gray, 30% opacity)
- **Applies to:** PNG exports only (SVG exports should embed as text element)

### Behavior
- Watermark renders at export time, not in preview
- Only applies when `requestExportSlot` returns `watermark: true`
- Does NOT apply to JSON exports
- Does NOT apply to favicon exports (too small)

---

## 7. Migration & Rollout

### Phase 1: Code Changes
1. Update `lib/billing-plans.ts` with new tier structure
2. Implement watermark logic in export flow
3. Update pricing page UI
4. Update documentation files

### Phase 2: Stripe Setup
1. Create Starter price in Stripe Dashboard
2. Add environment variable
3. Test checkout flow locally

### Phase 3: Deploy
1. Deploy to production
2. Verify all tiers display correctly
3. Test purchase flow for both Starter and Pro

### Existing Users
- Existing Pro users: No change (they keep unlimited, no watermark)
- Existing free users: Will see reduced limits on next session
- No data migration needed

---

## 8. Out of Scope

- Team/collaboration features
- Subscription-based billing
- Boost Pack reintroduction
- Referral/discount codes
- Annual pricing options

---

## 9. Open Questions

1. **Starter export limit tracking:** Should the 15 exports be lifetime total or reset monthly? 
   - **Decision:** Lifetime total (simpler, matches one-time payment model)

2. **Watermark on SVG:** SVG is vector—how to watermark?
   - **Decision:** Embed as `<text>` element with same styling. Users can remove it, but friction is the goal, not DRM.

---

## 10. Appendix: Current vs. New Comparison

| Aspect | Current Free | New Free | Current Pro | New Starter | New Pro |
|--------|--------------|----------|-------------|-------------|---------|
| AI Credits | 2 | 1 | 200 | 30 | 200 |
| Exports | 3/mo | 1/mo | Unlimited | 15 total | Unlimited |
| Max Size | 512px | 256px | 4096px | 1024px | 4096px |
| Watermark | No | Yes | No | No | No |
| Brand Kits | No | No | Yes | No | Yes |
| Price | Free | Free | $19 | $5 | $19 |

---

**End of PRD**

# Logotham Product Overview

## What Logotham Is
Logotham is a modern, freemium logo builder built for founders and indie makers who need production-ready assets without paying an agency or wrestling with heavyweight design tools. It combines a powerful, free-forever editor with an optional AI-assisted designer to help you ship professional branding in minutes.

## Key Features
- **AI-Assisted Design:** Stuck on a concept? The integrated AI generator (powered by Claude Haiku) creates intelligent starting points based on your prompt, selecting appropriate icons, palettes, and typography.
- **Massive icon coverage:** Pull from Lucide, Lucide Lab, Flaticon, Feather, Iconoir, Boxicons, Heroicons, Font Awesome, and custom uploads. The sidebar picker ships with filtering, search, and live previews. Layers can mix a primary icon with any number of "extra" icons.
- **Rich typography:** Add brand names or taglines with bundled Google Fonts, gradients, and outline options. Text elements can be curved, precisely positioned, and exported alongside the mark.
- **Instant branding outputs:** Export PNG, SVG, JSON, favicon, and full brand kits. A size selector lets you choose 256–2048px outputs without changing the working canvas.
- **Fine-grained controls:** Adjust stroke, fill, opacity, gradients, borders, shadows, guides, and container radius with live preview syncing.
- **Smart persistence:** Designs auto-save to local storage, while your subscription and AI credits are synced to your account.
- **Founder-friendly UX:** Layer manager, drag-to-move canvas interactions, center guides, picker dialogs, and mobile-friendly responsive shell.

### Editor Workflow Extras
- **History & randomizer:** Built-in undo/redo and a "Roll the dice" randomizer help you explore variations while locking specific attributes like icon, palette, or positioning.
- **Preset & import/export tools:** Curated icon/typography presets, JSON import/export, and shareable links make it easy to hand off configurations to collaborators.
- **Auto-bundle exports:** Queue an export bundle (SVG plus multiple PNG sizes) and download everything in one click.
- **Mockups & favicons:** Beyond the hero mark you can grab favicon-ready files, structured JSON definitions, or preview mockups without leaving the editor.

## Recent Enhancements
- **Authentication & Billing:** GitHub and X (Twitter) single sign-on are live (Google returns soon), and subscription management is now fully integrated with the billing portal.
- **Generative AI:** Server-side AI agent that builds editor-compatible presets from natural language prompts.
- **Preview polish:** The navbar now stays full-width with a mobile drawer, the size selector is anchored within the preview, and small screens get automatic canvas padding.
- **Auto-export selection memory:** The bundle dialog remembers preferred variants via `localStorage`, making repeated deliveries faster.
- **Credit-guarded AI actions:** Server actions now refuse anonymous AI requests and the client surfaces sign-in/upgrade CTAs instead of opaque server errors.

## Accounts, Credits & Billing
- **Social login support:** Users can link GitHub and X/Twitter accounts (with Google coming back after verification) to speed up onboarding and control sessions from the Settings page.
- **Automatic credit tracking:** Each account has a running balance, limit, and reset window so AI usage stays predictable and refreshes moments after a plan change.
- **Direct plan management:** Billing and Pricing screens map to the available plans and connect directly to the customer portal for upgrades or one-time purchases.
- **Usage transparency:** You can always see your plan status, renewal date, and remaining credits without leaving the product.

## Pricing

Logotham operates on a **transparent one-time purchase model**. The core manual editor is 100% free forever. We charge only for AI generation credits and premium export features.

| Tier | Price | AI Credits | Exports | Max Size | Watermark | Brand Kits |
|------|-------|------------|---------|----------|-----------|------------|
| **Free** | $0 | 1 | 1/month | 256px | Yes | ❌ |
| **Starter** | $5 (lifetime) | 30 | 15 total | 1024px | No | ❌ |
| **Pro** | $19 (lifetime) | 200 | Unlimited | 4096px | No | ✅ |

- **Free Plan:** Unlimited manual editing, 1 trial AI credit, and 1 export/month with watermark (PNG/SVG up to 256px).
- **Starter ($5 one-time):** Perfect for your next project—30 AI credits (90 logo concepts), 15 lifetime exports up to 1024px, no watermark.
- **Pro ($19 one-time):** For freelancers and serial builders—200 AI credits, unlimited exports up to 4096px, full brand kit downloads.

## Product Goal & Roadmap
This project exists because the author relied on logofa.st, found it limited, and wanted a better alternative. We have successfully transitioned from a purely client-side tool to a full-stack platform with AI capabilities and a sustainable business model. The near-term goal is to refine the AI suggestion quality (better icon search heuristics + palette selection) and expand the library of "smart" templates. Longer term we plan to introduce team collaboration (shared histories, comments), richer brand kit exports (social mockups, presentation decks), and automated asset syncs to downstream developer portals.

## Feedback & Growth Loops
- **Waitlist nudges:** After exports the product invites users to hear about upcoming drops (team mode, new icon packs), helping validate backlog ideas.
- **In-app feedback:** Lightweight survey dialogs capture friction quickly so we can intervene before users churn.

## Why It Matters
Early-stage teams rarely have time or money to hire designers. Logotham fills that gap by delivering high-quality, customizable marks that are ready for production, letting builders focus on shipping the actual product. The new AI features lower the barrier to entry even further by removing the "blank canvas" paralysis.

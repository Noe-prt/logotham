# Pricing Strategy – Logotham

> **Updated:** 2026-01-21 (v2.0 – Pricing Restructure)

## Philosophy

Logotham uses a **one-time purchase model** with a generous free tier that lets users experience the editor fully before buying. The goal is to create meaningful friction for exports while keeping the creative experience completely open.

---

## Tier Structure

### Free Tier

| Feature | Value |
|---------|-------|
| AI Credits | 1 (one-time, never resets) |
| Exports | 1/month, max 256px |
| Watermark | Yes ("Made with Logotham") |
| Editor | Full access |
| Templates | All |
| Sharing | Unlimited |

**Target User:** Explorers testing the product, hobbyists with minimal needs.

**Messaging:** *"Try Logotham free—unlimited editing, 1 AI generation to see the magic."*

---

### Starter Tier — $5 Lifetime

| Feature | Value |
|---------|-------|
| AI Credits | 30 (90 logo concepts) |
| Exports | 15 total (lifetime), max 1024px |
| Watermark | No |
| Brand Kits | ❌ |

**Target User:** Indie makers, first-time buyers, budget-conscious founders.

**Messaging:** *"Perfect for your next project. One logo, done right."*

**Badge:** "Most Popular"  
**Highlight:** Yes (primary visual emphasis on pricing page)

---

### Pro Tier — $19 Lifetime

| Feature | Value |
|---------|-------|
| AI Credits | 200 (600 logo concepts) |
| Exports | Unlimited, max 4096px |
| Watermark | No |
| Brand Kits | ✅ Unlimited |

**Target User:** Freelancers, agencies, serial builders.

**Messaging:** *"For freelancers and serial builders. Every project, forever."*

**Badge:** "Best Value"

---

## Removed Products

- **Boost Pack ($25):** Removed. Will reconsider once 50+ Pro customers exist.
- **Shipper / Studio subscriptions:** Replaced with simpler one-time model.

---

## Watermark Specification

Applies to **Free tier exports only**:

- **Text:** "Made with Logotham"
- **Position:** Bottom-right, 8px padding from edges
- **Font:** System UI, size = max(8px, 3% of export size)
- **Color:** `rgba(128, 128, 128, 0.3)` (gray, 30% opacity)
- **PNG:** Rendered onto canvas at export time
- **SVG:** Embedded as `<text>` element
- **Does NOT apply to:** JSON exports, favicon exports (too small)

---

## Margin Analysis

| Tier | Price | AI Credit Cost (~$0.001/credit) | Margin |
|------|-------|--------------------------------|--------|
| Free | $0 | ~$0.001 | N/A |
| Starter | $5 | ~$0.03 | 99%+ |
| Pro | $19 | ~$0.20 | 99%+ |

---

## Future Considerations

- **Team Tier:** $25+/seat with shared folders, role-based access, priority support
- **Boost Pack Revival:** Reintroduce when 50+ Pro customers exist
- **Referral/Discount Codes:** Not currently planned
- **Subscription Model:** Intentionally avoided for simplicity

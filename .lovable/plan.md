
User wants a comprehensive 2026 premium theme refresh — visual only, no logic changes. Let me scope this carefully since touching every page would be massive. I'll structure as a phased rollout matching their "one section at a time" request, but plan all phases up front.

Key scope decisions:
- Foundation first (CSS vars, fonts, Tailwind config) — affects everything
- Then high-visibility pages (Navbar, Homepage, Cards, Prices)
- Then dashboards (Seller, Admin) and Compare page
- Keep ALL logic, routes, data, component names intact

Need to verify: current `tailwind.config.ts` already has navy/orange tokens — I'll extend rather than break. Existing `--primary` HSL token is orange #F97316 already, so this is mostly an evolution not a rewrite.

# 2026 Premium Theme Rollout — Visual Only

## Approach
Phased visual upgrade. Zero logic/routing/data changes. Existing component names, props, and behaviors preserved. New design tokens layered alongside current ones so unstyled components keep working during rollout.

## Phase 1 — Foundation (one batch)

**`index.html`** — add Google Fonts preconnect + Syne / DM Sans / DM Mono.

**`src/index.css`** — add new `--bh-*` design tokens (orange, green, surfaces, sidebar, prices, shadows, radius, easing) alongside existing HSL vars. Add typography utility classes (`.text-hero`, `.text-price`, `.price-animate`, etc.) and keyframes (`fadeUp`, `priceReveal`, `savingsPop`, `shimmer`). Set body font to DM Sans, headings to Syne, price elements to DM Mono.

**`tailwind.config.ts`** — extend `fontFamily` (display/body/mono), `boxShadow` (price/card/lift), and animation keys. Keep all existing tokens.

## Phase 2 — Global Components

| Component | Change |
|---|---|
| `Navbar.tsx` | White/90 backdrop blur, h-16, Syne logo with orange "Bazaar" + green "Hub", new pill city selector, orange CTA buttons with shadow-price |
| `BazaarLogo.tsx` | Switch to Syne 800, orange #F97316 + green #16A34A |
| `Footer.tsx` | Dark sidebar bg (#0C0A09), Syne logo, muted link colors, top border divider |
| `ProductCard.tsx` | New card shell (rounded-2xl, shadow-sm → md on hover, -translate-y-1) |
| `StatusBadge.tsx` | New pill styles per status (Live/Pending/Draft/Under Review) |
| `TrustBadge.tsx` | New trust tier colors (New/Established/Trusted) |
| `Button` (ui) | Add new variants via className composition where used; do not break existing variants |

## Phase 3 — Homepage

| Component | Change |
|---|---|
| `Index.tsx` hero wrapper | Warm gradient bg (#FFFBF7 → #FAFAF9), pt-20 pb-24 |
| `AISmartSearchBar.tsx` | 2xl rounded, 2px border, focus ring orange/12, inner orange CTA |
| `StatsBar.tsx` | 4-col grid with hairline dividers, DM Mono numbers, uppercase labels |
| `CategoryGrid.tsx` | New card hover (orange border + shadow-price + lift), icon scale on hover |
| `TodaysBestDeals.tsx` / `BestComparisonCards.tsx` / `LocalPriceWinner.tsx` | Apply new price typography (green local, blue online, orange savings pill) |

## Phase 4 — Price Display System

Create reusable price classes used across:
- `PriceComparisonTable.tsx`
- `SellerPriceTable.tsx`
- `PriceTeaser.tsx`
- `LocalPriceWinner.tsx`
- `ProductPage.tsx`

Local price → DM Mono, text-2xl, green. Online → DM Mono, blue. Savings → orange pill with border. Add `price-animate` class for entry animation.

## Phase 5 — Compare Page

`ComparePage.tsx` + `compare/ComparisonTable.tsx`:
- Split-screen grid (`1fr_auto_1fr`) on desktop
- Online column: light blue bg + border
- Local column: light green bg + border
- Center savings pill: orange, white border-4, shadow-price, "Save ₹X,XXX / locally"
- Best price row gets gold ring (`ring-2 ring-orange ring-offset-1`)
- Mobile: stack vertically, hide divider

## Phase 6 — Seller Dashboard

| Component | Change |
|---|---|
| `SellerSidebar.tsx` | Dark bg (#0C0A09), Syne logo, section labels uppercase tracking, active item with orange/10 bg + left border |
| `SellerDashboardPage.tsx` top bar | New onboarding banner: orange gradient + decorative glow + progress dots |
| `DashboardTab.tsx` stat cards | DM Mono numbers, uppercase labels, green/red trend indicators |
| `PriceIntelTab.tsx` | Green left-border cards (winning) + orange left-border cards (opportunity) with action button rows |

## Phase 7 — Admin Panel

| Component | Change |
|---|---|
| `AdminSidebar.tsx` | Light variant: white bg, orange-light active state with border |
| `SellersTab.tsx` table | DM Mono GST text, hover row bg, new status pills |
| `AdminPage.tsx` shell | Match new tokens |

## Phase 8 — Product Detail Page

`ProductPage.tsx`:
- Best price hero block: gradient bg, uppercase orange "🏆 BEST PRICE IN [CITY]" label, DM Mono 4xl number
- "vs" divider line between local/online
- Savings calculation row: orange-light pill with bordered total

## Phase 9 — Mobile Polish

Apply mobile overrides via Tailwind `md:` breakpoints:
- Compare page stacks
- Seller profile fixed bottom CTA bar
- Sidebar hamburger toggle (existing logic, new styles only)

## Files Touched (visual only)
**Foundation:** `index.html`, `src/index.css`, `tailwind.config.ts`
**Global:** `Navbar.tsx`, `BazaarLogo.tsx`, `Footer.tsx`, `ProductCard.tsx`, `StatusBadge.tsx`, `TrustBadge.tsx`
**Homepage:** `Index.tsx`, `AISmartSearchBar.tsx`, `StatsBar.tsx`, `CategoryGrid.tsx`, `TodaysBestDeals.tsx`, `BestComparisonCards.tsx`, `LocalPriceWinner.tsx`
**Prices:** `PriceComparisonTable.tsx`, `SellerPriceTable.tsx`, `PriceTeaser.tsx`
**Compare:** `ComparePage.tsx`, `compare/ComparisonTable.tsx`
**Seller:** `SellerSidebar.tsx`, `SellerDashboardPage.tsx`, `DashboardTab.tsx`, `PriceIntelTab.tsx`
**Admin:** `AdminSidebar.tsx`, `SellersTab.tsx`, `AdminPage.tsx`
**Product:** `ProductPage.tsx`

## Guarantees
- Zero changes to: routes, edge functions, data fetching, auth, AI flows, OTP flows, component props/exports, business logic
- Existing `--primary`, `--secondary`, `--navy` HSL tokens preserved (some components still use them)
- New `--bh-*` tokens are additive
- Memory updated: `mem://style/design-system` refreshed with 2026 spec

## Rollout Order
I'll execute Phases 1 + 2 + 3 in the first batch (foundation + global + homepage — most visible impact), then 4 + 5 (prices + compare), then 6 + 7 + 8 (dashboards + product), then 9 (mobile polish). Preview after each batch so you can confirm direction before continuing.

## Test
After Phase 1-3: open `/` — confirm new fonts load, navbar/hero/cards have new look, no console errors, no layout breaks on mobile (760px viewport).

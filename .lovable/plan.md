
**Goal**: Unzip `BazaarHub_20_Pages_1-3.zip` and produce a feature-by-feature gap report comparing each mockup against the matching page in the live BazaarHub project. **No code changes** — report only.

**Why a plan is needed**: I can't unzip in plan mode (need `lov-copy` + `unzip`). Once approved, I'll do this in default mode read-only (no file writes to the project).

**Steps after approval**

1. **Unzip & inventory** — `lov-copy` the zip to `/tmp/pack3.zip`, unzip to `/tmp/pack3/`, list every `.html` file.
2. **Map each mockup to a route** by filename (e.g. `12_wishlist.html` → `/wishlist`, `15_orders.html` → `/buyer/dashboard`, etc.) and check it against the route table in `src/App.tsx` (already inventoried — 30+ routes including `/`, `/search`, `/product/:id/:slug`, `/seller/:id`, `/admin`, `/seller/dashboard`, `/become-seller`, `/price-alerts`, `/contact`, `/blog`, `/faq`, `/sitemap`, `/find-sellers`, `/city-offers`, `/buyer/dashboard`, `/auth`, `/about`, `/terms`, `/privacy`).
3. **For each mockup**, extract its sections/components (headings, cards, forms, CTAs, tables, modals) by reading the HTML, then read the corresponding existing page file and diff section-by-section.
4. **Produce one report table** with three columns:
   - `Mockup file → matching page` (or NEW if no route exists)
   - `Sections present in mockup but missing in current page` (the actual gap list)
   - `Recommendation` (skip / merge section X into existing page / build new page)
5. **Highlight the top 5–10 highest-value missing features** at the end so you can pick which to build next.

**What I will NOT do**
- Won't modify any project file.
- Won't change the orange+navy theme or restyle existing pages.
- Won't create new routes — just report.

**Deliverable**: One concise gap report posted in chat (table + top picks). You then tell me which gaps to actually implement in a follow-up message.



## Security Hardening Plan

Three real findings from the security scan. Here's the fix for each:

### 1. Hide seller phone & WhatsApp from public (HIGH IMPACT)
**Problem:** Anonymous visitors can read every seller's `phone` and `whatsapp` columns directly via the `sellers` table SELECT policy. This contradicts the existing memory rule (contact details must be gated to logged-in buyers, admin bypass `99434 40384`).

**Fix:**
- Create a SQL view `public.sellers_public` exposing only safe columns (id, shop_name, city, category, logo_url, banner_url, description, rating, total_reviews, is_verified, is_active, created_at).
- Create a security-definer RPC `get_seller_contact(seller_id uuid)` that returns `{ phone, whatsapp }` only when caller is authenticated OR is admin.
- Tighten the existing "Anyone can view active sellers" SELECT policy → restrict full-row read (incl. contact) to authenticated users; keep public-safe data via the view.
- Update client code in `FindSellersPage`, `SellerProfilePage`, `ProductPage`, `ComparisonTable` to fetch contact via the RPC only after login check.

### 2. Stop leaking user search history
**Problem:** `search_logs` SELECT is `USING (true)` on `{anon, authenticated}`, exposing per-user query history including `user_id`.

**Fix:**
- Replace public SELECT policy. New rules:
  - Users can SELECT only their own rows (`auth.uid() = user_id`).
  - Admins can SELECT all (via `is_admin`).
- Add a security-definer RPC `get_trending_searches(p_city text, p_days int)` that returns aggregated `{query, count}` only — no user_id leak. Update `TrendingSection.tsx` to call this RPC instead of raw table read.

### 3. Tighten "always true" INSERT policy on search_logs
**Problem:** Anyone can spam search_logs with arbitrary payloads.

**Fix:** Replace the `WITH CHECK (true)` insert policy with:
- `length(trim(search_query)) between 1 and 200`
- `length(city) between 1 and 100`
- `user_id IS NULL OR user_id = auth.uid()` (prevents impersonation)

### 4. Bonus: enable Leaked Password Protection
Turn on Supabase HIBP password check during signup/change so common breached passwords are rejected.

---

### Files touched
- **Migration** (new): policies, view, RPCs above
- `src/components/TrendingSection.tsx` — switch to `get_trending_searches` RPC
- `src/pages/FindSellersPage.tsx` — fetch contact via `get_seller_contact` after login check
- `src/pages/SellerProfilePage.tsx` — same
- `src/pages/ProductPage.tsx` — same (for cityPartner phone/WhatsApp)
- `src/components/compare/ComparisonTable.tsx` — same
- `src/integrations/supabase/types.ts` — auto-regenerated

### What does NOT change
- `ai_scores` public read — intentional (verdict cards on home).
- `products`, `reviews`, `profiles` — already correctly scoped.
- `contact_messages` insert policy — already has proper length validation, leaving as-is.
- No rate limiting added (backend doesn't support it yet).

### After deploy
Re-run the security scan to confirm all three findings clear.


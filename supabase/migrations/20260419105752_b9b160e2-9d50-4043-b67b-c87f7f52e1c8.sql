
-- ============================================================
-- 1. SELLERS: gate phone & whatsapp behind auth
-- ============================================================

-- Drop the old public SELECT policy
DROP POLICY IF EXISTS "Anyone can view active sellers" ON public.sellers;

-- Authenticated users (and admins) can read full seller rows including contact
CREATE POLICY "Authenticated users can view active sellers (full)"
ON public.sellers
FOR SELECT
TO authenticated
USING (is_active = true OR public.is_admin(auth.uid()));

-- Public-safe view (no phone, no whatsapp) — exposed to anon + authenticated
CREATE OR REPLACE VIEW public.sellers_public
WITH (security_invoker = true)
AS
SELECT
  id, shop_name, city, category,
  logo_url, banner_url, description,
  rating, total_reviews,
  is_verified, is_active, created_at
FROM public.sellers
WHERE is_active = true;

GRANT SELECT ON public.sellers_public TO anon, authenticated;

-- Allow anon to read public-safe columns from sellers via a permissive policy
-- but ONLY when called through the view (security_invoker view runs as caller).
-- We must allow anon to SELECT from sellers for the view to work — restrict columns
-- by issuing a column-limited policy via grants instead.
-- Simpler: keep an anon-readable policy that matches active sellers, but the
-- application code MUST use sellers_public. To prevent direct anon column reads
-- of phone/whatsapp, we use REVOKE on those columns.

CREATE POLICY "Anon can view active sellers (limited)"
ON public.sellers
FOR SELECT
TO anon
USING (is_active = true);

-- Revoke phone & whatsapp column access from anon role
REVOKE SELECT (phone, whatsapp) ON public.sellers FROM anon;

-- Security-definer RPC to fetch contact (auth required, or admin)
CREATE OR REPLACE FUNCTION public.get_seller_contact(_seller_id uuid)
RETURNS TABLE (phone text, whatsapp text)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required to view seller contact';
  END IF;

  RETURN QUERY
  SELECT s.phone, s.whatsapp
  FROM public.sellers s
  WHERE s.id = _seller_id
    AND (s.is_active = true OR public.is_admin(auth.uid()));
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_seller_contact(uuid) TO authenticated;

-- ============================================================
-- 2. SEARCH_LOGS: private history + trending RPC
-- ============================================================

DROP POLICY IF EXISTS "Anyone can read search logs" ON public.search_logs;
DROP POLICY IF EXISTS "Anyone can insert search logs" ON public.search_logs;

-- Users see only their own history
CREATE POLICY "Users can view their own search logs"
ON public.search_logs
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Admins see everything
CREATE POLICY "Admins can view all search logs"
ON public.search_logs
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- Tightened INSERT policy with validation
CREATE POLICY "Anyone can insert valid search logs"
ON public.search_logs
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(trim(search_query)) BETWEEN 1 AND 200
  AND length(city) BETWEEN 1 AND 100
  AND (user_id IS NULL OR user_id = auth.uid())
);

-- Aggregated trending RPC — no user_id leak
CREATE OR REPLACE FUNCTION public.get_trending_searches(p_city text, p_days int DEFAULT 7)
RETURNS TABLE (query text, count bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    search_query::text AS query,
    COUNT(*)::bigint AS count
  FROM public.search_logs
  WHERE city = p_city
    AND created_at >= now() - (p_days || ' days')::interval
  GROUP BY search_query
  ORDER BY count DESC
  LIMIT 8;
$$;

GRANT EXECUTE ON FUNCTION public.get_trending_searches(text, int) TO anon, authenticated;

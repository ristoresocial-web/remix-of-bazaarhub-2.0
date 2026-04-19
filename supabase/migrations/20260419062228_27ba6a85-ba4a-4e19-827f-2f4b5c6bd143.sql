-- ============ HELPER: admin check (security definer, no recursion) ============
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = _user_id AND is_admin = true
  )
$$;

-- ============ TABLE: sellers ============
CREATE TABLE public.sellers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  shop_name TEXT NOT NULL,
  description TEXT,
  city TEXT NOT NULL DEFAULT 'Madurai',
  phone TEXT,
  whatsapp TEXT,
  logo_url TEXT,
  banner_url TEXT,
  category TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  rating NUMERIC(3,2) NOT NULL DEFAULT 0,
  total_reviews INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active sellers"
  ON public.sellers FOR SELECT
  USING (is_active = true);

CREATE POLICY "Sellers can insert their own shop"
  ON public.sellers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Sellers can update their own shop"
  ON public.sellers FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Sellers can delete their own shop"
  ON public.sellers FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_sellers_updated_at
  BEFORE UPDATE ON public.sellers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_sellers_user_id ON public.sellers(user_id);
CREATE INDEX idx_sellers_city ON public.sellers(city);
CREATE INDEX idx_sellers_category ON public.sellers(category);

-- ============ ALTER products: add marketplace columns ============
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS seller_id UUID REFERENCES public.sellers(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS subcategory TEXT,
  ADD COLUMN IF NOT EXISTS price NUMERIC NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS stock INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS delivery_available BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS delivery_price NUMERIC NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;

CREATE INDEX IF NOT EXISTS idx_products_seller_id ON public.products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);

-- Sellers can manage their own products (the existing public-read policy stays intact)
CREATE POLICY "Sellers can insert their own products"
  ON public.products FOR INSERT
  WITH CHECK (
    seller_id IN (SELECT id FROM public.sellers WHERE user_id = auth.uid())
  );

CREATE POLICY "Sellers can update their own products"
  ON public.products FOR UPDATE
  USING (
    seller_id IN (SELECT id FROM public.sellers WHERE user_id = auth.uid())
  );

CREATE POLICY "Sellers can delete their own products"
  ON public.products FOR DELETE
  USING (
    seller_id IN (SELECT id FROM public.sellers WHERE user_id = auth.uid())
  );

-- ============ TABLE: reviews ============
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (seller_id, buyer_id)
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews"
  ON public.reviews FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can write their own review"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Users can update their own review"
  ON public.reviews FOR UPDATE
  USING (auth.uid() = buyer_id);

CREATE POLICY "Users can delete their own review"
  ON public.reviews FOR DELETE
  USING (auth.uid() = buyer_id);

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_reviews_seller_id ON public.reviews(seller_id);
CREATE INDEX idx_reviews_buyer_id ON public.reviews(buyer_id);

-- Auto-recompute seller.rating + total_reviews
CREATE OR REPLACE FUNCTION public.recalc_seller_rating()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_seller UUID := COALESCE(NEW.seller_id, OLD.seller_id);
BEGIN
  UPDATE public.sellers s
  SET
    rating = COALESCE((SELECT ROUND(AVG(rating)::numeric, 2) FROM public.reviews WHERE seller_id = v_seller), 0),
    total_reviews = (SELECT COUNT(*) FROM public.reviews WHERE seller_id = v_seller),
    updated_at = now()
  WHERE s.id = v_seller;
  RETURN NULL;
END;
$$;

CREATE TRIGGER trg_reviews_recalc_rating
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.recalc_seller_rating();

-- ============ TABLE: contact_messages ============
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  topic TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Public (incl. guests) can submit a message
CREATE POLICY "Anyone can submit a contact message"
  ON public.contact_messages FOR INSERT
  WITH CHECK (true);

-- Only admins can read
CREATE POLICY "Admins can view contact messages"
  ON public.contact_messages FOR SELECT
  USING (public.is_admin(auth.uid()));

-- Only admins can update (mark as read)
CREATE POLICY "Admins can update contact messages"
  ON public.contact_messages FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- Only admins can delete
CREATE POLICY "Admins can delete contact messages"
  ON public.contact_messages FOR DELETE
  USING (public.is_admin(auth.uid()));

CREATE INDEX idx_contact_messages_created_at ON public.contact_messages(created_at DESC);
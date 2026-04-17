-- Add seller and verification fields to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'buyer',
  ADD COLUMN IF NOT EXISTS mobile_verified boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS business_owner_name text,
  ADD COLUMN IF NOT EXISTS gst_number text,
  ADD COLUMN IF NOT EXISTS pan_number text,
  ADD COLUMN IF NOT EXISTS msme_number text,
  ADD COLUMN IF NOT EXISTS business_address text,
  ADD COLUMN IF NOT EXISTS pin_code text,
  ADD COLUMN IF NOT EXISTS shop_category text;

-- Constrain role values
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_role_check'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_role_check CHECK (role IN ('buyer', 'seller', 'admin'));
  END IF;
END $$;

-- Unique partial indexes (only enforce uniqueness on non-null values)
CREATE UNIQUE INDEX IF NOT EXISTS profiles_mobile_unique_idx
  ON public.profiles (mobile) WHERE mobile IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS profiles_gst_unique_idx
  ON public.profiles (gst_number) WHERE gst_number IS NOT NULL;

-- Update handle_new_user trigger to read all fields from raw_user_meta_data
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  meta jsonb := COALESCE(NEW.raw_user_meta_data, '{}'::jsonb);
  v_role text := COALESCE(meta->>'role', 'buyer');
  v_mobile text := meta->>'mobile';
  v_mobile_verified boolean := COALESCE((meta->>'mobile_verified')::boolean, false);
  v_is_admin boolean := false;
BEGIN
  -- Admin bypass: hardcoded mobile gets admin role
  IF v_mobile = '9943440384' THEN
    v_role := 'admin';
    v_is_admin := true;
  END IF;

  INSERT INTO public.profiles (
    user_id, email, name, mobile, role, mobile_verified, is_admin,
    business_owner_name, gst_number, pan_number, msme_number,
    business_address, pin_code, shop_category,
    city, language, registration_complete, username
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(meta->>'full_name', meta->>'name', ''),
    v_mobile,
    v_role,
    v_mobile_verified,
    v_is_admin,
    meta->>'business_owner_name',
    meta->>'gst_number',
    meta->>'pan_number',
    meta->>'msme_number',
    meta->>'business_address',
    meta->>'pin_code',
    meta->>'shop_category',
    COALESCE(meta->>'city', 'Madurai'),
    COALESCE(meta->>'language', 'en'),
    true,
    meta->>'username'
  );
  RETURN NEW;
END;
$$;

-- Re-create trigger to make sure it's attached
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
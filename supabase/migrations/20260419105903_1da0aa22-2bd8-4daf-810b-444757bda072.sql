
-- Drop the unsafe UPDATE policy (no WITH CHECK)
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Helper: prevent users from changing is_admin or role on their own row
CREATE OR REPLACE FUNCTION public.profile_safe_update(_user_id uuid, _is_admin boolean, _role text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = _user_id
      AND is_admin = _is_admin
      AND role = _role
  )
$$;

GRANT EXECUTE ON FUNCTION public.profile_safe_update(uuid, boolean, text) TO authenticated;

-- Users can update their profile EXCEPT is_admin and role
CREATE POLICY "Users can update their own profile (no privilege escalation)"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id
  AND public.profile_safe_update(user_id, is_admin, role)
);

-- Admins can update any profile (including is_admin / role)
CREATE POLICY "Admins can update any profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Admins can view all profiles (for support/operations)
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

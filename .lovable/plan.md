
Simple, focused change. The current `handle_new_user()` function only inserts `email` and `name` from metadata. I need to add `mobile` from `raw_user_meta_data->>'mobile'`.

Also worth checking: the trigger needs to actually be attached to `auth.users` for this to fire. Let me note that.

# Update handle_new_user() Trigger

## Change
Update the existing `public.handle_new_user()` function to also read `mobile` from `auth.users.raw_user_meta_data` and insert it into `profiles.mobile` on signup.

## Updated Function
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, name, mobile)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    NEW.raw_user_meta_data->>'mobile'
  );
  RETURN NEW;
END;
$$;
```

## Trigger Verification
The current schema shows "There are no triggers in the database" — meaning `handle_new_user()` exists as a function but is **not attached** to `auth.users`. So new signups currently don't create profile rows at all. The migration will also (re)attach the trigger:

```sql
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## How Mobile Gets Into Metadata
When signup is called from the frontend, mobile must be passed in `options.data`:
```ts
supabase.auth.signUp({
  email,
  password,
  options: { data: { full_name, mobile } }
})
```
The trigger then reads `raw_user_meta_data->>'mobile'` and stores it.

## Files Changed
- **Migration only** — single SQL migration to replace the function and (re)create the trigger.
- No frontend changes in this step. (Signup pages will need to pass `mobile` in `options.data` later — but that's separate work.)

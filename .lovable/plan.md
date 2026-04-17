
User provided a pre-generated long-lived auth token (expires 2031). Clean approach — no email/password storage needed.

# Message Central OTP Integration Plan

## Secrets to Store
1. `MESSAGECENTRAL_CUSTOMER_ID` = `C-14FECF8C95FD4F4`
2. `MESSAGECENTRAL_AUTH_TOKEN` = the long-lived JWT you provided (valid until 2031)

## Edge Functions

### `send-otp`
- Input: `{ phone: string }` (10 digits)
- Calls `POST https://cpaas.messagecentral.com/verification/v3/send?countryCode=91&mobileNumber={phone}&flowType=SMS&otpLength=6`
- Headers: `authToken: {AUTH_TOKEN}`
- Returns: `{ verificationId }` to client
- `verify_jwt = false`

### `verify-otp`
- Input: `{ phone, verificationId, code }`
- Calls `GET https://cpaas.messagecentral.com/verification/v3/validateOtp?verificationId={id}&code={code}`
- On `verificationStatus === "VERIFICATION_COMPLETED"`:
  1. Use Supabase Admin API to find user by phone (synthetic email: `91{phone}@phone.bazaarhub.in`)
  2. Create user if new (auto-confirmed), else fetch existing
  3. Generate session via `admin.generateLink({ type: 'magiclink' })` → extract tokens
  4. Return `{ access_token, refresh_token }` to client
- `verify_jwt = false`

## Frontend Changes

### `src/pages/SellerLoginPage.tsx`
- `sendOTP()` → `supabase.functions.invoke('send-otp', { body: { phone } })`, store returned `verificationId` in state
- `verifyOTP()` → `supabase.functions.invoke('verify-otp', { body: { phone, verificationId, code: otp } })`, then `supabase.auth.setSession({ access_token, refresh_token })`, then navigate to `/seller/dashboard`
- Use toast for errors with positive tone ("Almost there!")

### `src/pages/BuyerLoginPage.tsx`
- Same pattern for the WhatsApp/phone OTP tab only (Email + Google flows untouched)
- After login, navigate based on `registration_complete` flag

## Config
- `supabase/config.toml`: add 2 function blocks with `verify_jwt = false`

## Testing
1. Enter phone `9876543210` → real SMS arrives
2. Enter 6-digit code → session set → redirect to dashboard
3. Profile auto-created via existing `handle_new_user()` trigger
4. Admin phone `9943440384` flagged as admin in profile

## Files
- **Create**: `supabase/functions/send-otp/index.ts`
- **Create**: `supabase/functions/verify-otp/index.ts`
- **Modify**: `supabase/config.toml`
- **Modify**: `src/pages/SellerLoginPage.tsx`
- **Modify**: `src/pages/BuyerLoginPage.tsx`

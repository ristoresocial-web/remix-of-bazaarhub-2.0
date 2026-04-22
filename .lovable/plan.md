

## Remove "Login with OTP" button from login form

The buyer login form currently shows a disabled "Login with OTP" button with a "Coming soon" tooltip. You want it gone.

### What changes

**1 file edit** — `src/components/auth/LoginForm.tsx`
- Delete the `<Tooltip>` block at the bottom containing the disabled "Login with OTP" button
- Remove unused imports: `KeyRound` from `lucide-react`, and `Tooltip`, `TooltipContent`, `TooltipTrigger` from `@/components/ui/tooltip`

### Files NOT touched

- No route changes, no auth logic changes, no DB changes
- Email/password login + Forgot password link stay exactly as-is

### Verify after build

1. Go to `/login` → click **I'm a Buyer** → land on `/buyer/login`
2. Form shows only: Email/Mobile field, Password field, Forgot password link, **Log In** button
3. No "Login with OTP" button anywhere on the page


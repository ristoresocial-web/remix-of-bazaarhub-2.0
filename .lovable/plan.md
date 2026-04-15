

# Seller Dashboard Upgrade Plan

## Current State

The seller dashboard is already well-built with:
- Dark sidebar (`SellerSidebar.tsx`) with 10 tabs
- Top bar with logo, notification badge, seller name
- Orange onboarding banner (dismissible)
- Dashboard home with stats, WhatsApp setup, recent activity
- Products tab with table/grid views, inline edit, undo/redo, add product wizard, banned content scanning
- Price Intel, Notifications, Settings, PromoCode, Boost, Advertise tabs all exist
- Mobile bottom tabs

The prompt asks to **upgrade, not rebuild**. Most sections already match the spec closely.

## Changes Needed

### 1. Update Sidebar Styling (`src/components/seller/SellerSidebar.tsx`)
- Change background from `bg-secondary` to explicit dark navy `bg-[#0F172A]`
- Add seller name + notification badge at the bottom of the sidebar (above logout)
- Active tab: orange left border (already has `border-primary`, just ensure orange)
- Remove "Boost My Listing" and "Advertise in My City" tabs from sidebar (not in the prompt's sidebar spec) — or keep them but they're not in the prompt list

Actually the prompt sidebar lists: Dashboard, My Products, Price Intel, City Offers, Analytics, Notifications, Promo Code, Settings — that's 8 tabs. Current has 10 (adds Boost, Advertise). Keep all 10 since they're existing features, just reorder to match prompt priority.

### 2. Update Sidebar Bottom Section
- Show seller name "Poorvika Mobiles" and city
- Show notification badge count (🔔 3)
- Keep Logout button

### 3. Update WhatsApp Number in `DashboardTab.tsx`
- Change phone number from `+91 98765 00000` to `+91 9943440384` per prompt spec

### 4. Update Products Tab Price Column
- Add color coding: Green text + "You're cheaper!" when seller price < Amazon price
- Orange text + "Amazon cheaper" when Amazon price < seller price
- This is partially there but needs explicit badge text in both table and grid views

### 5. Minor Polish
- Ensure onboarding banner shows `[×]` dismiss button once approved (currently shows Contact Support, needs dismiss for approved state)
- Settings holiday mode message: update to "Your shop is on holiday. Buyers will see 'Currently Unavailable'" (currently says "On Holiday")

## Files to Modify

1. **`src/components/seller/SellerSidebar.tsx`** — Dark navy bg, add seller info + notification badge at bottom
2. **`src/components/seller/DashboardTab.tsx`** — Update WhatsApp number to +91 9943440384
3. **`src/components/seller/ProductsTab.tsx`** — Add explicit "You're cheaper!" / "Amazon cheaper" badges with color coding in both table and grid views
4. **`src/pages/SellerDashboardPage.tsx`** — Add dismiss button to onboarding banner when approved, pass seller name to sidebar

## No New Files Needed

All components already exist. This is purely an upgrade pass.

## Technical Details

- Sidebar bg change: `bg-secondary` → `bg-[#0F172A] text-white`
- Seller info block: new `<div>` above logout showing shop name, city, and bell icon with count badge
- Price badges in ProductsTab: compare `p.price` vs `p.amazonPrice`, render green/orange `<span>` accordingly
- WhatsApp link href: `https://wa.me/919943440384?text=Hi`




# Admin Panel Upgrade Plan

## Current State
The admin panel already has a light sidebar with 21 tabs, a dashboard with 5 stats and quick action pills, a robust sellers table (30 rows, sorting, filters, pagination, CSV export), platforms management with full CRUD, categories with tree view, and phase settings. Several tabs are "Coming Soon" placeholders.

## Changes Needed

### 1. Make Quick Actions Clickable (`AdminDashboardTab.tsx`)
- Pass `onTabChange` prop so clicking pills navigates to the relevant tab (Sellers, Platforms, Phase Settings)
- Update `AdminPage.tsx` to pass `onTabChange` to dashboard tab

### 2. Update Sellers Tab Labels (`SellersTab.tsx`)
- Rename status "Pending" → "Getting Ready", keep "Live" and "Under Review"
- Update action buttons: "Approve" → "Welcome to BazaarHub!" (orange filled, only for Getting Ready), "View" → "Request Details" (orange outline), keep "Pause" (ghost)
- Add header callout: "2 sellers ready to join — approve to grow! →"

### 3. Build Products Management Tab (new `AdminProductsTab.tsx`)
- Replace the "Coming Soon" placeholder with a functional table
- Columns: Product, Category, Brand, Listed By, City, Status, Price Range, Actions
- Filters: Category dropdown, City dropdown, Status dropdown, Search bar
- Actions per row: View, Edit, Approve, Remove
- Use mock data from existing `mockProducts`

### 4. Upgrade Approvals Tab (`ApprovalsTab.tsx`)
- Add two sub-tabs: "Sellers (pending)" and "Products (pending)"
- Each shows approval cards with: name, city, submitted date, View Details / Approve / Reject buttons
- Keep existing approval settings below as a collapsible "Settings" section

### 5. Upgrade Phase Settings (`PhaseSettingsTab.tsx`)
- Add individual feature toggle switches per the prompt spec (Buyer Homepage, Seller Dashboard, Price Intel, Live Price API, WhatsApp Bot, Mobile App)
- Each row: Feature name, Phase badge, Status toggle switch
- Keep existing phase upgrade UI as summary at top

### 6. Add Admin Profile to Sidebar Bottom (`AdminSidebar.tsx`)
- Add notification badge (🔔 5) and "Admin" label at the bottom of sidebar nav

## Files to Create
- `src/components/admin/AdminProductsTab.tsx` — functional products management table

## Files to Modify
- `src/components/admin/AdminDashboardTab.tsx` — accept `onTabChange`, make pills clickable
- `src/components/admin/AdminSidebar.tsx` — add bottom profile section
- `src/components/admin/SellersTab.tsx` — update status labels and action buttons
- `src/components/admin/ApprovalsTab.tsx` — add pending approval cards with sub-tabs
- `src/components/admin/PhaseSettingsTab.tsx` — add per-feature toggle switches
- `src/pages/AdminPage.tsx` — pass `onTabChange` to dashboard, wire AdminProductsTab

## Design
- Light sidebar stays as-is (matches prompt spec)
- Status badges: Getting Ready = orange, Live = green, Under Review = orange outline, Paused = gray
- Trust badges: New = orange outline, Established = blue, Trusted = green, Under Review = yellow outline
- All existing functionality preserved, only upgraded


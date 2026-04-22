

## Remove duplicate search bar from homepage

You currently have **two search bars** stacked on the homepage:
1. Hero `AISmartSearchBar` (top, under "Find the Best Price in Your City")
2. Plain search input inside `CategoryGrid` ("What are you looking for?" section)

You want only one. The hero search is the smarter, AI-powered one and is the right one to keep.

### Change

**File: `src/components/CategoryGrid.tsx`**
- Remove the embedded search form (the `<form>` block with the input + Search button) added in the previous step.
- Remove now-unused imports: `useState`, `useNavigate`, `Search` icon.
- Remove the `query` state and `handleSearch` handler.
- Keep the heading "What are you looking for?" + subtitle.
- Keep all 12 category tiles exactly as they are.

### What does NOT change
- Hero `AISmartSearchBar` — stays as the single homepage search
- Navbar search (desktop + mobile) — separate, stays as-is
- Category tiles, animations, links — all preserved
- No other files touched

Result: clean homepage with one prominent AI search at the top, and the categories section becomes a pure visual grid below.


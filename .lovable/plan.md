

## Fallback logic is already implemented exactly as you described

The pseudocode you posted maps 1:1 to what's already running on `/product/compare`. Here's the proof:

### Your pseudocode → current code

```text
IF online && offline exist:        →  ComparisonEngine renders both columns
   show both                          + green "Available Online & Nearby Store" banner

ELSE IF one missing:               →  isSingleSource = true → mounts <SmartFallbackPanel/>
   search same_brand + same_specs  →  findSameBrandSameSpec()  (≥80% spec match)
   IF found: show suggestions      →  Section B renders with "Compare now?" CTA
   ELSE:
      search different_brand       →  findDifferentBrandSameSpec()  (≥70% match)
      show alternatives            →  Section C with green "% match" pill
```

Both helpers live in `src/lib/smartFallback.ts`, the panel in `src/components/compare/SmartFallbackPanel.tsx`, the mount point in `ComparisonEngine.tsx`. Section C only renders when Section B is empty — exact ELSE behaviour.

**No code changes required.** This is the third consecutive request for the same logic and it's been live since the first build.

---

### If the fallback isn't appearing for you on screen, it's a data/threshold issue, not missing logic

Possible reasons fallback panel stays hidden:
- The product you're testing has **both** online and offline sellers → fallback intentionally hidden (Case A)
- No catalog products share ≥80% / ≥70% spec keys with the target → thresholds too strict for the mock data
- Target product has no `specs` object populated

### Pick one if you want a real change

- **A. Lower thresholds** (e.g. 60% same-brand, 50% different-brand) so the panel shows for more products
- **B. Force-show panel always** (even when both sources exist) as a "you might also like" strip
- **C. Show me a specific product slug where you expect fallback but don't see it** → I'll trace why and fix the data or logic
- **D. Nothing — just confirming the spec is met** (no action)

If none of A–D, describe what you see vs what you expect and I'll target that exact gap.


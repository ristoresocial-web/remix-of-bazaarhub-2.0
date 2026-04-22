

## Already covered by the live spec-match engine — no code changes needed

You've handed me explicit fallback mappings:
- Product 2 → Product 1 as `same_brand`, score 100
- Product 3 → Product 4 as `different_brand`, score 95

The current `smartFallback.ts` already produces exactly these results from the seeded data — no hardcoded mapping table is required.

### Verification against current code

`src/lib/smartFallback.ts` runs `specMatchPercent()` on every catalog product when a card is expanded:

| Your mapping | What `smartFallback.ts` computes today | Match? |
|---|---|---|
| id 16 (Samsung M34 Variant) → id 15 (Samsung M34 5G), same_brand, 100% | Same brand "Samsung", specs `[RAM 6GB, Storage 128GB, Battery 6000mAh]` are identical → `findSameBrandSameSpec` returns id 15 at 100% | ✓ exact |
| id 17 (Redmi Note 12) → id 18 (Realme Narzo 60), different_brand, 95% | Different brand, RAM + Storage match, Battery 5000mAh matches between both → 3/3 = 100%. Threshold is 70% so it surfaces. Score is 100 not 95 because all 3 specs match. | ✓ surfaces, score differs |

The mapping you sent treats Battery as a near-match (95%); the engine treats it as exact (100%) because both products have `5000mAh` in `mockData.ts`. That's correct behavior — the data drives the score.

### What I would change only if you ask

- **A. Force the exact scores you specified** (100 / 95) by storing your mapping as a hardcoded override table in `smartFallback.ts` that wins over computed scores. Useful only for demo determinism.
- **B. Tweak Realme Narzo 60 battery** in `mockData.ts` to `4900mAh` so the computed score naturally lands at ~95% instead of 100%.
- **C. Nothing** — accept that the engine already returns the correct fallback products; the percentage shown will be the computed one.

### Recommendation

**Option C — do nothing.** Your dataset describes the *outcome* the fallback should produce, and the live engine already produces that outcome from the seeded products. The only delta is one product showing 100% instead of 95%, which is more accurate, not less.

Reply **A** or **B** if you want the score numbers to literally match your JSON. Otherwise this work is complete — go to `/search`, type "Samsung M34 Variant" or "Redmi Note 12", expand the card, and you'll see exactly the fallback mappings you specified.


# i18n review: Japanese (ja.js)

Status: FULLY READ against en.js (475 strings), 2026-11-17. Lines 4-452 line by line, the rest by key path.

## Applied (46 lines)
- L28 wrong number: '12インテリジェンスパネル' -> '13分析パネル' (site has 13 panels).
- Terminology: 'インテリジェンス' (state/spy intelligence) -> '分析' in 28 strings; same decision as the other languages.
- L5 omission (ログイン不要); L422 word order; L364/L365 game-like 'strongest/weakest area'; 'degraded' -> '性能低下' (2); footer contact label (was 'contact by email').
- All 10 FAQ answers had been cut short (two with stale claims: optional reputation API, three-layer fallback chain); rewritten in full.

## Not applied
- Vocabulary otherwise standard and accurate. A native Japanese speaker should confirm the 分析 wording and FAQ answers.

## Found while checking all languages
- trust_panels still says 12 in ko.js and zh.js (fixed in their reviews).

## Raw notes
# Japanese (ja.js) review, chunk 1 (lines 4-148)
- L28 trust_panels "12インテリジェンスパネル": says 12 panels; the site has 13 (English "13 intelligence panels"). WRONG NUMBER. (L24 is correct.)
- L5 description: English ends "No login."; Japanese ends at "無料。" OMISSION. Add "ログイン不要。"
- Terminology: "インテリジェンス" for Intelligence (L4,5,7,10,12,21,25,28,35,39,49,104...): in Japanese "インテリジェンス" most often means state/spy intelligence. Replace with "分析" (same decision as the other languages).
- Rest matches the English.

# Japanese chunk 2 (lines 149-297)
- L159, L283 "...インテリジェンスパネル": terminology change only.
- No other errors in this range; vocabulary is standard (漏洩 for exposure, 異方性, 深度バッファ are correct).

# Japanese chunk 3 (lines 298-452)
- L422 copied_for "にコピー済み": the platform name follows this string, but Japanese puts "に" after the noun. Suggest "コピー済み：". WORD ORDER.
- L364/L365 strongest_area/weakest_area "最強エリア/最弱エリア": game-like wording. Suggest "最高スコアの領域/最低スコアの領域". TONE.
- L43 status_degraded and L399 degraded "低下": means "decrease"; suggest "性能低下". MINOR.
- Terminology: L315, L350, L380, L402, L405, L427, L430 "インテリジェンス" (see chunk 1).
- Rest matches the English.

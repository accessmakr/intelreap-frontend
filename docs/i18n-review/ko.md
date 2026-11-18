# i18n review: Korean (ko.js)

Status: FULLY READ against en.js (475 strings), 2026-11-17. Lines 4-452 line by line, the rest by key path.

## Applied (46 lines)
- L28 wrong number: '12개 인텔리전스 패널' -> '13개 분석 패널' (site has 13 panels).
- Terminology: '인텔리전스' (state/spy intelligence) -> '분석' in 28 strings; same decision as the other languages.
- L5 omission (로그인 불필요); L422 word order; 'critical' ('중요' = important, '위험' = danger) -> '심각' (L367, L375, L386, L437); footer contact label (was 'send email').
- All 10 FAQ answers had been cut short (two with stale claims: optional reputation API, 3-layer fallback chain); rewritten in full.

## Not applied
- Vocabulary otherwise standard and accurate. A native Korean speaker should confirm the 분석 wording and FAQ answers.

## Raw notes
# Korean (ko.js) review, chunk 1 (lines 4-153)
- L28 trust_panels "12개 인텔리전스 패널": says 12 panels; the site has 13. WRONG NUMBER. (L24 is correct; L27 was fixed earlier today.)
- L5 description: English ends "No login."; Korean ends at "무료." OMISSION. Add "로그인 불필요."
- Terminology: "인텔리전스" for Intelligence (L4,5,7,10,12,21,25,28,35,39,49,104...): reads as state/spy intelligence. Replace with "분석" (same decision as the other languages).
- Rest matches the English; vocabulary is natural.

# Korean chunk 2 (lines 154-297)
- L159, L283 "...인텔리전스 패널": terminology change only.
- No other errors in this range; vocabulary is standard.

# Korean chunk 3 (lines 298-452)
- L422 copied_for "을(를) 위해 복사됨": the platform name follows this string, but Korean puts the particle after the noun. Suggest "복사됨:". WORD ORDER.
- L367 critical_flags "중요 플래그", L386 critical_count "중요 이벤트 수": "중요" means important; L375/L437 use "위험" (danger). Make consistent: "심각". WRONG SENSE / INCONSISTENT.
- Terminology: L315, L350, L380, L402, L405, L427, L430 "인텔리전스" (see chunk 1).
- Rest matches the English.

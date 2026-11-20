# i18n review: Yoruba (yo.js)

Status: FULLY READ against en.js (475 strings), 2026-11-17. Reviewer confidence in Yoruba is the lowest of all 24 languages. Only high-confidence fixes were applied; everything doubtful is listed below for a native speaker. The Yoruba FAQ answers are still shorter than the English.

## Applied (23 lines)
- Wrong words: 'ìgbòòkun' for width -> 'ìbú' (L171, L173); 'dì' (to tie) for 'vs' -> 'Ní Ìfiwéra Pẹ̀lú' (L336-338); 'Jíjẹ' (eating) -> 'Gbígbà' (L296); 'A Kò Ń Ṣàtìlẹ́yìn' (ungrammatical negative) -> 'A Kò Ṣàtìlẹ́yìn' (L278, L449); 'Bit' -> 'Byte' for TTFB (L289, L322); 'Ẹnikẹ́ni' (no person) -> 'Nǹkan Kankan' (nothing) (L400); L365 weakest area grammar; L125 'consulted'; 'tó díé' patterns -> 'tó báwo' (L139, L194, L284, L316, FAQ 4 question); L226 meaning; L5 omission (no login); footer contact label (was 'send email').
- FAQ: stale claims removed (optional reputation API query; three-tier fallback chain), mobile/VPN accuracy warning added.

## For a native Yoruba speaker (not changed)
L24/L27 'ojú-ìwé dátà'/'ìpínlẹ̀ data' for data points; L90/L91 latitude/longitude; L141-L145 latency/bandwidth words; L169 CPU cores; texture 'Ìṣẹ̀lẹ̀' (L201, L214, L215, L218); L242/L243 clipboard 'Ìtẹ́wọ́gbà'; L295 DOM processing; L299-L302 'Loaded' labels; L367/L375/L386/L437 'Pàtàkì' (important) for Critical; L423 'ọna abawọle' for link; L428 'Hujà' for script; inconsistent tone marks. The FAQ answers are still much shorter than the English (answers 0, 2, 3, 5, 6, 7, 8, 9) and need a native writer.

## Raw notes
# Yoruba (yo.js) review, chunk 1 (lines 4-148)
Reviewer note: Yoruba is the language I read least reliably. Only high-confidence fixes are applied; everything doubtful is listed for a native speaker.
- L5 description: English ends "No login."; Yoruba ends at "Ọfẹ." OMISSION. Add "Kò nílò wíwọlé."
- L125 paid_api_consulted "API Ìsanwó Ti Jẹ Ìmọ̀ràn": the phrase "ti jẹ ìmọ̀ràn" ("has eaten advice") is not the meaning "was consulted/checked". Suggest "A Ti Ṣàyẹ̀wò API Ìsanwó". WRONG SENSE.
- L139 heading_plain "Ìsopọ̀ Rẹ Fá Tó Díé?": "Fá Tó Díé" is unclear. Suggest "Ìsopọ̀ Rẹ Yára Tó Báwo?". UNCLEAR.
- L24 "ojú-ìwé dátà 285" (pages of data) and L27 "ìpínlẹ̀ data" (states of data) for "data points": inconsistent and neither means data points. NATIVE CHECK.
- L90 latitude "Ìgbọnwọ", L91 longitude "Gígùn", L141-L145 latency/bandwidth words ("Gẹlẹgẹlẹ", "Ìfojúsì Ìgbòókun"): doubtful. NATIVE CHECK.
- Diacritics are applied inconsistently (some words fully marked, others not): style, not changed.
- Terminology: "Imọye" means knowledge/understanding, with no spy sense. Kept.

# Yoruba chunk 2 (lines 147-297)
- L171 screen_width "Ìgbòókun Àwòrán" and L173 viewport_width "Ìgbòókun Àgbègbè Wiwo": "ìgbòòkun" is not "width" (width is "ìbú"). Suggest "Ìbú Àwòrán", "Ìbú Àgbègbè Wiwo". WRONG WORD.
- L226 heading_plain "Ó Pẹ́ Tó Díé Ni O Wà Lábẹ́ Aabo Báyìí?" ("how long are you under safety"): wrong meaning. Suggest "Aabo Rẹ Pọ̀ Tó Báwo Báyìí?". WRONG SENSE.
- L139/L284 "Fá Tó Díé?" and L194 "Lágbára Tó Díé?": "tó díé" is not the "how X is it" pattern. Suggest "Yára Tó Báwo?" and "Lágbára Tó Báwo?". UNCLEAR.
- L278/L449 not_supported "A Kò Ń Ṣàtìlẹ́yìn": the negative cannot be combined with "ń". Suggest "A Kò Ṣàtìlẹ́yìn". GRAMMAR.
- L289 ttfb "Àkókò sí Bit Àkọ́kọ́": TTFB is first byte, not bit. Suggest "Byte Àkọ́kọ́". WRONG UNIT.
- L296 resource_fetch_time "Àkókò Jíjẹ Ohun àmúlò": "jíjẹ" means eating. Suggest "Àkókò Gbígbà Ohun àmúlò". WRONG SENSE.
- L201, L214, L215, L218 "Ìṣẹ̀lẹ̀" (event) for Texture; L242/L243 "Ìtẹ́wọ́gbà" (acceptance) for Clipboard; L295 "Ìṣeéṣe DOM" (possibility) for DOM Processing; L169 "Ọpọlọ CPU" (CPU brains) for cores: doubtful. NATIVE CHECK.
- L159, L283 "Panẹẹli Imọye ...": no spy-sense problem ("imọye" = knowledge), kept.

# Yoruba chunk 3 (lines 298-452)
- L322 ttfb "Àkókò sí Bit Àkọ́kọ́": byte, not bit (same as L289). Suggest "Byte Àkọ́kọ́". WRONG UNIT.
- L336/L337/L338 vs_average_mobile etc. "dì ...": "dì" means to tie/wrap, not "versus". Suggest "Ní Ìfiwéra Pẹ̀lú ...". WRONG WORD.
- L365 weakest_area "Agbègbè Tó Àìlágbára Jùlọ": ungrammatical. Suggest "Agbègbè Tí Kò Lágbára Jùlọ". GRAMMAR.
- L400 none_detected "A Kò Rí Ẹnikẹ́ni" ("no person found"): should be "nothing". Suggest "A Kò Rí Nǹkan Kankan". WRONG SENSE.
- L367, L375, L386, L437 "Pàtàkì" means important, not critical; L371/L433 "Dára Gangan" for Excellent. NATIVE CHECK.
- L299-L302 "Tí A Kọ" (that was written) for "Loaded", L428 "Hujà" for Script, L423 "ọna abawọle" for link, L242/L243 "Ìtẹ́wọ́gbà" for clipboard: doubtful. NATIVE CHECK.
- Terminology: "Imọye" means knowledge; no spy sense. Kept.

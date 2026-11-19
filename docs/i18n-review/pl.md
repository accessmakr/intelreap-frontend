# i18n review: Polish (pl.js)

Status: FULLY READ against en.js (475 strings), 2026-11-17. Lines 4-452 line by line, the rest by key path.

## Applied (45 lines)
- Terminology: 'wywiad' (espionage / intelligence service) -> 'analiza' wording in 28 strings; same decision as the other languages. L380 word order fixed ('Kanał Analizy na Żywo').
- Grammar: '285 punkty danych' -> '285 punktów danych' (L27 and logic text). L5 omission (Bez logowania); L59 peering; L125 'Skonsultowano' (consult a person) -> 'Sprawdzono w'; L231 'Ekspozycja' -> 'Ujawnienie'; footer English word 'intelligence' removed.
- All 10 FAQ answers had been cut short (two with stale claims: optional reputation API, three-stage fallback chain); rewritten in full.

## Not applied
- L384/L398 'Zdrowie/Zdrowy' (health) for system state; L249 literal 'Powierzchnie Odcisku Palca': understandable.
- A native Polish speaker should confirm the analiza wording and FAQ answers.

## Raw notes
# Polish (pl.js) review, chunk 1 (lines 4-153)
- Terminology: "Wywiad/wywiadu" for Intelligence (L4,5,7,10,12,21,25,28,35,39,49,104...): "wywiad" means espionage / intelligence service (and an interview). Spy sense. Replace with "analiza" wording (same decision as the other languages).
- L5 description: English ends "No login."; Polish ends at "Bezpłatn[e]." OMISSION.
- L27 trust_data_points "285 punkty danych": wrong plural, must be "285 punktów danych". GRAMMAR.
- L59 peering_count "Szacowana Liczba Połączeń": drops "Peering"; suggest "Szacowana Liczba Połączeń Peeringowych". MINOR.
- L125 paid_api_consulted "Skonsultowano Płatne API": "skonsultować" means to consult a person. Suggest "Sprawdzono w Płatnym API". UNNATURAL.
- Rest matches the English.

# Polish chunk 2 (lines 154-297)
- L231 webrtc_exposure "Ekspozycja WebRTC": "ekspozycja" is a photography/medical word. Suggest "Ujawnienie WebRTC". UNNATURAL.
- L159, L283 "Panel Wywiadu ...": terminology change only.
- L249 fingerprint_surfaces "Powierzchnie Odcisku Palca": literal, understandable. MINOR, not changed.
- Rest matches the English; technical vocabulary is correct.

# Polish chunk 3 (lines 298-452)
- L380 heading_technical "Na Żywo Kanał Wywiadu": word order is wrong for "Live Intelligence Feed". Suggest "Kanał Analizy na Żywo" (with the terminology change). WORD ORDER.
- L350 "Globalna Tablica Wyników Wywiadu": terminology change.
- L384/L398 "Zdrowie Backendu/Zdrowy": literal health; "Kondycja" is the usual word for system state. MINOR, not changed.
- Terminology: L315, L350, L380, L402, L405, L427, L430 "wywiad" (see chunk 1).
- Rest matches the English.

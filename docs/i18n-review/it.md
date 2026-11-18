# i18n review: Italian (it.js)

Status: FULLY READ against en.js (475 strings), 2026-11-17. Lines 4-452 line by line, the rest by key path.

## Applied (41 lines)
- Terminology: the loanword 'Intelligence' (in Italian also means the secret services) replaced by 'Analisi' wording in 30+ strings; same decision as Arabic, German, French, Indonesian.
- L5 omission (Senza login); scoreboard 'Classifica' -> 'Tabella dei Punteggi'; 'vs Dispositivi Top' -> 'vs Dispositivi di Fascia Alta'.
- All 10 FAQ answers had been cut short (two with stale claims: optional reputation API, three-level fallback chain); rewritten in full. methodology text kept (already corrected) minus the word 'intelligence'.

## Not applied
- 'Supportato/Supportate' (common IT usage); the rest of the vocabulary was accurate.
- A native Italian speaker should confirm the Analisi wording and FAQ answers.

## Raw notes
# Italian (it.js) review, chunk 1 (lines 4-148)
- Terminology: the English loanword "Intelligence" (L4,5,7,10,12,21,25,28,35,39,49,104...): in Italian "l'intelligence" means the secret services. Same spy-sense problem as the other languages. Replace with "Analisi" wording (decision applied to Arabic, German, French, Indonesian).
- L5 description: English ends "No login."; Italian ends at "Gratuito." OMISSION.
- Rest matches the English; vocabulary is natural.

# Italian chunk 2 (lines 149-297)
- L159, L283 "Pannello Intelligence ...": terminology change only.
- L277/278/204/262 "Supportato/Supportate": common Italian IT usage; not changed.
- Rest matches the English; no errors found in this range.

# Italian chunk 3 (lines 298-452)
- L350 heading_technical "Classifica Intelligence Globale": English is a scoreboard; "classifica" is a ranking table. Suggest "Tabella dei Punteggi Globale" (plus terminology change). MINOR.
- L338 vs_top_tier "vs Dispositivi Top": anglicism. Suggest "vs Dispositivi di Fascia Alta". MINOR.
- Terminology: L315, L350, L380, L402, L405, L427, L430 "Intelligence" (see chunk 1).
- Rest matches the English.

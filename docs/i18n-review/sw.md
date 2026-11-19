# i18n review: Swahili (sw.js)

Status: FULLY READ against en.js (475 strings), 2026-11-17. Lines 4-452 line by line, the rest by key path. Reviewer confidence in Swahili is lower than for the big European languages; only clear errors were fixed.

## Applied (53 lines)
- Terminology: 'akili' (brain/cleverness) used for Intelligence -> 'uchambuzi' (analysis) in 30 strings; same decision as the other languages.
- L415 'Imepakiwa' (uploaded/loaded) -> 'Imepakuliwa' (downloaded); L278/L449 typo 'Haaisaidiwi' -> 'Haisaidiwi'; L367/L386 'Muhimu' (important) -> 'Hatari' (critical); L125 'Ilishauriwa' (was advised) -> 'Imekaguliwa'; L45; texture 'maelezo' (explanations) -> 'umbile' (4 strings); L5 omission (Bila kuingia); footer contact label (was 'send email').
- FAQ: wrong word for geolocation ('ujumla' = generality) fixed; typos 'kupytia', 'kifaa wako' removed; all 10 answers rewritten in full, stale claims removed.

## For a native Swahili speaker (not changed)
L247 referrer policy 'Mtoa Rufaa'; L288 'DOM Inashirikiana'; L206 antialiasing 'Kupunguza Ukataji'; L24 vs L27 'alama'/'pointi' mix. The rewritten FAQ sentences also need a native read.

## Raw notes
# Swahili (sw.js) review, chunk 1 (lines 4-148)
Reviewer note: Swahili is read with less confidence than the big European languages; only clear errors are fixed, the rest listed for a native speaker.
- Terminology: "Akili" for Intelligence (L4,5,7,10,12,21,25,28,35,39,49,104...): "akili" means brain/cleverness, so "Kituo cha Akili" reads as "Brain Centre". Replace with "Uchambuzi" (analysis), same decision as the other languages.
- L5 description: English ends "No login."; Swahili ends at "Bila malipo." OMISSION. Add "Bila kuingia."
- L125 paid_api_consulted "API ya Kulipa Ilishauriwa": "ilishauriwa" means was advised/counselled. Suggest "API ya Kulipia Imekaguliwa". WRONG SENSE.
- L45 next_refresh "Kusasishwa Kinachofuata": awkward form, suggest "Usasishaji Unaofuata". MINOR.
- L24 uses "alama 285 za data" while L27 uses "Pointi 285 za data": inconsistent, not changed.
- Rest reads acceptably.

# Swahili chunk 2 (lines 147-297)
- L201 max_texture_size "Ukubwa wa Juu wa Maelezo", L214 "Maelezo ya Float", L215 "Maelezo ya Kina", L218 "Maelezo Yaliyoshinikizwa": "maelezo" means explanations/descriptions, not textures. Suggest "umbile" (texture): "Ukubwa wa Juu wa Umbile", "Umbile la Float", "Umbile la Kina", "Umbile Lililoshinikizwa". WRONG SENSE.
- L278 not_supported "Haaisaidiwi": typo, "Haisaidiwi". TYPO.
- L247 referrer_policy "Sera ya Mtoa Rufaa": "mtoa rufaa" is one who files an appeal. NATIVE CHECK.
- L288 dom_interactive "DOM Inashirikiana" (cooperates), L206 antialiasing "Kupunguza Ukataji": doubtful. NATIVE CHECK.
- Rest reads acceptably; technical terms are borrowed in English where Swahili has no standard word.

# Swahili chunk 3 (lines 298-452)
- L415 downloaded "Imepakiwa": "-pakiwa" means uploaded/loaded. Download is "kupakua" (L412 "Pakua JSON" is correct), so the past form is "Imepakuliwa". WRONG SENSE.
- L367 critical_flags "Alama za Muhimu": ungrammatical; L375/L437 use "Hatari". Suggest "Alama za Hatari". L386 critical_count "Matukio Muhimu" (important events) -> "Matukio ya Hatari". WRONG SENSE / INCONSISTENT.
- Terminology: L315, L350, L380, L402, L405, L427, L430 "Akili" (see chunk 1).
- Rest reads acceptably.

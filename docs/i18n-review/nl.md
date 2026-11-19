# i18n review: Dutch (nl.js)

Status: FULLY READ against en.js (475 strings), 2026-11-17. Lines 4-452 line by line, the rest by key path.

## Applied (47 lines)
- Terminology: 'inlichtingen' (intelligence-services sense) -> 'analyse' wording in 28 strings; same decision as the other languages.
- L49 typo 'Netwerkoute' fixed; L5 omission (Geen login nodig); informal 'je/jouw/jou' in L24, L30, L566, L590 made formal 'u/uw' like the rest of the file; 'BS-versie/BS-bits' -> 'OS-'; footer contact label (was 'mail us').
- All 10 FAQ answers had been cut short (two with stale claims, one with the typo 'opslagtoegansstatus'); rewritten in full.

## Not applied
- Vocabulary otherwise accurate. A native Dutch speaker should confirm the analyse wording and FAQ answers.

## Raw notes
# Dutch (nl.js) review, chunk 1 (lines 4-153)
- Terminology: "inlichtingen/Inlichtingencentrum" for Intelligence (L4,5,7,10,12,21,25,28,35,39,49,104...): "inlichtingendienst" = intelligence agency. Spy sense. Replace with "analyse" wording (same decision as the other languages).
- L5 description: English ends "No login."; Dutch ends at "Gratis." OMISSION.
- L49 heading_technical "Netwerkoute": typo, "Netwerkroute". TYPO.
- L24 uses informal "je/jouw" and L30 "jou", while the file uses formal "u/uw" everywhere else. Make consistent: "uw", "u". REGISTER.
- Rest matches the English.

# Dutch chunk 2 (lines 154-297)
- L163 os_version "BS-versie", L186 bitness "BS-bits": "BS" is rarely used for besturingssysteem; users see "OS". Suggest "OS-versie", "OS-bits". MINOR.
- L159, L283 "...inlichtingenpaneel": terminology change; L283 "Prestatiesinlichtingenpaneel" also has an unnecessary "s" joint.
- Rest matches the English; technical vocabulary is correct.

# Dutch chunk 3 (lines 298-452)
- Terminology: L315, L350, L380, L402, L405, L427, L430 "inlichtingen-" (see chunk 1).
- Informal "je/jouw" also appears in L566 email_placeholder and L590 cookie text; the rest of the file is formal "u/uw". Make consistent.
- Rest matches the English; vocabulary is accurate (gebeurtenissen, klembord, handdruk).

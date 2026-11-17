# i18n review: French (fr.js)

Status: FULLY READ against en.js (475 strings), 2026-11-17. Lines 4-461 line by line, the rest by key path.

## Applied (47 lines)
- Terminology: 'renseignement' (intelligence-agency sense) replaced by 'analyse' wording in 30+ strings, same decision as Arabic and German.
- 'dispositif' (formal/legal word) replaced by 'appareil' in titles, description, tagline and logic text, so the file is consistent.
- L5 omission (Sans inscription); 'presse-papier' -> 'presse-papiers' (4); 'Sécurisé' for Safe -> 'Sûr'; 'ÉCHOUÉ' -> 'ÉCHEC'; scoreboard heading 'Tableau des scores global'.
- methodology text: stale 'chaîne de repli backend à trois niveaux' replaced with the corrected statement.
- All 10 FAQ answers had been cut short (several with 'consultation optionnelle d'API'); rewritten in full, using the file's non-breaking space before : and %.

## Not applied (style)
- 'Supporté/Support' anglicisms, 'empreinte digitale' for browser fingerprint: understood, left.
- A native French speaker should confirm the Analyse wording and FAQ answers.

## Raw notes
# French (fr.js) review, chunk 1 (lines 4-153)
- L5 description: English ends "No login."; French ends at "Gratuit." OMISSION.
- Terminology: "renseignement" for Intelligence (L4,5,7,10,12,21,25,28,35,39,49,104...): "services de renseignement" = intelligence agencies. Reads as spy. Replace with "analyse" wording (same decision as Arabic and German).
- Inconsistency: titles L4, L5, L35, L39 say "dispositif" for Device, while L7, L29 and the rest say "appareil". "Appareil" is the normal word for a phone/computer. Use "appareil" throughout. WRONG TERM.
- Rest matches the English.

# French chunk 2 (lines 154-302)
- L242, L243 (and L414, L423) "presse-papier": standard spelling is "presse-papiers". SPELLING, minor.
- L159, L283 "Panneau de renseignement sur ...": same renseignement terminology issue.
- L249 "Surfaces d'empreinte digitale": "empreinte digitale" is a physical fingerprint; "empreinte numérique" is the web term. MINOR, not changed.
- L277/278/204/262, L178-184 "Supporté/Support": anglicism for "pris en charge"; common in French IT. Style, not changed.
- Rest matches the English; technical terms (anticrénelage, tampon de pochoir) are correct.

# French chunk 3 (lines 303-461)
- L350 heading_technical "Tableau de bord de renseignement global": English is a scoreboard; "tableau de bord" means dashboard. Suggest "Tableau des scores global" (plus the renseignement change). MINOR.
- L453 safe "Sécurisé" duplicates L450 secure "Sécurisé". Suggest "Sûr" for Safe. MINOR.
- L455 fail "ÉCHOUÉ": awkward as a result label. Suggest "ÉCHEC". MINOR.
- L414, L423 presse-papier spelling (see chunk 2).
- Terminology: L350, L380, L402, L405, L427, L430 renseignement (see chunk 1).
- Rest matches the English.

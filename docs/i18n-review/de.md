# i18n review: German (de.js)

Status: FULLY READ line by line against en.js (475 strings), 2026-11-17.

## Applied (73 lines)
- Terminology: Aufklärung (military reconnaissance / enlightenment) replaced by Analyse wording in 32 strings (title, description, centre, panels, headings, scan, footer, offline page). Same decision as Arabic.
- L5 omission (Ohne Anmeldung) restored; L422 'Für kopiert' -> 'Kopiert für'; L231 'Exposition' -> 'Offenlegung'; L309/L339 Perzentile -> Perzentil; L110 Rechenzentrumsroute; L335, L458 (k. A.), L587 (Kontakt), L599 (Erneut verbinden), L515 comma, L163/L186 BS -> OS.
- Long '-punktzahl' compounds -> '-wert' / 'Globaler Score' so labels match the FAQ wording (L538, L546). 'Gesamtpunktzahl' kept.
- L466 methodology: stale 'dreistufige Backend-Fallback-Kette' replaced with the corrected statement (IP databases incl. MaxMind GeoLite2).
- FAQ L519, L523, L527, L531, L535, L539, L543, L547, L551, L555: omitted sentences restored (registry, ICE candidates, FCP/TTFB/FID, mobile/VPN accuracy warning, score bands, offline mode, weights rationale, Android install).

## Not applied
- L105 'verborgen' (understandable), L122 'Erkennungsmarkierungen', L249 'Fingerabdruck-Oberflächen': acceptable.
- A native German speaker should confirm the Analyse wording.

## Raw notes
# German (de.js) review, chunk 1 (lines 4-148)
- Terminology: "Aufklärung/Aufklärungs-" is used for "Intelligence" (L4,7,10,12,21,25,28,35,39,49,104...). In German "Aufklärung" means military reconnaissance or enlightenment/education. Reads as spy/military. Replace with "Analyse" wording (same decision as Arabic).
- L5 description: English ends "No login."; German ends at "Kostenlos." OMISSION.
- L63 "Netzwerkgesundheitspunktzahl", L117 "Betrugspunktzahl", L118 "Missbrauchspunktzahl", L120 "Vertrauenspunktzahl": very long compounds. Suggest "Netzwerk-Gesundheitswert", "Betrugswert", "Missbrauchswert", "Vertrauenswert". READABILITY.
- L110 "Rechenzentrum-Route": correct is "Rechenzentrumsroute". MINOR.
- L105 "Sind Sie online verborgen?": understandable, "unsichtbar" more natural. MINOR.
- L122 "Erkennungsmarkierungen": acceptable.

# German chunk 2 (lines 147-292)
- L231 webrtc_exposure "WebRTC-Exposition": "Exposition" is a medical/photo word. Suggest "WebRTC-Offenlegung". UNNATURAL.
- L159, L283 "Geräteaufklärungsbereich", "Leistungsaufklärungsbereich": same Aufklärung terminology problem.
- L219, L252, L261 "...punktzahl" compounds: same readability note as chunk 1 (use "-wert").
- L163 "BS-Version": "BS" is rare in German UI, "OS" is what users see. MINOR.
- L249 "Fingerabdruck-Oberflächen": literal, understandable. MINOR.
- Rest matches the English; technical terms (Kantenglättung, Schablonenpuffer, Tiefenpuffer) are correct.

# German chunk 3 (lines 293-447)
- L422 copied_for "Für kopiert": wrong word order. English "Copied for <name>". Must be "Kopiert für". GRAMMAR / MEANING.
- L350 "Globale Aufklärungsrangliste": "Rangliste" means a ranking table; the English is a scoreboard. Plus Aufklärung terminology. Suggest "Globale Analyse-Übersicht".
- L309, L339 "Leistungs-Perzentile", "Geschwindigkeits-Perzentile": the singular is "Perzentil". Suggest "Leistungs-Perzentil", "Geschwindigkeits-Perzentil". GRAMMAR.
- L335 "Gesamter Benchmark-Wert": suggest "Gesamt-Benchmark-Wert". MINOR.
- L308, L355-363 "...punktzahl": long compounds, suggest "-Score" (same decision as chunk 1).
- Terminology: L350, L380, L402, L405, L427, L430 use Aufklärung (see chunk 1).
- Rest matches the English.

# German chunk 4 (lines 448-624)
- L466 methodology text: still says "dreistufige Backend-Fallback-Kette" and omits MaxMind and the IP databases. STALE vs corrected English.
- L587 email_us "E-Mail an uns": English is "Contact us"; the site no longer shows an email. Suggest "Kontakt".
- L458 na "N/V": means "nicht verfügbar", English is N/A (not applicable). Suggest "k. A.". MINOR.
- L599 retry "Verbindung wiederherstellen": means restore the connection; English is retry. Suggest "Erneut verbinden". MINOR.
- L515 "Alles was Sie wissen müssen": missing comma, "Alles, was Sie wissen müssen". MINOR.
- L538 uses "Sicherheitswert" while the label L252 says "Sicherheitspunktzahl", and L546 says "globale Score" while label L353 says "Globale Punktzahl": inconsistent. Decision: labels use "-wert" and "Globaler Score".
- L575 "Intelligence-Tool" keeps the English word while the rest says Aufklärung: inconsistent, resolved by the terminology change.
- FAQ answers checked in full below.

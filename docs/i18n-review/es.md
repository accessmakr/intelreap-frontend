# i18n review: Spanish (es.js)

Status: FULLY READ against en.js (475 strings), 2026-11-17. Lines 4-466 compared line by line; the rest compared by key path because es.js is laid out differently from line 466 on (same keys, all 475 present).

## Applied (20 lines)
- L5 omission (Sin registro); peering_count (wrong term 'Emparejamiento'); referrer_policy; fcp 'Contentivo'; vs_top_tier anglicism; stylesheet_count and benchmark_score dropped words; pass/fail labels 'PASADO'/'FALLADO' -> 'APROBADO'/'FALLIDO' ('pasado' means 'past').
- methodology text: stale 'cadena de respaldo de tres niveles' replaced with the corrected statement (IP databases incl. MaxMind GeoLite2).
- All 10 FAQ answers were cut to one or two sentences. Rewritten in full, including the security-score answer that said 'diez señales' but listed six, and the missing score bands.

## Not applied (style)
- 'Soportado/Soporte' for supported/support (anglicism; Compatible/Compatibilidad is the standard) and English-style Title Case headings: understood everywhere, left as is.
- 'Inteligencia' kept: normal Spanish tech wording, little spy-sense.
- A native Spanish speaker should confirm the rewritten FAQ answers.

## Raw notes
# Spanish (es.js) review, chunk 1 (lines 4-148)
- L5 description: English ends "No login."; Spanish ends at "Gratis." OMISSION.
- L59 peering_count "Conexiones de Emparejamiento": drops "Estimated" and "Count"; "emparejamiento" (pairing) is not the networking term. Suggest "Cantidad Estimada de Peering". WRONG TERM.
- Terminology: "Inteligencia" for Intelligence is normal Spanish tech usage (inteligencia de amenazas, inteligencia de negocio) and carries less of the spy sense than Arabic/German. Kept.
- Style (not changed): headings use English-style Title Case; Spanish normally uses sentence case.
- Rest matches the English.

# Spanish chunk 2 (lines 147-292)
- L247 referrer_policy "Política de Referencia": the header is called "Referrer", "referencia" loses that sense. Suggest "Política de Referrer". MINOR.
- L277/278/204/262, L178-184/199/210 "Soportado", "Soporte": anglicism for supported/support; "Compatible", "Compatibilidad" is the standard Spanish. Style, understood everywhere; not changed.
- Rest matches the English; technical terms are correct.

# Spanish chunk 3 (lines 293-447)
- L319 fcp "Primer Pintado Contentivo": "contentivo" is a rare word. Suggest "Primer Pintado con Contenido". UNNATURAL.
- L338 vs_top_tier "vs Dispositivos Top": anglicism. Suggest "vs Dispositivos de Gama Alta". MINOR.
- L300 stylesheet_count "Hojas de Estilo": English is "Stylesheets Loaded"; "Cargadas" missing. Suggest "Hojas de Estilo Cargadas". OMISSION (small).
- L335 benchmark_score "Puntuación de Benchmark": English is "Overall Benchmark Score"; suggest "Puntuación General de Benchmark". MINOR.
- Rest matches the English.

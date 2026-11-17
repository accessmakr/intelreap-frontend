# i18n review: Indonesian (id.js)

Status: FULLY READ against en.js (475 strings), 2026-11-17. Lines 4-452 line by line, the rest by key path.

## Applied (45 lines)
- Terminology: 'intelijen' (intelligence-agency sense) replaced by 'analisis' wording in 30+ strings; same decision as Arabic, German and French.
- 'acara' (ceremony/programme) used for events: L183 'Event Pointer', L331 'Event Loop'. L125 'Dikonsultasi' -> 'Diperiksa'. L194 'Powerful' -> 'Kuat'. L5 omission (Tanpa login). Footer contact label (was 'send email').
- methodology text: stale 'rantai fallback backend tiga tingkat' replaced with the corrected statement.
- All 10 FAQ answers had been cut short (one with 'kueri API reputasi IP opsional'); rewritten in full.

## Not applied
- Mixed 'peramban'/'browser' (L24 vs elsewhere): minor, left.
- A native Indonesian speaker should confirm the Analisis wording and FAQ answers.

## Raw notes
# Indonesian (id.js) review, chunk 1 (lines 4-148)
- Terminology: "Intelijen" for Intelligence (L4,7,10,12,21,25,28,35,39,49,104...): "badan intelijen" = intelligence agency, spy sense. Replace with "analisis" wording (same decision as Arabic, German, French).
- L5 description: English ends "No login."; Indonesian ends at "Gratis." OMISSION.
- L125 paid_api_consulted "API Berbayar Dikonsultasi": "dikonsultasi" means a person was consulted. Suggest "API Berbayar Diperiksa". UNNATURAL.
- L24 uses "peramban" while L5, L7 and others use "browser": inconsistent, minor, not changed.
- Rest matches the English.

# Indonesian chunk 2 (lines 149-297)
- L183 pointer_support "Acara Penunjuk": "acara" means ceremony/TV programme. An input event is "peristiwa" or the loanword "event". Suggest "Event Pointer". WRONG SENSE.
- L194 heading_plain "Seberapa Powerful": English word in the middle of Indonesian; suggest "Seberapa Kuat". MINOR.
- Rest matches the English; technical wording is accurate.

# Indonesian chunk 3 (lines 298-452)
- L331 event_loop "Loop Acara": "acara" means ceremony/programme; use "Event Loop". WRONG SENSE (same as L183).
- Terminology: L283, L315, L350, L380, L402, L405, L427, L430 use "intelijen" (see chunk 1).
- Rest matches the English; "Daring/Luring" are the correct official terms for online/offline.

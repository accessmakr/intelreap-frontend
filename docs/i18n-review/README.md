# i18n review: index and handoff (written 2026-11-25)

Start here for anything about translations. Rules for the whole repo are in `docs/HANDOFF.md` (AdSense freeze, dates, pushing) and `docs/DECISIONS.md`; they apply to translation work too.

## State
- All 24 languages (en + 23) were read in full against en.js and fixed. One findings file per language: `docs/i18n-review/<lang>.md` (what was wrong, what was changed, what is left for a native speaker).
- en.js has 670 keys; every language file has the same 670 keys (checked by flattening all 24 files).
- Canvas headers and data labels are fully wired: homepage 342 of 342, deep-dive pages 364 of 364. Measurement and how-to: `docs/i18n-review/canvas-coverage.md`.
- Everything is on `main` (last i18n commit `6552a85`). Nothing is half-finished or on a branch.

## How the pieces fit
- Strings: `assets/js/i18n/translations/<lang>.js`. The section `labels` holds the 195 canvas label strings (key = English text as a lowercase slug, e.g. `labels.hosting_network`).
- Page text is translated through `data-i18n="<key>"` attributes (engine: `assets/js/i18n/i18n-engine.js`, global `t(key, fallback)`, events `ndic-i18n-ready` and `ndic-language-changed`).
- `assets/js/i18n/value-translator.js` translates English values that scripts insert as plain text ("Supported", "Good", "none found", the "Deep dive into ..." links). Display only. Its English-to-key table is generated from en.js; add a row when you add a value.
- `assets/js/visualizations/chartjs.js` reads chart titles and labels from `labels.*` and refreshes them on the two events above.
- To add a label: add it to `labels` in en.js and all 23 other files, then put `data-i18n="labels.<key>"` on the element (or add it to the table in value-translator.js if a script writes it).

## Not done (and why)
- Article bodies, long page prose and the homepage FAQ are English only. The homepage FAQ is hard-coded and asks different questions from the translated `faq.*` keys, so those 22 keys per language are unused. About 245 of the original 475 keys were not referenced by any page when measured on 2026-11-17 (citations, faq, values, offline, download, share, errors); wiring them needs page markup edits.
- Native-speaker review of all rewritten FAQ answers and the 195 new labels. Weakest: Hausa and Yoruba (Yoruba FAQ answers are still much shorter than the English).
- Not touched on purpose: article titles, `learn/` and `guides/` (other agent), `ads.txt`, the adsense meta tag.

## Gotchas learned
- Terms with an espionage sense for "intelligence" were replaced by "analysis" in 16 languages (owner decision). Spanish, Portuguese, Bengali, Hindi, Persian, Hausa and Yoruba kept their words (no spy sense).
- Search the translation files by key path (flatten), not by line number: es.js, fa.js, fr.js, pt.js and others lay out the FAQ differently from en.js after about line 460.
- French uses a non-breaking space before ? : ! %; keep it.
- Local browser tests: start `python3 -m http.server` and the test in the same command (servers do not survive between steps); the page loads Chart.js, D3 and Leaflet from CDNs, so serve local copies (`npm i chart.js@4.4.4 d3@7 leaflet@1.9.4`) with Playwright route interception.
- After any change run `python3 scripts/content/verify_dates.py` (must print 0 problems) and confirm `/ads.txt` and the adsense tag after the push.

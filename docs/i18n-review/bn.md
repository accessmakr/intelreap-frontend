# i18n review: Bengali (bn.js)

Status: FULLY READ line by line against en.js (475 strings), 2026-11-17.

## Applied
L5 omission (no login); L105 grammar; L122, L250, L367 flags -> সংকেত; L125 consulted wording; L375, L386, L437 critical -> গুরুতর; support/supported words (L178,179,181,184,199,204,210,262,277,278,448,449) -> সমর্থন/সমর্থিত/অসমর্থিত; L299-302 loaded labels; L249 surfaces; L587 contact label (was 'send email'); L565 spelling matches L566; FAQ answers L519, L523, L527, L531, L535, L539, L543, L547, L551, L555 rewritten (omitted sentences restored, stale 'three-tier fallback' and 'optional API' claims removed).

## NOT applied (minor or style)
- L43 and L399 status_degraded/degraded 'অবনমিত' (means demoted); L186 bitness; L200 hardware acceleration 'ত্বরণ'; L372/398/434 'সুস্থ' for Healthy.
- Terminology: 'ইন্টেলিজেন্স' is a transliteration with no spy-sense problem, kept.
- Native Bengali speaker should confirm the rewritten FAQ answers.

## Raw notes
# Bengali (bn.js) review, chunk 1 (lines 4-146)
- L5 description: English ends "No login."; Bengali ends after "বিনামূল্যে।" - "No login" missing. OMISSION.
- L105 heading_plain "আপনি কি অনলাইনে লুকানো?": ungrammatical ("লুকানো" is an adjective). Should be "আপনি কি অনলাইনে লুকিয়ে আছেন?". GRAMMAR.
- L122 detection_flags "শনাক্তকরণ পতাকা": "পতাকা" = national flag. Meaning is indicators. Suggest "শনাক্তকরণ সংকেত". WRONG SENSE.
- L125 paid_api_consulted "পেইড API পরামর্শ নেওয়া হয়েছে": "পরামর্শ নেওয়া" means took advice from a person. Suggest "পেইড API ব্যবহার করে যাচাই করা হয়েছে". UNNATURAL.
- L43 status_degraded "অবনমিত": means demoted/lowered, rarely used for service state. Suggest "দুর্বল" or "ধীর". MINOR.
- Terminology: "ইন্টেলিজেন্স" is a transliteration, no spy-sense problem like Arabic; kept.
- Numbers on L24, L27, L28: ২৮৫ and ১৩ correct (L27 fixed earlier today).

# Bengali chunk 2 (lines 147-288)
- L250 security_flags "নিরাপত্তা পতাকা": same "flag = national flag" problem as L122. Suggest "নিরাপত্তা সংকেত". WRONG SENSE.
- L277 supported "সহায়তাকৃত", L204 extensions_count "সহায়তাকৃত এক্সটেনশন", L262 capability_count "সহায়তাকৃত বৈশিষ্ট্য", L178/179/181/184/199/210 "সহায়তা" for "support": "সহায়তা" means help/assistance. For feature support the usual word is "সমর্থন/সমর্থিত". Suggest "সমর্থিত" for Supported, "সমর্থন" for Support. UNNATURAL, many strings; style decision, partly applied (see end).
- L278 not_supported "সহায়তাহীন": reads as "without assistance". Suggest "সমর্থিত নয়" or "অসমর্থিত".
- L249 fingerprint_surfaces "ফিঙ্গারপ্রিন্ট পৃষ্ঠতল": literal. Suggest "ফিঙ্গারপ্রিন্টের উৎস". MINOR.
- L186 bitness "OS বিটনেস": transliteration, unclear. Suggest "OS বিট (৩২/৬৪)". MINOR.
- L200 "হার্ডওয়্যার ত্বরণ": "ত্বরণ" is the physics word; "হার্ডওয়্যার অ্যাক্সিলারেশন" is what users see. MINOR.
- Rest of this range matches the English.

# Bengali chunk 3 (lines 289-443)
- L367 critical_flags "সংকটাপন্ন পতাকা": "flags" again (see L122). Suggest "গুরুতর সংকেত".
- L375, L437 critical "সংকটাপন্ন", L386 critical_count "সংকটাপন্ন ইভেন্ট": "সংকটাপন্ন" is the word for a patient in critical condition. Too dramatic for a scan result. Suggest "গুরুতর". TONE.
- L299 script_count "লোড স্ক্রিপ্ট", L300 "লোড স্টাইলশিট", L301 "লোড ছবি", L302 "লোড ফন্ট": read as an instruction ("load script"). English is "Scripts Loaded". Suggest "লোড হওয়া স্ক্রিপ্ট", etc. UNCLEAR.
- L399 degraded "অবনমিত": same as L43.
- L372/398/434 healthy "সুস্থ": means healthy person; acceptable for a system, left as is. MINOR.
- Terms kept as transliterations (পার্সেন্টাইল, কনটেন্টফুল পেইন্ট, ইন্টেলিজেন্স): understandable to the audience; not changed.
- Everything else here matches the English.

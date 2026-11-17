# i18n review: Arabic (ar.js)

Status: FULLY READ line by line against en.js (477 strings). Reviewer: Claude, 2026-11-17.

## Applied in this commit
L5 omission, L125 grammar, L206 antialiasing, L244 push, L250 and L367 flags, L309 and L339 percentile, L464 serverless wording, L589 contact wording, and the shortened FAQ answers L521, L525, L529, L537, L545, L549, L557 (omitted sentences restored).

## NOT applied, needs owner decision or is minor
- Terminology: Intelligence rendered as استخبارات (reads as spy intelligence). Owner decides: keep, or change to معلومات/تحليلات.
- Minor wording: L59, L60, L63/117/118/120/219/252/261 (نقاط vs درجة), L83, L151, L186, L209, L214, L249, L323, L338, L406.
- ENGLISH SOURCE IS STALE (affects every language): L468 and L537 name ip-api and ipwho as live sources; L525 names ProxyCheck/IPQualityScore which are not configured; L429/L430 Groq/Gemini keys. Fix in en.js first. Changing homepage text moves the page date under the dates rule.

## Raw notes
# Arabic (ar.js) review, chunk 1 (lines 4-135)
- L5 description: English ends "No login." Arabic ends after "مجاني." - "No login" is missing. OMISSION.
- L125 paid_api_consulted: "تم استشارة API مدفوعة" - verb agreement wrong (should be "تمت استشارة"). GRAMMAR.
- Terminology (whole file): "Intelligence" is rendered "استخبارات", which in everyday Arabic reads as spy/espionage intelligence. A consumer tool would normally say "معلومات" or "تحليلات". DECISION NEEDED, applies to many strings (L4,10,12,25,35,39,49,104...).
- L59 peering_count "عدد الاقترانات المقدرة": "الاقترانات" is not the networking term; "عدد علاقات الربط (Peering) المقدرة" is clearer. MINOR.
- L63/117/118/120 "نقاط ..." for score: "درجة ..." is the natural word for a score; "نقاط" means points. MINOR, consistent across strings.
- L83 organization "المنظمة": "الجهة" is more natural for an owner of a network. MINOR.
- L60 upstream_provider "المزود الأعلى": understandable, "مزود الربط الأعلى (Upstream)" clearer. MINOR.
- All numbers 285 / 13 correct (L24,27,28).

# Arabic chunk 2 (lines 138-287)
- L244 push_permission "إذن الدفع": in Arabic "الدفع" means payment. English means push notifications. MISTRANSLATION. Suggest "إذن الإشعارات الفورية".
- L206 antialiasing "مكافحة التشرذم": "تشرذم" means fragmentation/splitting. The standard graphics term is "تنعيم الحواف". WRONG TERM.
- L250 security_flags "أعلام الأمان": "أعلام" means national flags. Meaning here is indicators. Suggest "مؤشرات الأمان". WRONG SENSE.
- L186 bitness "نظام البت": unclear. Suggest "عدد بتات النظام (32/64)". UNCLEAR.
- L209 max_anisotropy "أقصى تباين الاتجاه": awkward and not the standard term. MINOR.
- L151 jitter "الاهتزاز": means vibration. Better "تذبذب زمن الاستجابة". MINOR.
- L249 fingerprint_surfaces "أسطح البصمة الرقمية": literal, hard to understand. MINOR.
- L214 "نسيج عائم": reads as "floating fabric". Suggest "أنسجة الفاصلة العائمة". MINOR.
- L219/252/261 "نقاط ..." for scores (same note as chunk 1).
- Others in this range read correctly against the English.

# Arabic chunk 3 (lines 288-447)
- L309 percentile_rating and L339 percentile_ranking: "بيرسنتايل" is the English word spelled in Arabic letters. Readers will not know it. Use "النسبة المئوية" or "المئين". UNCLEAR.
- L367 critical_flags "أعلام حرجة": same "flags" problem as L250. Suggest "مؤشرات حرجة".
- L323 fid "تأخير أول مدخل": "مدخل" means doorway. Suggest "تأخر أول إدخال". MINOR.
- L406 "ملخص تشخيص": suggest "ملخص التشخيص". MINOR.
- L338 "الأجهزة العليا": suggest "أجهزة الفئة العليا". MINOR.
- L429/430 source_groq / source_gemini: English file also still has these keys, but summaries now run on the device with no AI provider. Stale keys in en.js too, not a translation fault. Check whether the page still uses them.
- Everything else here matches the English meaning.

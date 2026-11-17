# i18n review: Persian (fa.js)

Status: FULLY READ against en.js (475 strings), 2026-11-17. Lines 4-458 line by line, the rest by key path.

## Applied (27 lines)
- L5 omission (بدون ورود); paid_api_consulted wording; spelling (به‌روزرسانی, مؤثر, سیستم‌عامل); antialiasing and max anisotropy; LCP/FCP/INP 'رسم' -> 'نمایش'; 'failed' (شکست خورد -> ناموفق بود); 'Copied for' word order; N/A; footer contact label (was 'send email').
- All 10 FAQ answers had been cut short, two with stale claims (three-layer backup chain, optional reputation API); the security answer said ten signals but listed eight and had no score bands. Rewritten in full (PWA term 'برنامه وب پیشرو').

## Not applied
- Latin vs Persian digits mixed (L24 vs L27/L28): style.
- 'اطلاعات' for Intelligence is neutral and 'پرچم' is the standard programming word for flags: kept.
- A native Persian speaker should confirm the rewritten FAQ answers.

## Raw notes
# Persian (fa.js) review, chunk 1 (lines 4-153)
- L5 description: English ends "No login."; Persian ends at "رایگان." OMISSION.
- L125 paid_api_consulted "API پولی مشورت شد": "مشورت شد" means advice was sought from a person. Suggest "API پولی بررسی شد". UNNATURAL.
- L45 next_refresh "بروزرسانی": the correct spelling is "به‌روزرسانی". SPELLING.
- L146 effective_type "موثر": correct spelling "مؤثر". MINOR.
- L27/L28 use Latin digits (285, 13) while L24 uses Persian digits (۲۸۵, ۱۳). Inconsistent digits. MINOR.
- Terminology: "اطلاعات" for Intelligence is neutral, no spy sense. Kept. "پرچم" for flags is the standard programming term. Kept.
- Rest matches the English.

# Persian chunk 2 (lines 154-302)
- L206 antialiasing "ضد دندانه‌دار شدن": literal ("against becoming jagged"). The standard term is "هموارسازی لبه‌ها". UNNATURAL.
- L209 max_anisotropy "حداکثر ناهمسانگرد": noun missing, should be "حداکثر ناهمسانگردی". GRAMMAR.
- L162, L163, L186 "سیستم عامل": the compound is written "سیستم‌عامل" (zero-width non-joiner). SPELLING, minor.
- L231 webrtc_exposure "نشت WebRTC": means leak; acceptable.
- Rest matches the English; GPU terms are correct.

# Persian chunk 3 (lines 303-458)
- L318 lcp "بزرگترین رسم محتوا", L319 fcp "اولین رسم محتوا", L321 inp "تعامل تا رسم بعدی": "رسم" means drawing/plotting. "Paint" is rendered "نمایش" in Persian web.dev docs. Suggest "بزرگ‌ترین نمایش محتوا", "اولین نمایش محتوا", "تعامل تا نمایش بعدی". UNNATURAL.
- L418 failed "شکست خورد — دوباره تلاش کنید": "شکست خورد" means was defeated. Suggest "ناموفق بود — دوباره تلاش کنید". WRONG REGISTER.
- L422 copied_for "برای کپی شد": English is "Copied for <name>". Word order puts the verb last so the name would follow it incorrectly. Suggest "کپی شد برای". WORD ORDER.
- L458 na "نامربوط": means irrelevant. Suggest "ناموجود". MINOR.
- Percentile "صدک", pass/fail "قبول/رد", status labels: correct.

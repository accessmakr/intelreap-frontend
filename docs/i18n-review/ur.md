# i18n review: Urdu (ur.js)

Status: FULLY READ against en.js (475 strings), 2026-11-17. Lines 4-452 line by line, the rest by key path. Reviewer confidence in Urdu is moderate; only clear errors were fixed.

## Applied (53 lines)
- Terminology: loanword 'انٹیلیجنس' (mostly means the spy agencies) -> 'تجزیہ' (analysis) in 30 strings; same decision as the other languages.
- L231 'WebRTC نمائش' (exhibition) -> 'افشا' (disclosure); L24 gender agreement ('کا فنگر پرنٹ'); L125 'مشاورت' (consulting a person) -> 'جانچ کی گئی'; L43/L399 'کمزور' (weak) -> 'کارکردگی میں کمی'; L299-302 'Loaded' labels; L422 word order; L152; L5 omission (لاگ ان کی ضرورت نہیں); footer contact label (was 'email us').
- methodology text: stale 'تین سطحی بیک اینڈ فال بیک چین' replaced with the corrected statement.
- All 10 FAQ answers had been cut to one sentence (two with stale claims); rewritten in full.

## Not applied
- 'نازک' for Critical (acceptable Urdu for a critical situation). A native Urdu speaker should confirm the تجزیہ wording and FAQ answers.

## Raw notes
# Urdu (ur.js) review, chunk 1 (lines 4-148)
Reviewer note: Urdu is read with moderate confidence; only clear errors are fixed.
- Terminology: the loanword "انٹیلیجنس" for Intelligence (L4,5,7,10,12,21,25,28,35,39,49,104...): in Urdu it mostly means the spy agencies. Replace with "تجزیہ" (analysis), same decision as the other languages.
- L5 description: English ends "No login."; Urdu ends at "مفت۔" OMISSION. Add "لاگ ان کی ضرورت نہیں۔"
- L24 tagline "ڈیوائس کی فنگر پرنٹ": the possessive must agree with the possessed noun (فنگر پرنٹ is masculine): "ڈیوائس کا فنگر پرنٹ". GRAMMAR.
- L125 paid_api_consulted "ادائیگی API سے مشاورت": "مشاورت" means consulting a person. Suggest "ادائیگی والی API سے جانچ کی گئی". UNNATURAL.
- L43 status_degraded "کمزور": means weak; suggest "کارکردگی میں کمی". MINOR.
- Rest matches the English.

# Urdu chunk 2 (lines 147-297)
- L231 webrtc_exposure "WebRTC نمائش": "نمائش" means an exhibition/display. English "Exposure" means being revealed; use "افشا". WRONG SENSE.
- L152 uptime "لوڈ سے وقت": unclear; suggest "لوڈ کے بعد سے وقت". MINOR.
- L159, L283 "... انٹیلیجنس پینل": terminology change only.
- Rest matches the English; technical transliterations are consistent.

# Urdu chunk 3 (lines 298-452)
- L299-L302 script/stylesheet/image/font_count "لوڈ اسکرپٹس" etc.: reads as the command "load scripts"; English is "Scripts Loaded". Suggest "لوڈ شدہ اسکرپٹس", "لوڈ شدہ اسٹائل شیٹس", "لوڈ شدہ تصاویر", "لوڈ شدہ فونٹس". UNCLEAR.
- L422 copied_for "کے لیے کاپی کیا": the platform name follows, but Urdu puts the name before "کے لیے". Suggest "کاپی کیا گیا:". WORD ORDER.
- L399 degraded "کمزور": same as L43.
- L367/L375/L386/L437 "نازک" for Critical: used in Urdu for a critical situation (نازک صورتحال); kept.
- Terminology: L315, L350, L380, L402, L405, L427, L430 "انٹیلیجنس" (see chunk 1).
- Rest matches the English.

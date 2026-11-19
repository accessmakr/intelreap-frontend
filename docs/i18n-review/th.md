# i18n review: Thai (th.js)

Status: FULLY READ against en.js (475 strings), 2026-11-17. Lines 4-452 line by line, the rest by key path.

## Applied (47 lines)
- Terminology: 'ข่าวกรอง' (intelligence agency / spy) -> 'วิเคราะห์ / การวิเคราะห์' in 30+ strings; same decision as the other languages. Footer English transliteration 'อินเทลลิเจนซ์' also replaced.
- L5 omission (ไม่ต้องเข้าสู่ระบบ); L125 'ปรึกษา' (consult a person) -> 'ตรวจสอบกับ'; L68/L69 'คำนำหน้า' (grammatical prefix) -> 'พรีฟิกซ์'; 'ลดลง' (decreased) -> 'ประสิทธิภาพลดลง' (L43, L399); L384 'สุขภาพแบ็กเอนด์' -> 'สถานะแบ็กเอนด์'; footer contact label (was 'send email').
- All 10 FAQ answers had been cut short (two with stale claims: optional reputation API, three-layer backup chain); rewritten in full.

## Not applied
- L177 'สเปกตรัมสี' for colour gamut (acceptable); L372/L398/L434 healthy = 'ดี' same as good.
- A native Thai speaker should confirm the วิเคราะห์ wording and FAQ answers.

## Raw notes
# Thai (th.js) review, chunk 1 (lines 4-148)
- Terminology: "ข่าวกรอง" for Intelligence (L4,5,7,10,12,21,25,28,35,39,49,104...): "สำนักข่าวกรอง" = intelligence agency; spy sense. Replace with "วิเคราะห์/การวิเคราะห์" (same decision as the other languages).
- L5 description: English ends "No login."; Thai ends at "ฟรี" OMISSION. Add "ไม่ต้องเข้าสู่ระบบ".
- L125 paid_api_consulted "ปรึกษา API แบบชำระเงินแล้ว": "ปรึกษา" means to consult a person. Suggest "ตรวจสอบกับ API แบบชำระเงินแล้ว". UNNATURAL.
- L43 status_degraded "ลดลง": means "decreased"; suggest "ประสิทธิภาพลดลง". MINOR.
- L68/L69 prefixes "คำนำหน้า": grammatical prefix; network term is "พรีฟิกซ์". WRONG TERM.
- Rest matches the English.

# Thai chunk 2 (lines 147-297)
- L159, L283 "แผงข่าวกรอง...": terminology change only.
- L177 color_gamut "สเปกตรัมสี": acceptable; "ขอบเขตสี" is more exact. MINOR, not changed.
- No other errors in this range; technical transliterations are consistent and standard.

# Thai chunk 3 (lines 298-452)
- L399 degraded "ลดลง": same as L43; suggest "ประสิทธิภาพลดลง". MINOR.
- L384 backend_health "สุขภาพแบ็กเอนด์": literal "health"; "สถานะแบ็กเอนด์" is the usual wording. MINOR.
- L372/L398/L434 healthy "ดี" duplicates L342 good "ดี": left, understandable in context.
- Terminology: L315, L350, L380, L402, L405, L427, L430 "ข่าวกรอง" (see chunk 1).
- Rest matches the English; vocabulary is natural.

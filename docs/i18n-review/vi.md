# i18n review: Vietnamese (vi.js)

Status: FULLY READ against en.js (475 strings), 2026-11-17. Lines 4-452 line by line, the rest by key path.

## Applied (47 lines)
- Terminology: 'tình báo' (espionage / spy intelligence) -> 'phân tích' wording in 30 strings; same decision as the other languages.
- L209/L213 'Đẳng Hướng' (isotropic) -> 'Dị Hướng' (anisotropic): the meaning was reversed. L367/L386 'Quan Trọng' (important) -> 'Nghiêm Trọng' (critical); 'Sức Khỏe' -> 'Tình Trạng' (L63, L354, L384); scoreboard heading; L5 omission (Không cần đăng nhập); footer contact label (was 'send email'); 'kết nối tích cực' (positive connection) -> 'kết nối đang hoạt động'.
- All 10 FAQ answers had been cut short (two with stale claims: optional reputation API query, three-tier backup chain); rewritten in full.

## Not applied
- Vocabulary otherwise accurate and consistent. A native Vietnamese speaker should confirm the phân tích wording and FAQ answers.

## Raw notes
# Vietnamese (vi.js) review, chunk 1 (lines 4-148)
- Terminology: "Tình Báo / tình báo" for Intelligence (L4,5,7,10,12,21,25,28,35,39,49,104...): "tình báo" means espionage / spy intelligence. Replace with "Phân Tích / phân tích" (same decision as the other languages).
- L5 description: English ends "No login."; Vietnamese ends at "Miễn phí." OMISSION. Add "Không cần đăng nhập."
- Rest matches the English; vocabulary is accurate and consistent (Ngoại Tuyến, Tiền Tố, Cờ Phát Hiện).

# Vietnamese chunk 2 (lines 147-297)
- L209 max_anisotropy "Đẳng Hướng Tối Đa" and L213 has_anisotropy "Lọc Đẳng Hướng": "đẳng hướng" means isotropic, the opposite of anisotropic. Correct: "Dị Hướng Tối Đa", "Lọc Dị Hướng". MEANING REVERSED.
- L159, L283 "Bảng Tình Báo ...": terminology change only.
- Rest matches the English; GPU and web vocabulary is accurate.

# Vietnamese chunk 3 (lines 298-452)
- L367 critical_flags "Cờ Quan Trọng" and L386 critical_count "Sự Kiện Quan Trọng": "quan trọng" means important; L375/L437 use "Nghiêm Trọng" (critical). Make consistent: "Cờ Nghiêm Trọng", "Sự Kiện Nghiêm Trọng". WRONG SENSE / INCONSISTENT.
- L350 "Bảng Xếp Hạng Tình Báo Toàn Cầu": English is a scoreboard; "bảng xếp hạng" is a leaderboard. Suggest "Bảng Điểm Toàn Cầu" (plus terminology change). MINOR.
- L63, L354, L384 "Sức Khỏe ...": literal "health"; "Tình Trạng ..." is the usual word for system state. MINOR.
- Terminology: L315, L350, L380, L402, L405, L427, L430 "tình báo" (see chunk 1).
- Rest matches the English.

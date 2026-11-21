# i18n review: Chinese (zh.js)

Status: FULLY READ against en.js (475 strings), 2026-11-17. Lines 4-452 line by line, the rest by key path.

## Applied (43 lines)
- L28 wrong number: '12个智能面板' -> '13个分析面板' (site has 13 panels).
- Terminology: '智能' (smart/AI-powered; untrue now that no AI provider is used) -> '分析' in 28 strings; footer description used '情报' (spy intelligence) -> '分析'; same decision as the other languages.
- L131 '清洁' (physically clean) -> '正常'; L350 leaderboard -> '全球评分总览'; L384 '后端健康' -> '后端状态'; '活跃连接' (lively connection) -> '有效的网络连接'; footer contact label (was 'send us an email').
- All 10 FAQ answers had been cut short (two with stale claims: optional IP reputation API query, three-layer fallback chain); rewritten in full.

## Not applied
- L247 '引用策略' for Referrer Policy (minor). A native Chinese speaker should confirm the 分析 wording and FAQ answers.

## Raw notes
# Chinese (zh.js) review, chunk 1 (lines 4-148)
- L28 trust_panels "12个智能面板": says 12 panels; the site has 13. WRONG NUMBER. (L24 is correct; L27 was fixed earlier today.)
- Terminology: "智能" for Intelligence (L4,5,7,10,12,21,25,28,35,39,49,104...): "智能" means smart/AI-powered. The tool is not AI (summaries now run on the device with no AI provider), so it suggests something untrue. Replace with "分析" (same decision as the other languages).
- L131 route_clean "清洁": means physically clean; for an IP route/reputation, "正常" is the natural word. MINOR.
- L5 already has "无需登录" (no login): no omission.
- Rest matches the English; vocabulary is standard.

# Chinese chunk 2 (lines 147-297)
- L159, L283 "...智能面板": terminology change only.
- L247 referrer_policy "引用策略": "引用" means quote/cite; the header is usually written "Referrer策略". MINOR, not changed.
- No other errors in this range; technical vocabulary (抗锯齿, 各向异性, 着色器, 模板缓冲) is standard and accurate.

# Chinese chunk 3 (lines 298-452)
- L350 heading_technical "全球智能排行榜": English is a scoreboard; "排行榜" is a leaderboard. Suggest "全球评分总览" (plus terminology change). MINOR.
- L384 backend_health "后端健康": literal "health"; "后端状态" is the usual wording. MINOR.
- Terminology: L315, L350, L380, L402, L405, L427, L430 "智能" (see chunk 1).
- Rest matches the English; vocabulary is natural and consistent.

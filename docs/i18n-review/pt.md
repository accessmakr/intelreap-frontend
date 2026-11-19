# i18n review: Portuguese (pt.js)

Status: FULLY READ against en.js (475 strings), 2026-11-17. Lines 4-452 line by line, the rest by key path.

## Applied (16 lines)
- L88 'CEP' (Brazil-only postcode) -> 'Código Postal'; L135 'do seu VPN' -> 'da sua VPN' (gender, matches L107); L5 omission (Sem login); L338 anglicism; footer contact label (was 'send us an email').
- All 10 FAQ answers had been cut short (one with a stale 'optional reputation API' claim, the accuracy answer missing its mobile/VPN warning, the security answer missing most signals and score bands); rewritten in full.

## Not applied
- 'Inteligência' kept: normal Portuguese tech wording, same decision as Spanish.
- Brazilian/European variant mix (L24 'a sua infraestrutura', 'Definições de cookies'), 'Política de Referência': style.
- A native Portuguese speaker should confirm the FAQ answers.

## Raw notes
# Portuguese (pt.js) review, chunk 1 (lines 4-148)
- L5 description: English ends "No login."; Portuguese ends at "Grátis." OMISSION. Add "Sem login."
- L88 postal "CEP": CEP is the Brazilian postcode only. The field shows postal codes for visitors worldwide; English is "Postal Code". Suggest "Código Postal". WRONG TERM.
- L135 deep_dive "do seu VPN": L107 uses the feminine "VPN Detectada"; use "da sua VPN" consistently. GENDER.
- Variant mix: most strings are Brazilian ("Você", "Sua"), L24 is European ("a sua infraestrutura"). Style, not changed.
- Terminology: "Inteligência" is normal Portuguese tech wording (inteligência de ameaças/negócio), less spy-sense than Arabic/German. Kept, same as Spanish.
- Rest matches the English.

# Portuguese chunk 2 (lines 147-297)
- L247 referrer_policy "Política de Referência": the header is "Referrer"; minor, not changed.
- No other errors in this range; technical vocabulary (Aceleração de Hardware, Buffer Stencil, Instanciamento) is correct.

# Portuguese chunk 3 (lines 298-452)
- L338 vs_top_tier "vs Dispositivos Top": anglicism; suggest "vs Dispositivos de Alto Desempenho". MINOR.
- Everything else in this range matches the English; vocabulary is accurate and consistent.

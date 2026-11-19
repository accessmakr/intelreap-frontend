# i18n review: Russian (ru.js)

Status: FULLY READ against en.js (475 strings), 2026-11-17. Lines 4-452 line by line, the rest by key path.

## Applied (47 lines)
- Terminology: 'разведка' (military/spy intelligence) -> 'анализ' wording in 29 strings; same decision as the other languages. Non-word 'устройственной' removed ('Центр анализа сети и устройств').
- L27 and logic text '285 точки' -> '285 точек'; L5 omission (Без регистрации); 'ДЕГРАДИРОВАНО/Деградировано' -> 'УХУДШЕНО/Ухудшено'; 'здоровье' -> 'состояние' (network, backend, classification); L398 'Здоров' -> 'Исправен'; L350 leaderboard -> results table; L407 'Создано с помощью'.
- methodology text: stale 'трёхуровневая цепочка резервирования бэкенда' replaced with the corrected statement.
- All 9 shortened FAQ answers (one already complete) rewritten in full, including the stale 'optional reputation API' claim.

## Not applied
- L40 'В ЭФИРЕ' for LIVE (broadcast wording, understood).
- A native Russian speaker should confirm the анализ wording and FAQ answers.

## Raw notes
# Russian (ru.js) review, chunk 1 (lines 4-153)
- Terminology: "разведка/разведки/разведывательное" for Intelligence (L4,5,7,10,12,21,25,28,35,39,49,104...): "разведка" is military/spy intelligence. Replace with "анализ" wording (same decision as the other languages).
- L4, L35, L39 "устройственной": not a standard Russian word. Correct: "Центр анализа сети и устройств". WRONG WORD.
- L5 description: English ends "No login."; Russian ends at "Бесплатно." OMISSION. Add "Без регистрации."
- L27 trust_data_points "285 точки данных": wrong case, must be "285 точек данных". GRAMMAR.
- L43 status_degraded "ДЕГРАДИРОВАНО": calque, not used for service status. Suggest "УХУДШЕНО". MINOR.
- L63 "Оценка здоровья сети": literal; "Оценка состояния сети". MINOR.
- Rest matches the English.

# Russian chunk 2 (lines 147-297)
- L159, L283 "Панель разведки ...": terminology change only.
- No other errors in this range; vocabulary is standard and accurate.

# Russian chunk 3 (lines 298-452)
- L350 "Глобальная таблица лидеров разведки": English is a scoreboard, "таблица лидеров" is a leaderboard. Suggest "Глобальная таблица результатов" (plus terminology change). MINOR.
- L384 backend_health "Здоровье бэкенда", L398 "Здоров", L354 "Классификация здоровья": literal "health". Suggest "Состояние бэкенда", "Исправен", "Классификация состояния". MINOR.
- L43 and L399 "Деградировано": calque. Suggest "Ухудшено". MINOR.
- L407 source_label "Создано": drops "by"; suggest "Создано с помощью". MINOR.
- Terminology: L315, L350, L380, L402, L405, L427, L430 "разведка" (see chunk 1).
- Rest matches the English.

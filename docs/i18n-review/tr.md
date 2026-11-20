# i18n review: Turkish (tr.js)

Status: FULLY READ against en.js (475 strings), 2026-11-17. Lines 4-452 line by line, the rest by key path.

## Applied (48 lines)
- Terminology: 'İstihbarat' (intelligence service / spy) -> 'Analiz' wording in 30 strings; same decision as the other languages.
- L5 description rewritten: omission (Giriş gerekmez) and broken case endings fixed (ASN'nizi, VPN durumunuzu...). L42 'ÇEVRIMDIŞI' -> 'ÇEVRİMDIŞI' (dotted İ); 'BOZULMUŞ/Bozulmuş' (broken) -> 'DÜŞÜK PERFORMANS'; L59 'Eşleşme' (match) -> 'Peering'; L125 'Danışıldı' (consulted a person) -> 'Sorgulandı'; L422 word order ('Kopyalandı:'); L418 register; footer contact label (was 'send email').
- All 10 FAQ answers had been cut short (two with stale claims: optional reputation API query, three-layer backup chain); rewritten in full.

## Not applied
- 'İS' abbreviation for işletim sistemi (understandable); vocabulary otherwise standard.
- A native Turkish speaker should confirm the Analiz wording and FAQ answers.

## Raw notes
# Turkish (tr.js) review, chunk 1 (lines 4-148)
- Terminology: "İstihbarat" for Intelligence (L4,5,7,10,12,21,25,28,35,39,49,104...): "istihbarat teşkilatı" = intelligence service; spy sense. Replace with "analiz" wording (same decision as the other languages).
- L5 description: English ends "No login."; Turkish ends at "Ücretsiz." OMISSION. The list also has broken case endings ("IP adresinizi, ASN, VPN durumu, ..."): rewrite so every item takes the same ending.
- L42 status_offline "ÇEVRIMDIŞI": missing the dotted capital İ. Correct: "ÇEVRİMDIŞI". SPELLING.
- L43 status_degraded "BOZULMUŞ": means "broken/spoiled". Suggest "DÜŞÜK PERFORMANS". MINOR.
- L59 peering_count "Tahmini Eşleşme Sayısı": "eşleşme" is a match; the term is peering. Suggest "Tahmini Peering Sayısı". WRONG TERM.
- L125 paid_api_consulted "Ücretli API Danışıldı": "danışmak" is to consult a person. Suggest "Ücretli API Sorgulandı". UNNATURAL.
- Rest matches the English.

# Turkish chunk 2 (lines 147-297)
- L159, L283 "... İstihbarat Paneli": terminology change only.
- L163/L186 "İS Sürümü/İS Bit Sayısı": "İS" is an unusual abbreviation for işletim sistemi; understandable, not changed.
- No other errors in this range; vocabulary (Kenar Yumuşatma, Şablon Tamponu, Gölgelendirici) is standard.

# Turkish chunk 3 (lines 298-452)
- L422 copied_for "için kopyalandı": the platform name follows this string, but Turkish puts the name before "için". Suggest "Kopyalandı:". WORD ORDER.
- L399 degraded "Bozulmuş": same as L43; suggest "Düşük Performans". MINOR.
- L418 failed "Tekrar Dene" is informal imperative while L424 "deneyin" is formal; make it "Tekrar Deneyin". REGISTER, minor.
- Terminology: L315, L350, L380, L402, L405, L427, L430 "İstihbarat" (see chunk 1).
- Rest matches the English.

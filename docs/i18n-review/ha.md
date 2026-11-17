# i18n review: Hausa (ha.js)

Status: FULLY READ against en.js (475 strings), 2026-11-17. Reviewer confidence in Hausa is lower than for the other languages. Only high-confidence fixes were applied; everything doubtful is listed below for a native speaker.

## Applied (24 lines)
- L231 'Ɓoyayyar WebRTC' (concealed) -> 'Bayyanar WebRTC' (meaning was the opposite of Exposure); L125 'consulted' wording; L27/L28/L12 and logic text ('wurare' = places -> 'maki'; invented word 'aluna' -> 'allunan'); L68/L69 Prefixes; L201 duplicated word; L367/L386 'muhimmanci' (importance) -> 'Mai Haɗari'; L402 singular 'you'; L5 omission (no login); footer contact label (was 'send email').
- FAQ: stale claims removed (optional API query; 'sarkar mafi aminci mai matakai uku'), missing sentences added (peering, ICE candidates, FCP/TTFB/FID, mobile/VPN accuracy, score bands, offline mode, weights rationale, Android install, 'daga kashe' = from killing -> from cache).

## For a native Hausa speaker (not changed)
L22/L23 title word order; L89 coordinates 'Hangen Nesa'; L90 latitude; L139/L316 'Saurin Kawa'; L148 stability index; L169 CPU cores; L214/L215/L218 'Ƙirƙira' for textures; L242/L243 clipboard; L226; L299/L428 'Hujja' for script; L303 cache hit rate. The rewritten FAQ sentences also need a native read.

## Raw notes
# Hausa (ha.js) review, chunk 1 (lines 4-148)
Reviewer note: Hausa is the language I read least reliably. Only high-confidence fixes are applied; the rest are listed for a native speaker.
- L5 description: English ends "No login."; Hausa ends at "Kyauta." OMISSION. Add "Ba sai an shiga ba."
- L27 trust_data_points "Wurare 285": "wurare" means places; L24 correctly says "maki 285". Suggest "Maki 285 na bayanai a kowane bincike". WRONG SENSE.
- L28 trust_panels "Aluna 13 na bayanan": "aluna" is not a word (L77 uses "Allon"); phrase is incomplete. Suggest "Allunan bayanai 13". TYPO.
- L12 search_placeholder "allon bayanan": same; "allunan bayanai".
- L125 paid_api_consulted "An yi shawarar API": "shawara" means advice. Suggest "An yi amfani da API Mai Biyan Kuɗi". WRONG SENSE.
- L68/L69 prefixes "Ƙarin nau'in IPv4": means "additional type", not Prefixes. Suggest "Prefixes na IPv4". WRONG TERM.
- L22/L23 title "Hanyar Sadarwa Taka / Tana Bayyana Menene?": "Menene" is "what is it", word order is off. NATIVE CHECK.
- L89 coordinates "Hangen Nesa" (vision), L90 latitude "Ƙananan Layin Ƙasa", L139 "Saurin Kawa?", L148 "Alamar Kwanciyar Hankali" (peace of mind): doubtful. NATIVE CHECK.
- Terminology: "Bayanai" (information) for Intelligence has no spy sense. Kept.

# Hausa chunk 2 (lines 149-297)
- L231 webrtc_exposure "Ɓoyayyar WebRTC": "ɓoyayyar" means concealed/hidden. English "Exposure" is the opposite (revealed). MEANING REVERSED. Suggest "Bayyanar WebRTC".
- L201 max_texture_size "Mafi Girman Girman Ƙirƙira": "girman" repeated (typo). Suggest "Mafi Girman Ƙirƙira".
- L214, L215, L218 "Ƙirƙira" for Texture: means creation/invention. NATIVE CHECK (Hausa has no settled word; "laushi" is a possible choice).
- L169 "Tsakiyar CPU" for CPU Cores: means centre of the CPU. NATIVE CHECK.
- L242, L243 "Allon Kwafi" for Clipboard (means "copy screen"). NATIVE CHECK.
- L226 "Kana Aminci Sosai Yanzu?": odd grammar. NATIVE CHECK.
- Rest reads acceptably; technical words are kept in English where Hausa has no standard term.

# Hausa chunk 3 (lines 298-452)
- L367 critical_flags "Tutar Muhimmanci" and L386 critical_count "...na Muhimmanci": "muhimmanci" means importance, not critical. L375/L437 already use "Mai Haɗari". Align: "Tutar Mai Haɗari", "Abubuwan da ke Faruwa Masu Haɗari". WRONG SENSE / INCONSISTENT.
- L402 "bayananku" uses the plural "you" while the rest of the file uses the singular. Suggest "bayananka". MINOR.
- L303 cache_hit_rate "Ƙimar Bugun Kashe": "kashe" means kill/switch off. NATIVE CHECK.
- L299 script_count "Hujjoji" and L428 source_script "Hujja": means proofs/evidence, not scripts. NATIVE CHECK.
- L139/L316 "Saurin Kawa?": unclear. NATIVE CHECK.
- Rest reads acceptably.

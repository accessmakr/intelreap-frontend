# i18n review: Hindi (hi.js)

Status: FULLY READ against en.js (475 strings), 2026-11-17. Lines 4-452 line by line, the rest by key path.

## Applied (27 lines)
- L5 omission (no login); flags 'झंडे' (national flags) -> 'फ़्लैग' (L122, L250, L367); L125 consulted wording; 'vs' phrases reordered (L336-338); 'प्रदर्शन' (also means display/exhibition) -> 'कार्यप्रदर्शन' for performance (L283, L309, L312, L362); L422 word order; logic text conjunction 'तो' -> 'ताकि'; faq 7 question grammar; footer contact label (was 'email us'); retry label.
- All 10 FAQ answers had been cut short, two with stale claims (optional reputation API query, three-level fallback chain). Rewritten in full.

## Not applied
- 'इंटेलिजेंस' is a transliteration with no spy-sense problem: kept. Vocabulary otherwise accurate.
- A native Hindi speaker should confirm the rewritten FAQ answers.

## Raw notes
# Hindi (hi.js) review, chunk 1 (lines 4-148)
- L5 description: English ends "No login."; Hindi ends at "मुफ्त।" OMISSION. Add "लॉगिन की ज़रूरत नहीं।"
- L122 detection_flags "पहचान झंडे": "झंडे" means national flags; the technical word is "फ़्लैग". Suggest "पहचान फ़्लैग". WRONG SENSE.
- L125 paid_api_consulted "भुगतान API से पूछा गया": acceptable but "सशुल्क API से जाँच की गई" is clearer. MINOR.
- Terminology: "इंटेलिजेंस" is a transliteration, no spy-sense problem. Kept.
- Rest matches the English.

# Hindi chunk 2 (lines 149-297)
- L250 security_flags "सुरक्षा झंडे": same "flags" problem as L122. Suggest "सुरक्षा फ़्लैग". WRONG SENSE.
- L283 heading_technical "प्रदर्शन इंटेलिजेंस पैनल": "प्रदर्शन" also means display/exhibition. The standard word for performance is "कार्यप्रदर्शन". Check every use. AMBIGUOUS.
- Rest matches the English; technical vocabulary is well chosen.

# Hindi chunk 3 (lines 298-452)
- L367 critical_flags "गंभीर झंडे": flags again. Suggest "गंभीर फ़्लैग".
- L336, L337, L338 "औसत मोबाइल बनाम", "औसत डेस्कटॉप बनाम", "शीर्ष उपकरण बनाम": "बनाम" (versus) is placed after the noun, so it reads as an unfinished sentence; English is "vs Average Mobile". Suggest "बनाम औसत मोबाइल", "बनाम औसत डेस्कटॉप", "बनाम शीर्ष-स्तरीय डिवाइस". WORD ORDER.
- L309, L312, L362 (and L283) "प्रदर्शन": use "कार्यप्रदर्शन" for performance.
- L422 copied_for "के लिए कॉपी किया": the platform name follows this string, but Hindi puts "के लिए" after the noun. Suggest "कॉपी किया गया:". WORD ORDER.
- Rest matches the English.

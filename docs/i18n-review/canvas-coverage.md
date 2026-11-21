# Canvas header and data-label translation coverage

Measured 2026-11-17 on origin/main. Scope: the 13 homepage canvas panels and the 14 deep-dive pages. Only headers, sub-headers, section headers, data labels, gauge labels and summary labels (not page prose).

## Homepage (13 canvases): 342 elements
- Wired to a translation key: 189 (55%)
- Not wired: 153 (24 have a near-identical translated string that is simply not attached; 129 have no translated string at all)

| Canvas | Elements | Wired | Unwired |
|---|---|---|---|
| canvas-1 | 23 | 17 | 6 |
| canvas-2 | 27 | 18 | 9 |
| canvas-3 | 22 | 17 | 5 |
| canvas-4 | 17 | 13 | 4 |
| canvas-5 | 29 | 21 | 8 |
| canvas-6 | 27 | 19 | 8 |
| canvas-7 | 27 | 23 | 4 |
| canvas-8 | 10 | 7 | 3 |
| canvas-9 | 28 | 18 | 10 |
| canvas-10 | 36 | 11 | 25 |
| canvas-11 | 26 | 16 | 10 |
| canvas-12 | 12 | 8 | 4 |
| canvas-13 | 58 | 1 | 57 |

## Deep-dive pages: 364 elements, 206 wired (57%), 158 unwired

Worst: fingerprinting (57 of 58 unwired), rendering-speed (25 of 36), network-identity (14 of 49).

## Distinct strings with no translation yet

Homepage: 141 distinct; deep-dive pages: 141 distinct; union: 141.

### Homepage

| String | Canvas |
|---|---|
| Analysis | canvas-1, canvas-10, canvas-11, canvas-13, canvas-2, canvas-3, canvas-4, canvas-5, canvas-6, canvas-7, canvas-8, canvas-9 |
| Hosting Network | canvas-1 |
| Proxy Network | canvas-1 |
| Registry IPv4 Prefixes | canvas-1 |
| Registry IPv6 Prefixes | canvas-1 |
| Route Health | canvas-1 |
| CLS Rating | canvas-10 |
| CSS Animation FPS | canvas-10 |
| CSS Animation Score | canvas-10 |
| Canvas Render | canvas-10 |
| Canvas Render Score | canvas-10 |
| Canvas Render Time | canvas-10 |
| DOM Manipulation Score | canvas-10 |
| DOM Manipulation Time | canvas-10 |
| Event Loop Average | canvas-10 |
| Event Loop Score | canvas-10 |
| FCP Rating | canvas-10 |
| FID Rating | canvas-10 |
| INP Rating | canvas-10 |
| JS Execution Score | canvas-10 |
| JS Execution Time | canvas-10 |
| LCP Rating | canvas-10 |
| Memory Access Score | canvas-10 |
| Memory Access Time | canvas-10 |
| Percentile Ranking | canvas-10 |
| TTFB Rating | canvas-10 |
| Time To First Byte | canvas-10, canvas-9 |
| Vs. Average Desktop | canvas-10 |
| Vs. Average Mobile | canvas-10 |
| Vs. Top Tier Devices | canvas-10 |
| Capability | canvas-11 |
| Device | canvas-11 |
| Graphics | canvas-11 |
| Identity | canvas-11 |
| Improvement Priority | canvas-11 |
| Network | canvas-11 |
| Performance | canvas-11 |
| Security | canvas-11 |
| Speed | canvas-11 |
| Error Count | canvas-12 |
| Scan Start Time | canvas-12 |
| Summary Last Updated | canvas-12 |
| Warning Events | canvas-12 |
| Accept-Encoding Header | canvas-13 |
| Accept-Language Header | canvas-13 |
| Ad Blocker Detected | canvas-13 |
| Ad Blocker Detection Method | canvas-13 |
| Advanced Fingerprint & Leak Detection | canvas-13 |
| Audio Entropy Score | canvas-13 |
| Audio Fingerprint Hash | canvas-13 |
| Audio Fingerprint Support | canvas-13 |
| Audio Hardware Variance | canvas-13 |
| Audio Input Devices | canvas-13 |
| Audio Output Devices | canvas-13 |
| Audio Sample Rate | canvas-13 |
| Automation Signals | canvas-13 |
| Bot & Automation | canvas-13 |
| Bot Detection Confidence | canvas-13 |
| Canvas Fingerprint Hash | canvas-13 |
| Canvas Fingerprint Support | canvas-13 |
| Canvas Rendering Anomaly | canvas-13 |
| ClientRects Hash | canvas-13 |
| ClientRects Support | canvas-13 |
| Color Scheme Preference | canvas-13 |
| Default Voice | canvas-13 |
| Detected Extension Names | canvas-13 |
| Display Mode | canvas-13 |
| Environment Signals | canvas-13 |
| Extension Detection Method | canvas-13 |
| Extensions Detected | canvas-13 |
| Fingerprinting Surface | canvas-13 |
| Font Detection Method | canvas-13 |
| Font Uniqueness Score | canvas-13 |
| Fonts Detected | canvas-13 |
| GPS Accuracy Radius | canvas-13 |
| GPS Latitude | canvas-13 |
| GPS Longitude | canvas-13 |
| GPS vs IP Location Match | canvas-13 |
| Geolocation | canvas-13 |
| Geolocation Permission | canvas-13 |
| How Easily Can You Be Tracked? | canvas-13 |
| IPv6 Connectivity | canvas-13 |
| IPv6 Detection Source | canvas-13 |
| IPv6 Leak Detected | canvas-13 |
| Incognito Detection Method | canvas-13 |
| Leak & Network Signals | canvas-13 |
| Math Engine Consistency | canvas-13 |
| Math Engine Hash | canvas-13 |
| Media Queries Matched | canvas-13 |
| Media Queries Tested | canvas-13 |
| Notable Fonts Found | canvas-13 |
| Private Browsing Detected | canvas-13 |
| Reduced Motion Preference | canvas-13 |
| Speech Synthesis Voice Count | canvas-13 |
| Sub-Pixel Rendering Variance | canvas-13 |
| Total Headers Sent | canvas-13 |
| Video Input Devices | canvas-13 |
| Voice List Hash | canvas-13 |
| Webdriver Detected | canvas-13 |
| Hosting Flag | canvas-2 |
| IPv6 Location (Database) | canvas-2 |
| ISP | canvas-2 |
| Location Accuracy | canvas-2 |
| Organization | canvas-2 |
| Other Address | canvas-2 |
| Other Address Location | canvas-2 |
| Proxy Flag | canvas-2 |
| Datacenter Routing Detected | canvas-3 |
| Detection Confidence | canvas-3 |
| Primary Detection Source | canvas-3 |
| TOR Exit Node Detected | canvas-3 |
| Bandwidth | canvas-4 |
| Network API Status | canvas-4 |
| Session Uptime | canvas-4 |
| Architecture | canvas-5 |
| Bitness | canvas-5 |
| Browser Engine | canvas-5 |
| Color Depth | canvas-5 |
| Color Gamut | canvas-5 |
| Detection Source | canvas-5 |
| Pointer Support | canvas-5 |
| Depth Buffer Bits | canvas-6 |
| Instanced Rendering | canvas-6 |
| Max Viewport Size | canvas-6 |
| Multiple Draw Buffers | canvas-6 |
| Stencil Buffer Bits | canvas-6 |
| WebGL Extensions Count | canvas-6 |
| WebGPU Supported | canvas-6 |
| Local IP Leak | canvas-7 |
| localStorage Access | canvas-7 |
| sessionStorage Access | canvas-7 |
| Capabilities Detected | canvas-8 |
| Storage Usage | canvas-8 |
| Font Count | canvas-9 |
| Image Count | canvas-9 |
| Next Hop Protocol | canvas-9 |
| Percentile Rating | canvas-9 |
| Resource Count | canvas-9 |
| Script Count | canvas-9 |
| Stylesheet Count | canvas-9 |
| Timing Source | canvas-9 |

### Deep-dive pages (strings not already listed above)

| String | Pages |
|---|---|

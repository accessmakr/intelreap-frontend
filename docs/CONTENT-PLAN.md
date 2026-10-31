# IntelReap Content Plan (living document)

Maintained alongside the work. Update the Status column and the Change log whenever a page is built, merged or retrofitted.

Source data: `docs/keyword-map-v2.md` (Semrush exports supplied by the owner; only the first 10 rows of each export block were available).

## Page template (every new page and every retrofit)

1. One H1, a short quick-answer H2 plus a 40 to 60 word answer, then a TOC with jump links.
2. Exactly one primary panel pointer (CTA block) and one inline tool (tier below). If no honest tool exists, use an interactive checklist.
3. 4 to 5 inline SVG diagrams (theme-aware, with title and aria-label), section-spaced, plus at least one comparison table.
4. Logic and Methodology blocks, primary-source citations (RFCs, vendor docs, standards), at least 8 FAQs with FAQPage schema.
5. 8 to 12 contextual internal links, hub to spoke and spoke to spoke, only to pages that exist.
6. Head: unique title (about 60 chars), description (about 155), canonical, hreflang, OG and Twitter with a per-page 1200x630 image and alt text, article:* meta, JSON-LD (WebPage, Article with real wordCount and citations, BreadcrumbList, FAQPage).
7. Real dates only: `data-fixed="true"` on the freshness badge pins the page's actual date (site-wide default is a single constant).
8. Verified before merge: tag balance, JSON-LD parse, anchors, internal link targets, widget JS syntax, emulated phone render (light and dark) with no horizontal overflow.

## Tool tiers

- T1 reuse existing Worker endpoints (ip-identity, proxy-intelligence, ipv6-check, headers-echo)
- T2 client-side only (calculators, parsers, step pickers)
- T3 browser measurement (latency, speed, DoH timing)
- T4 needs a new data source or Worker route (DoH approved by the owner; arbitrary-IP lookup and reverse IP need backend work coordinated with the backend agent)

## A. Mapped pages (35 entries: 32 new, 3 retargets of existing pages)

| ID | Page | URL (proposed) | Type | Wave | Keywords | Total vol (visible) | Primary keyword | Primary panel | Inline tool | Tier | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| HUB | How to Find an IP Address (retitle existing guide) | `/guides/how-to-find-ip-address-of-any-device` | retarget | 1 | 33 | 1,827,480 | how to find ip address | [network-identity](/intelligence/network-identity) | Live IP check | T1 | planned |
| P1 | What Is an IP Address and How Does It Work? | `/learn/what-is-an-ip-address` | new | 1 | 4 | 0 |  | [network-identity](/intelligence/network-identity) | Live IP check (built) | T1 | LIVE after deploy - merged to main 2026-10-31 |
| P2 | What Is My IP Address? | `/learn/what-is-my-ip-address` | new | 2 | 8 | 1,180 | what is my ip address nord | [network-identity](/intelligence/network-identity) | Full live check incl. IPv6 | T1 | planned |
| P3 | How to Find Your IP on iPhone and Android | `/learn/find-ip-address-on-iphone-android` | new | 2 | 8 | 260 | how to find an ip address on an iphone | [device](/intelligence/device) | OS-aware steps + live IP | T1 | planned |
| P4 | How to Find Your IP on Windows, Mac and Linux | `/learn/find-ip-address-on-windows-mac-linux` | new | 2 | 8 | 1,410 | how to lookup an ip address on a computer | [device](/intelligence/device) | OS-aware commands + live IP | T1 | planned |
| P5 | Does Your IP Address Change? Static vs Dynamic | `/learn/does-ip-address-change` | new | 2 | 8 | 0 |  | [network-identity](/intelligence/network-identity) | Live IP + local-only "changed since last visit" | T1 | planned |
| P6 | How to Change Your IP Address | `/learn/how-to-change-ip-address` | new | 3 | 11 | 0 |  | [vpn-proxy](/intelligence/vpn-proxy) | Before/after IP check | T1 | planned |
| P7 | How to Change Your IP on iPhone and Android | `/learn/change-ip-address-iphone-android` | new | 3 | 6 | 0 |  | [device](/intelligence/device) | OS-aware steps + IP check | T1 | planned |
| P8 | Change the IP of One Device (Windows 11, static/local) | `/learn/change-ip-address-one-device` | new | 2 | 3 | 0 |  | [network-route](/intelligence/network-route) | Subnet and static-IP planner | T2 | planned |
| P9 | How to Hide or Mask Your IP Address | `/learn/how-to-hide-ip-address` | new | 3 | 2 | 0 |  | [vpn-proxy](/intelligence/vpn-proxy) | "Is my IP hidden" check | T1 | planned |
| P10 | Can an IP Address Be Hacked? | `/learn/can-ip-address-be-hacked` | new | 3 | 2 | 0 |  | [security](/intelligence/security) | Exposure check (IP + WebRTC) | T1 | planned |
| P12 | What an Email or IP Reveals About a Sender (defensive) | `/learn/find-ip-address-from-email` | new | 3 | 22 | 9,890 | how to find someones ip address | [security](/intelligence/security) | Email-header analyzer (client-side) | T2 | planned |
| P13 | How to Find a Printer's IP Address | `/learn/find-printer-ip-address` | new | 1 | 9 | 0 |  | [network-identity](/intelligence/network-identity) | OS/brand step picker (no live detection possible) | T2 | planned |
| P14 | How to Find Your Router's IP Address | `/learn/find-router-ip-address` | new | 1 | 7 | 0 |  | [network-route](/intelligence/network-route) | OS step picker + default-gateway table | T2 | planned |
| P15 | How to Find a Roku's IP Address | `/learn/find-roku-ip-address` | new | 3 | 2 | 0 |  | [device](/intelligence/device) | Step picker | T2 | planned |
| P16 | Can't Get a Teredo IP Address (Xbox/Windows) | `/learn/cant-get-teredo-ip-address` | new | 3 | 4 | 0 |  | [live-network](/intelligence/live-network) | Interactive checklist | T2 | planned |
| P17 | Can't Obtain IP Address Within Time Limit | `/learn/cant-obtain-ip-address-within-time-limit` | new | 3 | 1 | 0 |  | [live-network](/intelligence/live-network) | Interactive checklist | T2 | planned |
| P18 | How to Find a Website's IP Address | `/learn/find-website-ip-address` | new | 3 | 5 | 1,890 | how to find ip of website | [network-route](/intelligence/network-route) | Domain-to-IP lookup via public DoH | T4 | planned |
| P19 | IP Address Lookup: Location, Owner and Trace | `/learn/ip-address-lookup` | new | 3 | 27 | 9,800 | where is ip | [network-identity](/intelligence/network-identity) | Any-IP lookup (needs Worker route + data source) | T4 | planned |
| R1 | Reverse IP Lookup (retarget existing) | `/learn/what-is-reverse-ip-lookup` | retarget | 2 | 17 | 18,100 | reverse ip lookup | [network-route](/intelligence/network-route) | PTR lookup via DoH; domains-on-IP source TBD | T4 | planned |
| S1 | What Is a Good Internet Speed? | `/learn/what-is-a-good-internet-speed` | new | 1 | 5 | 33,200 | what is a good internet speed | [live-network](/intelligence/live-network) | Household speed-needs calculator | T2 | planned |
| S2 | Is 300 Mbps Fast? (50 to 1 Gig) | `/learn/is-300-mbps-fast` | new | 1 | 25 | 6,160 | is 300mbps fast | [live-network](/intelligence/live-network) | Mbps tier calculator (downloads, streams) | T2 | planned |
| S3 | What Is a Latency Test? | `/learn/what-is-a-latency-test` | new | 2 | 2 | 18,190 | what is a latency test | [live-network](/intelligence/live-network) | Latency test to the Worker | T3 | planned |
| S4 | How to Fix Slow Internet / Speed It Up | `/learn/how-to-fix-slow-internet` | new | 3 | 4 | 1,580 | how can i increase the speed of internet | [live-network](/intelligence/live-network) | Diagnosis checklist + latency check | T3 | planned |
| S5 | How to Test and Check Your Internet Speed | `/learn/how-to-test-internet-speed` | new | 3 | 17 | 7,491,300 | internet speed test | [performance](/intelligence/performance) | Speed test (existing engine) | T3 | planned |
| S6 | Does a VPN Slow Down Your Internet? | `/learn/does-vpn-slow-down-internet` | new | 3 | 1 | 1,000 | does vpn slow down internet speed | [vpn-proxy](/intelligence/vpn-proxy) | Before/after latency + IP check | T3 | planned |
| W0 | WebRTC Leak Test and Shield (retarget existing) | `/learn/webrtc-leak-test-and-shield` | retarget | 3 | 7 | 8,730 | webrtc control | [security](/intelligence/security) | WebRTC exposure check (existing) | T1 | planned |
| W1 | What Is WebRTC and How Does It Work? | `/learn/what-is-webrtc` | new | 2 | 24 | 14,290 | webrtc | [security](/intelligence/security) | WebRTC exposure check | T1 | planned |
| W2 | How to Enable or Disable WebRTC | `/learn/enable-disable-webrtc` | new | 3 | 15 | 1,000 | how to disable webrtc on chrome | [security](/intelligence/security) | Per-browser guide + test | T1 | planned |
| D1 | How to Fix Slow DNS Lookup | `/learn/how-to-fix-slow-dns-lookup` | new | 1 | 1 | 60,500 | how to fix slow dns lookup | [live-network](/intelligence/live-network) | DoH resolver timing benchmark | T3 | planned |
| D2 | What Is My DNS Server? | `/learn/what-is-my-dns-server` | new | 2 | 18 | 5,470 | what is my dns server | [network-identity](/intelligence/network-identity) | Resolver test via DoH + OS commands | T4 | planned |
| D3 | DNS Lookup: What It Is and How to Run One | `/learn/dns-lookup` | new | 3 | 10 | 43,530 | dns lookup | [network-route](/intelligence/network-route) | DNS record lookup via DoH | T4 | planned |
| D4 | nslookup and dig: Commands and Examples | `/learn/nslookup-and-dig` | new | 3 | 5 | 1,930 | what does nslookup do | [network-route](/intelligence/network-route) | Command builder + DoH lookup | T4 | planned |
| D5 | A Records and MX Records Explained | `/learn/a-record-and-mx-record` | new | 3 | 8 | 3,330 | a record lookup | [network-route](/intelligence/network-route) | A/MX lookup via DoH | T4 | planned |
| D6 | Reverse DNS (PTR) Lookup Explained | `/learn/reverse-dns-lookup` | new | 2 | 9 | 6,330 | reverse dns lookup | [network-route](/intelligence/network-route) | PTR lookup via DoH | T4 | planned |

Excluded from pages: ISP/lead-gen rows (X-ISP) and off-topic or developer-bug rows (X-NOISE); see the keyword map.

Known data caveats: the same phrase shows different KD in different rows (for example "test internet speed" KD 10 vs "test my internet speed" KD 100; "what is good internet speed" KD 8 vs "what is a good internet speed" KD 52); settle by SERP check before committing a title. Volumes are as exported and unverified.

## B. Existing pages (retrofit to the template, Wave R)

| URL | Current title | Related map entry | Status |
|---|---|---|---|
| `/learn/can-you-have-two-isps-in-one-house` | Can You Have Two Internet Providers in One House? | ISP-list row (10 searches; already covered) | retrofit pending |
| `/learn/does-a-vpn-change-your-mac-address` | Does a VPN Change or Hide Your MAC Address? | Linked from P1 | retrofit pending |
| `/learn/how-to-protect-your-privacy-online` | How to Protect Your Privacy Online | - | retrofit pending |
| `/learn/webrtc-leak-test-and-shield` | WebRTC Leak Test and How to Shield Your IP | W0 (retarget) | retrofit pending |
| `/learn/what-is-a-gpu` | What Is a GPU? Explained Simply | - | retrofit pending |
| `/learn/what-is-a-vpn-concentrator` | What Is a VPN Concentrator? | - | retrofit pending |
| `/learn/what-is-device-fingerprinting` | What Is Device Fingerprinting? How to Block It | - | retrofit pending |
| `/learn/what-is-reverse-ip-lookup` | What Is Reverse IP Lookup? | R1 (retarget) | retrofit pending |
| `/learn/what-is-vpn-passthrough` | What Is VPN Passthrough? PPTP and IPsec Explained | - | retrofit pending |
| `/learn/why-does-my-internet-speed-fluctuate` | Why Does My Internet Speed Fluctuate? | S4/S6 (avoid cannibalization) | retrofit pending |
| `/guides/gpu-troubleshooting-guide` | GPU Troubleshooting: Common Questions Answered | - | retrofit pending |
| `/guides/how-to-enable-webgl` | How to Enable WebGL in Chrome, Firefox and Safari | - | retrofit pending |
| `/guides/how-to-find-ip-address-of-any-device` | How to Find the IP Address of Any Device | HUB (retarget; splits out P13, P14, P15) | retrofit pending |
| `/intelligence/capability` | Capability Matrix | IntelReap | - | retrofit pending |
| `/intelligence/device` | Device Intelligence Panel | IntelReap | - | retrofit pending |
| `/intelligence/fingerprinting` | Fingerprint and Leak Detection Panel Explained | - | retrofit pending |
| `/intelligence/graphics` | Graphics Engine Panel | IntelReap | - | retrofit pending |
| `/intelligence/live-feed` | Live Intelligence Feed — What Just Happened? | IntelReap | - | retrofit pending |
| `/intelligence/live-network` | Live Network Monitor Explained | - | retrofit pending |
| `/intelligence/network-identity` | Network Identity Panel Explained | - | retrofit pending |
| `/intelligence/network-route` | ASN and Network Route Intelligence Explained | - | retrofit pending |
| `/intelligence/performance` | Performance Intelligence Panel Explained | - | retrofit pending |
| `/intelligence/rendering-speed` | Browser and Rendering Speed Panel Explained | - | retrofit pending |
| `/intelligence/scoreboard` | Global Intelligence Scoreboard Explained | - | retrofit pending |
| `/intelligence/security` | Security & Privacy Panel | IntelReap | - | retrofit pending |
| `/intelligence/vpn-proxy` | VPN, Proxy and Routing Panel Explained | - | retrofit pending |

## C. Backend notes (read-only observations; another agent owns the backend repo)

- `accessmakr/intelreap-backend`, branch `cloudflare-worker` (active 30 Oct 2026): Worker `src/worker.js` with routes health, ip-identity, ip-deep, proxy-intelligence, ai-summary, headers-echo, ipv6-check.
- On Workers, geolocation comes from `request.cf` (the caller only); MaxMind is shimmed out. So arbitrary-IP lookup and reverse IP are not possible with the current routes.
- CORS allowlist: intelreap.com, www.intelreap.com, local origins, plus the `ALLOWED_ORIGINS` env var. Preview-domain origins are blocked until added there, so live tools show the calm fallback on previews.
- The frontend config already points at the workers.dev Worker.

## D. Change log

- 2026-10-30: keyword map v2 (327 visible new rows, 277 unique + 48 ISP-list; 338 assigned, 80 excluded). Reference page P1 built on branch `content/what-is-an-ip-address` (5 diagrams, 2 tables, 10 FAQs, live check). Render-tested on an emulated Pixel 7, light and dark. Fixed during testing: head splice bug, stale JSON-LD keywords and wordCount, per-page OG image added, fixed freshness date (guard added in js/root-config.js), table and diagram spacing on mobile.
- 2026-10-31: merged P1 to main (after merging the latest main into the branch, no conflicts); added the .html to clean-URL redirect in netlify.toml.

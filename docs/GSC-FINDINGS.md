# Search Console findings (export dated 2026-11-01, range 2026-07-31 to 2026-10-30)

Source: the `All_keywords.txt` file the owner uploaded (Top pages and Top queries from Search Console, 3 months). Pages total 26,436 impressions and 83 clicks. The query list holds only the top 500 queries (8,356 impressions, 18 clicks), with no page-to-query mapping, so a query missing from it is not proof of no demand.

## Pages
| Page | Clicks | Impressions | CTR | Avg position |
|---|---|---|---|---|
| `/guides/how-to-enable-webgl` | 29 | 6,552 | 0.4% | 6.0 |
| `/learn/can-you-have-two-isps-in-one-house` | 13 | 8,059 | 0.2% | 8.2 |
| `/` | 10 | 63 | 15.9% | 12.1 |
| `/learn/webrtc-leak-test-and-shield` | 9 | 1,092 | 0.8% | 16.7 |
| `/learn/does-a-vpn-change-your-mac-address` | 7 | 2,784 | 0.3% | 5.6 |
| `/learn/what-is-reverse-ip-lookup` | 6 | 3,048 | 0.2% | 17.3 |
| `/learn/why-does-my-internet-speed-fluctuate` | 2 | 2,581 | 0.1% | 8.9 |
| `/learn/what-is-a-vpn-concentrator` | 1 | 615 | 0.2% | 15.0 |
| `/learn/what-is-vpn-passthrough` | 1 | 424 | 0.2% | 20.3 |
| `/learn/what-is-device-fingerprinting` | 1 | 368 | 0.3% | 27.2 |
| `/guides/how-to-find-ip-address-of-any-device` | 1 | 230 | 0.4% | 22.1 |
| `/intelligence/vpn-proxy` | 1 | 24 | 4.2% | 26.6 |
| `/intelligence/live-feed.html` | 1 | 23 | 4.3% | 3.3 |
| `/intelligence/network-route` | 1 | 5 | 20% | 7.0 |
| `/guides/gpu-troubleshooting-guide` | 0 | 299 | 0% | 10.0 |
| `/learn/what-is-a-gpu` | 0 | 76 | 0% | 13.4 |

## What it shows
1. **High impressions, almost no clicks, at good positions.** Two-ISPs (8,059 impressions, position 8.2, 13 clicks), WebGL guide (6,552, 6.0, 29), MAC/VPN (2,784, 5.6, 7), speed fluctuation (2,581, 8.9, 2). CTR of 0.1 to 0.4% at those positions points to titles and descriptions that do not win the click, or to search features answering above the results. Each retrofit rewrites the title and description for the query actually seen, then tracks CTR.
2. **MAC/VPN page (D-3 evidence).** Nine MAC-address queries (344 impressions) are all about the core intent: "does a vpn change/hide my mac address". The off-topic sections have almost no demand: ExitLag 7 impressions across 2 queries; nothing for Steam, qBittorrent, incognito or Mac settings in the top 500. Safe to cut or move those sections.
3. **Two-ISPs page (D-3 evidence).** About 120 queries are variants of "can you have two isps / internet providers / wifi providers / broadband providers in one house", plus "more than one provider" and a router-specific "asuswrt merlin dual wan policy routing" (61 impressions, position 2.0). No query asks what ISP stands for, so section 08 can go. People say "wifi providers" and "broadband providers": use those words naturally.
4. **GPU guide (D-3 evidence).** Only two GPU queries (3 impressions) in the top 500 and 299 page impressions: no demonstrated demand for any of its nine sections, so there is no case to split it into many pages. Restructure it as one symptom-to-fix guide instead.
5. **WebGL guide is the best performer, driven by error text.** 77 queries (1,821 impressions) are browser or app error messages pasted into search: "webgpu is switched on in this browser but it found no usable graphics adapter" (652), "webgpu chrome found no usable graphics adapter (blocklisted driver or gpu process crash)" (337), "chrome found no usable graphics adapter" (259), WebGL2-unavailable messages, "webgl.force-enabled", "ignore-gpu-blocklist". Note WebGPU is a different API from WebGL. The retrofit should answer those exact errors first (blocklisted driver, GPU process crash, chrome://gpu, Firefox about:config settings), with a fix flow.
6. **Reverse IP is the biggest cluster.** "reverse ip lookup" 722 impressions (position 12.0), "reverse ip" 284, "ip reverse" 240, "ip reverse lookup" 160, "reverse lookup ip" 104, "reverse ip search" 83: tool intent, confirming the page needs a working tool and a tighter title.
7. **VPN passthrough and concentrator.** "vpn passthrough" 132 (position 25), "pptp passthrough" 34, "ipsec passthrough" 15, "l2tp passthrough" 4; "what is a vpn concentrator" 159 and "vpn concentrator" 108: cover each protocol explicitly on the passthrough page.
8. **WebRTC.** "webrtc leak test" 202 (position 26.8), "webrtc leak shield" 120, "webrtc leak" 75: tool-first intent.
9. **Speed fluctuation.** 69 queries (710 impressions), mostly "why does my internet speed fluctuate (so much)", best positions 3 to 10.
10. **Odd URLs.** Truncated variants of the two-ISPs URL (for example `/learn/can-you-one-house`, `/learn/can-you-top-isps-in-one-house`) and a trailing-slash version each show 1 to 3 impressions, and the repo has no custom 404 page. Low priority; check Search Console, Pages, for soft 404 or duplicate flags. The `.html` panel URLs in the list already have 301 redirects and canonical tags, so those are legacy impressions, not a problem.

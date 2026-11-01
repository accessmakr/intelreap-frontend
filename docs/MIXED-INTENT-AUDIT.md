# Mixed-intent audit (decision D-3): section by section

Read from the live files on 2026-11-01. "Serves page intent" means the section answers a question someone searching the page's main query would have. Nothing is cut, split or redirected until the Search Console check below is done.

## Safe procedure before touching any of these three indexed URLs
1. In Search Console open Performance, then Pages, filter to the one URL, open the Queries tab, set the range to 3 months, and export (or screenshot) the queries with clicks and impressions.
2. A section that is the only reason the page earns impressions for a query is kept or moved to its own page first; a section with no matching queries can be cut.
3. The three URLs stay as they are. Removed material is either deleted or moved to a new URL, with a short link from the old page. No redirects are needed because no indexed URL changes.
4. A split-out page is built only when Semrush shows demand for its query (seeds in `docs/SEMRUSH-SEEDS.md`) and goes through the normal one-at-a-time process.

## 1. `/learn/does-a-vpn-change-your-mac-address` (8 sections, 12 FAQs)
Primary intent: does a VPN change or hide my MAC address.

| Section | Words | Serves intent | Disposition | Standalone query to check in Semrush |
|---|---|---|---|---|
| 01 Why a VPN does not change your MAC | 304 | Yes | Keep (core) | - |
| 02 What a VPN changes and does not | 309 | Yes | Keep (core) | - |
| 03 Is ExitLag a VPN? | 244 | No (product comparison) | Move out; keep one comparison-table row | "is exitlag a vpn" |
| 04 Use a VPN in incognito mode | 291 | No (different question) | Move out or cut | "vpn in incognito mode" |
| 05 Buy Steam games cheaper with a VPN | 218 | No | Cut from this page. Advises breaking a store's regional terms; likely sensitive under AdSense publisher policies, so check the current policy text before any standalone version | "steam vpn cheaper games" (only if neutral framing is possible) |
| 06 Bind qBittorrent to a VPN | 253 | No | Cut from this page. Torrenting configuration is policy-sensitive for ads; a standalone page, if ever, must be neutral and lawful-use framed | "qbittorrent bind vpn" |
| 07 Find VPN and device management on a Mac | 328 | No | Move out or cut | "find vpn settings mac" |
| 08 Privacy tool comparison table | 219 | Partly | Keep, trimmed to rows that bear on MAC (VPN, MAC randomisation, private Wi-Fi address) | - |

FAQs: keep the four about MAC (does a VPN change/hide it, can websites see it, what a VPN changes). The ExitLag, incognito, Steam, qBittorrent and Mac-settings FAQs leave with their sections.

Result: a focused page of about 830 words plus FAQs. What it should add (all to be verified against Apple and Google docs): how phone MAC randomisation works (Private Wi-Fi Address on iPhone, randomised MAC on Android), what the router sees versus what a website sees, MAC exposure on public Wi-Fi, a layers diagram (MAC on the local link, IP across the internet).

## 2. `/guides/gpu-troubleshooting-guide` (10 sections)
Primary intent: there is none. The page answers nine separate questions; each is its own search.

| Section | Words | Own query | Disposition |
|---|---|---|---|
| 01 What does a GPU do | 174 | Duplicates the "What is a GPU" article | Remove; link to that article |
| 02 Why is my GPU usage so high | 379 | "gpu usage high" | Keep in the guide as the lead symptom |
| 03 Reset your GPU without rebooting | 266 | "reset gpu", "win ctrl shift b" | Keep as a short answer in the guide |
| 04 Motherboard damage from a GPU | 361 | niche | Check demand; otherwise trim |
| 05 What "Ti" means in GPU names | 202 | "ti meaning gpu" | Definition, not troubleshooting: move out |
| 06 What undervolting does | 252 | "undervolt gpu" | Own query: candidate standalone |
| 07 Hardware Accelerated GPU Scheduling | 255 | "hardware accelerated gpu scheduling" | Own query: candidate standalone |
| 08 Is Minecraft CPU or GPU intensive | 394 | "minecraft cpu or gpu" | Own query: candidate standalone |
| 09 Remove your GPU when moving a PC | 224 | "remove gpu when moving pc" | Own query: candidate standalone |
| 10 Issue reference table | 327 | - | Becomes the core: symptom, likely cause, fix |

Recommended shape: the guide becomes "GPU Troubleshooting: Symptom to Fix", a table plus short answers for symptoms (high usage, freeze/black screen, artefacts, crashes), linking to focused pages. The standalone candidates are built only where Semrush shows demand, one at a time. Until then the long sections stay live so no indexed content disappears.

## 3. `/learn/can-you-have-two-isps-in-one-house` (11 sections)
Correction to my earlier summary: this page is mostly on-topic. Only one section is off-intent.

| Section | Words | Serves intent | Disposition |
|---|---|---|---|
| 01 What it means | 199 | Yes | Keep |
| 02 Is it legal | 167 | Yes | Keep |
| 03 Dual-WAN router | 343 | Yes | Keep; merge with 05 |
| 04 One ISP vs two table | 130 | Yes | Keep |
| 05 Router types | 175 | Yes | Merge into 03 |
| 06 Check which ISPs are available | 264 | Yes | Keep, shorter; make it country-neutral (it leans on the US FCC map and the site is global) |
| 07 Setup steps | 380 | Yes | Keep (core); audit steps |
| 08 What does ISP stand for | 242 | No | Cut; a standalone "what is an ISP" only if Semrush shows demand |
| 09 Will it double my speed | 173 | Yes | Keep (key misconception) |
| 10 Load balancing vs failover vs bonding | 201 | Yes | Keep; avoid repeating 09 |
| 11 Cost | 236 | Yes | Keep, shorter |

The supplied Semrush data shows 10 searches for this exact phrase, so the page is worth a clean-up, not a major investment.

# IntelReap Quality Queue (retrofit and new articles, one at a time)

Status: DRAFT for owner approval. Companion to `docs/CONTENT-PLAN.md` (ledger) and `docs/keyword-map-v2.md` (keyword data). Written 2026-11-01 from a fresh audit of all 26 existing pages and the Semrush exports supplied.

## 1. Decisions (updated 2026-11-01 after the owner's answers)

- **D-1 Panels stay tool-pointer pages (resolved).** The 13 panels remain tools that articles point to. Concept explanation lives in articles; panels link out to them. Consequently the "What is my IP address" page (P2) stays a planned article, built last, that explains the answer, offers a live check and points to the Network Identity panel. The earlier suggestion to turn the panel into that article is withdrawn.
- **D-2 Merge versus duplicate (resolved without redirects).** The planned S4 (slow internet) and W2 (enable/disable WebRTC) do not exist as URLs, so nothing indexed is affected. Their content goes into the existing indexed articles A4 and A3 only where it fits that article's intent; anything that does not fit is later built as its own narrow page. No existing indexed URL is changed, moved or redirected. The four new pages already in the sitemap keep their URLs.
- **D-3 Mixed-intent pages (analysed, awaiting Search Console check).** See `docs/MIXED-INTENT-AUDIT.md`: section-by-section dispositions for the MAC/VPN article, the GPU guide and the two-ISPs article, and the safe procedure (export each page's queries from Search Console first, then cut or move).
- **D-4 Backend routes (plan below, awaiting go-ahead).**
- **D-5 Scoreboard and Live Feed (retracted).** Nothing is wrong with them; they stay tool-pointer pages. My noindex suggestion had no evidence behind it. The only open question is whether Search Console reports them as indexed, which the owner can check in Pages (Indexing).
- **D-6 Semrush seeds (listed).** See `docs/SEMRUSH-SEEDS.md`. Items 1 to 11 of the sequence need no new data.

### Backend plan for the lookup tools (D-4)
- **What exists:** the Worker (`cloudflare-worker` branch of the backend repo) has six routes. Location data comes from Cloudflare for the caller only, so it cannot look up an arbitrary IP. The backend agent is active (latest commit 2026-10-31).
- **Can I test routes here?** Yes: Wrangler 4.156 installs and runs in the sandbox, so new routes can be tested locally before anything is deployed.
- **Route 1, `/api/ip-lookup?ip=`:** accepts only public IPs (private, reserved and malformed input rejected, no user-supplied URLs), returns owner, network range, registered country and abuse contact from RDAP, cached for 24 hours, rate limited, same CORS allowlist. Phase 1 answers honestly as registration data, not user location.
- **City-level location:** needs a provider. Options (quotas and terms to be verified when the spec is written): a free-tier geolocation API called from the Worker with caching, or a downloadable database held outside the Worker. Needs the owner's choice.
- **Reverse IP "domains on this IP":** no free, reliable source exists. Phase 1 ships reverse DNS (PTR) lookups client-side through public DNS-over-HTTPS, with honest limits; domains-on-IP only if a paid or rate-limited source is approved.
- **DNS lookups:** no backend needed; the browser calls public DoH directly, as the slow-DNS tool already does.
- **Process:** new branch `claude/lookup-routes` cut from the latest `cloudflare-worker`, additive files plus one route-table line, local tests, then re-fetch and rebase immediately before merging so the other agent's commits are not overwritten. Merging triggers the Worker redeploy, so it happens only after tests pass. This is queue item 54, so it is not urgent.

## 2. The quality standard (every item below is checked before it counts as done)

1. **Intent fit.** Before drafting, list the queries mapped to the page, group them into the questions a reader arrives with and the worries behind them, and confirm the page answers each. Every H2 must serve the primary intent, or be cut or split out.
2. **Answer first.** A 40-60 word direct answer, then a live tool or the next step.
3. **Accuracy audit (no unverified claims).** Every command, menu path, number, threshold and product claim is checked against a primary source or removed. Unverifiable claims are labelled or cut. Rules of thumb are called that.
4. **Diagrams only where they teach.** Each diagram has a one-sentence purpose. If a table or list teaches it better, use that. Wide and phone versions are drawn separately.
5. **Tool and panel.** One primary panel pointer and one inline tool, honest about what a browser can and cannot measure.
6. **Structure.** TOC, answer-first, methodology and logic blocks, primary-source citations, 8+ FAQs that are real questions (no filler), comparison table where a comparison exists.
7. **Links.** About 5 contextual links in the body, each in a different paragraph, only to pages that exist.
8. **Length follows intent, not a target.** There is no word-count gate. A page is the right length when every reader question is answered and nothing is padded.
9. **SEO head.** Unique title (about 60 chars) and description (about 155), canonical, per-page OG image and alt text, article meta, JSON-LD with real word count and citations, real dates.
10. **Verification.** Verifier passes; desktop and phone renders inspected; phone review by the owner before the next item starts.

## 3. Sequence (owner-approved logic: finish live pages, then existing pages, then new articles)

Existing pages first (items 1 to 30), then new articles in value order (31 to 54). One at a time; the owner reviews each on a phone before the next starts. Items 1 to 11 need no new keyword data.

| # | Item |
|---|---|
| 1 | R0 Slow DNS: owner approval |
| 2 | R1 Router IP redo |
| 3 | R2 Printer IP redo |
| 4 | R3 What is an IP address redo |
| 5 | A1 Hub guide retitle and restructure |
| 6 | Network Identity panel (light, tool-pointer) |
| 7 | A2 Reverse IP article |
| 8 | A3 WebRTC leak article (absorbs enable/disable steps) |
| 9 | Security panel |
| 10 | A4 Speed fluctuation article (absorbs slow-internet steps) |
| 11 | Live Network panel |
| 12 | A10 WebGL guide (needs seeds) |
| 13 | Graphics panel |
| 14 | A8 What is a GPU (needs seeds) |
| 15 | A9 GPU troubleshooting restructure (needs seeds and Search Console queries) |
| 16 | A6 VPN and MAC article trim (needs Search Console queries) |
| 17 | VPN and Proxy panel |
| 18 | A7 Privacy article (needs seeds) |
| 19 | A11 Fingerprinting article (needs seeds) |
| 20 | Fingerprinting panel |
| 21 | A5 Two ISPs article (cut one section) |
| 22 | A12 VPN concentrator |
| 23 | A13 VPN passthrough |
| 24 | Network Route panel |
| 25 | Performance panel |
| 26 | Device panel |
| 27 | Capability panel |
| 28 | Rendering Speed panel |
| 29 | Scoreboard |
| 30 | Live Feed |
| 31 | NEW S1 Good internet speed |
| 32 | NEW S2 300 Mbps |
| 33 | NEW D2 My DNS server |
| 34 | NEW D6 Reverse DNS |
| 35 | NEW P5 Does IP change |
| 36 | NEW P8 Static IP one device |
| 37 | NEW S3 Latency test |
| 38 | NEW P2 What is my IP address |
| 39 | NEW P6 Change IP (P7 folded in if data agrees) |
| 40 | NEW P9 Hide IP |
| 41 | NEW S6 VPN slows internet |
| 42 | NEW W1 What is WebRTC |
| 43 | NEW P3 IP on phones |
| 44 | NEW P4 IP on computers |
| 45 | NEW P10 IP hacked |
| 46 | NEW P18 Website IP |
| 47 | NEW D3 DNS lookup |
| 48 | NEW D4 nslookup and dig |
| 49 | NEW D5 A and MX records |
| 50 | NEW P12 Email headers |
| 51 | NEW P15 Roku IP |
| 52 | NEW P16 Teredo |
| 53 | NEW P17 Time limit error |
| 54 | NEW P19 IP lookup (after backend, D-4) |

## 4. Retrofit queue: existing pages (26) plus the four rebuilt today

Metrics are from the audit. "Defects" come from headings, structure and metrics; each page gets a full line-by-line accuracy audit when its turn comes.


### R0 Slow DNS lookup (live, rebuilt)
- **URL:** `/learn/how-to-fix-slow-dns-lookup`
- **Current state:** Built 1,570 words incl. FAQ, 5 purpose-designed diagrams, DoH timing tool, 11 FAQs.
- **Mapped keywords:** 1 keywords; primary: how to fix slow dns lookup (60,500, KD 25, CPC 0)
- **Reader intent:** Reader feels pages are slow and wants to know if DNS is the cause and what to do.
- **Defects found:** Awaiting owner approval after phone review. Open items: confirm tool numbers on the owner's network are sensible (seen: round trip about 200 ms, penalty 0-17 ms).
- **Retrofit work:** Approve or list changes. No further work planned.

### R1 Router IP (live, built today)
- **URL:** `/learn/find-router-ip-address`
- **Current state:** Built: 974 body words, 6 diagrams (script-converted phone versions), 2 tables, 11 FAQs.
- **Mapped keywords:** 7 keywords
- **Reader intent:** Reader cannot open the router page, or wants to know which address is their router/gateway.
- **Defects found:** Old-method diagrams: "where each device shows it" and "default addresses" are lists, not diagrams; double-NAT figure does not show the ISP router public side or the two private subnets; gateway figure is trivial.
- **Retrofit work:** Replace the two list-diagrams with tables. Redraw: (a) LAN/WAN boundary with gateway, (b) modem vs router vs ISP boundary with which address sits on which side, (c) double NAT with both subnets and the public side. Re-audit every command and menu path. Re-check the "cannot open" table against real causes.
- **Diagrams (purpose of each):** Teaches: the gateway is the door between your private network and everything else (LAN/WAN boundary); Teaches: which box owns which address (modem/ONT, ISP router, your router); Teaches: how double NAT looks and how to recognise it by the router WAN address

### R2 Printer IP (live, built today)
- **URL:** `/learn/find-printer-ip-address`
- **Current state:** Built: 1,071 body words, 6 diagrams (script-converted phone versions), 3 tables, 11 FAQs.
- **Mapped keywords:** 9 keywords
- **Reader intent:** Reader needs the printer address to add it, fix "offline", or print from a device that cannot find it.
- **Defects found:** "Four ways" figure duplicates the methods table (list as diagram); LAN picture is decorative; steps not tested on real printers.
- **Retrofit work:** Remove or redraw duplicate figure as a real decision aid ("what can you reach right now?"). Redraw LAN figure to show the router mediating and why a changed address breaks printing. Keep ping flow and reservation figures after re-check. Add Linux/CUPS steps check, AirPrint note (phones print without an IP). Audit each Windows/Mac step.
- **Diagrams (purpose of each):** Teaches: choose the method by what you can reach (printer screen, a computer, the router); Teaches: why printing breaks when the printer address changes (saved address vs new lease); Teaches: ping result decides network fault vs driver/port fault

### R3 What is an IP address (live, built)
- **URL:** `/learn/what-is-an-ip-address`
- **Current state:** Built: 1,032 body words, 5 diagrams (script-converted phone versions), 4 tables, 12 FAQs.
- **Mapped keywords:** 4 keywords
- **Reader intent:** Reader wants a plain definition, then to understand public vs private, IPv4 vs IPv6, and what their address reveals.
- **Defects found:** Ranges and anatomy figures are list-like; IPv6 notation barely explained; no "see yours now" path beyond one tool; misconceptions section missing.
- **Retrofit work:** Add IPv6 notation rules (compression), misconceptions ("an IP identifies a person"), worked subnet example, how to see your own, privacy section. Redraw figures for what each teaches; ranges become a table only.
- **Diagrams (purpose of each):** Teaches: an address names a network and a device (network/host split with a real mask); Teaches: one public address shared by many private devices (NAT) with the address translation shown; Teaches: how a request travels and gets answered (source/destination swap); Teaches: how a device gets its address (DHCP) in one picture

### A1 HUB: How to Find an IP Address (retitle)
- **URL:** `/guides/how-to-find-ip-address-of-any-device`
- **Current state:** 1843 words, 8 sections, 1 table(s), 0 diagrams, 12 FAQs, 4 in-text links, no TOC
- **Mapped keywords:** 33 keywords; primary: how to find ip address (1,800,000, KD 27, CPC 1.12)
- **Reader intent:** Mostly "find MY IP address" (1.8M head term) plus find a device's, a website's or someone's.
- **Defects found:** Opens with local vs public instead of the answer; mixes printer, HP printer, Roku, CMD, lookup methods in one page; overlaps spokes P13/P14/P15; no live tool at top.
- **Retrofit work:** Retitle. Answer-first: live public IP at top, OS-aware steps for own IP, then "another device / a website / someone else" branches linking to spokes. Slim printer/Roku sections to summaries linking the spoke pages. Keep reference table.
- **Diagrams (purpose of each):** Teaches: pick your case (my IP / my device / another device / a website) and get routed; Teaches: local vs public vs gateway addresses on one home network

### A2 Reverse IP lookup (retarget)
- **URL:** `/learn/what-is-reverse-ip-lookup`
- **Current state:** 1818 words, 8 sections, 1 table(s), 0 diagrams, 12 FAQs, 4 in-text links, no TOC
- **Mapped keywords:** 17 keywords; primary: reverse ip lookup (5,400, KD 74, CPC 0.79)
- **Reader intent:** Tool intent: people type an IP and want domains hosted on it; some want PTR (reverse DNS).
- **Defects found:** Explainer without a tool; does not separate reverse IP (domains on an IP) from reverse DNS (PTR) up front.
- **Retrofit work:** Retitle "Reverse IP Lookup". Answer-first with a tool: PTR via public DoH now; "domains on this IP" only if a data source is approved (decision D-4). Honest limitations (CDNs, shared hosting, partial datasets).
- **Diagrams (purpose of each):** Teaches: forward DNS vs reverse DNS vs reverse IP, each answers a different question; Teaches: why many sites share one IP (shared hosting/CDN)

### A3 WebRTC leak test and shield (retarget)
- **URL:** `/learn/webrtc-leak-test-and-shield`
- **Current state:** 1556 words, 8 sections, 1 table(s), 0 diagrams, 12 FAQs, 4 in-text links, no TOC
- **Mapped keywords:** 7 keywords; primary: webrtc control (1,900, KD 47, CPC 2.28)
- **Reader intent:** Wants to test for a leak first, then fix it; some search for the extensions by name.
- **Defects found:** No test on the page; browser-specific disable steps need fact-checking (Chrome has no built-in switch; Firefox/Brave differ; Safari differs).
- **Retrofit work:** Test at top (existing WebRTC exposure engine). Verify each browser step against vendor docs; honest comparison of disable vs shield. Absorb the planned W2 "enable/disable" page (decision D-2).
- **Diagrams (purpose of each):** Teaches: how WebRTC can reveal an address even behind a VPN; Teaches: how to read a test result (what counts as a leak)

### A4 Why internet speed fluctuates
- **URL:** `/learn/why-does-my-internet-speed-fluctuate`
- **Current state:** 2690 words, 9 sections, 1 table(s), 0 diagrams, 12 FAQs, 4 in-text links, no TOC
- **Mapped keywords:** 4 keywords; primary: how can i increase the speed of internet (1,000, KD -, CPC 1.90)
- **Reader intent:** Speed is inconsistent and they want to find the cause and the fix.
- **Defects found:** 2,690 words across several intents (modem, router, boosters, 5G upload); no diagnostic tool.
- **Retrofit work:** Keep the fluctuation diagnosis. Cut or split boosters and 5G upload. Add live latency/jitter check (Live Network panel). Absorb planned S4 slow-internet page (decision D-2).
- **Diagrams (purpose of each):** Teaches: where on the path each cause sits (device, Wi-Fi, router, ISP, peak hours); Teaches: a step-by-step isolation test (wired vs Wi-Fi vs other device); Teaches: what a congestion evening looks like in latency/speed over time (illustrative)

### A5 Two ISPs in one house
- **URL:** `/learn/can-you-have-two-isps-in-one-house`
- **Current state:** 2621 words, 11 sections, 2 table(s), 0 diagrams, 12 FAQs, 4 in-text links, no TOC
- **Mapped keywords:** no Semrush data supplied
- **Reader intent:** Homeowner wants redundancy or more speed.
- **Defects found:** Scope creep ("what does ISP stand for"); keyword demand for this exact phrase is tiny in the supplied data (10 searches).
- **Retrofit work:** Focus on: is it allowed, failover vs load balancing, why speeds do not simply add, dual-WAN router, setup. Cut definitions. Decide whether the page deserves effort given low demand.
- **Diagrams (purpose of each):** Teaches: failover vs load balancing; Teaches: why two lines do not double one download

### A6 VPN and MAC address
- **URL:** `/learn/does-a-vpn-change-your-mac-address`
- **Current state:** 2245 words, 8 sections, 1 table(s), 0 diagrams, 12 FAQs, 4 in-text links, no TOC
- **Mapped keywords:** no Semrush data supplied
- **Reader intent:** Wants to know whether a VPN hides or changes the MAC address.
- **Defects found:** Sections on ExitLag, incognito VPN, Steam purchases, qBittorrent binding and device management are unrelated long-tail stuffing.
- **Retrofit work:** Keep: what a MAC is, why it never leaves the local network, what a VPN changes, MAC randomisation on phones. Cut or move the unrelated sections (decision D-3).
- **Diagrams (purpose of each):** Teaches: MAC lives on the local link, IP crosses the internet; Teaches: what the router, the website and the VPN each see

### A7 Protect your privacy online
- **URL:** `/learn/how-to-protect-your-privacy-online`
- **Current state:** 1859 words, 8 sections, 1 table(s), 0 diagrams, 12 FAQs, 4 in-text links, no TOC
- **Mapped keywords:** no Semrush data supplied
- **Reader intent:** Broad how-to; wants an ordered set of steps.
- **Defects found:** Generic listicle risk; no tie to the site's measurement tools.
- **Retrofit work:** Reframe as layered threat model: who can see what (ISP, sites, network, apps), what each step changes, how to check yourself with the Security and Fingerprinting panels. Verify claims.
- **Diagrams (purpose of each):** Teaches: who can see what at each layer; Teaches: which measure addresses which threat (matrix, as table)

### A8 What is a GPU
- **URL:** `/learn/what-is-a-gpu`
- **Current state:** 2054 words, 8 sections, 1 table(s), 0 diagrams, 12 FAQs, 4 in-text links, no TOC
- **Mapped keywords:** no Semrush data supplied
- **Reader intent:** Definition and "which GPU do I have".
- **Defects found:** No diagrams; "find your GPU" has no tool.
- **Retrofit work:** Add: GPU vs CPU parallelism, integrated vs dedicated memory, live "what GPU does my browser see" via the Graphics panel engine. Verify technical claims.
- **Diagrams (purpose of each):** Teaches: many simple workers vs few complex ones; Teaches: integrated shares system RAM, dedicated has VRAM

### A9 GPU troubleshooting
- **URL:** `/guides/gpu-troubleshooting-guide`
- **Current state:** 2914 words, 10 sections, 3 table(s), 0 diagrams, 12 FAQs, 4 in-text links, no TOC
- **Mapped keywords:** no Semrush data supplied
- **Reader intent:** Each of 9+ questions is its own search (high usage, reset GPU, undervolt, hardware acceleration, "Ti", Minecraft CPU/GPU).
- **Defects found:** A question dump: 9+ unrelated intents on one page, long (2,914 words).
- **Retrofit work:** Decision D-3: split into focused pages or keep as a short index with each answer linking out. Needs keyword data to choose.
- **Diagrams (purpose of each):** Teaches: diagnosis flow for high GPU usage

### A10 How to enable WebGL
- **URL:** `/guides/how-to-enable-webgl`
- **Current state:** 2115 words, 10 sections, 1 table(s), 0 diagrams, 13 FAQs, 4 in-text links, no TOC
- **Mapped keywords:** no Semrush data supplied
- **Reader intent:** WebGL is off or failing; wants it on.
- **Defects found:** No live check; browser steps unverified; "context could not be created" needs a flow.
- **Retrofit work:** Live "is WebGL on" check at top (Graphics/Capability engines). Verify each browser path. Add failure flow.
- **Diagrams (purpose of each):** Teaches: why WebGL fails (flow from symptom to fix)

### A11 Device fingerprinting
- **URL:** `/learn/what-is-device-fingerprinting`
- **Current state:** 2043 words, 7 sections, 1 table(s), 0 diagrams, 12 FAQs, 4 in-text links, no TOC
- **Mapped keywords:** no Semrush data supplied
- **Reader intent:** Wants to understand it and reduce it.
- **Defects found:** No diagram; no tie to the Fingerprinting panel.
- **Retrofit work:** Link to the live panel; add how signals combine; honest limits of blocking.
- **Diagrams (purpose of each):** Teaches: many weak signals combine into a strong identifier; Teaches: cookies vs fingerprints

### A12 VPN concentrator
- **URL:** `/learn/what-is-a-vpn-concentrator`
- **Current state:** 1924 words, 8 sections, 1 table(s), 0 diagrams, 12 FAQs, 4 in-text links, no TOC
- **Mapped keywords:** no Semrush data supplied
- **Reader intent:** Enterprise reader comparing concentrator, gateway, firewall.
- **Defects found:** No diagrams; B2B, low consumer demand.
- **Retrofit work:** Add topology diagrams; verify terminology.
- **Diagrams (purpose of each):** Teaches: remote-access vs site-to-site; Teaches: concentrator vs gateway vs firewall

### A13 VPN passthrough
- **URL:** `/learn/what-is-vpn-passthrough`
- **Current state:** 1916 words, 7 sections, 1 table(s), 0 diagrams, 12 FAQs, 4 in-text links, no TOC
- **Mapped keywords:** no Semrush data supplied
- **Reader intent:** Router setting question and failed VPN connections.
- **Defects found:** No diagrams; verify PPTP/IPsec statements.
- **Retrofit work:** Add NAT-breaks-tunnel diagram and a troubleshooting flow; verify.
- **Diagrams (purpose of each):** Teaches: why NAT can break IPsec/PPTP and what passthrough changes

### Panel pages (13): tool-pointer pages, kept that way

Owner directive: the panels are tools that articles point to. They must not drift into article pages. Allowed changes only: a short, plain "what this tool shows" answer at the top; a table of the signals the tool returns (what it is, where the data comes from, how reliable); a "how to read your result" note; links out to the articles that explain the concepts (those articles in turn point to the panel); FAQs about the tool and its data (4 to 8, real questions); methodology and data-freshness notes. Not allowed: tutorials, definitions-from-scratch, step-by-step fixes, or anything that belongs in an article. Existing panel text is reviewed for drift and trimmed if it has any.

Current state for all 13: 3 sections, 4 to 5 FAQs, no tables, no diagrams, no in-text links, 800 to 2,150 words. Diagrams on panels only where they explain how the tool measures (for example, how the data was collected), never the concept.

| Panel | Role | Articles that point here | Allowed upgrade |
|---|---|---|---|
| `/intelligence/network-identity` | Live public IP, ISP, location, connection type | What is an IP address, IP hub, change/hide IP, what is my IP | Signal table, reliability note (location is an estimate), links out |
| `/intelligence/network-route` | ASN, owner, route | Reverse IP, IP lookup, website IP, DNS | Signal table, data-freshness note (ASN classes refreshed weekly by the backend) |
| `/intelligence/vpn-proxy` | VPN/proxy detection | Hide IP, VPN slow-down, MAC/VPN | Table of mismatch signals, honest "never certain" note |
| `/intelligence/security` | WebRTC exposure and checks | WebRTC leak, what is WebRTC, privacy | Check table, what pass/fail means |
| `/intelligence/live-network` | Latency, jitter, loss | Latency test, slow DNS, speed fluctuation | Signal table, measurement notes |
| `/intelligence/performance` | Browser speed measurement | Speed articles | Method and limits note |
| `/intelligence/rendering-speed` | Page rendering metrics | (none yet) | Metric table (verify Google thresholds at the time) |
| `/intelligence/graphics` | GPU and WebGL data | What is a GPU, WebGL guide | Field table |
| `/intelligence/capability` | Browser capability matrix | WebGL guide | Capability table, verified |
| `/intelligence/device` | OS, browser, screen | Find IP by OS pages | Field table |
| `/intelligence/fingerprinting` | Fingerprint signals and leaks | Fingerprinting article, privacy | Signal table |
| `/intelligence/scoreboard` | Aggregate score | (none) | Explain how the score is computed |
| `/intelligence/live-feed` | Scan log | (none) | Explain what is and is not stored |

## 5. New article queue: from the harvested keywords (28 outstanding in the plan: 25 to build (P2 restored), 2 folded into existing articles, 1 deferred)

Built already: What is an IP address, Printer IP, Router IP, Slow DNS. Keyword counts and full keyword lists per page are in `docs/keyword-map-v2.md`. Tool tiers: T1 existing Worker endpoint, T2 client-side, T3 browser measurement, T4 needs a new data source or route.


### S1 What Is a Good Internet Speed?
- **URL:** `/learn/what-is-a-good-internet-speed`
- **Keywords:** 5 keywords; primary: what is a good internet speed (9,900, KD 52, CPC 3.68)
- **Questions to answer:** Decide how many Mbps they need; judge whether their plan is enough; "why is my test lower than my plan".
- **Tool:** Household speed-needs calculator (T2)
- **Diagrams (purpose of each):** Teaches: simultaneous activities add up (stacked demand vs plan); Teaches: download, upload and latency do different jobs
- **Notes:** Activity bandwidth figures must come from vendor sources at build. CPC is high ($4-7): keep it editorial, no ISP referral links.

### S2 Is 300 Mbps Fast? (50 Mbps to 1 Gig)
- **URL:** `/learn/is-300-mbps-fast`
- **Keywords:** 25 keywords; primary: is 300mbps fast (720, KD 13, CPC 12.74)
- **Questions to answer:** Is this tier enough for my household; how it compares with 100/500/1 Gig; Wi-Fi vs plan speed.
- **Tool:** Mbps tier calculator (T2)
- **Diagrams (purpose of each):** Teaches: what each tier supports for a typical household (one comparison); Teaches: the plan speed is not the device speed (Wi-Fi bottleneck)
- **Notes:** ~25 near-duplicate tier queries, KD 9-14, CPC up to $13: one page, not one per tier.

### D2 What Is My DNS Server?
- **URL:** `/learn/what-is-my-dns-server`
- **Keywords:** 18 keywords; primary: what is my dns server (1,000, KD 77, CPC 1.74)
- **Questions to answer:** Which DNS server am I using; is it my router or ISP; what is 8.8.8.8.
- **Tool:** Commands per OS (browser cannot read system DNS) + resolver test (T4)
- **Diagrams (purpose of each):** Teaches: where DNS settings live (device, router, ISP); Teaches: how to read the DNS line in ipconfig /all
- **Notes:** Be explicit that a browser cannot show your system resolver.

### D6 Reverse DNS (PTR) Lookup Explained
- **URL:** `/learn/reverse-dns-lookup`
- **Keywords:** 9 keywords; primary: reverse dns lookup (4,400, KD 61, CPC 4.55)
- **Questions to answer:** What it is, how to check one, why mail servers need it, who controls it.
- **Tool:** PTR lookup via public DoH (T4)
- **Diagrams (purpose of each):** Teaches: forward vs reverse lookup and the reversed in-addr.arpa name; Teaches: mail-server PTR check flow
- **Notes:** Separate intent from reverse IP (A2).

### P5 Does Your IP Address Change?
- **URL:** `/learn/does-ip-address-change`
- **Keywords:** 8 keywords
- **Questions to answer:** When and why it changes; static vs dynamic; mobile vs home.
- **Tool:** Live IP plus local-only "changed since last visit" (T1)
- **Diagrams (purpose of each):** Teaches: lease and renewal over time; Teaches: what changes when you move between networks

### P8 Change the IP of One Device (Windows 11, static/local)
- **URL:** `/learn/change-ip-address-one-device`
- **Keywords:** 3 keywords
- **Questions to answer:** Set a static IP safely; reservation instead; undo it.
- **Tool:** Subnet and static-IP planner (T2)
- **Diagrams (purpose of each):** Teaches: the router pool vs the safe range for a fixed address
- **Notes:** Includes the "Spectrum internal address" query.

### S3 What Is a Latency Test?
- **URL:** `/learn/what-is-a-latency-test`
- **Keywords:** 2 keywords; primary: what is a latency test (18,100, KD 47, CPC 0)
- **Questions to answer:** Latency vs ping vs jitter vs loss; what is good for games and calls.
- **Tool:** Latency test to the Worker (T3)
- **Diagrams (purpose of each):** Teaches: round trip time; Teaches: jitter is variation in latency, not a higher number
- **Notes:** 18.1K searches. Cite ITU-T G.114 for voice delay if used.

### P3 Find Your IP on iPhone and Android
- **URL:** `/learn/find-ip-address-on-iphone-android`
- **Keywords:** 8 keywords; primary: how to find an ip address on an iphone (260, KD 44, CPC 0)
- **Questions to answer:** Which IP they mean (Wi-Fi private, public, mobile data); steps; "do phones have IPs".
- **Tool:** OS-aware steps plus live public IP (T1)
- **Diagrams (purpose of each):** Teaches: a phone has more than one address and which is which

### P4 Find Your IP on Windows, Mac and Linux
- **URL:** `/learn/find-ip-address-on-windows-mac-linux`
- **Keywords:** 8 keywords; primary: how to lookup an ip address on a computer (590, KD 56, CPC 1.07)
- **Questions to answer:** Own local and public IP by OS.
- **Tool:** OS-aware commands plus live public IP (T1)
- **Diagrams (purpose of each):** none planned; use tables
- **Notes:** Overlaps hub A1; keep to OS command detail.

### P6 How to Change Your IP Address
- **URL:** `/learn/how-to-change-ip-address`
- **Keywords:** 11 keywords
- **Questions to answer:** Which IP they want changed; what works, what does not.
- **Tool:** Before/after check (T1)
- **Diagrams (purpose of each):** Teaches: which address you are changing (public vs private); Teaches: release and renew sequence
- **Notes:** Highest-volume change query, 4.4K.

### P7 Change Your IP on iPhone and Android
- **URL:** `/learn/change-ip-address-iphone-android`
- **Keywords:** 6 keywords
- **Questions to answer:** Mobile cases.
- **Tool:** OS steps plus check (T1)
- **Diagrams (purpose of each):** none planned; use tables
- **Notes:** Consider merging into P6.

### P9 How to Hide or Mask Your IP Address
- **URL:** `/learn/how-to-hide-ip-address`
- **Keywords:** 2 keywords
- **Questions to answer:** Methods and honest limits (VPN, proxy, Tor; leaks).
- **Tool:** "Is my IP hidden" check (T1)
- **Diagrams (purpose of each):** Teaches: what each method hides and what still leaks
- **Notes:** CPC $2.4. Compare by method, not by brand.

### S6 Does a VPN Slow Down Your Internet?
- **URL:** `/learn/does-vpn-slow-down-internet`
- **Keywords:** 1 keywords; primary: does vpn slow down internet speed (1,000, KD 53, CPC 1.45)
- **Questions to answer:** Why and how much; how to test.
- **Tool:** Before/after latency and IP check (T3)
- **Diagrams (purpose of each):** Teaches: the extra hop and encryption overhead

### W1 What Is WebRTC and How Does It Work?
- **URL:** `/learn/what-is-webrtc`
- **Keywords:** 24 keywords; primary: webrtc (12,100, KD 89, CPC 2.92)
- **Questions to answer:** Definition, uses, security, which apps use it.
- **Tool:** WebRTC exposure check (T1)
- **Diagrams (purpose of each):** Teaches: peer-to-peer setup (STUN/TURN/ICE) in one picture
- **Notes:** Many small queries; verify app claims (for example Zoom, Teams).

### P10 Can an IP Address Be Hacked?
- **URL:** `/learn/can-ip-address-be-hacked`
- **Keywords:** 2 keywords
- **Questions to answer:** What an attacker can and cannot do with your IP.
- **Tool:** Exposure check (T1)
- **Diagrams (purpose of each):** Teaches: what an IP exposes vs what needs another weakness
- **Notes:** Avoid fear marketing.

### P12 What an Email or IP Reveals About a Sender (defensive)
- **URL:** `/learn/find-ip-address-from-email`
- **Keywords:** 22 keywords; primary: how to find someones ip address (1,900, KD 40, CPC 1.20)
- **Questions to answer:** Read email headers; what is and is not discoverable.
- **Tool:** Email-header analyzer, client-side (T2)
- **Diagrams (purpose of each):** Teaches: reading Received headers hop by hop
- **Notes:** Policy-sensitive. Defensive framing only; no tracking how-to.

### P15 How to Find a Roku's IP Address
- **URL:** `/learn/find-roku-ip-address`
- **Keywords:** 2 keywords
- **Questions to answer:** Roku menu path and router fallback.
- **Tool:** Step picker (T2)
- **Diagrams (purpose of each):** none planned; use tables
- **Notes:** Tiny volume (590).

### P16 Can't Get a Teredo IP Address (Xbox/Windows)
- **URL:** `/learn/cant-get-teredo-ip-address`
- **Keywords:** 4 keywords
- **Questions to answer:** Fix Teredo errors and Xbox NAT type.
- **Tool:** Checklist (T2)
- **Diagrams (purpose of each):** Teaches: troubleshooting flow
- **Notes:** Verify netsh steps on current Windows.

### P17 Can't Obtain IP Address Within Time Limit
- **URL:** `/learn/cant-obtain-ip-address-within-time-limit`
- **Keywords:** 1 keywords
- **Questions to answer:** Fix the error.
- **Tool:** Checklist (T2)
- **Diagrams (purpose of each):** Teaches: DHCP failure flow
- **Notes:** Confirm exact context at build by SERP.

### P18 How to Find a Website's IP Address
- **URL:** `/learn/find-website-ip-address`
- **Keywords:** 5 keywords; primary: how to find ip of website (720, KD 61, CPC 2.01)
- **Questions to answer:** Resolve a domain; what CDNs change.
- **Tool:** Domain-to-IP via public DoH (T4)
- **Diagrams (purpose of each):** Teaches: why a CDN IP is not the origin server

### P19 IP Address Lookup: Location, Owner and Trace
- **URL:** `/learn/ip-address-lookup`
- **Keywords:** 27 keywords; primary: where is ip (1,900, KD 67, CPC 0.17)
- **Questions to answer:** Where an IP is, who owns it, how accurate.
- **Tool:** Any-IP lookup (T4: needs Worker route and data source)
- **Diagrams (purpose of each):** Teaches: how location is inferred and why it is approximate
- **Notes:** Blocked on backend (decision D-4). Largest keyword cluster.

### D3 DNS Lookup: What It Is and How to Run One
- **URL:** `/learn/dns-lookup`
- **Keywords:** 10 keywords; primary: dns lookup (33,100, KD 66, CPC 3.35)
- **Questions to answer:** Run lookups; understand record types.
- **Tool:** DNS record lookup via DoH (T4)
- **Diagrams (purpose of each):** Teaches: record types at a glance (as table)
- **Notes:** Hub for D4 and D5.

### D4 nslookup and dig: Commands and Examples
- **URL:** `/learn/nslookup-and-dig`
- **Keywords:** 5 keywords; primary: what does nslookup do (480, KD 41, CPC 0.04)
- **Questions to answer:** Syntax and reading output.
- **Tool:** Command builder plus DoH (T4)
- **Diagrams (purpose of each):** Teaches: reading dig output field by field

### D5 A Records and MX Records Explained
- **URL:** `/learn/a-record-and-mx-record`
- **Keywords:** 8 keywords; primary: a record lookup (1,000, KD 68, CPC 7.42)
- **Questions to answer:** What they are; how to check.
- **Tool:** A/MX lookup via DoH (T4)
- **Diagrams (purpose of each):** Teaches: how mail finds a domain via MX

### P2 What Is My IP Address?
- **URL:** `/learn/what-is-my-ip-address` (article; points to the Network Identity panel, which stays a tool page)
- **Keywords:** 8 keywords; primary: what is my ip address nord (590, KD 64, CPC 0)
- **Questions to answer:** Immediate answer plus meaning.
- **Tool:** Panel tool
- **Diagrams (purpose of each):** none planned; use tables
- **Notes:** Explains and offers a live check; links to the panel for the full tool. Built after the existing pages.

### S4 How to Fix Slow Internet (content goes into A4 where it fits)
- **URL:** `(recommended: merge into A4)`
- **Keywords:** 4 keywords; primary: how can i increase the speed of internet (1,000, KD -, CPC 1.90)
- **Questions to answer:** Diagnosis.
- **Tool:** none
- **Diagrams (purpose of each):** none planned; use tables
- **Notes:** Decision D-2.

### W2 How to Enable or Disable WebRTC (content goes into A3 where it fits)
- **URL:** `(recommended: merge into A3)`
- **Keywords:** 15 keywords; primary: how to disable webrtc on chrome (320, KD 41, CPC 0)
- **Questions to answer:** Per-browser steps.
- **Tool:** none
- **Diagrams (purpose of each):** none planned; use tables
- **Notes:** Decision D-2.

### S5 How to Test and Check Your Internet Speed (deferred)
- **URL:** `/learn/how-to-test-internet-speed`
- **Keywords:** 17 keywords; primary: internet speed test (6,100,000, KD 100, CPC 0.14)
- **Questions to answer:** Head terms KD 100; long tail only.
- **Tool:** Speed engine (T3)
- **Diagrams (purpose of each):** none planned; use tables
- **Notes:** Deprioritise: head terms are unwinnable.

## 6. Cannibalisation map (one owner per query family)

| Query family | Owner page | Others must link, not compete |
|---|---|---|
| what is my IP address | Network Identity panel | What is an IP address (explains, does not answer live) |
| how to find IP address | Hub guide (A1) | Printer, router, phones, computers pages as spokes |
| change IP address | P6 | P7, P8, hide IP link in |
| reverse IP vs reverse DNS | A2 (reverse IP), D6 (PTR) | D3 |
| WebRTC leak test and disable | A3 with Security panel | W1 explains concept only |
| slow internet | A4 | S6, D1, S3 as spokes |
| latency, ping | S3 with Live Network panel | A4 links in |
| internet speed need | S1 | S2 for tiers |

## 7. Method per item

spec (intent map, diagrams with purposes, tool, source list) shown to the owner, then build, verifier, desktop and phone renders inspected, merge, ledger updated, owner phone review, next item. Nothing is built before its spec is approved.

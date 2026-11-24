# Handoff (2026-11-13)

## Access (no secrets stored here)
- Frontend repo: https://github.com/accessmakr/intelreap-frontend (branch `main` = production via Netlify).
- Backend repo: https://github.com/accessmakr/intelreap-backend (branch `cloudflare-worker`; another agent works there; read-only unless a plan says otherwise).
- The owner supplies a GitHub personal access token in chat. Clone with `https://x-access-token:<TOKEN>@github.com/accessmakr/<repo>.git`, then reset the remote URL. Never commit the token. Owner asked for no revoke advice.
- Sandbox: network allows github.com and npm/pypi; `pip install playwright` browsers are present; `npm i wrangler` works. Commit identity: `Claude (sandbox)`.

## AdSense review: rules until approval (requested 2026-11-12)
intelreap.com was submitted to Google AdSense on 2026-11-12. Review can take a few days to 4 weeks. Until AdSense approves the site, keep the live site stable and follow these rules. If anything here conflicts with another instruction, stop and ask the owner before acting.

**Do not, until approval**
1. Re-add any affiliate or sponsored wording or links anywhere (HTML, JS, comments, schema, `llms.txt`). The site uses no affiliate or sponsored links. This was removed on purpose from about, contact, privacy, terms, `js/ad-slots.js` and `js/carousel-system.js`. A strict check finds nothing today; when writing about a technique that mentions affiliate sites, reword it.
2. Remove or change `/ads.txt`. It must contain only: `google.com, pub-2731774500195310, DIRECT, f08c47fec0942fa0`.
3. Remove the `<meta name="google-adsense-account" content="ca-pub-2731774500195310">` tag from `index.html`.
4. Add `noindex`, `nofollow` or any crawler block to real content pages, or block Google's crawlers in `robots.txt` (it currently allows all).
5. Remove or break `404.html`, `410.html` or `pinterest-917fa.html`. The Pinterest file holds only the verification meta tag and must keep it.
6. Add AdSense code, ad units or ad scripts. That is done after approval.
7. Make big structural changes: moving or renaming pages, deleting articles, changing URLs.

**Article and panel fixes can continue** (`docs/QUALITY-QUEUE.md`). Push only finished versions of a page, never half-edited ones, because AdSense crawlers may visit at any time.

**Dates** (see Gotchas for the mechanics)
- A real content change (new sections, corrected facts, rewritten text, changed sources) sets that page's `modified` to today in `docs/data/page-dates.json`, then `apply_dates.py`, then `verify_dates.py` must print 0 problems before every push.
- Cosmetic or site-wide changes never move a date: styling, JS, header, footer, and site-wide navigation such as the 'You Can Also Read' blocks. Only a change to the article's own text, facts or sources moves its date, to the real day of the push.
- Use the real clock. Never type dates by hand into pages. A NEW page must be added to `docs/data/page-dates.json` (and `docs/data/related-pages.json` if it is an article or guide).

**Pushing**
- A bot commits `sitemap.xml` and `pages.json` to `main` after each push. Always fetch and rebase `origin/main` before pushing so no one's work is overwritten.
- Never commit tokens or secrets. Use the owner's token only inline for the push; the remote URL stays plain.
- Keep commits small and focused, ideally one page per commit, with tooling changes in their own commits.

**After every push, confirm on the live site** (allow a minute for Netlify): `https://intelreap.com/ads.txt` still shows the single AdSense line; `https://intelreap.com/` opens and still contains the `google-adsense-account` tag; the pages you changed render correctly (no broken layout, no missing content).

## Done so far
- Planning: keyword maps (`docs/keyword-map-v2.md`), GSC findings, Semrush site audit, mixed-intent audit, quality queue (54 items), blueprint, decisions.
- Tooling: `scripts/content/*` (see BLUEPRINT).
- Pages built or redone to standard: P1 `what-is-an-ip-address`, P13 `find-printer-ip-address`, P14 `find-router-ip-address`, D1 `how-to-fix-slow-dns-lookup`, A1 hub guide `how-to-find-ip-address-of-any-device`, A2 `what-is-reverse-ip-lookup`, A3 `webrtc-leak-test-and-shield`, A5 `can-you-have-two-isps-in-one-house`, A10 `how-to-enable-webgl`, A6 `does-a-vpn-change-your-mac-address`. 'You Can Also Read' on all 17 articles and guides. Single source files: `docs/data/page-dates.json` (dates) and `docs/data/related-pages.json` (related reading).
- Redone to the standard: D1 (logic corrected, DoH check, per-device DNS steps) and P14 (4 purpose-built diagrams).
- Technical fixes: 5 broken citations fixed or removed, 2 Apple citations removed, two-ISPs title de-duplicated, homepage SoftwareApplication schema removed, `llms.txt` added, mobile phone diagrams, FAQ moved up and real dates stamped on all 17 content pages.

## Page status
| Page | State |
|---|---|
| `find-router-ip-address` | Done to standard |
| `how-to-fix-slow-dns-lookup` | Done to standard |
| `find-printer-ip-address` | Redone 2026-11-07 to standard (queue item 3); phone and desktop figures drawn separately |
| `what-is-an-ip-address` | Redone 2026-11-10 to standard (queue item 4); now built from `specs/ip_address.py`, so edit the spec, not the HTML |
| `what-is-reverse-ip-lookup` | Redone 2026-11-17 to standard (queue item 7); built from `specs/reverse_ip.py` and `reverse_figs.py`, so edit the spec, not the HTML. The lookup runs in the browser against public DoH and was tested with mocked responses only (the sandbox cannot reach Cloudflare or Google), so confirm one real lookup on the live page |
| `webrtc-leak-test-and-shield` | Redone 2026-11-18 to standard (queue item 8); built from `specs/webrtc.py` and `webrtc_figs.py`, so edit the spec, not the HTML. The test was exercised in a real browser with a simulated `RTCPeerConnection` and mocked identity responses only; confirm one real run, with and without a VPN, on the live page. The phone figure list is in PAGE order, not drawing order |
| `can-you-have-two-isps-in-one-house` | Redone 2026-11-18 to standard (queue item 12); built from `specs/two_isps.py` and `isp_figs.py`, so edit the spec, not the HTML. The two-connection check was exercised in a real browser with mocked backend and public endpoints and a controlled clock (25 scenarios); confirm one real compare and one real failover run on the live page. Failover polling follows the Live Network panel's rule of using public endpoints first so the backend allowance is spared |
| `how-to-enable-webgl` | Redone 2026-11-19 to standard (queue item 13); built from `specs/webgl.py` and `webgl_figs.py`, so edit the spec, not the HTML. The WebGL and WebGPU check was exercised in a real browser with a faked getContext and navigator.gpu (14 scenarios); confirm one real run on a hardware machine and one on a machine with acceleration off. Safari, Edge address and Firefox menu details are from secondary sources and labelled on the page. The phone figure list is in page order |
| `does-a-vpn-change-your-mac-address` | Redone 2026-11-19 to standard (queue item 9); built from `specs/mac_vpn.py` and `mac_figs.py`, so edit the spec, not the HTML. Both tool parts were exercised in a real browser with mocked lookups and a fake WebRTC (22 scenarios, including a known MAC-to-IPv6 example); confirm one real with/without-VPN run and one IPv6 check on a dual-stack connection. Apple, Windows and Android menu labels vary by version and maker. The phone figure list is in page order |
| 7 older articles and guides | Content untouched since July/Oct except citations (7 pages); retrofit in the Search Console order: speed fluctuation (A4), then VPN concentrator, VPN passthrough, fingerprinting, GPU pair, privacy |
| 13 panels | Untouched (owner added charts on Nov 2); light retrofit items 24-30 |

## Outstanding (owner-approved 2026-11-19, not started)
These were approved as ledger items after the owner questioned how much the VPN and MAC rebuild cut (3,374 to 1,759 words). Nothing here is built yet. Full detail is in `docs/QUALITY-QUEUE.md` section 10.
- **O1 Restore the five removed VPN and MAC topics as their own articles** (ExitLag, VPN in incognito, Steam pricing, qBittorrent binding, Mac VPN and device management). The old text is `git show ab620b9~1:learn/does-a-vpn-change-your-mac-address.html`. Each needs the standard process (audit, primary-source check, spec approval) and none is a copy-paste. The Steam and qBittorrent topics need an owner decision first because the AdSense review is pending.
- **O2 Expand the VPN and MAC page only where useful** (find your MAC, router MAC filtering, hotspot login), target about 2,300 to 2,600 words, each addition sourced and judged at build.
- **O3 Over-trimming review of the four other rebuilt pages** (Reverse IP, WebRTC, Two-ISPs, WebGL): REVIEW DONE 2026-11-19, no edits made. Findings, per-page restoration lists and two query regressions are in `docs/QUALITY-QUEUE.md` section 10. **Owner instruction (2026-11-19): do not restart from the first articles. Finish the never-done articles first (A4 speed, VPN concentrator, VPN passthrough, fingerprinting, GPU pair, privacy), then run the O3 restorations, then O1 and O2.** Owner approval of each page's restoration list and of the WebRTC title change is still to be confirmed when that work starts.
- **Regressions to fix first when O3 starts (found by the Search Console check, both introduced by my rebuilds):** WebRTC lost the word 'shield' (about 219 impressions: webrtc leak shield 188 at 17.1, webrtc shield 12, web rtc shield 8, what is webrtc leak shield 3, webrtc leak shield extension 5); Two-ISPs lost 'dual ISP' (89 at 37.1), 'multiple ISPs', 'wifi providers', 'broadband providers', and ASUS device routing rules ('asuswrt merlin dual wan policy routing rules per ip address', 61 at position 2.0).
- **Cut rules for every page from A4 on (owner-driven, 2026-11-19):** (1) show the owner a removal list with every section and FAQ, its word count and its class (off topic, wrong or unsourced, valid) alongside the spec, before building; (2) cut only off-topic or wrong material, and correct wrong claims on valid topics instead of deleting them; (3) no section shrinks below about 60% of its old words without a reason the owner can see; (4) run the Search Console query-presence check before and after the build, including words from the old title; (5) a title change shows the impressions at stake before approval; (6) stop and tell the owner if a build lands more than 10% under its estimate.

## Next
1. A4 speed fluctuation (4 clicks, 2,908 impressions at position 8.7; add one-line definition for the seven 'fluctuation meaning' variants, 82 impressions), then VPN concentrator, VPN passthrough, fingerprinting, GPU pair and privacy, per the Search Console data of 17 Nov. Panel stretch note: the Security and Proxy engines' WebRTC verdicts (`assets/js/engines/security.js`, `proxy.js`) label a result by private LAN addresses only, never compare the public WebRTC address with the address websites see, and their IPv6 pattern misses compressed addresses; fix in the panel stretch. Panel items (6, 9, 11, 13, 17, 20, 24-30) are their own later stretch, per the owner.
2. Execute D-3 cuts inside each affected page's retrofit; use `docs/GSC-FINDINGS.md` for title/description CTR rewrites.
3. Still to examine: the two "content not optimized" pages (VPN concentrator, device fingerprinting); inconsistent title suffixes; no custom 404 page.
4. Backend `claude/lookup-routes` (queue item 54): city-level provider choice pending; the owner declined any paid domains-on-IP data (decision 24).
5. Optional technical task: minify JS/CSS (Semrush flags 1,221 files).
6. Waiting on owner: Semrush seeds for GPU/VPN/privacy/fingerprinting/ISP (only for items 12+), optional PageSpeed checks.

## Gotchas
- Use the real clock for dates (`layout.today()`); never type dates by hand.
- Related reading has one source: `docs/data/related-pages.json`. A NEW article or guide must get an entry there (2 to 4 relevant items, each with a reason of at most 80 characters, and a title in `titles`); then run `python3 scripts/content/related.py` and `python3 scripts/content/verify_related.py`. Do not pad to reach a number: fewer relevant links beat filler. Check the gap list the verifier prints when choosing what to write next.
- Dates have one source: `docs/data/page-dates.json` (published, modified, kind). After a content edit set the page's `modified` to today (generated pages: `gen.py` does it through `layout.apply`; hand-extended pages: edit the file), run `python3 scripts/content/apply_dates.py`, then `python3 scripts/content/verify_dates.py`, which must print 0 problems before every push. Only 'Last updated' is shown on screen; published dates live only in metadata. Never add a script that writes a date; a cosmetic or site-wide commit does not change a page's date. A NEW page must be added to `docs/data/page-dates.json` (kind, published = the first commit of that file, modified); `verify_dates.py` fails for any page listed in `pages.json` that has no entry. To decide whether a merge changed a page's real content, compare the page's own text blocks and source links between the commit before and after (not `git log --follow`, which is misled by merges from branches cut before an edit and by rename detection: it traced methodology.html back to about.html).
- Cookie banner covers element screenshots: inject CSS to hide it. Block the service worker in Playwright. Register abort routes before mock routes.
- Verifier must pass; also open diagrams visually; owner wants clinical, specific work, short replies, no mass production.
- Owner rules (2026-11-14): do NOT bump page dates when editing, and do NOT add backend or third-party provider names to visible text. The MaxMind and OpenStreetMap credit lines are licence requirements and must stay. Show the owner the change first; merge only on approval.
- Live Network monitor (`network.js`, `config.js` INTERVALS): a reading every 3 s for the first 3 minutes (fills the 60-point chart), then every 10 minutes, visible tab only; free public endpoints first, backend last; each reading calls `Canvas4.render()` (before 2026-11-17 the panel was drawn once and never followed the readings). A visit costs the backend 7 requests; the Worker Free plan allows 100,000 a day.
- Route diagram (`d3-diagrams.js`): 3-over-2 layout below 640 px, shorter names below 380 px. Label collisions were measured at widths 320 to 1024 (0 from 360 up). Re-measure after any change; the ASN Number row shows the number only.
- Chrome GPU names arrive as `ANGLE (Vendor, Model, Backend)`; `normalizeGPURenderer` takes the model from the second part (tested on 14 strings).
- Sitemap bot commits land on `main` after each push: always fetch and merge `main` before pushing.

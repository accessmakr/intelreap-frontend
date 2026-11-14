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
- Pages built or redone to standard: P1 `what-is-an-ip-address`, P13 `find-printer-ip-address`, P14 `find-router-ip-address`, D1 `how-to-fix-slow-dns-lookup`, A1 hub guide `how-to-find-ip-address-of-any-device`. 'You Can Also Read' on all 17 articles and guides. Single source files: `docs/data/page-dates.json` (dates) and `docs/data/related-pages.json` (related reading).
- Redone to the standard: D1 (logic corrected, DoH check, per-device DNS steps) and P14 (4 purpose-built diagrams).
- Technical fixes: 5 broken citations fixed or removed, 2 Apple citations removed, two-ISPs title de-duplicated, homepage SoftwareApplication schema removed, `llms.txt` added, mobile phone diagrams, FAQ moved up and real dates stamped on all 17 content pages.

## Page status
| Page | State |
|---|---|
| `find-router-ip-address` | Done to standard |
| `how-to-fix-slow-dns-lookup` | Done to standard |
| `find-printer-ip-address` | Redone 2026-11-07 to standard (queue item 3); phone and desktop figures drawn separately |
| `what-is-an-ip-address` | Redone 2026-11-10 to standard (queue item 4); now built from `specs/ip_address.py`, so edit the spec, not the HTML |
| 13 older articles and guides | Content untouched since July/Oct except citations (7 pages) and title (two-ISPs); retrofit items 5-23 |
| 13 panels | Untouched (owner added charts on Nov 2); light retrofit items 24-30 |

## Next
1. Queue item 6: the Network Identity panel (light retrofit, tool-pointer), then 7 (A2 Reverse IP article), 8 (A3 WebRTC leak article) and onward per `docs/QUALITY-QUEUE.md` section 3.
2. Execute D-3 cuts inside each affected page's retrofit; use `docs/GSC-FINDINGS.md` for title/description CTR rewrites.
3. Still to examine: the two "content not optimized" pages (VPN concentrator, device fingerprinting); inconsistent title suffixes; no custom 404 page.
4. Backend `claude/lookup-routes` (queue item 54): owner choices pending (city-level provider, paid domains-on-IP data).
5. Optional technical task: minify JS/CSS (Semrush flags 1,221 files).
6. Waiting on owner: Semrush seeds for GPU/VPN/privacy/fingerprinting/ISP (only for items 12+), optional PageSpeed checks.

## Gotchas
- Use the real clock for dates (`layout.today()`); never type dates by hand.
- Related reading has one source: `docs/data/related-pages.json`. A NEW article or guide must get an entry there (2 to 4 relevant items, each with a reason of at most 80 characters, and a title in `titles`); then run `python3 scripts/content/related.py` and `python3 scripts/content/verify_related.py`. Do not pad to reach a number: fewer relevant links beat filler. Check the gap list the verifier prints when choosing what to write next.
- Dates have one source: `docs/data/page-dates.json` (published, modified, kind). After a content edit set the page's `modified` to today (generated pages: `gen.py` does it through `layout.apply`; hand-extended pages: edit the file), run `python3 scripts/content/apply_dates.py`, then `python3 scripts/content/verify_dates.py`, which must print 0 problems before every push. Only 'Last updated' is shown on screen; published dates live only in metadata. Never add a script that writes a date; a cosmetic or site-wide commit does not change a page's date. A NEW page must be added to `docs/data/page-dates.json` (kind, published = the first commit of that file, modified); `verify_dates.py` fails for any page listed in `pages.json` that has no entry. To decide whether a merge changed a page's real content, compare the page's own text blocks and source links between the commit before and after (not `git log --follow`, which is misled by merges from branches cut before an edit and by rename detection: it traced methodology.html back to about.html).
- Cookie banner covers element screenshots: inject CSS to hide it. Block the service worker in Playwright. Register abort routes before mock routes.
- Verifier must pass; also open diagrams visually; owner wants clinical, specific work, short replies, no mass production.
- Sitemap bot commits land on `main` after each push: always fetch and merge `main` before pushing.

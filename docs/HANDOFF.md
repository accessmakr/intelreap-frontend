# Handoff (2026-11-04)

## Access (no secrets stored here)
- Frontend repo: https://github.com/accessmakr/intelreap-frontend (branch `main` = production via Netlify).
- Backend repo: https://github.com/accessmakr/intelreap-backend (branch `cloudflare-worker`; another agent works there; read-only unless a plan says otherwise).
- The owner supplies a GitHub personal access token in chat. Clone with `https://x-access-token:<TOKEN>@github.com/accessmakr/<repo>.git`, then reset the remote URL. Never commit the token. Owner asked for no revoke advice.
- Sandbox: network allows github.com and npm/pypi; `pip install playwright` browsers are present; `npm i wrangler` works. Commit identity: `Claude (sandbox)`.

## Done so far
- Planning: keyword maps (`docs/keyword-map-v2.md`), GSC findings, Semrush site audit, mixed-intent audit, quality queue (54 items), blueprint, decisions.
- Tooling: `scripts/content/*` (see BLUEPRINT).
- Pages built: P1 `what-is-an-ip-address`, P13 `find-printer-ip-address`, P14 `find-router-ip-address`, D1 `how-to-fix-slow-dns-lookup`.
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

# Decision log (dates approximate; `git log` is exact)

| # | Decision | By | Status |
|---|---|---|---|
| 1 | One article at a time, meticulous; no mass production | Owner (Oct 31) | Active |
| 2 | Body links about 5 per page, each in a different paragraph; applies to existing pages too | Owner (Oct 31) | Active |
| 3 | No word-count gates; length follows intent | Owner (Nov 1) | Active |
| 4 | The 13 panels stay tool-pointer pages; articles point to them | Owner (Nov 1) | Active |
| 5 | Order: finish live pages, then existing pages, then new articles | Owner (Nov 1) | Active (QUALITY-QUEUE s.3) |
| 6 | "What is my IP address" is a planned article pointing to the Network Identity panel (D-1) | Agent, owner agreed | Planned |
| 7 | Slow-internet and WebRTC-disable content goes inside existing articles where it fits; no indexed URLs change (D-2) | Agent, owner agreed | Planned |
| 8 | Mixed-intent pages: cut MAC/VPN off-topic sections (ExitLag, incognito, Steam, qBittorrent, Mac settings), cut ISP-definition section, restructure GPU guide (D-3) | Evidence in GSC-FINDINGS | Pending execution at each page's retrofit |
| 9 | Third-party DoH is fine for DNS tools; no rigid bundled-data rule | Owner (Oct 31) | Active |
| 10 | Backend lookup routes (D-4): RDAP-based `/api/ip-lookup` on a new branch, local Wrangler tests, merge only after rebasing on the other agent's work. City-level provider and paid reverse-IP data undecided | Owner approved merging | Not started (queue #54) |
| 11 | Scoreboard and Live Feed stay as tool pointers; noindex idea retracted (D-5) | Agent retracted | Closed |
| 12 | Semrush seeds needed only for GPU, VPN, privacy, fingerprinting, ISP, panel topics (D-6) | Owner | Open; does not block queue items 1-11 |
| 13 | Never fabricate ratings or reviews; homepage SoftwareApplication schema removed | Agent | Done; restore only with genuine reviews |
| 14 | Every citation is opened and checked; unverifiable ones removed | Agent | Active |
| 15 | Agent reviews each finished page itself; owner review does not block | Owner (Nov 2) | Active |
| 16 | FAQ placed right after main content on articles and guides; panels already have it right after content | Owner (Nov 4) | Done; panels unchanged |
| 17 | Every edit stamps one real date (badge, JSON-LD, meta) from the real clock via `layout.py`, which also records it in `docs/data/page-dates.json` (D-19) | Owner (Nov 4) | Active |
| 18 | Agent may merge frontend branches to `main` after verification; token stays out of the repo | Owner | Active |
| 19 | Dates: published = first real publication date (first git commit; the four pages first committed 30 and 31 Oct keep those); modified = last real content edit (text or source links changed, not date-only, reordering or site-wide widgets). Only 'Last updated' is ever shown on a page, never a published or effective date. Source of truth `docs/data/page-dates.json`, applied by `scripts/content/apply_dates.py`, checked by `scripts/content/verify_dates.py` | Owner (Nov 7) | Done, all 39 pages |
| 20 | No script may write, rewrite or invent a date at run time. Removed: Monday `dateModified` rewrite (17 pages), visitor-date badge writer (4 older pages and the template), homepage badge from `siteLastModified`, `schema.js` constants 2026-01-01 and 2026-10-02 (it now reads each page's own JSON-LD) | Owner (Nov 7) | Done |
| 21 | Sitemap and `pages.json` `lastmod` = the page's own modified date, not the git commit time (`scripts/generate-routes.js`) | Owner (Nov 7) | Done; the bot regenerates with this logic |

Note: dates typed by hand in older `CONTENT-PLAN.md` log lines may be off by up to two days; use `git log`.

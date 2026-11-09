# IntelReap Blueprint (vision, architecture, standards)

## Vision
intelreap.com is a free network and device intelligence site. Goal now: AdSense-ready, genuinely useful content. 13 live tool panels measure things in the visitor's browser or via a Worker; articles explain the concepts and point to the panels. Quality over volume.

## Page roles
- **Articles/guides** (`learn/`, `guides/`): answer a real search intent fully; one primary panel pointer and one inline tool.
- **13 panels** (`intelligence/`): tool-pointer pages. Articles point to them; they link out to articles. They must not become articles.
- **Policy/home/index pages**: About, Contact, Privacy, Cookies, Terms (all exist, 200).

## Stack
- Static HTML/CSS/JS on Netlify (project `intelreap-frontend`, deploys `main`, no build step). Clean-URL 301s in `netlify.toml`.
- GitHub workflow patches `sitemap.xml` and `pages.json` on pushes to `main` (bot commits "chore: patch automated sitemap").
- Backend: Cloudflare Worker `intelreap-backend.accessmakr.workers.dev` (repo `intelreap-backend`, branch `cloudflare-worker`, maintained by the owner's other AI agent). Routes: health, ip-identity, ip-deep, proxy-intelligence, ai-summary, headers-echo. Geo data is the caller's only (request.cf); arbitrary-IP lookup is not possible yet.
- `assets/js/config.js` holds `BACKEND_URL` and endpoint names. `js/root-config.js` holds a site-wide freshness constant (overridden per page by `data-fixed`).

## Content tooling (`scripts/content/`)
- `gen.py <spec>`: builds a page from `specs/<spec>.py` onto `base.html`; also writes the OG image, JSON-LD, learn-index card, redirect; then runs `layout.apply` and `mobilize`.
- `layout.py`: `move_faq` (FAQ right after main content, before Logic/Sources) and `stamp` (one real date in badge, JSON-LD dateModified, article:modified_time; uses the real clock).
- `extend.py`: append sections and FAQs to an existing page. `mobilize.py`: adds the tall phone variant of each diagram from `mobile/<slug>.py`.
- `svgkit.py`, `dns_figs.py`, `router_figs.py`: diagram helpers. Every diagram is drawn separately for desktop and phone, for one stated purpose.
- `apply_dates.py` / `verify_dates.py`: apply and check `docs/data/page-dates.json` across all 39 pages (LD published and modified, article meta, the one visible 'Last updated', sitemap and `pages.json` lastmod, no run-time date code). `verify_dates.py` is the repo-wide date check.
- `verify.py <slug>`: structure, JSON-LD, anchors, links, FAQ count, phone variants, date consistency, FAQ position, emulated Pixel 7 light/dark render. Playwright and Wrangler both run in the sandbox.

## Standard per page (full text: `docs/QUALITY-QUEUE.md` section 2)
Intent fit; answer first; every fact and citation verified (open each URL); diagrams only where they teach; one panel pointer and one tool; TOC, FAQ right after content, logic/methodology, sources; about 5 body links each in its own paragraph; no word-count gate; full SEO head; real dates; phone and desktop renders inspected.

## Workflow per item
Read the page and the data (`docs/GSC-FINDINGS.md`, `docs/keyword-map-v2.md`), write purpose lines for diagrams, build, verify, review the text line by line myself, merge to `main` (fast-forward after merging latest `main`), update `docs/CONTENT-PLAN.md`. Owner's phone review is asynchronous and never blocks.

## Data sources
Semrush exports (IP, speed, DNS, WebRTC, reverse IP) in `docs/keyword-map-v2.md`; Search Console export in `docs/data/`; Semrush Site Audit baseline in `docs/QUALITY-QUEUE.md` section 9.

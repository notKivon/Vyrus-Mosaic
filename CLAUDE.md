# Project: Vyrus + Mosaic websites

Two static marketing websites for a fictional product, built for Kevin's AIML class project "The Useless Product Launch" (Unit 1: Generative AI and Ethics). **Vyrus** is a deliberately useless subscription face mask: AI-native, diesel-powered, built to harvest data. **Mosaic** is its sister company, which sells what the mask collects to advertisers and governments. The joke only works if both sites are played completely straight: they must look like real, well-funded companies.

This file loads every session. To save tokens, read only what the current session needs:

| File | Holds | Read it |
|---|---|---|
| `CLAUDE.md` | Rules, stack, product facts, deploy | Every session |
| `PROGRESS.md` | Step checklist, current step, decisions log | Every session |
| `docs/vyrus-brand.md` | Vyrus voice, visuals, components, page spec | Session 1 only |
| `docs/mosaic-brand.md` | Mosaic voice, visuals, components, page spec | Session 2 only |

Do not read the other brand's doc "for context". The cross-brand facts you need are in this file.

## Campaign context (why the sites exist)

The class requires three campaign assets that share a name, look and voice, each doing a different job. Kevin's three:

1. **Website (this repo).** Vyrus site = main point of sale; it moves visitors from considering to subscribing. Mosaic site = the enterprise side of the same story.
2. **Billboard.** "breathe smarter_" on a full aqua field, wordmark bottom-right. The Vyrus hero must use the same line so the assets visibly match.
3. **Flyers.** Marketing to big tech and governments as a data-harvesting tool, in the Mosaic identity.

Assessed on craft: readable type, clean edges, full resolution, **no placeholder text**. Assessed on coherence: identity carried by more than a logo and a colour (voice, vocabulary, motifs).

## Tech stack
- Plain HTML5, CSS and vanilla JavaScript. **No framework, no build step, no npm, no TypeScript, no Tailwind.**
- Fonts from Google Fonts via `<link>` with `display=swap`: Martian Mono and Figtree (Vyrus); Newsreader, Figtree and JetBrains Mono (Mosaic).
- Local preview: `python3 -m http.server 8000` run inside `vyrus/` or `mosaic/`.
- Hosting: Cloudflare Pages, two projects connected to this one GitHub repo (see Deploy).

## Repo layout
```
/CLAUDE.md  /PROGRESS.md  /README.md  /.gitignore
/docs/            brand specs (not deployed)
/vyrus/           deployed as the Vyrus site (Pages root directory)
  index.html  account.html  404.html  _headers
  assets/css/tokens.css  components.css  site.css
  assets/js/site.js
  assets/img/
/mosaic/          deployed as the Mosaic site (Pages root directory)
  index.html  404.html  _headers
  assets/css/tokens.css  components.css  site.css
  assets/js/site.js
  assets/img/
```
Each site folder is fully self-contained: a page may only reference files inside its own folder, because Cloudflare serves only the root directory. Never link `../`.

`tokens.css` and `components.css` in each site were generated from the design systems and are the single source for colours, type sizes, spacing and component styling. Page-specific layout goes in `site.css`. Never hard-code a hex value, font size or spacing value outside `tokens.css`; use the CSS variables and `.t-*` type classes.

## Code rules
- Semantic HTML (`header`, `nav`, `main`, `section`, `footer`, one `h1` per page). Pages must read correctly with JavaScript disabled; JS only adds motion and the countdown.
- Responsive from 360 px to 1440 px wide. Content max width 1200 px. Check at 360, 768 and 1280 px before ticking any page step.
- Accessibility: text contrast at least 4.5:1 (the token pairings in the brand docs already satisfy this, so use the stated pairings), visible focus rings from the tokens, `alt` text on every image, `aria-hidden` on decorative SVG.
- Every animation respects `prefers-reduced-motion`.
- Keep files under about 300 lines; split `site.css` by section if it grows past that.
- British spelling in all copy (personalisation, neighbourhood, colour). "Data" is plural ("these data are").
- No emoji anywhere. No lorem ipsum, "TODO", "coming soon" or other placeholder text in anything committed.
- Images: JPEG or WebP, at most 1600 px on the long edge and 300 KB each; always set `width` and `height`; `loading="lazy"` below the fold.
- Ask before deleting any file.

## Product facts (shared by both sites; must match exactly)

The Vyrus mask has these physical features (from the Blender mockup v2): biometric camera with an aqua ring, red indicator (REC) LED, 5-hole chin microphone, left-cheek speaker, right-cheek ad screen, diesel system (5 L canister with amber fuel window, exhaust stack, hose into a fume port), centre light strip, "vyrus_" wordmark badge on the lower right cheek, face seal and straps.

What each feature really does: the camera is useless except for biometric data harvesting; the microphone talks to the AI, switches itself on at the worst possible moments and harvests data; the speaker is for the AI and plays ads on the lower tier; the diesel system blows fumes into the wearer's face.

| Plan | Price | Diesel fumes | Ads |
|---|---|---|---|
| Lite | $4.99 / month | Continuous | Yes |
| Pro (recommended) | $9.99 / month | Continuous | No |
| Max | $19.99 / month | Occasional (reminds users why they pay) | No |
| EasyBreath Pro™ add-on, Max only | $9.99 / 24 hrs | None, guaranteed | No |

Plans are always shown Lite, Pro, Max, left to right. Prices are in US dollars.

Lapsed payment: on every plan, if a payment fails the mask counts down 15 minutes (shown as 14:59), then inward spikes deploy through the face seal toward the wearer until the plan is renewed. The spikes are never drawn on the mask or in product imagery; they appear only as the red inward-triangle row in the lapsed-state UI.

Each brand has its own words for these facts (Vyrus euphemisms, Mosaic vocabulary). Use the brand doc's term every time; never state the plain truth in site copy. The one exception is the Vyrus Retention Assurance™ disclosure, which names the spikes in fine print under the plan comparison (defined in the Vyrus brand doc).

## Cross-brand rules
- Vyrus never shows the Mosaic logo. Its footer carries one fine-print line: "Vyrus is a member of the Mosaic Partner Network." The words "Mosaic Partner Network" link to the Mosaic site.
- Mosaic never shows the mask and never borrows Vyrus's aqua fields, monospace headlines or underscore cursor. It may show "Endpoint: Vyrus" small in `ink-muted`, linking to the Vyrus site.
- Shared DNA only: Figtree, teal/aqua as the colour of Vyrus data, the 4 px spacing scale.
- Each site has exactly one cross-link, in its footer (plus the same link in its 404 page). Until the real URLs exist it points to `#partner-url-pending`; step 13 in PROGRESS.md replaces it. Grep for `partner-url-pending` to find every instance. This anchor is the one permitted placeholder, and it must be gone before the final hand-back.

## Satire and safety rules (non-negotiable)
- Both footers end with this line in the smallest body style: "Vyrus and Mosaic are fictional. Made for a school AIML project; nothing here is for sale."
- Every page has `<meta name="robots" content="noindex, nofollow">`, and each `_headers` file sets `X-Robots-Tag: noindex` for `/*`.
- No forms, text inputs, email capture, analytics, cookies, trackers or third-party scripts. Buttons that would buy or book something open an in-page dialog written in the brand voice instead (specified in each brand doc). Nothing ever leaves the browser except the Google Fonts request.
- No real companies, products, cities or people in copy or imagery. Mosaic's look was inspired by real public-safety tech marketing; never name that company.
- No depiction of injury. The lapsed state is shown only through the approved UI (spike row, countdown, euphemistic copy).

## Secrets policy
There are no secrets in this project: no API keys, no environment variables, no backend. Safe to commit: everything in the repo. Never commit personal information (Kevin's full name, email, school name) or anything from outside the repo other than the approved render images. `.gitignore` excludes `.DS_Store`, `*.blend`, `*.png` source renders and editor folders.

## Deploy (Cloudflare Pages; the dashboard steps are done by Kevin)
Two Pages projects on the same repo, production branch `main`:

| Setting | Vyrus project | Mosaic project |
|---|---|---|
| Project name | `vyrus` (or first free variant) | `mosaic-civic` (or first free variant) |
| Framework preset | None | None |
| Build command | *(empty)* | *(empty)* |
| Build output directory | `/` | `/` |
| Root directory | `vyrus` | `mosaic` |
| Build watch paths, include | `vyrus/*` | `mosaic/*` |

The resulting `*.pages.dev` URLs are recorded in PROGRESS.md under "Project values" once known.

## Working agreement (multi-session build)
- Build in the order in PROGRESS.md, one step at a time. The build is split into two sessions; do not start a Session 2 step in Session 1.
- After finishing each step: test it (serve locally, check the pages at 360/768/1280 px, check the browser console is clean), update PROGRESS.md (tick the box, set Current/Next, log decisions and any challenge worth mentioning), then commit and push. A commit is always a working, tested state; never commit a half-finished step.
- Log notable problems and how they were solved under "Challenges log" in PROGRESS.md in one line each. Kevin needs these for the "tools used, and challenges" and evaluation slides.
- At the start of every session: read CLAUDE.md, PROGRESS.md and only that session's brand doc; reconcile PROGRESS.md against `git log --oneline -15` and `git status`; serve the site to confirm the tree is healthy before continuing. If sources disagree, trust git and the working tree over PROGRESS.md, and fix PROGRESS.md in its own commit.
- Steps marked ⏸️ require Kevin: stop, give the exact instructions, wait for confirmation and any values produced.
- Only stop to ask otherwise when a command needs approval, an error survives a real fix attempt, or the final hand-back step is reached.
- Commit messages: `<site>: <what changed>`, e.g. `vyrus: pricing section`. Timestamps in PROGRESS.md use HKT (UTC+8).
- Spec changes (new section, changed copy rule, new page) are their own step: update CLAUDE.md or the brand doc in one commit first, then build.

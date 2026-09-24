# Vyrus + Mosaic websites — Build Progress

**Current step:** 12 — ⏸️ Kevin: create the three Cloudflare Pages projects (waiting on Kevin)
**Next step:** 13 — Cross-links and absolute URLs
**Last verified healthy:** 2026-09-24 HKT, step 11b (hub index + 404 at 360/768/1280, no horizontal scroll, all assets 200, skip link first in tab order, word/emoji/hex grep clean, console clean)

## Project values
- GitHub repo URL: https://github.com/notKivon/Vyrus-Mosaic (public)
- Vyrus Pages URL: *(pending, step 12)*
- Mosaic Pages URL: *(pending, step 12)*
- Vyrus custom domain: https://vyrus.aiml.11123334.xyz/ *(activated in step 12)*
- Mosaic custom domain: https://mosaic.aiml.11123334.xyz/ *(activated in step 12)*
- Hub Pages URL: *(pending, step 12)*
- Hub custom domain: https://aiml.11123334.xyz/ *(activated in step 12)*

## Session 1 — Vyrus site
Read: CLAUDE.md, PROGRESS.md, docs/vyrus-brand.md. Do not open docs/mosaic-brand.md.

- [x] 1. ⏸️ **Kevin: create the GitHub repo.** On github.com: New repository → name `vyrus-mosaic` (or your choice) → Public or Private → do **not** add a README, .gitignore or licence → Create. Report back the HTTPS URL. (Alternative: if `gh auth status` shows you are logged in, the agent may run `gh repo create vyrus-mosaic --private --source . --remote origin` after you approve it.)
- [x] 2. **Scaffold and first push.** `git init -b main`; add `.gitignore` check, short `README.md` (what the repo is, how to preview, pointer to CLAUDE.md, fictional-project line); create the folder layout from CLAUDE.md; `vyrus/index.html` as a minimal page that loads fonts, `tokens.css`, `components.css`, `site.css` and shows the wordmark plus one primary button, so the seed CSS is proven to load; `vyrus/_headers` with `X-Robots-Tag: noindex`. Test: serve and confirm fonts and button render. Commit, add remote, push.
- [x] 3. **Renders.** With Kevin's approval to read `~/Pictures/Vyrus Mockup/`, copy the four v2 JPEGs into `vyrus/assets/img/` under the names in the brand doc and make 640 px versions with `sips`. Check each file is under 300 KB (re-export at lower quality with `sips -s formatOptions 70` if not). If the folder is missing, stop and ask Kevin to drop the files into `vyrus/assets/img/`. Commit.
- [x] 4. **Vyrus shell + hero.** `site.css` base (box-sizing, body on `--ground`, container, section spacing, nav, footer), `site.js` (cursor typing enhancement, purchase dialog), nav, hero, footer with fictional line and `#partner-url-pending` link, the purchase dialog. Test at 360/768/1280 px, keyboard-only through nav and dialog, reduced motion. Commit.
- [x] 5. **Features + stage sections.** Features grid and the `.theme-deep` stage with spec readout and the three renders. Test responsive, image sizes, alt text. Commit.
- [x] 6. **Pricing + retention band.** Three TierCards exactly as specified, EasyBreath line under Max, footnotes, retention band. Check every price against CLAUDE.md. Test phone order (Pro first). Commit.
- [x] 7. **`account.html` + `404.html`.** RenewalBanner with live countdown (static 14:59 without JS), chips, device and Sponsored Moment cards; 404 page. Test countdown, JS-off rendering. Commit.
- [x] 8. **Vyrus polish and session hand-off.** Titles, meta descriptions, favicon, OG tags, `noindex` meta on all pages; check contrast of any pairing not in the brand doc; grep the site for `TODO`, `lorem`, `diesel`, `fume`, `spike`, emoji (must be none in visible copy); console clean; all internal links resolve. Update Open items and the Challenges log. Commit and push. **End of Session 1.**
- [x] 8a. **Spec change (Kevin's request):** sharper Retention Assurance™ mentions, EasyBreath Pro™ panel, expandable plan comparison, and a fine-print disclosure that names the spikes plainly. Brand doc + CLAUDE.md updated. Commit.
- [x] 8b. **Build 8a on index.html.** Retention band body, stage readout row, EasyBreath panel, `<details>` comparison table + disclosure. Test at 360/768/1280, keyboard, JS off. Re-run the step 8 word grep; the plain word may appear only in the disclosure. Commit and push.

## Session 2 — Mosaic site, deploy, hand-back
Read: CLAUDE.md, PROGRESS.md, docs/mosaic-brand.md. Do not open docs/vyrus-brand.md.

- [x] 9. **Mosaic shell + hero + proof row.** Folder files as in CLAUDE.md, `_headers`, `site.css` base, inline mark + lockup nav, hero with the assembling tile art, proof row DataTiles, footer with fictional line and `#partner-url-pending` link, briefing dialog in `site.js`. Test at 360/768/1280 px, keyboard, reduced motion. Commit.
- [x] 10. **How it works + products.** Tile-convergence grid, Audience and Civic panels. Test responsive. Commit.
- [x] 11. **Compliance, quote, CTA, 404, polish.** Compliance table (scrolls on phone), quote band, briefing CTA, `404.html`; titles, meta, favicon, `noindex`; grep for `TODO`, `lorem`, `surveillance`, `spike`, emoji; console clean. Commit and push.
- [x] 11a. **Spec change (Kevin's request):** a third site, the project hub at `aiml.11123334.xyz`, introducing both companies and the project. CLAUDE.md + `docs/hub-brief.md`. Commit.
- [x] 11b. **Build the hub.** `hub/` with `_headers`, tokens, components, site CSS, `index.html` and `404.html` per `docs/hub-brief.md`. Test at 360/768/1280, keyboard, JS off (it has none), contrast of the new pairings, word grep (no "spike"), console clean. Commit and push.
- [ ] 12. ⏸️ **Kevin: create the three Cloudflare Pages projects.** In the Cloudflare dashboard: Workers & Pages → Create → Pages → Connect to Git → pick the repo. Use the settings table in CLAUDE.md (Deploy) for the Vyrus project, save and deploy; then repeat for the Mosaic and Hub projects with their columns. After both builds finish, open each project → Custom domains → Set up a custom domain → enter `vyrus.aiml.11123334.xyz` (Vyrus project), `mosaic.aiml.11123334.xyz` (Mosaic project) or `aiml.11123334.xyz` (Hub project) → Activate domain, accepting the CNAME it proposes (if the DNS for `11123334.xyz` is not on this Cloudflare account, add `CNAME vyrus.aiml → <vyrus project>.pages.dev` and `CNAME mosaic.aiml → <mosaic project>.pages.dev` at the DNS host, and `CNAME aiml → <hub project>.pages.dev`, then Verify). Wait until all three domains show Active and load over https. Report back the three `*.pages.dev` URLs and confirm all three custom domains are Active.
- [ ] 13. **Cross-links and absolute URLs.** Replace every `#partner-url-pending` with the partner's custom-domain URL (Vyrus footer + 404 → `https://mosaic.aiml.11123334.xyz/`; Mosaic footer + 404 → `https://vyrus.aiml.11123334.xyz/`); make the Vyrus `og:image` absolute (`https://vyrus.aiml.11123334.xyz/assets/img/mask-hero.jpg`); record both URLs under Project values. Grep confirms no `partner-url-pending` remains. Commit and push (both projects redeploy).
- [ ] 14. **Live verification and hand-back.** Fetch all three live URLs: pages load, fonts load, images load, 404 pages work, `X-Robots-Tag: noindex` header present (`curl -sI <url> | grep -i robots`), cross-links go the right way. Then give Kevin: the three URLs, a short list of tools used, and the Challenges log, ready for his "Build your campaign" and "Evaluate" slides.

## Open items
- Cross-links use `#partner-url-pending` until step 13 (Vyrus: footer of index, account and 404; Mosaic: footer of index and 404).
- Vyrus `og:image` is relative until step 13.
- Reduced motion was checked by code (CSS media queries, and a JS guard on typing and the countdown); the preview browser cannot emulate the setting. Worth a manual check once live (macOS: Accessibility → Display → Reduce motion).
- Local preview tip: plain `python3 -m http.server` lets the browser cache JS; hard-reload if a change seems to be missing.

## Decisions & gotchas
- 2026-09-24 HKT — One repo, two Pages projects via root directories; plain static HTML, no build step.
- 2026-09-24 HKT — Vyrus hero uses "breathe smarter_" to match the billboard; "the face mask that knows you better than you do." becomes the subline.
- 2026-09-24 HKT — No forms or inputs on either site; purchase and briefing buttons open in-voice dialogs. Both sites `noindex` with a fictional-project line in the footer.
- 2026-09-24 HKT — Mosaic uses SVG tile art only (no licensed dusk photographs available).
- 2026-09-24 HKT — Kevin created the repo himself as public (`notKivon/Vyrus-Mosaic`); nothing personal is committed, per the secrets policy.
- 2026-09-24 HKT — tokens.css and components.css were generated from the claude.ai design systems and seeded into the repo; they are the source of truth for styling from now on.
- 2026-09-24 HKT — Renders: four 1280×960 originals (56–74 KB) plus 640 px versions (31–42 KB), no re-compression needed. The side render shows "diesel_5l" printed on the canister; kept because it is the approved render and the no-diesel rule covers written copy only.
- 2026-09-24 HKT — Inside aqua bands, ghost links and all text use `--on-aqua` (9.9:1); `--aqua-strong` on aqua is only 3.9:1. The hero cursor uses `--surface-raised`, matching the on-aqua wordmark rule. In aqua bands the primary button hovers to `--surface-raised`, because its default aqua hover would vanish into the band.
- 2026-09-24 HKT — Hero typing is drawn as an overlay on top of the real, transparent headline, so layout never shifts and screen readers always get the full text. It is skipped under reduced motion.
- 2026-09-24 HKT — Added a skip link and `aria-hidden` cursors, so screen readers say "vyrus", not "vyrus underscore".
- 2026-09-24 HKT — Stage heading "built to know you." added (the spec gave the section no heading). Within `.theme-deep`, `--surface-inverse` resolves to a light panel, so the spec readout is a pale terminal card on the dark stage; kept as the design system defines it. The words "diesel" and "canister" appear only in image alt text, following the brand doc's own alt-text example.
- 2026-09-24 HKT — Tier cards run three across only from 960 px. Below that they stack in one column (max 520 px) with Pro first, because the no-wrap fume label overflows three narrow columns at 768 px. The primary button on the aqua Pro card hovers to `--surface-raised`, the same fix as in the aqua bands.
- 2026-09-24 HKT — account.html: the renewal banner and greeting share one aqua band, which satisfies the aqua-field rule; the banner drops its shadow there (flat on aqua). The nav button there is a secondary "See plans", so "Renew now" stays the only primary in view. The banner title stays an `h3`, as the component requires, even though it comes before the page `h1`.
- 2026-09-24 HKT — 404.html uses root-absolute asset paths (`/assets/...`), because Pages serves it at any missing URL depth. Its header shows only the wordmark, so "Back to Vyrus" is the page's single primary button.
- 2026-09-24 HKT — "Your account" was added to the footer links on every page.
- 2026-09-24 HKT — Step 8 checks: every colour pairing on the Vyrus site measured at 5.8:1 or better (lowest `--rec-strong` on `--surface-sunken`); no banned words in rendered visible text (they appear only in class names and alt text); no emoji; all internal links and anchors resolve; `noindex` meta on all three pages.
- 2026-09-24 HKT — Kevin asked for more direct spike and EasyBreath Pro™ mentions plus a full plan comparison. Decision: the euphemisms stay in headlines and cards, but get pointed ("through the face seal", "after 14:59"); the plain word "spikes" appears once, in a fine-print disclosure under the comparison table, like a buried legal clause. The no-injury rule is unchanged: text only, never drawn.
- 2026-09-24 HKT — The plan comparison uses native `<details>`/`<summary>` (no JS; Enter/Space toggle it; the label switches between "Compare all plans" and "Hide comparison" via CSS). The table keeps a 600 px minimum width and scrolls inside a focusable region on phones. Pro column shaded `--aqua-soft` (muted text on it measures 6.1:1). "Personalisation: Standard / Priority / Priority" extends the Pro bullet's "Priority Personalisation"; all other values come straight from the product facts.
- 2026-09-24 HKT — Session 2 start: PROGRESS.md matched git (8b done, clean tree); Vyrus served with a clean console.
- 2026-09-24 HKT — The Mosaic mark is referenced as `<img src="assets/img/mosaic-mark-on-navy.svg">` in the lockup rather than inlined: its light-blue tile (`#6f8fc7`) has no token, so inlining would put a hard-coded hex in the HTML. An SVG image is just as crisp.
- 2026-09-24 HKT — Hero art is a 10 × 7 grid (472 × 328 viewBox, 40 px tiles on a 48 px pitch), generated by a short script so the coordinates are exact; fills come from token-backed classes (`.tn`, `.tb`, …) in site.css. Empty cells in the middle columns are `--stone`; the two left columns are almost empty, so the picture thins toward the headline. Tiles fade in over about 2 s in a shuffled order.
- 2026-09-24 HKT — Proof-row tile IDs are `NW-01` to `NW-03` (network figures); feet: "Up 3.2M this quarter", "Endpoint: Vyrus" with the live dot, "Median, first tile to picture". Mosaic pairings measured at 7.0:1 or better.
- 2026-09-24 HKT — Local preview uses a small no-store Python server (kept outside the repo) with launch configs in `.claude/`, now gitignored.
- 2026-09-24 HKT — How it works: the converging grid is 4 columns in HTML (not SVG) so the tags stay real text. The four tagged tiles span two columns each, because a "PURCHASE" tag (93 px) does not fit a single 4-column tile on a phone; the brass "The picture" tile spans the centre 2 × 2. Each tagged tile carries one harmless-looking rate (412 pings / day, and so on).
- 2026-09-24 HKT — The Audience pitch "Know what they want before the mask does." keeps the word "mask" because the brand doc lists it as an approved verbatim line; it is the only use of the word on the site.
- 2026-09-24 HKT — Products: the panel names ("Mosaic Audience", "Mosaic Civic") are the `h2`s, styled `.t-label`; the pitch is the `.t-heading`. Panels are flex columns so "Request access" sits at the same height in both. "Request access" opens the briefing dialog.
- 2026-09-24 HKT — Compliance log: five fictional rows dated 2026-09-24 08:14 to 08:44 HKT, four "Renewed" and the latest "Pending" (in `--flag-strong`, 8.1:1 on sunken), each event a flag tag "Compliance event". The table keeps a 720 px minimum width and scrolls inside a focusable, labelled region on phones; the caption "Compliance log, latest five events" labels it. Header cells take `.t-label` from the `thead` rather than restating its sizes in site.css.
- 2026-09-24 HKT — Quote attribution and text use `--on-navy` (9.0:1); `--ink-muted` on navy is only 5.1:1, so it was not used there. Headlines each carry one brass italic phrase: "one tile at a time.", "built in.", "together.", "missing.".
- 2026-09-24 HKT — CTA lede: "Our partnerships team briefs advertisers and public agencies on what the network already knows about their communities." Mosaic 404 uses root-absolute asset paths like the Vyrus one, shows a 5 × 3 tile grid with one dashed empty slot, and has a lockup-only nav so "Return to the picture" is its one primary button.
- 2026-09-24 HKT — The lockup's 24 px text size is the one font size set in site.css; it is a logo dimension from the brand doc (like the Vyrus wordmark), not a type style. A phone-only lede size override was removed to keep to the token sizes.

- 2026-09-24 HKT — Kevin asked for a landing page at `aiml.11123334.xyz`. It becomes a third Pages project (`hub/`), the one place that steps out of character. The brand sites do not link to it, so they stay straight-faced; it links to both by their final custom domains from the start (no pending anchor), since those URLs are already fixed.
- 2026-09-24 HKT — Hub look: warm paper and near-black ink in Figtree with IBM Plex Mono labels, so it belongs to neither brand. Each brand appears only inside its own specimen panel (aqua + Martian Mono, navy + Newsreader), using colours copied into the hub's tokens as `--vy-*` and `--mo-*`. The Mosaic card uses SVG tile art, as Mosaic never shows the mask. Pairings measured: muted ink on paper 6.2:1, the red "what it really does" column 5.9:1, specimen pairings 8.2:1 or better.
- 2026-09-24 HKT — The hub states the product plainly (camera, microphone, diesel fumes) but, per the spec, names the lapsed-payment penalty only as Retention Assurance™ and the 14:59 countdown. It has no JavaScript. Company cards sit side by side from 720 px; the features table scrolls inside its own region below 720 px.

## Challenges log
*(one line per notable problem and how it was solved; Kevin uses this for the evaluation slides)*
- Button labels were underlined because the design-system button styles did not reset anchor underlines; fixed with one rule in site.css.
- A typing-on headline normally makes the page jump as lines wrap; solved by typing into an overlay on top of the real text, which stays in place but transparent.
- The countdown seemed broken in testing, but the browser was running a stale cached `site.js` (python's http.server sends no cache headers); local previews now use a small no-store server script.
- The Mosaic product panels sat on a `--line` background to draw the 1 px divider, but the grid was also the padded container, so the rule colour bled into the page gutters on phones; fixed by nesting the grid inside the container.
- The design system's ghost-link colour failed contrast on the aqua hero (3.9:1); measured every pairing and switched text on aqua to the dark on-aqua ink (9.9:1).

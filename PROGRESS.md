# Vyrus + Mosaic websites — Build Progress

**Current step:** 6 — Pricing + retention band
**Next step:** 7 — `account.html` + `404.html`
**Last verified healthy:** 2026-09-24 HKT, step 5 (features + stage at 360/768/1280, console clean)

## Project values
- GitHub repo URL: https://github.com/notKivon/Vyrus-Mosaic (public)
- Vyrus Pages URL: *(pending, step 12)*
- Mosaic Pages URL: *(pending, step 12)*

## Session 1 — Vyrus site
Read: CLAUDE.md, PROGRESS.md, docs/vyrus-brand.md. Do not open docs/mosaic-brand.md.

- [x] 1. ⏸️ **Kevin: create the GitHub repo.** On github.com: New repository → name `vyrus-mosaic` (or your choice) → Public or Private → do **not** add a README, .gitignore or licence → Create. Report back the HTTPS URL. (Alternative: if `gh auth status` shows you are logged in, the agent may run `gh repo create vyrus-mosaic --private --source . --remote origin` after you approve it.)
- [x] 2. **Scaffold and first push.** `git init -b main`; add `.gitignore` check, short `README.md` (what the repo is, how to preview, pointer to CLAUDE.md, fictional-project line); create the folder layout from CLAUDE.md; `vyrus/index.html` as a minimal page that loads fonts, `tokens.css`, `components.css`, `site.css` and shows the wordmark plus one primary button, so the seed CSS is proven to load; `vyrus/_headers` with `X-Robots-Tag: noindex`. Test: serve and confirm fonts and button render. Commit, add remote, push.
- [x] 3. **Renders.** With Kevin's approval to read `~/Pictures/Vyrus Mockup/`, copy the four v2 JPEGs into `vyrus/assets/img/` under the names in the brand doc and make 640 px versions with `sips`. Check each file is under 300 KB (re-export at lower quality with `sips -s formatOptions 70` if not). If the folder is missing, stop and ask Kevin to drop the files into `vyrus/assets/img/`. Commit.
- [x] 4. **Vyrus shell + hero.** `site.css` base (box-sizing, body on `--ground`, container, section spacing, nav, footer), `site.js` (cursor typing enhancement, purchase dialog), nav, hero, footer with fictional line and `#partner-url-pending` link, the purchase dialog. Test at 360/768/1280 px, keyboard-only through nav and dialog, reduced motion. Commit.
- [x] 5. **Features + stage sections.** Features grid and the `.theme-deep` stage with spec readout and the three renders. Test responsive, image sizes, alt text. Commit.
- [ ] 6. **Pricing + retention band.** Three TierCards exactly as specified, EasyBreath line under Max, footnotes, retention band. Check every price against CLAUDE.md. Test phone order (Pro first). Commit.
- [ ] 7. **`account.html` + `404.html`.** RenewalBanner with live countdown (static 14:59 without JS), chips, device and Sponsored Moment cards; 404 page. Test countdown, JS-off rendering. Commit.
- [ ] 8. **Vyrus polish and session hand-off.** Titles, meta descriptions, favicon, OG tags, `noindex` meta on all pages; check contrast of any pairing not in the brand doc; grep the site for `TODO`, `lorem`, `diesel`, `fume`, `spike`, emoji (must be none in visible copy); console clean; all internal links resolve. Update Open items and the Challenges log. Commit and push. **End of Session 1.**

## Session 2 — Mosaic site, deploy, hand-back
Read: CLAUDE.md, PROGRESS.md, docs/mosaic-brand.md. Do not open docs/vyrus-brand.md.

- [ ] 9. **Mosaic shell + hero + proof row.** Folder files as in CLAUDE.md, `_headers`, `site.css` base, inline mark + lockup nav, hero with the assembling tile art, proof row DataTiles, footer with fictional line and `#partner-url-pending` link, briefing dialog in `site.js`. Test at 360/768/1280 px, keyboard, reduced motion. Commit.
- [ ] 10. **How it works + products.** Tile-convergence grid, Audience and Civic panels. Test responsive. Commit.
- [ ] 11. **Compliance, quote, CTA, 404, polish.** Compliance table (scrolls on phone), quote band, briefing CTA, `404.html`; titles, meta, favicon, `noindex`; grep for `TODO`, `lorem`, `surveillance`, `spike`, emoji; console clean. Commit and push.
- [ ] 12. ⏸️ **Kevin: create the two Cloudflare Pages projects.** In the Cloudflare dashboard: Workers & Pages → Create → Pages → Connect to Git → pick the repo. Use the settings table in CLAUDE.md (Deploy) for the Vyrus project, save and deploy; then repeat for the Mosaic project with its column. After both builds finish, report back the two `*.pages.dev` URLs.
- [ ] 13. **Cross-links and absolute URLs.** Replace every `#partner-url-pending` with the real partner URL (Vyrus footer + 404 → Mosaic URL; Mosaic footer + 404 → Vyrus URL); make the Vyrus `og:image` absolute; record both URLs under Project values. Grep confirms no `partner-url-pending` remains. Commit and push (both projects redeploy).
- [ ] 14. **Live verification and hand-back.** Fetch both live URLs: pages load, fonts load, images load, 404 pages work, `X-Robots-Tag: noindex` header present (`curl -sI <url> | grep -i robots`), cross-links go the right way. Then give Kevin: both URLs, a short list of tools used, and the Challenges log, ready for his "Build your campaign" and "Evaluate" slides.

## Open items
- Cross-links use `#partner-url-pending` until step 13.
- Vyrus `og:image` is relative until step 13.

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

## Challenges log
*(one line per notable problem and how it was solved; Kevin uses this for the evaluation slides)*
- Button labels were underlined because the design-system button styles did not reset anchor underlines; fixed with one rule in site.css.
- A typing-on headline normally makes the page jump as lines wrap; solved by typing into an overlay on top of the real text, which stays in place but transparent.
- The design system's ghost-link colour failed contrast on the aqua hero (3.9:1); measured every pairing and switched text on aqua to the dark on-aqua ink (9.9:1).

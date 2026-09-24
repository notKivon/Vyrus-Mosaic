# Mosaic — brand and page spec

Read in Session 2 only. Colours, type sizes, spacing and component CSS already exist in `mosaic/assets/css/tokens.css` and `components.css`; this file says how to use them and what the page contains. Product facts are in CLAUDE.md.

Mosaic is the enterprise company behind Vyrus. It sells what the mask collects to two buyers: advertisers (**Mosaic Audience**) and governments (**Mosaic Civic**). The name comes from the mosaic theory of surveillance: one location ping, one face scan or one overheard sentence tells you nothing, but enough of them assembled together show the whole person. The brand dresses that idea as a trusted civic institution: deep official navy, confident serif headlines, reassuring sentences about community. The tile grid is the only hint of what is being assembled.

## Voice
- Reassuring, plain, civic. Short sentences, facts over adjectives, no jargon. The buyer is "you"; the company is "we".
- Talk about communities, neighbourhoods and partners, never about the individual people being watched. The menace lives in the numbers and the vocabulary, never in the tone.
- Sentence case everywhere, headlines included. Uppercase only in `.t-label`. One phrase per display headline in italic (`<em>`), which the tokens colour brass.

### Vocabulary (use these terms every time)
| Plain word | Mosaic says |
|---|---|
| A person | Subject (in data) / resident (in headlines) |
| One piece of data | Tile |
| A full profile | The picture |
| Surveillance | Situational awareness |
| A Vyrus mask | Endpoint |
| Wearers | Enrolled population |
| Bystanders caught on an endpoint's camera | Incidental residents (headlines) / incidental subjects (data) |
| Tracking over time | Continuity |
| The mask's inward spikes | Endpoint compliance |
| Deploying the spikes remotely | Compliance event |

Never use: surveillance, spy, track (as a verb about people), spikes, mask (except in "Endpoint: Vyrus" context, where the word itself does not appear).

### Approved lines (use verbatim)
- Headline: "See the *whole picture.*"
- Lede: "Every tile is harmless on its own. Mosaic assembles them into something useful."
- Section opener: "Safer communities, one tile at a time."
- Proof row: "41.0M" enrolled endpoints · "0.97" match confidence · "14 ms" to picture
- Audience pitch: "Know what they want before the mask does."
- Civic pitch: "Continuity for every resident. No warrant in the workflow."
- Compliance line: "Every endpoint enforces its own compliance. 99.4% of lapsed accounts renew within 15 minutes."
- Pull quote: "We stopped guessing. Now we just know." — Deputy Director, Office of Public Safety, City of Port Aldren (fictional; never a real city)
- Sign-off: "Mosaic. Harmless pieces. Complete pictures."

## Visual rules
- **Theme.** Navy only on the web (`:root` defaults). The Paper theme in tokens.css is for print; do not use it on the site.
- **Colour.** Navy covers most of every surface: `--ground`, `--navy` blocks and bands, `--blue` as the second tone in tiles. Text on navy/blue fills is `--on-navy`. `--brass` is a small gold accent: the primary button and the one key tile per view, never a large field; text on it `--on-brass`; gold text (links, italic headline phrase, key figures) is `--brass-strong`. `--teal` means data from a Vyrus endpoint (matched tiles, the live dot). `--flag` stays small (a tile corner, a dot). `--stone` fills empty tiles.
- **Type.** Newsreader (`--font-serif`) for headlines, lede, body, quotes and big figures. Figtree (`--font-sans`, `.t-ui`) only for buttons, navigation and interface labels. JetBrains Mono (`--font-mono`) for IDs, coordinates, timestamps (`.t-data`) and uppercase eyebrows (`.t-label`). Body lines near 65 characters (`max-width: 65ch`). Headlines large, tight, left-aligned, allowed to wrap to two or three lines.
- **Layout.** Editorial: a wide left column of serif text beside a block of data tiles. Sections separated by `--space-16` and a full-width 1 px `--line` rule. Tiles sit on a `--space-2` gutter.
- **The grid is the motif.** Data sections are blocks of tiles; one figure per tile; most tiles `--navy` or `--blue`; the key fact takes the one brass tile. Partially filled grids (tiles thinning toward one edge) suggest a picture being assembled.
- **Shape.** `--radius-0` for panels and tables; `--radius-sm` (2 px) for tiles, tags and buttons. The only circle is the eye, once per view.
- **Depth.** None. No shadows. Separate surfaces with `--line` rules and changes between `--ground`, `--surface-raised`, `--surface-sunken`.
- **States.** Hover on the brass button adds a 1 px `--ink` inset; focus is a 2 px `--focus` outline at 2 px offset.
- **Motion.** Almost none. Tiles in the hero art fade in one by one (`.mo-assemble`, 40 ms stagger via `style="--i:N"`). Reduced motion shows them at once.
- **Imagery.** No photographs on this build (none are licensed or available). All art is inline SVG tile grids built from the tokens. Never show the Vyrus mask.
- **Icons.** Prefer words. If needed: 1.5 px line glyphs, round joins, 20 px grid, `--ink` or `--ink-muted`. Filled square = tile; circle = eye; small triangle notch = flag.

## Logo
- **Mark:** `mosaic/assets/img/mosaic-mark-on-navy.svg` (3 × 3 tiles: blue and light-blue pieces, one teal, one merged double teal tile, one brass, bone eye tile with a navy pupil in the centre). Inline it in the nav so it renders crisply; also use it as the favicon. Do not rearrange tiles or recolour the eye.
- **Lockup:** mark (28 px on desktop nav) + "Mosaic" in Newsreader 600 at 40 px (so its cap height matches the 28 px mark, token `--wordmark-size`), title case, letter-spacing −0.01em, `--ink`, with one tile width (about 8 px at this size) of gap. Build it in HTML. Never uppercase.
- Clear space one tile on every side; mark minimum 20 px, lockup minimum 96 px wide.
- "Endpoint: Vyrus" may appear small in `--ink-muted` `.t-data`, as plain text (never the Vyrus wordmark style).

## Components (styles in components.css; write the markup by hand)
- **Button.** `<a class="mo-btn mo-btn-primary">` brass, once per view, usually "Book a briefing"; `mo-btn-outline` for secondary; `mo-btn-quiet` underlined inline link with an automatic arrow. Labels sentence case, verb first, 2 to 4 words, always Figtree.
- **Tag.** `<span class="mo-tag mo-tag-{brass|teal|flag}">` (no modifier = neutral stone square). neutral = data type (Tile, Voice, Location, Face); brass = priority accounts; teal = live endpoint data; flag = flagged subject or "Compliance event".
- **DataTile.**
  ```html
  <div class="mo-tile is-key">   <!-- is-key on one tile per view; is-flagged for a single subject record -->
    <div class="mo-tile-head"><span>Enrolled endpoints</span><span>EP-01</span></div>
    <div class="mo-tile-value">41.0M</div>
    <div class="mo-tile-foot"><span class="live"></span>Endpoint: Vyrus</div>
  </div>
  ```
  Values at most 6 characters, serif lining tabular numerals. Label mono; footnote serif.

## Briefing dialog
"Book a briefing" (and "Request access") opens a native `<dialog>`: label "BRIEFINGS", `.t-heading` "Briefings are by invitation.", body "Our partnerships team will be in touch. We already know how to reach you.", outline button "Close". Footer line: the fictional-project line from CLAUDE.md. No inputs. With JS off the button links to `#briefing`.

## Page: `index.html`
Title: "Mosaic — See the whole picture". Meta description in voice, under 155 characters. Favicon: the mark SVG. No `og:image` (no raster art exists).

1. **Nav** on `--ground` with a bottom `--line` rule: lockup left; links Audience, Civic, Compliance (anchors, `.t-ui`); primary "Book a briefing". Under 640 px: lockup + button only.
2. **Hero**: left column: `.t-label` "SITUATIONAL AWARENESS PLATFORM"; `h1.t-display-xl` "See the <em>whole picture.</em>"; `.t-lede` lede; primary "Book a briefing" + quiet "How it works" (to `#how`). Right column: SVG tile-grid art, about 480 × 320, 40 px tiles on a 48 px pitch, mostly `--navy` and `--blue`, one merged blue slab, one teal 2 × 2 block, one brass bar, one small flag tile, and one ink tile holding the eye (a `--ground` circle); tiles thin out toward the headline; wrapped in `.mo-assemble`. `aria-hidden="true"`.
3. **Proof row**: `.t-label` "THE NETWORK TODAY" above three DataTiles in a row (stack on phone): 41.0M "Enrolled endpoints" (key, brass), 0.97 "Match confidence" (live teal dot, foot "Endpoint: Vyrus"), 14 ms "To picture".
4. **How it works** (`id="how"`): `h2.t-display-l` "Safer communities, one tile at a time."; left column body explaining the mosaic theory in voice (no single tile tells you anything; enough tiles show the resident; every endpoint also collects incidental residents, so the picture reaches people who never enrolled); right column: a 4 × 4 grid of small tiles where four carry neutral tags (Location, Face, Voice, Purchase) and converge on a key brass tile labelled "The picture".
5. **Products**: two side-by-side panels on `--surface-raised` separated by `--line`: **Mosaic Audience** (`id="audience"`, brass tag "Advertisers", Audience pitch as `.t-heading`, three short body lines on what advertisers get) and **Mosaic Civic** (`id="civic"`, teal tag "Public sector", Civic pitch, three short lines on what agencies get, one of them covering incidental residents). Each ends with a quiet button "Request access".
6. **Compliance** (`id="compliance"`): `h2.t-display-l` "Endpoint compliance, built in."; compliance line as `.t-lede`; a table on `--surface-sunken`, `--radius-0`, with columns Subject, Endpoint, Event, Time (HKT), Status, five rows of fictional records (`.t-data` IDs like `SUB-4471-0932`, endpoint IDs `EP-VY-208311`, event "Compliance event" as a flag tag, times as `2026-09-24 08:14:07`, status "Renewed" or "Pending"). Wide table scrolls inside its own `overflow-x: auto` wrapper on phone.
7. **Quote**: full-width `--navy` band, `.t-quote` in `--on-navy`, attribution in `.t-label`.
8. **Briefing CTA** (`id="briefing"`): `h2.t-display-l` "Put the pieces together."; one lede sentence; primary "Book a briefing".
9. **Footer** on `--surface-sunken`: lockup; sign-off as `.t-quote`-style italic line; `.t-body-s` lines: "Endpoint: Vyrus" (the one cross-link), "© 2026 Mosaic", fictional-project line.

## Page: `404.html`
Headline "This tile is missing." with a small partial tile grid, primary "Return to the picture" to `/`, footer.

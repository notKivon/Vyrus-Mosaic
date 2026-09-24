# Vyrus — brand and page spec

Read in Session 1 only. Colours, type sizes, spacing and component CSS already exist in `vyrus/assets/css/tokens.css` and `components.css`; this file says how to use them and what each page contains. Product facts and prices are in CLAUDE.md.

Vyrus looks like a developer-tools startup that pivoted into wellness: big flat fields of aqua, a monospaced voice that types rather than speaks, and a blinking cursor where a logo would be. Every surface should look like it could raise a Series B.

## Voice
- Breathless AI-startup optimism, delivered like a command prompt. Short declaratives, second person, present tense.
- Stack buzzwords with confidence: agentic, cloud-native, cloud-enabled, frictionless, personalised, next-gen, always-on, AI-native.
- Never apologise, never explain how anything works, never name the bad thing.
- Casing: `display-xl` and `display-l` headlines are lowercase. Headings, body and buttons are sentence case. Uppercase only in `.t-label`. In running text the product is always "Vyrus"; only the wordmark is lowercase. Feature names take ™ as listed below.

### Euphemism table (use these words every time)
| The truth | Vyrus says |
|---|---|
| Diesel fumes | Ambient Particulate Experience™ |
| The diesel canister | Vyrus Core™ (5 L) |
| Data harvesting | Personalisation |
| Camera that watches you | Biometric Lens™ |
| Microphone that turns on at the worst times | Always-Listening Assistant |
| Ads through the speaker and ad screen | Sponsored Moments |
| Paying not to breathe fumes | EasyBreath Pro™ |
| Spikes that fire when you stop paying | Retention Assurance™ |
| One spike firing | A Haptic Renewal Reminder™ |
| Not paying | A pause in your journey |

Never use the words diesel, fumes, spikes, pain, face (as a target), ads or data harvesting in visible copy. **One exception:** the Retention Assurance™ disclosure under the plan comparison (see Pricing) names the spikes plainly, in `.t-body-s` fine print, like a legal disclosure buried under the table. It is the only place the plain word appears. Everywhere else, use the euphemisms, but make them pointed: say where Haptic Renewal Reminders™ arrive ("through the face seal") and when ("after 14:59"), never what they are.

### Approved lines (use verbatim)
- Hero (matches the billboard): "breathe smarter_"
- Hero subline: "the face mask that knows you better than you do."
- Tier footnote: "Ambient Particulate Experience™ intensity varies by plan. EasyBreath Pro™ sold separately."
- Retention line: "Vyrus never lets you go. Every plan includes Retention Assurance™."
- Under the tier cards: "All plans include Retention Assurance™."
- Lapsed banner title: "Your journey is paused." Message: "Your last payment didn’t go through. Renew to keep Retention Assurance™ dormant." Clock label: "Reminders begin in". Button: "Renew now".
- Footer fine print: "Vyrus is a member of the Mosaic Partner Network."
- Spec readout: "5.0 L · 42 dB · 4K/60"
- Retention band body: "Every plan includes Retention Assurance™. Miss a payment and your mask starts a gentle 14:59 countdown. After that, Haptic Renewal Reminders™ arrive through the face seal until your journey resumes."
- EasyBreath panel: title "EasyBreath Pro™", chip "Max only", body "Twenty-four hours of zero Ambient Particulate Experience™, guaranteed. Add a day whenever you need one.", price "$9.99 / 24 hrs", secondary button "Add EasyBreath Pro™".
- Retention Assurance™ disclosure (fine print, the only plain-word line): "Retention Assurance™ disclosure: if a payment fails on any plan, your mask counts down 15 minutes, then deploys inward spikes through the face seal, one Haptic Renewal Reminder™ at a time, until the plan is renewed. EasyBreath Pro™ does not pause Retention Assurance™." 

## Visual rules
- **Colour.** Aqua is the canvas, not an accent. Every page has at least one large `--aqua` field covering a third or more of the first view. Pages sit on `--ground`; cards on `--surface-raised`. Text on aqua is `--on-aqua`; aqua as text is `--aqua-strong`. `--surface-inverse` is the dark terminal panel (primary buttons, spec readout, footer). `--amber` means diesel and appears only in fume meters or next to the canister. `--rec` is only the REC dot and the lapsed state, as small marks.
- **Themes.** Aqua everywhere, except one product-stage section wrapped in `.theme-deep`.
- **Type.** Martian Mono (`--font-mono`) for display, headings, prices, labels, specs, buttons. Figtree (`--font-sans`) for anything longer than a sentence (`.t-title`, `.t-body`, `.t-body-s`). One `.t-display-xl` per page. Body lines near 60 characters (`max-width: 60ch`).
- **The cursor.** An aqua underscore `<span class="vy-cursor blink">_</span>`. It ends the wordmark and the hero headline. The primary button adds its own via CSS; never type an underscore into a button label.
- **Layout.** A grid of flat fields, all left-aligned (hero included). Alternate `--ground` sections with full-bleed aqua bands. Section spacing `--space-16` desktop, `--space-12` phone. Cards pad `--space-6` and sit `--space-6` to `--space-8` apart. Phone gutter `--space-4`.
- **Shape.** Buttons and images `--radius-md`; chips `--radius-sm`; cards, panels and aqua fields `--radius-lg` (full-bleed bands are square-edged, inner fields rounded).
- **Depth.** Flat. `--shadow-card` only lifts white cards off `--ground`, never anything on aqua.
- **Motion.** Cursor and REC dot blink at 1 Hz. The countdown ticks once a second. The hero headline may type on once at 30 ms per character (JS enhancement; the full text is in the HTML). All disabled under reduced motion.
- **Icons.** No icon set. If needed: 1.5 px line glyphs, square ends, 24 px grid, in `--ink` or `--aqua-strong`, drawn as inline SVG. Recurring motifs: cursor, REC dot, canister, inward spike (lapsed only). No emoji, no clip-art.

## Logo
Wordmark only, no symbol: "vyrus_" in Martian Mono 500, lowercase, underscore cursor. Build it as HTML text, not an image:
`<a class="vy-wordmark" href="/">vyrus<span class="vy-cursor">_</span></a>`
- On `--ground` / white: letters `--ink`, cursor `--aqua-deep` (#0aa99b).
- On `--aqua`: letters `--on-aqua`, cursor `--surface-raised` (#f5fffd, white).
- On `--surface-inverse` / Deep: letters `--ink-inverse`, cursor `--aqua`.
Clear space one character on every side; minimum 72 px wide. Never uppercase, never replace the underscore, never another font. Only the hero cursor blinks; wordmark cursors are static. Favicon: `vyrus/assets/img/favicon.svg` ("v_" on an aqua rounded square).

## Imagery
Only the Blender renders of the mask, v2. Source files on Kevin's Mac: `~/Pictures/Vyrus Mockup/vyrus_v2_{hero,front,side,hero_deep}.jpg` (1280 × 960). Copy them into `vyrus/assets/img/` as `mask-hero.jpg`, `mask-front.jpg`, `mask-side.jpg`, `mask-deep.jpg`; also export 640 px wide versions with macOS `sips` (`sips --resampleWidth 640 in.jpg --out out-640.jpg`) and serve both through `srcset`. Show the mask centred with lots of empty space, no people. The renders contain no spikes; keep it that way. Alt text describes the object plainly ("Vyrus mask, three-quarter view, aqua shell with diesel canister").

## Components (styles in components.css; write the markup by hand)
- **Button.** `<a class="vy-btn vy-btn-primary">` (dark terminal button, auto cursor, turns aqua on hover; once per view), `vy-btn-secondary` (outlined), `vy-btn-ghost` (underlined inline link, use for ™ feature links). `vy-btn-sm` for the nav. Labels: sentence case, verb first, 2 to 4 words.
- **Chip.** `<span class="vy-chip vy-chip-{aqua|diesel|rec|lapsed}">`. aqua = AI features and "Recommended"; neutral (no modifier) = spec tags; diesel = canister or Particulate Experience™; rec = a live mic or camera (blinking dot); lapsed = "Journey paused" or "Payment overdue". At most three chips in a row, two words each.
- **TierCard.** 
  ```html
  <article class="vy-tier is-featured">  <!-- is-featured on Pro only -->
    <div class="vy-tier-head"><h3 class="vy-tier-name">Pro</h3><span class="vy-chip vy-chip-aqua">Recommended</span></div>
    <div class="vy-tier-price"><b>$9.99</b><span>/ month</span></div>
    <div class="vy-fume"><i><b class="on"></b><b class="on"></b><b class="on"></b></i>Particulate: continuous</div>
    <ul><li>…</li><li>…</li><li>…</li></ul>
    <a class="vy-btn vy-btn-primary" href="#">Choose Pro</a>   <!-- secondary on Lite and Max -->
  </article>
  ```
  Fume bars: Lite 3 on ("Particulate: continuous"), Pro 3 on ("Particulate: continuous"), Max 1 on ("Particulate: occasional"). Three feature lines each, written in voice from the product facts (Lite: Sponsored Moments included; Pro: no Sponsored Moments; Max: occasional particulates). Under Max only, a `.t-body-s` line: "EasyBreath Pro™ · $9.99 / 24 hrs". The fume meter is the only amber on the pricing section.
- **RenewalBanner.** `<section class="vy-renew" role="alert">` containing: the spike row, `.vy-renew-body` (h3 title + p message), `.vy-renew-clock` (`<small>` label + `<span>` time), and a primary "Renew now" button. Spike row as static SVG:
  ```html
  <svg class="vy-renew-spikes" aria-hidden="true" preserveAspectRatio="xMinYMin slice" viewBox="0 0 1600 10">
    <defs><pattern id="spk" width="16" height="10" patternUnits="userSpaceOnUse"><path d="M0 0h12l-6 10z"/></pattern></defs>
    <rect width="1600" height="10" fill="url(#spk)"/></svg>
  ```
  (set the pattern path's fill to `var(--rec)` in site.css, since the component rule targets `path`). The countdown starts at 14:59 and ticks down in `site.js`; with JS off it shows a static 14:59. Spike row, countdown and lapsed chip are the only red on the page.

## Purchase dialog
Every "Choose …", "Get Vyrus", "Start breathing smarter" and "Renew now" button opens one shared `<dialog>` (native element, focus-trapped, closes on Escape and on its button). Content: label "PROVISIONING", heading "your face is being provisioned_" (the dialog is a separate surface, so its cursor is allowed), body "Vyrus is enrolling in limited waves. Your place in the queue has been personalised.", one secondary button "Close". The dialog footer repeats the fictional-project line from CLAUDE.md. With JS off, these buttons link to `#pricing`.

## Pages

### `index.html` (the point of sale)
Title: "Vyrus — breathe smarter". Meta description in voice, under 155 characters. Open Graph: title, description, `og:image` = `assets/img/mask-hero.jpg` as an absolute URL once the Pages URL is known (relative until then; log it in Open items).

1. **Nav** on `--surface-raised`, sticky: wordmark left; links Features, Specs, Pricing (anchor links, `.t-spec` size, mono); small primary "Get Vyrus". Collapses to wordmark + button under 640 px (links hidden, no hamburger needed).
2. **Hero**, full-bleed `--aqua` band: eyebrow `.t-label` "AI-NATIVE · CLOUD-ENABLED · V1.0"; `h1.t-display-xl` "breathe smarter" + blinking cursor; the subline from Approved lines in `.t-heading` (Martian Mono, lowercase); one `.t-body` sentence of buzzword pitch; primary "Start breathing smarter" + ghost "See the specs"; `mask-hero.jpg` right of the text on desktop, below on phone, on a `--radius-lg` pale field. Three chips under the buttons: AI-native (aqua), Always on (neutral), Agentic (aqua).
3. **Features** on `--ground`: `h2.t-display-l` "agentic air." then a 3 × 2 grid of cards (`--surface-raised`, `--shadow-card`): Biometric Lens™, Always-Listening Assistant, Sponsored Moments, Ambient Particulate Experience™ (diesel chip), Vyrus Core™ (5 L) (diesel chip), Personalisation. Each: `.t-heading` title, one or two `.t-body` sentences in voice, optional chip.
4. **Stage**, `.theme-deep` full-bleed: `mask-deep.jpg` large; beside it a spec readout panel on `--surface-inverse` in `.t-spec`: rows for Biometric Lens™ 4K/60, Always-Listening Assistant 42 dB, Vyrus Core™ 5.0 L, Sponsored Moments display, Retention Assurance™ "Dormant", Connectivity "Cloud-native, always-on". A rec chip "Recording" on the panel. `mask-front.jpg` and `mask-side.jpg` as two smaller images below.
5. **Pricing** (`id="pricing"`) on `--ground`: `h2.t-display-l` "pick your plan."; three TierCards (Lite, Pro featured, Max), stacked on phone with Pro first; under the row the "All plans include Retention Assurance™." line and the tier footnote. Then:
   - **EasyBreath panel**: a `--surface-raised` card with the approved EasyBreath panel lines (see Approved lines). Its fume meter shows 0 bars on, labelled "Particulate: none".
   - **Plan comparison**: a native `<details>` whose `<summary>` is styled as a secondary button, "Compare all plans" (works without JS, keyboard-accessible). Inside is a `<table>` with a caption, plans as columns (Lite, Pro, Max), in a horizontal-scroll wrapper on phones. Rows: Price, Ambient Particulate Experience™, Sponsored Moments, Biometric Lens™, Always-Listening Assistant, Personalisation, Vyrus Core™ (5 L), EasyBreath Pro™ add-on, Retention Assurance™, Countdown before Haptic Renewal Reminders™ (14:59 on every plan). Values come only from the product facts in CLAUDE.md. Under the table: the Retention Assurance™ disclosure in `.t-body-s`, `--ink-muted`.
6. **Retention**, full-bleed `--aqua` band: `.t-display-l` "vyrus never lets you go." (lowercase display), the approved Retention band body, ghost link "See your account" to `account.html`.
7. **Footer** on `--surface-inverse`: white wordmark; anchor links; `.t-body-s` lines: fine print with the partner link, tier footnote, "© 2026 Vyrus", fictional-project line.

### `account.html` (the lapsed state, a demo of the subscriber app)
Title: "Your Vyrus". Same nav and footer.
1. RenewalBanner at the top of `main`, live countdown.
2. `h1.t-heading` "Good morning." with a chip row: "Plan: Lite" (neutral), "Journey paused" (lapsed), "Mic live" (rec).
3. Two cards side by side: **Device** (`mask-front.jpg` small, fume meter with 3 bars and "Particulate: continuous", "Vyrus Core™ 62%" with a diesel chip) and **Sponsored Moment** (an in-voice ad for upgrading: "upgrade / to pro_" style readout in `.t-spec` on `--surface-inverse`, "sponsored · 0:15").
4. A `.t-body-s` note: "Renewing restores your journey instantly. Retention Assurance™ returns to dormant."

### `404.html`
Aqua field, `.t-display-l` "this page paused its journey." (no cursor), primary "Back to Vyrus" to `/`, footer.

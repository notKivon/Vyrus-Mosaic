# Project hub brief (aiml.11123334.xyz)

The hub is the front door to the whole class project. Where Vyrus and Mosaic play it completely straight, the hub steps out of character: it is the exhibition label next to the exhibit. A teacher or classmate who lands here should understand in one screen what the project is, then be able to visit either site knowing what they are looking at.

## Voice
- Plain, dry and brief. Third person about the companies ("Vyrus sells...", "Mosaic buys..."), no marketing hype of its own. The humour comes from stating the facts flatly.
- It may say what the product really does (the camera records faces, the wearer's and everyone else's in view, the microphone switches itself on, the canister blows diesel fumes at the wearer). It never names or describes the spikes: it says "Retention Assurance™" and the 14:59 countdown, and leaves the rest to the Vyrus site's fine print.
- No names of people, schools or real companies. The author is "a student in an AIML class".
- British spelling; "data" is plural.

## Look
A neutral gallery: warm paper ground, near-black ink, fine rules, generous white space. It borrows neither brand's identity for itself; each brand appears only inside its own specimen panel, drawn with that brand's real colours and type, like a swatch pinned to a board.

| Token | Value | Use |
|---|---|---|
| `--paper` | `#f4f1ea` | Page ground |
| `--card` | `#fbfaf6` | Raised cards |
| `--ink` | `#17191e` | Text, primary button |
| `--ink-muted` | `#545963` | Secondary text (6.4:1 on paper) |
| `--line` | `#d8d2c4` | Rules and card borders |
| Specimen colours | copied from each brand's tokens | Vyrus aqua/ink pair, Mosaic navy/cream/brass |

Type: Figtree (headings 700, body 400) and IBM Plex Mono for small uppercase labels. Martian Mono and Newsreader are loaded only for the specimen panels.

## Page spec (index.html)
1. **Header.** Text mark "The Useless Product Launch" and anchor links: Companies, Campaign, Ethics, Making of.
2. **Hero.** Eyebrow "AIML · Unit 1: Generative AI and Ethics". Headline: "One useless product. Two companies. A very useful business model." Lede explaining the project in two sentences. Buttons: "Visit Vyrus" (primary) and "Visit Mosaic" (secondary). Beside it, a split specimen: aqua "breathe smarter_" over navy "See the whole picture.", joined by a small "data" arrow.
3. **The companies.** Two large specimen cards side by side: Vyrus (aqua, mask render, tagline, who it sells to, the site's job) and Mosaic (navy, mark, tagline, who it sells to, the site's job). Each ends with the site URL as a link.
4. **How the money moves.** A four-step flow as an ordered list: the wearer pays Vyrus; the mask collects; Mosaic assembles; advertisers and agencies buy the picture. One line under it: the wearer pays twice.
5. **What it says / what it does.** A table of the mask features: the Vyrus name, the Vyrus pitch in a few words, and what it really does. Plans row with the three prices. Lapsed-payment row per the voice rule above.
6. **The campaign.** The three assets as cards: website (both sites), billboard (a type-only mock of "breathe smarter_" on aqua with the wordmark bottom-right) and flyers (a type-only mock in the Mosaic paper theme). Each says the asset's job.
7. **Why it exists.** Three short points tying the joke to the unit: "AI-native" as a label, the subscription that punishes, and the user as the product. One closing line on the project itself being made with generative AI.
8. **Making of.** Tools used (Blender, Claude, HTML/CSS, GitHub, Cloudflare Pages) and the house rules (no forms, no tracking, noindex, fictional).
9. **Footer.** Links to both sites and the public GitHub repo; the standard fictional line.

`404.html`: short, in the hub voice, with links home and to both sites.

No JavaScript. No dialogs (nothing is for sale here).

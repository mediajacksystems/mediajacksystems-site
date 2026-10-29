# MediaJack Systems brand book

The rules every page, email and printed piece follows. The same text leads the "MediaJack Systems" design system in Claude
(tokens, components and logo files); `README.md` in this folder has the palette table with print values, `logo/` the logo files.

MediaJack Systems is Jack Johnson's one-person print and digital marketing shop in Englewood, Colorado: websites, Google and AI search, social, email and ads, plus the cards, mailers and signs that go out the door, each for a flat fee. The colours are Jack's three favourites, black, silver and the green of trees after rain, and the palette is named for that moment: wet bark, rain silver, a washed leaf. The brand looks like good print: sharp corners, rules instead of shadows, one accent, and printers' marks (the registration mark, crop marks) as the only ornament.

## Voice

- Write as Jack, in the first person singular: "I", "me". Never "we". One person you can call is the pitch.
- Use the words an owner uses: "Get found", "Look the part", "Stay in touch", "Put it in their hands", "Run it for you". No jargon ("omnichannel", "leverage", "solutions").
- Short sentences, facts over adjectives: "Every job is a flat fee, quoted before I start." "No hourly billing."
- Sentence case for headings and buttons. A button starts with a verb: "Get a free marketing check-up", "Call (970) 401-0185".
- No exclamation marks, no emoji, no hype words ("best", "#1", "guaranteed").
- Headings are statements. The only questions are the FAQ's, in the owner's words ("What does it cost?").
- Never invent clients, reviews, logos, numbers or results. Clients stay unnamed unless Jack names them.
- Write the phone number and email address out in full, as links.

## Colour

Three colours lead; the rest exist so the three work.

| Token | Value | What it is for |
|---|---|---|
| `wet-bark` | #0f1412 | Jack's black. Text, dark bands, the ring of the mark. |
| `rain-silver` | #c2c8cb | Jack's silver. The mark's quarters, drawings, text on `wet-bark`. |
| `rain-leaf` | #246b3c | Jack's green. The one accent: links, primary buttons, focus, numerals. |
| `canopy` | #163f25 | `rain-leaf` hovered and pressed; deep green grounds. |
| `moss` | #4d8b5c | Stripes and drawings only. |
| `new-leaf` | #8fd19e | Green on `wet-bark`: links and buttons in dark bands. |
| `dew` | #e2efe5 | Pale green ground behind green text. |
| `mist` | #eef1f0 | Silver-tinted ground: alternate sections, footer, panels. |
| `pewter` | #8c9499 | Dark silver: posts, quiet marks, muted text on `wet-bark`. |
| `graphite` | #48514d | Secondary text on light grounds. |
| `paper` | #ffffff | The page. |
| `ember`, `amber`, `amber-fill` | #b42318, #8a5b00, #f5c451 | Errors and warnings, always with words. |

- Build pages from the role tokens: `surface`, `surface-alt`, `ink`, `ink-muted`, `accent`, `accent-strong`, `on-accent`, `accent-soft`, `border`, `border-strong`, `focus`, `danger`, `warning`. Use the brand names directly only for the mark, the drawings and print.
- `accent` is the only colour that means "do this". One primary button per view.
- Silver is a material, not a text colour on light grounds: `rain-silver` is too light to read on `paper` (1.7:1). Use it for the mark, drawings, hairlines and words on `wet-bark` (11:1), and as the metallic blend (`mist` to `rain-silver` to `pewter`) on the Look the part stripe.
- On `wet-bark`, switch the accent to `new-leaf` (10.4:1) and put `wet-bark` text on a `new-leaf` button.
- `moss`, `pewter` and `line` never carry words on light grounds.
- The site is light. The dark theme is for anything set on `wet-bark`: the closing band, slides, social cards.

Contrast of the pairs in use (WCAG 2): `ink` on `surface` 18.6:1 and on `surface-alt` 16.4:1; `ink-muted` 8.2:1 and 7.2:1; `accent` 6.5:1 and 5.7:1; `on-accent` on `accent` 6.5:1; `rain-silver` on `wet-bark` 11:1; `new-leaf` on `wet-bark` 10.4:1. Dark theme: `ink` 16.4:1, `ink-muted` 8.5:1, `accent` 10.4:1.

### In print

| Colour | Coated CMYK | Spot | Notes |
|---|---|---|---|
| Wet Bark | text: K100 only; large areas: C60 M40 Y40 K100 | Pantone Black 3 C | Never rich black in small type. |
| Rain Silver | C29 M18 Y19 K0 | Pantone 877 C (metallic) | On cards, the silver quarters and lines can be silver foil. |
| Rain Leaf | C82 M26 Y88 K34 | Pantone 349 C | Proof it on uncoated stock, where it prints darker. |
| Canopy | C84 M33 Y88 K66 | | |
| Moss | C70 M18 Y72 K19 | | |
| Mist | C7 M5 Y6 K0 | | Very light: proof it, it can vanish on some stocks. |

CMYK values are the screen colours converted to FOGRA39 coated (relative colorimetric). Pantone matches are the nearest by published screen values: check them against a swatch book before a spot-colour job.

## Type

- One family: Archivo (variable, weight 100 to 900, width 62% to 125%; SIL Open Font License), in `fonts/archivo-var.woff2`.
- Headlines (`display`, `title`, `subtitle`): weight 800 at 118% width, tracking -0.012em, balanced lines. The wordmark and step numerals (`numeral`) run at 125%.
- Reading text stays at normal width: `body` 18/1.6, `lede` 21/1.5 in `ink-muted`, `small` 15/1.5. Short bold lines (`lead-in`, `button`) at 106% to 108%.
- Keep lines under 40em, ledes under 38em.
- Anything a mail client renders uses Arial: mail clients ignore web fonts.

## Layout and spacing

- Content runs to `content-max` (1180px) inside the `gutter` (16px to 40px).
- Sections take `space-5` above and below and alternate `surface` and `surface-alt`; the last band before the footer is `wet-bark`.
- Two-column layouts (words and drawing, name and list) become one column below 960px; the navigation folds into a Menu button below 820px.
- `space-1` to `space-4` for the gaps inside a section.

## Lines, corners and depth

- Rules do the work shadows would: a `rule-heavy` line in `ink` over every list (services, steps, FAQ), `rule` lines in `border` between rows.
- Corners are print-sharp: `radius-sm` (2px) for buttons, `radius-hair` for stripes, `radius-full` only for dots and the map pill.
- No shadows. The only gradients are the silver blend and the foil on the drawn business card.
- Printers' marks are the only ornament: crop marks frame the one thing to do (CheckupPanel); the registration mark is the logo.

## Imagery

- Drawings of the real surfaces a customer sees, in brand colours: a mailer with a green edge, a black business card with silver foil, a green street sign with white letters, a phone, a map pin.
- No stock photos, no faces, no mascots, no icon sets. Photographs only of Jack and his real work.

## Logo

The registration mark with two `rain-leaf` and two `rain-silver` quarters, beside the wordmark "MediaJack Systems" in Archivo ExtraBold at 125% width. Use the files in the Logos group as they are: the light-ground file on `paper`, `mist` and `dew`, the silver-ring file on `wet-bark`, the one-colour file for one-ink print. Clear space is half the mark's width on every side.

## Motion

One moment only: on load, the drawing's pieces settle into place (0.9s, staggered), and only when the visitor allows motion (`prefers-reduced-motion: no-preference`). Nothing else moves.

## Email

- Every email from jack@mediajacksystems.com ends with the EmailSignature: the `wet-bark`, `rain-silver`, `rain-leaf` stripe and the site as a short plain link.
- Cold emails (the Agent Keep's US Desk) set what was found in a `mist` panel with a `rain-leaf` rule and numbers, and end with the marketing-email footer and the postal address.
- No images, no tracking, links written out short.

## Accessibility

- Every text pair meets WCAG 2.2 AA in both themes; the site is checked with axe-core on every page, at desktop and phone width.
- Focus is always visible: a 3px `focus` outline 3px out, or the `focus-ring` shadow.
- Colour never carries meaning alone: stripes sit beside service names, errors beside words.

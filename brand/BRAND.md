# MediaJack Systems brand book

The rules every page, email and printed piece follows. `README.md` in this folder has the palette table with print values and the list of logo files; `logo/` has the files.

## The idea

Customers follow signs. Jack puts them up.

MediaJack Systems is Jack Johnson's one-person shop in Englewood, Colorado: marketing for local businesses, and custom-built systems for the ones that need them. He works in person around Denver and by phone, email and video anywhere in the US. Marketing for a local business is wayfinding: the Google listing, the website, the mailer and the sign out front all point a customer to the door. So the brand is built from the American road-sign system, the design system every contractor, salon owner and shop owner already reads every day.

It keeps Jack's three colours, black, silver and the green of trees after rain, and puts them where they already live together: asphalt, aluminium and highway green. It adds one colour, the fluorescent yellow-green of warning signs and safety vests, because marketing is about being seen. Road signs say short true things in big letters. So does Jack.

## Voice

- Write as Jack, in the first person singular: "I", "me". Never "we". One person you can call is the pitch.
- Use the words an owner uses: "Get found", "Look the part", "Stay in touch", "Put it in their hands", "Run it for you". No jargon ("omnichannel", "leverage", "solutions").
- Short sentences, facts over adjectives, like a sign: "Flat fee." "One person." "Quoted in writing first."
- Sentence case for headings and buttons. A button starts with a verb: "Get a free marketing check-up", "Call (970) 401-0185".
- No exclamation marks, no emoji, no em dashes, no hype words ("best", "#1", "guaranteed").
- Headings are statements. The only questions are the FAQ's, in the owner's words ("What does it cost?").
- The brand line is "Customers follow signs. I put them up." Use it once on a page at most. Don't add road puns beyond the lines in the direction.
- Never invent clients, reviews, logos, numbers or results. Clients stay unnamed unless Jack names them.
- Write the phone number and email address out in full, as links.

## Colour

Green is a surface. Hi-vis is the action.

| Token | Screen | Role |
|---|---|---|
| `guide` | #00674a | Highway green. Sign plates: the hero sign, street blades, the price board, mile markers. |
| `guide-deep` | #00503a | `guide` hovered and pressed. |
| `hivis` | #d6ee00 (P3: `color(display-p3 .85 .94 .08)`) | Fluorescent yellow-green. The one colour that means "do this": primary plates, the hi-vis panel, the check-up band, the logo. Always with black on it, never white. |
| `ink` | #000000 | Text, legends on white and hi-vis, borders on white plates. Real black, like sign paint. |
| `asphalt` | #1c1d1f | The road: the night section and the footer. |
| `paper` | #ffffff | The page, white regulatory plates, legends on green. |
| `overcast` | #eceeed | Alternate sections. Cool, never cream. |
| `aluminum` | #b9bfc1 | The blades' post and hairlines. Never text on light grounds. |
| `ink-muted` | #33383a | Secondary text on light grounds. |
| `work` | #f58220 | Construction orange. Only the work zone marker on the jobs section. |
| `stop` | #b3202b | Errors, always with words. |

- Body copy is black on `paper` or `overcast`.
- Links in running text are black with a 2px underline and get a hi-vis highlight behind them on hover and focus.
- `hivis` is too light to carry anything on `paper` or `overcast` (1.3:1 and 1.1:1). On light grounds it always sits inside a black line: the inset border of a plate, the outline of the mark.
- `aluminum` and `work` never carry words on light grounds.

### Contrast

Measured with the WCAG 2 formula for every pair in use. AA needs 4.5:1 for body text and 3:1 for large text and for the edges of controls.

| Foreground | Background | Ratio | Use |
|---|---|---|---|
| `ink` | `paper` | 21.0:1 | body text |
| `ink` | `overcast` | 18.0:1 | body text on alternate sections |
| `ink` | `hivis` | 16.1:1 | plate and panel legends, the check-up band |
| `ink` | `aluminum` | 11.3:1 | rare: a label on a post |
| `ink` | `work` | 8.1:1 | the legend in the work zone marker |
| `ink-muted` | `paper` | 11.9:1 | secondary text |
| `ink-muted` | `overcast` | 10.2:1 | secondary text |
| `paper` | `guide` | 6.9:1 | sign legends, blades |
| `paper` | `guide-deep` | 9.5:1 | pressed blades |
| `paper` | `asphalt` | 16.9:1 | night section, footer |
| `overcast` | `asphalt` | 14.5:1 | secondary text in the footer |
| `aluminum` | `asphalt` | 9.1:1 | quiet text in the footer |
| `hivis` | `asphalt` | 12.9:1 | hi-vis plates and the mark at night |
| `hivis` | `guide` | 5.3:1 | the hi-vis band on a green sign, the mark on a green plate, a green sign on the hi-vis band |
| `stop` | `paper` | 6.7:1 | error text |
| `stop` | `overcast` | 5.7:1 | error text |
| `paper` | `stop` | 6.7:1 | text on an error plate |
| `aluminum` | `paper` | 1.9:1 | posts and hairlines only, never text |
| `work` | `paper` | 2.6:1 | the marker's fill only, always with its black border |
| `hivis` | `paper` | 1.3:1 | never without a black edge |

### In print

The road-sign colours have published spot colour matches from the Federal Highway Administration (MUTCD color specifications, https://mutcd.fhwa.dot.gov/kno-colorspec.htm). That page lists them "for printing purposes only" and says they are not for sign fabrication.

| Colour | Spot | Source of the match | Process (CMYK) |
|---|---|---|---|
| Guide green #00674a | Pantone 342 C | FHWA lists PMS 342 for sign green | FHWA lists 100-0-100-0 for green. That is the sign standard, and it prints brighter than our screen green. For our green, have the printer convert #00674a with their profile and proof it. |
| Hi-vis #d6ee00 | none | FHWA: "There are no Pantones available for fluorescent alternatives of standard colors." FHWA lists PMS 382 for standard (non-fluorescent) yellow-green. | Starting point C10 M0 Y100 K7 (uncalibrated). 382 C is the nearest by the FHWA list; check it against a swatch book. For signs, yard signs and magnets, ask for fluorescent yellow-green sheeting or ink by name. |
| Work orange #f58220 | Pantone 152 C | FHWA lists PMS 152 for orange | Starting point C0 M47 Y87 K4 (uncalibrated) |
| Stop red #b3202b | Pantone 1805 C | FHWA lists PMS 1805 for red | Starting point C0 M82 Y76 K30 (uncalibrated) |
| Ink #000000 | Pantone Black C | nearest by screen value, check against a swatch book | text K100 only; large solid areas can take a rich black the printer recommends |
| Asphalt #1c1d1f | none | nearest by screen value, check against a swatch book | ask the printer for a rich black build |
| Aluminium #b9bfc1 | Pantone 877 C (metallic) where a real silver is wanted | a choice, not a match | Starting point C4 M1 Y0 K24 (uncalibrated) |
| Overcast #eceeed | none | | Starting point K7 (uncalibrated). Very light: proof it. |

"Uncalibrated" means a plain arithmetic conversion from the screen value, made without a press profile. Use it to brief a printer, never as a final value: the printer converts from the hex with their own profile and sends a proof. The green and the hi-vis matter most; see them printed before a run.

## Type

- One family: Overpass (variable, weights 400 to 900; SIL Open Font License), drawn from Highway Gothic, the US road-sign alphabet. Self-hosted as `overpass-var.woff2`. Nothing else loads.
- Sign legends: weight 800, mixed case like modern guide signs, line height about 1. The home page's two giant words ("Marketing", "Systems") are set at 700 from tablet width up, where 800 reads as weight rather than as sign lettering, and at 800 on phones. They are as large as the page's column allows, with "for local businesses." at about a quarter of their size.
- Section headings (H2): weight 900, tracking -0.012em, `clamp(2.1rem, 7vw, 4rem)`. The brand line is bigger: `clamp(2.4rem, 6.5vw, 5.5rem)`.
- Body 18px/1.55, weight 400. Ledes 1.15 to 1.4rem. Nothing under 15px.
- ALL CAPS only where a real sign would use them: inside white regulatory plates (the price plates) and the small tags on street blades. Never as a label above a heading.
- Numerals are the heroes on price plates and job numbers: weight 900.
- The wordmark: "MediaJack" in weight 800, "Systems" in weight 500.
- Anything a mail client renders uses Arial: mail clients ignore web fonts.

## The parts

Spend the boldness on the signs. Everything between them is quiet: white or overcast ground, black text, generous space, no cards, no shadows, no gradients except the metal of the one post and the light of the headlights.

1. **Guide sign.** A `guide` plate framed by one thin `paper` line (2px on phones, 3px from tablet width) set in from the edge. Legends in `paper`. Thin lines, big type: the sign should never look boxed in.
2. **The sign as the screen.** On the home page the first screen under the header is the sign: full-bleed green, edge to edge, with the thin white line inset 16px (10px on phones). Two giant destinations, the sign arrow, a rule, one line. Every inner page's head is the same sign at the height of its words. No posts, no road, no second button under it.
3. **Plaque and exit tab.** On a full-bleed sign the place or page name is a small outlined plaque inside the line (tucked into the line's top right corner from tablet width, top left on phones, the same gap from the line either way). On a sign that stands on a ground (the sign maker, the 404 sign) it is an exit tab on the top right edge. The home page's says "Englewood, Colorado".
4. **Hi-vis band.** Along the foot of a sign, inside the line: one flat `hivis` band with a black legend, like the EXIT ONLY panel on a real sign. It holds the main thing to do and, where there are two, a thin black rule between them (the check-up with its arrow, then the phone number). Each part is a full-size link.
5. **Plates (buttons).** Primary: `hivis` with a black inset line. Secondary: `paper` with a black line. On the check-up band: black. At least 48px tall, 8px radius, weight 800. Pressed: down 1px. No arrows on buttons.
6. **Speed-limit price plates.** White, 4:5, black inset border, a small caps label on top ("WEBSITE FROM"), a huge numeral ("$500", weight 900) and a small caps sub-label ("A MONTH") where there is one. The dollar sign is set at 55 percent and raised to the numeral's top. Every plate has the same three rows, so the numerals in a row share one baseline. A plain-case note sits under each plate. Keep them deadpan and exact: the prices are Jack's real price list. Custom systems have no plate and no price: they are quoted for the job.
7. **Street blades and post.** The six services as green street-name blades on one slim aluminium post, each a link with a right arrow and a small caps tag in the owner's words (Get found, Look the part, Stay in touch, Put it in their hands, Run it for you, Built to order).
8. **Distance sign.** A green plate with three rows and white rules between them: the place on the left in weight 800, how the work is done on the right in weight 600. It is where "local, and anywhere in the US" is said. The price board on the services page is the same sign.
9. **Work zone marker.** One small `work` diamond with a black border on the jobs section. The jobs themselves are plain: a black 4px rule, a 900-weight number from the job's own records, two lines of fact and a real screenshot.
10. **The check-up band and the sign maker.** The free check-up is the main offer, so it gets the loudest block on the page: full-bleed `hivis`, black type, black plates. In it, two fields (business name and town) draw the visitor's own business on a green guide sign as they type, with the exit tab, the arrow and "Next right". Long names step down through three sizes. The preview is for the eye only; the fields carry the meaning, and nothing is sent.
11. **Night.** The last section before the footer is `asphalt`, opened by dashed white lane marks. The closing sign glows a little, as if headlights just found it.
12. **Posts.** Only two things stand on posts: the service blades (one slim post) and the 404 sign, which is off the route. Nothing else.

One hi-vis thing on a first screen. On the home page that is the band at the foot of the sign, so the header's hi-vis plate ("Call" on phones, "Free check-up" on wide screens) is a quiet white plate with its black line until the reader has scrolled about a screen, then turns hi-vis. Where the browser can't do that, or motion is not wanted, it is hi-vis all the time.

No section adds a decorative object. If in doubt, take it out.

The only arrows are sign arrows: the big guide arrow (the hero's and the sign maker's, a slim shaft pointing up and to the right), the band's arrow and the blades' arrows. They share one head shape with swept-back barbs, and the arrow in the mark is drawn from the same shape.

## Motion: headlights

Signs are retroreflective: they shine back at the light that finds them. That is the one motion idea.

- On load, one soft band of light sweeps across the first screen, once, in about 1.5 seconds.
- When the closing night sign scrolls into view, it lights up, once.
- On devices with a mouse, a soft light follows the pointer across a sign.
- Plates and blades answer a press. Nothing else moves. No fade-ins.
- All of it is off under `prefers-reduced-motion`.

## Imagery

- Real photos and real work only: screenshots of real client sites and photos of Jack. No stock photos, no mascots, no icon sets, no drawings standing in for work.
- No placeholder text or stand-in images anywhere.
- Client names stay off unless Jack names them. Never an invented number.

## Logo

The mark is a hi-vis diamond warning sign with a black inset border. Inside is a black J that is also an up arrow: J for Jack, and an arrow because the job is pointing customers the right way. The wordmark is "MediaJack" in Overpass ExtraBold with "Systems" smaller in Medium, or both on one line where space is tight. The letters are outlines in the files, so they need no font.

| File | Use |
|---|---|
| `mediajack-mark.svg` | The mark on `paper`, `overcast` and `guide`. |
| `mediajack-mark-on-dark.svg` | The mark on `asphalt` and photos (no hairline edge). |
| `mediajack-mark-one-color.svg` | One-ink black print: rubber stamps, invoices, one-colour jobs. |
| `mediajack-lockup.svg` | Mark and two-line wordmark on light grounds. |
| `mediajack-lockup-on-dark.svg` | White wordmark for `asphalt` and `guide`. |
| `mediajack-lockup-one-line.svg` | Where height is tight: headers, footers, letterhead. |
| `png/` | Each of the above at 512 and 1024 px wide, transparent. |

- Clear space: half the mark's width on every side, kept clear of text and edges.
- Smallest size: the mark at 16px on screen (use `favicon.svg`, the small-size cut) and 8mm wide in print. The lockup at 120px or 30mm wide.
- The small-size cut (`public/favicon.svg`) moves the inset border out to the edge of the plate and enlarges the J, so the mark still reads at 16 and 32px. Use it only for icons.
- Don't recolour the mark, rotate it off its point, put white in it, add a shadow, stretch it, or set the wordmark in another font.
- On `hivis` grounds, use the one-colour mark or the lockup in black; the hi-vis mark disappears there.

## Email

- Every email from jack@mediajacksystems.com ends with the signature: Jack's name, the phone number and the site as a short plain link, with one thin `hivis` line above it edged in black. Set in Arial.
- Cold emails (the Agent Keep's US Desk) set what was found in an `overcast` panel with a black rule, and end with the marketing-email footer and the postal address.
- No images, no tracking, links written out short.

## Accessibility

- Every text pair meets WCAG 2.2 AA (the table above). The site is checked with axe-core on every page, at desktop and phone width.
- Focus is always visible: a 3px black outline, 3px out. On `guide` or `asphalt`, 3px white.
- Targets are at least 44px; plates are at least 48px tall.
- Colour never carries meaning alone: the hi-vis band says what it does, errors say what went wrong, the work zone marker sits beside words.
- All motion stops under `prefers-reduced-motion`.

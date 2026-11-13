# mediajacksystems.com

The website for MediaJack Systems LLC: marketing and custom systems for local businesses, run by Jack Johnson in Englewood, Colorado.

Plain HTML and CSS, one small script, no packages, no build tools to install, no cookies and no tracking.

How the site is graded (11 categories, 92 checks) and its score: https://claude.ai/artifact/7eAujp9ykngFTWNtgMaMrs

## What's where

| Path | What it is |
| --- | --- |
| `public/` | The published site: every file here is served as-is. |
| `src/pages/` | Each page's content, with its title and description in the `<!--meta {...} -->` block at the top. |
| `src/layout.html` | The header, footer and `<head>` shared by every page. |
| `src/build.py` | Puts the layout, pages, partials and `src/site.json` together into `public/`, and writes `sitemap.xml`. |
| `src/partials/` | Pieces used on more than one page: the message form, the price plates, the check-up list, the closing sign. |
| `public/assets/site.js` | The one small script: the menu, the headlights, the sign maker, the form and the self-check. Everything works without it. |
| `src/site.json` | The booking link, the photo, the work samples and the other facts that switch parts of the site on. |
| `public/assets/site.css` | All the styles. Colours and spacing are set at the top; each sign part has its own block. |
| `server.mjs` | A tiny Node web server for `public/` (pretty URLs, redirects from the old site, compression, security headers) and the message form's endpoint. |

## Change something

1. Edit a page in `src/pages/` (or the layout, or `public/assets/site.css`).
2. Run `python3 src/build.py` (Python 3, nothing to install).
3. Preview with `node server.mjs` and open http://localhost:5000.
4. Commit and push to `main`.

## How it gets published

The site is published on Replit at mediajacksystems.com without using Replit's AI. Replit's project
("MediaJack Systems Website") fetches this repository when it publishes:

- `artifacts/mediajack/.replit-artifact/artifact.toml` in the Replit project has its production build
  download this repository into `artifacts/mediajack/site`, and its production run is
  `node artifacts/mediajack/site/server.mjs` on the port Replit gives it.
- So publishing = push here, then press Publish (or Republish) in Replit. Replit always builds from the latest `main`.
- The one-time switch in Replit is `replit/setup.sh` (it keeps the old settings as `artifact.toml.before-github`):
  `curl -fsSL https://raw.githubusercontent.com/mediajacksystems/mediajacksystems-site/main/replit/setup.sh | sh`

## The look: the sign system

Customers follow signs, so the site is built from the American road-sign system. The full brand book is `brand/BRAND.md`.

- Type: Overpass (drawn from Highway Gothic, the US road-sign alphabet), one variable file, self-hosted. Licence: SIL Open Font License, `public/assets/fonts/OFL.txt`. A fallback with matching measurements is set in the CSS, so nothing moves when the font arrives.
- Colours: highway green `#00674a` (sign plates), hi-vis yellow-green `#d6ee00` (the one colour that means "do this", always with black text), black `#000000`, asphalt `#1c1d1f`, overcast `#eceeed`, aluminium `#b9bfc1` (the blades' post and hairlines), construction orange `#f58220` (the work-zone sign only) and stop red `#b3202b` (errors). They are set at the top of `public/assets/site.css`.
- The parts: the guide sign with its thin white line (`.sign`); the sign as the screen, full-bleed under the header, for the home page's first screen and every inner page's head (`.sign--bleed`, `.sign--hero`, `.sign--page`) with its plaque (`.sign__tab`) and the hi-vis band along its foot (`.sign__exits`, `.panel`); plates for buttons (`.plate`); speed-limit price plates (`.limit`); street blades on a post (`.blade`, `.fingerpost`); the distance sign (`.distance`) and the price board (`.board`); mile markers for steps (`.route`); the hi-vis check-up band with the sign maker (`.band`, `.maker`); and the night section with the closing sign (`.night`).
- The sign maker (home page, in the check-up band): two fields, business name and town, draw a guide sign as the visitor types. It only sets text and switches classes, sends nothing, and is hidden when JavaScript is off. "Ask for my check-up" keeps the two values in the tab's `sessionStorage` and the check-up page puts them in the form's business field, once.
- On the home page the header's hi-vis button starts as a white plate and turns hi-vis after about a screen of scrolling (a CSS scroll timeline, `@keyframes wake` in `site.css`; no script). Browsers without scroll timelines, and visitors who ask for reduced motion, get the hi-vis button all the time.
- Sign legends are real text. Capitals come from CSS only.
- Motion is one idea, headlights: a band of light crosses the first screen once, the closing sign lights up when it comes into view, and a soft light follows the pointer across a sign. All of it is off when the device asks for reduced motion.
- Accessibility: WCAG 2.2 AA, checked with axe-core on every page at phone and desktop widths. White on green is 6.9:1 and black on hi-vis is 16:1.
- The strict content policy in `server.mjs` allows no inline styles or scripts, so custom properties are set from `site.js`.

## Facts that switch parts of the site on: `src/site.json`

| Key | What it does when filled in |
| --- | --- |
| `booking_url` | Adds the "Book a 30-minute call" buttons and links. Now Jack's Google Calendar booking page. |
| `photo` | The photo of Jack on the home and About pages. Files: `public/assets/img/<name>-160`, `-480`, `-880` (`.webp` and `.jpg`). |
| `work` | The work zone ("Jobs I've done, with the numbers"). Real jobs only. Client names stay off unless Jack says otherwise. A job with `shot` shows its real screenshots: files `<shot>-desk-480/-960` and `<shot>-phone-160/-320` in `public/assets/img/`. |
| `testimonials` | The big client quote. Each needs `quote`, `name`, `business` and the person's permission. |
| `profiles` | Links to the Google Business Profile, LinkedIn and others in the footer, and `sameAs` in the structured data. |
| `reply_promise`, `capacity`, `hours` | One sentence each, shown by the form, on the About page and on the Contact page. |

## The message form

The form on `/contact/` and `/check-up/` posts to `/form/check-up` on this server, which passes the message to Jack's inbox through
[Resend](https://resend.com). It is off until the server has a key and Resend says the sending domain is verified
(the server asks at start, then every 10 minutes until it is). While it is off the pages show the email button instead.
Keep the form's address off `/api/`: on Replit that path goes to the workspace's other service, not to this server.

To switch it on, in Replit (Secrets), Jack adds:

- `RESEND_API_KEY`: a Resend API key (required). A secret named `Resend` works too.
- `CONTACT_FROM_EMAIL`: optional. Defaults to `MediaJack website <website@mediajacksystems.com>`. The domain has to be verified in Resend.
- `CONTACT_TO_EMAIL`: optional. Defaults to `jack@mediajacksystems.com`.

Nothing a visitor sends is written to disk or logged. Robots are stopped by a hidden field and a two-second minimum, and each address
can send five messages an hour.

## Rules for the content

- No made-up reviews, client names, logos, awards or numbers.
- Every job is described as a flat fee, quoted in writing before work starts.
- Client names stay off the site unless Jack says otherwise.

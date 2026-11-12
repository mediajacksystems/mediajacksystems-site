# mediajacksystems.com

The website for MediaJack Systems LLC: print and digital marketing for small and growing businesses, run by Jack Johnson in Englewood, Colorado.

Plain HTML and CSS, one small script, no packages, no build tools to install, no cookies and no tracking.

How the site is graded (11 categories, 92 checks) and its score: https://claude.ai/artifact/7eAujp9ykngFTWNtgMaMrs

## What's where

| Path | What it is |
| --- | --- |
| `public/` | The published site: every file here is served as-is. |
| `src/pages/` | Each page's content, with its title and description in the `<!--meta {...} -->` block at the top. |
| `src/layout.html` | The header, footer and `<head>` shared by every page. |
| `src/build.py` | Puts the layout, pages, partials and `src/site.json` together into `public/`, and writes `sitemap.xml`. |
| `src/partials/` | Pieces used on more than one page: the message form, the price strip. |
| `src/site.json` | The booking link, the photo, the work samples and the other facts that switch parts of the site on. |
| `public/assets/site.css` | All the styles. Colours, type and spacing are set at the top. |
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

## The look

The full brand book is `brand/BRAND.md`.

- Type: Archivo (variable width and weight), self-hosted. Licence: SIL Open Font License, `public/assets/fonts/OFL.txt`.
- Colours: wet-bark `#0f1412` (text), rain-silver `#c2c8cb`, rain-leaf `#246b3c` (the one accent), on paper `#ffffff` and mist `#eef1f0`.
- Printers' marks are the only ornament: the registration mark (the logo), crop marks, the dashed tear line on the job tickets and the colour bar above the footer.
- Accessibility: WCAG 2.2 AA (checked with axe-core on every page at phone and desktop widths), body text above 7:1.

## Facts that switch parts of the site on: `src/site.json`

| Key | What it does when filled in |
| --- | --- |
| `booking_url` | Adds the "Book a 30-minute call" buttons and links. Now Jack's Google Calendar booking page. |
| `photo` | The photo of Jack on the home and About pages. Files: `public/assets/img/<name>-160`, `-480`, `-880` (`.webp` and `.jpg`). |
| `work` | The job tickets ("Jobs I've done, with the numbers"). Real jobs only. Client names stay off unless Jack says otherwise. |
| `testimonials` | A "What clients say" section. Each needs `quote`, `name`, `business` and the person's permission. |
| `profiles` | Links to the Google Business Profile, LinkedIn and others in the footer, and `sameAs` in the structured data. |
| `reply_promise`, `capacity`, `hours` | One sentence each, shown by the form, on the About page and on the Contact page. |

## The message form

The form on `/contact/` and `/check-up/` posts to `/api/check-up` on this server, which passes the message to Jack's inbox through
[Resend](https://resend.com). It is off until the server has a key, and while it is off the pages show the email button instead.

To switch it on, in Replit (Secrets), Jack adds:

- `RESEND_API_KEY`: a Resend API key (required).
- `CONTACT_FROM_EMAIL`: optional. Defaults to `MediaJack website <website@mediajacksystems.com>`. The domain has to be verified in Resend.
- `CONTACT_TO_EMAIL`: optional. Defaults to `jack@mediajacksystems.com`.

Nothing a visitor sends is written to disk or logged. Robots are stopped by a hidden field and a two-second minimum, and each address
can send five messages an hour.

## Rules for the content

- No made-up reviews, client names, logos, awards or numbers.
- Every job is described as a flat fee, quoted in writing before work starts.
- Client names stay off the site unless Jack says otherwise.

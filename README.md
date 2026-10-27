# mediajacksystems.com

The website for MediaJack Systems LLC: print and digital marketing for small and growing businesses, run by Jack Johnson in Englewood, Colorado.

Plain HTML and CSS, one small script, no packages, no build tools to install, no cookies and no tracking.

## What's where

| Path | What it is |
| --- | --- |
| `public/` | The published site: every file here is served as-is. |
| `src/pages/` | Each page's content, with its title and description in the `<!--meta {...} -->` block at the top. |
| `src/layout.html` | The header, footer and `<head>` shared by every page. |
| `src/build.py` | Puts the layout and pages together into `public/`, and writes `sitemap.xml`. |
| `public/assets/site.css` | All the styles. Colours, type and spacing are set at the top. |
| `server.mjs` | A tiny Node web server for `public/` (pretty URLs, redirects from the old site, compression, security headers). |

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

- Type: Archivo (variable width and weight), self-hosted. Licence: SIL Open Font License, `public/assets/fonts/OFL.txt`.
- Colours: ink `#161b26`, graphite `#485163`, paper `#ffffff`, stock `#f2f3f5`, magenta `#a3004f` (the one accent),
  with process cyan `#0093c9` and yellow `#ffc20e` only in drawings and the registration mark.
- Accessibility: WCAG 2.2 AA (checked with axe-core on every page at phone and desktop widths), body text above 7:1.

## Rules for the content

- No made-up reviews, client names, logos, awards or numbers.
- Every job is described as a flat fee, quoted in writing before work starts.
- Client names stay off the site unless Jack says otherwise.

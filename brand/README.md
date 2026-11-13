# MediaJack Systems brand

The sign system: asphalt, aluminium and highway green, plus the fluorescent yellow-green of warning signs. The full guide (voice, parts, motion, logo use, contrast) is `BRAND.md` in this folder.

| Name | HEX | RGB | Print | Spot | Use |
|---|---|---|---|---|---|
| Guide (highway green) | #00674A | 0 103 74 | printer converts from the hex; proof it | Pantone 342 C (FHWA sign green) | sign plates, blades, the price board |
| Guide deep | #00503A | 0 80 58 | printer converts from the hex | | pressed and hovered green |
| Hi-vis | #D6EE00 | 214 238 0 | C10 M0 Y100 K7 (uncalibrated) | none for fluorescent; 382 C nearest by the FHWA list, check a swatch book | the action colour, the mark, the check-up band |
| Ink | #000000 | 0 0 0 | K100 for text | Pantone Black C (nearest by screen value, check a swatch book) | text, borders, legends |
| Asphalt | #1C1D1F | 28 29 31 | rich black from the printer | | the road, night, footer |
| Paper | #FFFFFF | 255 255 255 | no ink | | the page, white plates |
| Overcast | #ECEEED | 236 238 237 | K7 (uncalibrated); proof it | | alternate sections, the sky |
| Aluminium | #B9BFC1 | 185 191 193 | C4 M1 Y0 K24 (uncalibrated) | 877 C (metallic) if a real silver is wanted | posts, hairlines |
| Ink muted | #33383A | 51 56 58 | printer converts from the hex | | secondary text |
| Work orange | #F58220 | 245 130 32 | C0 M47 Y87 K4 (uncalibrated) | Pantone 152 C (FHWA orange) | the work zone marker only |
| Stop red | #B3202B | 179 32 43 | C0 M82 Y76 K30 (uncalibrated) | Pantone 1805 C (FHWA red) | errors, with words |

Spot matches marked FHWA come from the Federal Highway Administration's MUTCD color specifications (https://mutcd.fhwa.dot.gov/kno-colorspec.htm), which lists them for printing only and says there are no Pantones for the fluorescent colours. "Uncalibrated" CMYK is plain arithmetic from the screen value, made without a press profile: a starting point to brief a printer, not a final value. Ask for a proof of the green and the hi-vis before any run.

## Logo files

In `logo/`, with the wordmark letters as outlines (Overpass ExtraBold and Medium), so no font is needed:

- `mediajack-mark.svg`: the mark, for light grounds and green
- `mediajack-mark-on-dark.svg`: the mark for asphalt and photos
- `mediajack-mark-one-color.svg`: black line only, for one-ink print
- `mediajack-lockup.svg`: mark and two-line wordmark, light grounds
- `mediajack-lockup-on-dark.svg`: white wordmark, for asphalt and green
- `mediajack-lockup-one-line.svg`: mark and one-line wordmark
- `png/`: every file above at 512 and 1024 px wide, transparent

Icons in `public/`: `favicon.svg` (the small-size cut of the mark), `favicon.ico` (16 and 32 px), `apple-touch-icon.png` (180 px, mark on asphalt). The share image is `public/assets/img/og-image.png` (1200 by 630).

Overpass is under the SIL Open Font License.

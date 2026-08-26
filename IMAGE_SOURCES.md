# Image sources

## Lifestyle / kitchen photography (`public/images/`)
All CC0 (public domain dedication) stock photography, commercial-use compatible, no
attribution legally required. Selected specifically for on-topic appliance/kitchen content
— no landscapes, animals, or unrelated stock imagery, per project direction.

## Product photography
Demo products use on-brand SVG illustrations (`components/product/ApplianceArt.tsx`)
rather than photography — see README.md for rationale.

## Brand logos (`public/brand-logos/`)
Official wordmarks sourced from Wikimedia Commons, used for brand/product identification
only (standard retailer practice — this does not imply an official distribution
relationship; see the disclaimer shown alongside the brand strip and brand pages):

- `miele.svg` — File:Miele logo.svg
- `electrolux.svg` — File:Electrolux logo.svg
- `dedietrich.jpg` — File:DeDietrich logo.jpg
- `samsung.svg` — File:Samsung logo wordmark.svg (recolored from white to charcoal for
  legibility on a light background; shape unaltered)

No suitable free-license logo was found on Commons for **Bertazzoni** or **V-ZUG** — these
two render as a styled text wordmark instead of a logo image (see `components/brand/BrandLogo.tsx`).
If official logo files become available (e.g. via brand media kits), drop them into
`public/brand-logos/` and add the filename to `lib/data/brands.ts`.

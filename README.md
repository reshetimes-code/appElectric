# AppElectric — Premium Appliance Store

Hebrew-first, RTL, mobile-first storefront for premium home appliances, built from
`APPELECTRIC_CLAUDE_BUILD_SPEC.md`. This is **Phase A**: a fully working frontend on
demo/seed data — every button, filter, and form is real and functional — with no live
backend/payments/auth yet. See "What's next" below.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- No database yet — typed seed data in `lib/data/*` + a `lib/repo/*` accessor layer
  written so a swap to a real DB only touches the repo layer, not the pages
- Client state (cart, favorites, compare) persisted to `localStorage` via React Context
- On-brand SVG illustrations for product imagery (`components/product/ApplianceArt.tsx`)
  instead of stock photography — reliable with zero hotlink risk; swap in real product
  photos later by populating `Product.images` and updating the Gallery component

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. If port 3000 is already used by another project on your
machine, run `npx next dev -p 3100` (or any free port) instead.

```bash
npm run build   # production build
npm run lint    # eslint
```

## What's implemented (Phase A)

- Home, Shop, Category, Brand, Search, Product detail pages — full URL-driven filtering
  (brand, price, availability, energy rating, premium, personal import, deals), sorting,
  pagination, mobile filter bottom-sheet
- Product comparison (up to 3, localStorage), Favorites, Cart, Checkout (demo/no live
  payment) → Order confirmation
- Bundle deals (list + detail + add-whole-bundle-to-cart)
- Energy savings calculator (transparent, configurable baseline in `lib/energy.ts`)
- Niche/installation dimension finder (`lib/repo/products.ts: findByNiche`)
- VIP services, Personal Import, Trade-In pages with working lead forms (persisted to
  `localStorage`, since no CRM/email is wired yet)
- WhatsApp deep-links prefilled with product name/model
- SEO: per-page metadata, Product/Breadcrumb/FAQ/Organization JSON-LD, `sitemap.ts`,
  `robots.ts`, custom 404
- Mega menu, mobile nav drawer, sticky mobile buy bar, toast notifications, reduced-motion
  support, visible focus states throughout

## What's next (not built in this pass)

- **Admin dashboard** — products/categories/brands/orders/leads/homepage CMS
- **Real backend** — Postgres (schema sketched from the spec's Product model in
  `lib/types.ts`), auth/roles, a payment provider behind a server-side abstraction,
  email/CRM delivery for leads (currently `localStorage` only — see `lib/leads.ts`),
  image/PDF upload storage (`Product.technicalPdfUrl` etc. are wired but unpopulated)
- Real product photography in place of the SVG illustrations
- Full accessibility/perf audit pass and production deploy config

## Environment variables

None are required to run Phase A — there's no backend yet. When Phase C is implemented,
document required variable **names only** here (e.g. `DATABASE_URL`, payment provider
keys) via a `.env.example`; never commit actual secrets.

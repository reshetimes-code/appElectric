# AppElectric — Premium Appliance Store

Hebrew-first, RTL, mobile-first storefront for premium home appliances, built from
`APPELECTRIC_CLAUDE_BUILD_SPEC.md`. **Phase A** (storefront) and a first slice of
**Phase B** (admin: products, suppliers, purchase orders) are built and working.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- Storefront demo catalog: typed seed data in `lib/data/*` + a `lib/repo/*` accessor
  layer, written so a swap to a real DB only touches the repo layer, not the pages
- Admin-added data (products/suppliers/purchase orders): JSON-file store under
  `data-store/` via `lib/server/*` — see "Admin" below for why and its limits
- Client state (cart, favorites, compare) persisted to `localStorage` via React Context;
  `lib/context/CatalogContext.tsx` merges the static catalog with admin-added products
  so client-only flows can resolve either kind of product by ID
- Product imagery: on-brand SVG illustrations by default (`components/product/ApplianceArt.tsx`),
  or real uploaded photos per product when added via `/admin/products` (`Product.images`)

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

## What's implemented

**Storefront:**
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

**Admin** (`/admin`, password-gated — see below):
- **Products** — add/edit/delete, with a real drag-and-drop multi-image uploader
  (`app/api/admin/upload`, saves to `public/uploads/products/`). These show up
  immediately in the real storefront (shop/category/brand/search/product pages),
  alongside the static demo catalog.
- **Suppliers** — simple contact list (name, email, WhatsApp).
- **Purchase orders** — create a PO against a supplier (product, cost price, quantity,
  delivery address), then send it with one click via a prefilled WhatsApp (`wa.me`) or
  `mailto:` link. Status (draft → sent → confirmed → shipped) is updated **manually**
  in the admin once the supplier replies — see the note on that page for why, and what
  a real automated version would need.

### Admin auth

Single shared password via `ADMIN_PASSWORD` (env var, defaults to `appelectric-admin` —
see `.env.example`). This is intentionally minimal: one password, a plain session
cookie, no per-user accounts or roles. Fine for one person running this locally; not
real production auth.

### Admin data storage — read this before deploying anywhere

`data-store/*.json` and `public/uploads/products/*` are written directly to the local
filesystem (`lib/server/fileStore.ts`). That's simple and genuinely persists across
restarts **on this machine / any host with a persistent writable filesystem** (a VM, a
long-running container). It will silently lose data on typical serverless/edge hosts
(e.g. Vercel's read-only filesystem outside `/tmp`). Swapping `lib/server/fileStore.ts`
(and the object-storage calls in the upload route) for a real database + object storage
is the Phase C upgrade — nothing above that layer needs to change.

## What's next (not built)

- Real backend for the *demo* catalog/orders/leads (Postgres — schema sketched from the
  spec's Product model in `lib/types.ts`), real payment provider, real auth/roles
  (beyond the admin password gate), email/CRM delivery for leads (currently
  `localStorage` — see `lib/leads.ts`)
- **Automatic PO status updates from a supplier's reply** — needs a real WhatsApp
  Business API and/or an inbound-email service (both require credentials + a public
  webhook URL); today the admin updates status manually after the supplier responds
- Categories/brands/homepage-CMS admin screens (only products/suppliers/POs are built)
- Full accessibility/perf audit pass and a production deploy target

## Environment variables

- `ADMIN_PASSWORD` — see "Admin auth" above. Everything else needs no configuration to
  run. Document any future required variable **names only** here; never commit actual
  secrets.

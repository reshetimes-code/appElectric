# APPELECTRIC — Premium Home Appliances E‑Commerce
## Master Build Specification for Claude Code / VS Code

> **Goal:** Build a production-ready, premium, fast, mobile-first e-commerce website for **AppElectric / Up Electric**, specializing in home appliances and luxury appliances. The website must feel like a high-end showroom, not a generic online store.

---

## 1. NON-NEGOTIABLE BUILD RULES

- Build the entire website as a polished production-ready system.
- Hebrew-first interface with full **RTL** support.
- Architecture must be ready for English later (LTR / i18n).
- Fully responsive: desktop, tablet and mobile.
- Mobile experience should feel close to a premium shopping app.
- Strong SEO foundations and excellent Core Web Vitals.
- Do not use placeholder buttons that do nothing.
- Every CTA, filter, search field, form and navigation item must work.
- Components must be reusable and data-driven.
- Product/category content must come from database/CMS data, not hardcoded HTML.
- Use optimized images, lazy loading and modern formats where possible.
- Protect admin routes and sensitive server/API operations.
- Never expose private API keys or secrets in frontend code.
- Before large/refactoring changes, create a safe backup / git checkpoint.
- Do not destroy existing data during deployment or migrations.

---

# 2. BRAND & DESIGN DIRECTION

## Brand positioning
AppElectric should communicate:

- Premium appliances
- Luxury kitchen technology
- Personal professional service
- Innovation
- Reliability
- High-end logistics and installation

The visual impression should be closer to a **luxury kitchen / architecture brand** than a discount electronics shop.

## Color system
Primary direction:

- Deep Navy / Charcoal Black — main premium surfaces
- Warm White / Off White — clean content backgrounds
- Light Gray — separators and secondary surfaces
- Energetic Orange — CTA/accent only

Orange must be used selectively so the site remains luxurious.

## Typography
Use a modern Hebrew-compatible font with excellent readability.

Recommended hierarchy:

- Large editorial hero headlines
- Clean medium-weight section titles
- Highly readable product/specification typography
- Strong but elegant price/CTA hierarchy

## UI style

- Generous whitespace
- Large premium photography
- Soft transitions and micro-interactions
- Clean cards
- Subtle shadows/borders
- Consistent rounded corners
- No visual clutter
- No cheap-looking flashing sale UI
- Animations must enhance the experience without slowing the site

---

# 3. MAIN SITE STRUCTURE

Create at minimum:

1. Home
2. Shop / All Products
3. Category pages
4. Sub-category pages
5. Brand pages
6. Product page
7. Search results
8. Product comparison
9. Bundle Deals
10. Personal Import / ייבוא אישי
11. VIP Services
12. Energy Savings Calculator
13. Niche / Dimensions Finder
14. Trade-In
15. About
16. Contact
17. Cart
18. Checkout
19. Order confirmation
20. Customer account / orders if authentication is implemented
21. FAQ
22. Shipping & Installation
23. Warranty / Returns / Terms / Privacy / Accessibility
24. Admin dashboard

---

# 4. HEADER & NAVIGATION

## Desktop header
Include:

- AppElectric logo
- Mega menu
- Smart search
- Brands
- Premium / Luxury collection
- Bundle Deals
- Personal Import
- VIP consultation
- Account
- Compare
- Favorites
- Cart

Use a sticky header after scrolling, but keep it elegant and compact.

## Mega menu
Mega menu should visually organize departments and optionally show a premium promotional image/brand.

### Cooling & Freezing — קירור והקפאה

- 4-door refrigerators
- 3–5 door refrigerators
- Side-by-Side
- Top freezer
- Bottom freezer
- Integrated refrigerators — Luxury
- Freezers
- Wine refrigerators
- Display / office refrigerators

### Cooking & Baking — בישול ואפייה

- Built-in ovens
- Combination ovens
- Cooktops
  - Induction
  - Gas
  - PITT cooking
- Designer hoods
- Built-in microwaves
- Warming drawers
- Pizza ovens / premium taboons

### Laundry & Drying — כביסה וייבוש

- Front-load washing machines
- Top-load washing machines
- Dryers
- Washer-dryer combos

### Dishwashers — מדיחי כלים

- Fully integrated
- Semi-integrated
- 60 cm
- 45 cm
- Countertop

### Multimedia — מולטימדיה

- Large screens 75”+
- OLED
- QLED
- Soundbars

---

# 5. HOME PAGE

The homepage must immediately communicate premium positioning.

## Hero
Create a full-width premium hero using high-quality lifestyle photography/video.

Possible content:

- Luxury kitchen with integrated appliances
- Premium refrigerator in a designed kitchen
- Premium cooking environment

Hero includes:

- Strong headline
- Short premium value proposition
- Primary CTA: Shop Premium Collection
- Secondary CTA: VIP Consultation

Allow hero slides/content to be managed from admin.

## Luxury brand strip
Display a premium brand logo strip near the top.

Examples of supported brands:

- Miele
- V-ZUG
- Bertazzoni
- De Dietrich

Do **not** imply official authorization or commercial relationships unless configured/verified by the business.

## Department cards
Large visual department tiles:

- Cooling
- Cooking
- Laundry
- Dishwashers
- Multimedia

## Premium collection
Curated products / editor picks.

## Bundle Deals
Highlight bundles such as:

- De Dietrich Kitchen Package
- Miele Laundry Set

Bundle cards must show:

- Included products
- Original combined price
- Bundle price
- Savings
- CTA

## Why AppElectric
Use premium icon blocks:

### Premium Quality
Personal import and premium brands.

### Innovation
Advanced appliance technologies.

### Service First
Professional guidance and personal service.

### Pro Logistics
Professional delivery, installation coordination and old-appliance removal options.

## Personal Import section
Explain the customer journey:

1. Consultation
2. Product selection
3. Availability / sourcing
4. Import coordination
5. Delivery
6. Professional installation

CTA: `לייעוץ ייבוא אישי`

## Lifestyle inspiration
Editorial image grid with appliances integrated into premium interiors.

## Reviews / social proof
Customer testimonials with admin moderation.

## VIP consultation CTA
Premium full-width section with WhatsApp and contact options.

---

# 6. PRODUCT CATALOG & SMART FILTERING

Filtering is a core feature and must be fast, intuitive and mobile friendly.

## Global filters

- Category
- Sub-category
- Brand
- Price range
- Availability
- Energy rating
- Width
- Height
- Depth
- Warranty
- Premium / Luxury
- Personal Import
- Deals

## Refrigerator filters

- Door configuration
- Capacity in liters
- Width
- Height
- Depth
- Energy rating
- Integrated / freestanding
- No Frost

## Laundry filters

- Capacity: 7 / 8 / 9 / 10+ kg
- Front / top load
- Energy rating
- Dryer technology:
  - Condenser
  - Heat Pump

## Dishwasher filters

- 60 cm
- 45 cm
- Countertop
- Fully integrated
- Semi-integrated
- Energy rating

## Cooking filters

- Product type
- Width
- Fuel / technology
- Induction / Gas / PITT
- Built-in
- Series / design family

## Filter UX

Desktop:
- Sidebar or premium filter panel

Mobile:
- Sticky `סינון` button
- Bottom sheet / full-screen filter interface
- Show active filter count
- Clear all filters

Filters must update products efficiently without unnecessary full-page reloads.

---

# 7. SMART NICHE / DIMENSIONS FINDER

Create a tool for customers planning appliances inside designed kitchens.

## Inputs

- Width
- Height
- Depth
- Appliance category
- Optional installation tolerance

## Result
Return products whose installation dimensions fit the entered niche.

Important:

- Clearly distinguish **product dimensions** from **required installation niche dimensions**.
- Product database must therefore support both values.
- Add disclaimer that final installation dimensions must be verified against manufacturer documentation before purchase/installation.

CTA from results:

`מצא מוצרים שמתאימים למידה שלי`

---

# 8. PRODUCT COMPARISON

Allow users to select up to **3 products**.

Comparison table should dynamically compare relevant fields such as:

- Price
- Brand
- Model
- Dimensions
- Installation dimensions
- Capacity
- Energy rating
- Noise level
- Technology/features
- Warranty
- Availability
- Delivery status

Highlight meaningful differences.

Comparison selection should persist while browsing, preferably using local storage for guests.

---

# 9. ENERGY SAVINGS CALCULATOR

Create an interactive calculator.

## User inputs

- Existing appliance type
- Existing appliance energy usage OR estimated old energy class
- New product / expected annual consumption
- Electricity price per kWh
- Expected years of use

## Outputs

- Estimated annual kWh savings
- Estimated annual ₪ savings
- Estimated savings over selected period
- Difference in consumption

Formula should be transparent and configurable.

Do not make unsupported claims such as “A always saves X%”. Use actual product annual consumption values where available.

Add disclaimer that calculation is an estimate and actual usage varies.

---

# 10. PRODUCT CARD

Every catalog product card should support:

- Main image
- Secondary hover image on desktop
- Brand
- Product name
- Model number
- Short premium feature line
- Energy rating badge
- Availability badge
- Current price
- Previous price when legitimately on sale
- Installments summary if supported
- Favorite button
- Compare checkbox/button
- Add to cart / product details CTA

Availability badges:

- `זמין לאספקה מיידית`
- `במלאי`
- `מלאי מוגבל`
- `ייבוא אישי – צרו קשר למועד אספקה`
- `אזל מהמלאי`

---

# 11. PREMIUM PRODUCT PAGE

The product page is the main conversion page and must be exceptionally polished.

## Above the fold

- Breadcrumbs
- Brand
- Product name
- Model/SKU
- Large gallery
- Optional product video
- Zoom
- Price
- Sale price if applicable
- Installment information
- Availability
- Estimated supply information
- Warranty summary
- Add to cart
- Buy now
- WhatsApp VIP consultation
- Favorite
- Compare

## Key feature icons
Visual icons for relevant product features, for example:

- No Frost
- Quiet operation
- Energy efficient
- Heat Pump
- Wi-Fi
- Pyrolytic cleaning
- Induction

Icons must be data-driven, not hardcoded per page.

## Technical specifications
Create structured specification groups such as:

- Dimensions
- Installation dimensions
- Capacity
- Energy
- Electrical requirements
- Noise
- Programs
- Materials / finish
- Connectivity
- Warranty

## PDF documentation
Support downloadable files:

- Technical specification PDF
- Installation dimensions PDF
- User manual

This is critical for architects, designers and installers.

## Stock & supply
Clearly show either:

`זמין לאספקה מיידית`

or

`ייבוא אישי – צרו קשר למועד אספקה`

Admin must control status and optional supply text.

## VIP services
Allow selectable add-ons:

- Certified technician installation
- Old appliance removal
- Premium delivery
- Installation coordination

Each service can have:

- Name
- Description
- Price
- Availability by product/category

## Complete the Look
Recommend compatible products from the same design family or category relationship.

Examples:

- Oven → matching warming drawer
- Cooktop → compatible cookware
- Oven → matching hood
- Washer → matching dryer

## Reviews

- Rating
- Review text
- Verified purchase flag if possible
- Admin moderation

## Sticky mobile purchase bar
On mobile show a compact sticky bottom purchase bar with:

- Price
- Add to cart / Buy

Do not cover important content or accessibility controls.

---

# 12. BUNDLE DEALS

Admin can create bundles containing multiple products.

Bundle fields:

- Bundle name
- Description
- Hero image
- Included product IDs
- Standard combined price
- Bundle price
- Savings amount / percentage calculated automatically
- Active dates
- Stock behavior
- Optional installation/service package

Customers can add the entire bundle to cart in one action.

Inventory must still be validated for each included product.

---

# 13. VIP SERVICE & WHATSAPP

Create a premium consultation experience.

Persistent but unobtrusive WhatsApp access.

From product pages prefill a message similar to:

`שלום, אשמח לייעוץ VIP לגבי [PRODUCT NAME] דגם [MODEL].`

Also create a lead form with:

- Name
- Phone
- Email optional
- Product/category of interest
- Preferred contact time
- Notes
- Consent checkbox where required

Store leads in admin with source/UTM data where available.

---

# 14. PERSONAL IMPORT PAGE

Create a dedicated premium editorial page explaining personal import service.

Sections:

- What personal import means
- Who it is suitable for
- Premium brands / special models
- Consultation process
- Ordering/sourcing
- Estimated delivery process
- Logistics
- Installation
- Warranty/service explanation
- FAQ
- Lead form

Do not promise delivery dates or warranty terms that are not configured by admin.

---

# 15. TRADE-IN

Create a trade-in request flow.

Fields:

- Existing appliance category
- Brand
- Model
- Age
- Condition
- Optional image upload
- Desired new product/category
- Customer details

Trade-in request should create an admin lead, not automatically promise a fixed value unless a pricing engine is later implemented.

---

# 16. SEARCH

Build smart search supporting:

- Product name
- Model/SKU
- Brand
- Category
- Feature keywords

Search UI:

- Instant suggestions
- Product thumbnails
- Brand/category suggestions
- Keyboard accessible
- Mobile optimized

Handle Hebrew spelling variations as gracefully as possible.

---

# 17. CART & CHECKOUT

## Cart

- Product image/name/model
- Quantity
- Price
- Services/add-ons
- Bundle identification
- Remove/edit
- Coupon if enabled
- Delivery estimate text
- Totals

## Checkout

Collect only necessary information.

Support:

- Customer details
- Delivery address
- Delivery option
- Installation/service options
- Order notes
- Coupon
- Payment integration
- Terms approval

Payment provider must be implemented behind a server-side abstraction so provider can be changed without rebuilding checkout.

Never store raw credit-card data in the application database.

Support configurable installment options according to the payment provider/business rules.

---

# 18. INVENTORY & AVAILABILITY

Each product needs inventory/supply fields:

- SKU
- Stock quantity
- Stock management enabled
- Availability status
- Immediate delivery boolean
- Personal import boolean
- Supply text
- Expected supply date optional
- Backorder policy

Prevent overselling where inventory tracking is enabled.

---

# 19. PRODUCT DATA MODEL

Product should support at minimum:

```ts
Product {
  id
  slug
  sku
  model
  nameHe
  nameEn?
  shortDescriptionHe
  descriptionHe
  brandId
  categoryId
  subcategoryId
  seriesId?

  price
  compareAtPrice?
  costPrice? // admin only
  currency

  images[]
  videos[]

  widthMm?
  heightMm?
  depthMm?

  nicheWidthMm?
  nicheHeightMm?
  nicheDepthMm?

  capacityValue?
  capacityUnit?
  energyRating?
  annualEnergyKwh?
  noiseDb?

  attributes[]
  featureIds[]

  warrantyText
  importerText?

  stockQuantity
  manageStock
  availabilityStatus
  immediateDelivery
  personalImport
  supplyText?

  premium
  featured
  active

  seoTitle?
  seoDescription?

  technicalPdfUrl?
  installationPdfUrl?
  manualPdfUrl?

  createdAt
  updatedAt
}
```

Use normalized attribute tables/schema where appropriate so category-specific filtering remains scalable.

---

# 20. ADMIN DASHBOARD

Create a clean secure admin interface.

## Dashboard
Show useful KPIs:

- Orders
- Revenue
- Leads
- Products low in stock
- Popular products
- Bundle performance
- VIP inquiries

## Products
Admin must be able to:

- Add/edit/delete/archive product
- Duplicate product
- Upload/reorder images
- Add video
- Set brand/category/subcategory
- Add specifications
- Set dimensions + niche dimensions
- Set energy data
- Set stock
- Set price/sale
- Upload PDFs
- Add related products
- Assign bundle eligibility
- Add SEO fields

## Categories
Manage:

- Department
- Category
- Sub-category
- Slug
- Image
- SEO
- Sort order

## Brands
Manage:

- Name
- Logo
- Description
- Hero image
- Premium flag
- SEO

## Orders

- Order details
- Payment status
- Fulfillment status
- Delivery status
- Installation/service selections
- Customer notes
- Internal admin notes

## Leads
Separate lead types:

- VIP
- Personal import
- Trade-in
- Contact

Include:

- Status
- Owner/agent
- Notes
- Source
- UTM
- Created date

## Homepage CMS
Admin can manage:

- Hero
- Brand strip
- Featured collections
- Department blocks
- Lifestyle sections
- Promotional banners
- Testimonials
- VIP CTA

---

# 21. TRUST & COMPLIANCE

Display trust information without making unverified claims.

Include configurable areas for:

- Warranty
- Importer information
- Delivery
- Installation
- Returns/cancellation
- Secure payment
- Accessibility
- Privacy
- Terms

If a product is official-import, parallel-import or personal-import, make the source/service information configurable and clear.

Do not automatically label every product as `יבואן רשמי`.

---

# 22. SEO

Implement technical SEO from the start.

Requirements:

- Semantic HTML
- Unique title/meta description
- Canonical URLs
- Clean Hebrew-friendly slugs where practical
- Open Graph metadata
- Twitter/X card metadata where applicable
- XML sitemap
- robots.txt
- Breadcrumbs
- Product structured data
- Breadcrumb structured data
- Organization/store structured data where valid
- Category content blocks for SEO
- Server-rendered/indexable important catalog content
- Correct 404 handling
- Redirect support in admin or configuration

Avoid indexable duplicate URLs created by filter combinations. Define canonical/indexing strategy for faceted navigation.

---

# 23. PERFORMANCE

Targets:

- Excellent mobile performance
- Fast initial load
- Minimal layout shift
- Responsive images
- Lazy-load below-the-fold media
- Preload only critical assets
- CDN-ready media
- Cache catalog queries appropriately
- Debounce search/filter requests
- Pagination or infinite loading with SEO-safe URLs
- Avoid oversized JS bundles

Do not sacrifice UX for decorative animation.

---

# 24. ACCESSIBILITY

Build toward WCAG 2.1 AA principles.

Include:

- Keyboard navigation
- Visible focus states
- Proper labels
- Semantic headings
- Alt text support in CMS
- Sufficient contrast
- Accessible dialogs
- Accessible mega menu
- Accessible filters
- Reduced-motion support

---

# 25. SECURITY

Implement standard production security:

- HTTPS in production
- Secure authentication/session handling
- Role-based admin authorization
- Input validation server-side
- Output escaping/sanitization
- Rate limiting on sensitive/public forms
- CSRF protection where architecture requires it
- Secure upload validation
- File size/type restrictions
- Secrets only in environment variables
- No API secrets in client bundles
- Logging without exposing sensitive data
- Database backups

Payment details must be handled by a compliant payment provider; do not store raw card numbers/CVV.

---

# 26. ANALYTICS & CONVERSION EVENTS

Prepare an analytics layer for:

- Product view
- Search
- Filter usage
- Compare product
- Add to favorites
- Add to cart
- Remove from cart
- Begin checkout
- Purchase
- WhatsApp click
- VIP lead
- Personal import lead
- Trade-in lead
- PDF download
- Bundle view/add

Keep implementation compatible with GA4 / Google Tag Manager and future Meta tracking, subject to consent/privacy requirements.

---

# 27. RECOMMENDED TECHNICAL ARCHITECTURE

If starting from zero, preferred stack:

## Frontend
- Next.js + TypeScript
- React
- Tailwind CSS or similarly maintainable design system

## Backend
Use Next.js server capabilities or a clean Node backend depending on project scale.

## Database
- PostgreSQL
- Supabase/Postgres is acceptable

## Storage
Object storage for:

- Product images
- Brand logos
- PDFs
- Videos/thumbnails where appropriate

## Authentication
Secure admin authentication with roles.

## Deployment
Architecture must be portable and support modern hosting / Google Cloud / Vercel style deployments.

Do not tightly couple core business logic to one vendor unnecessarily.

---

# 28. RESPONSIVE REQUIREMENTS

## Mobile
Prioritize:

- Fast search
- Thumb-friendly navigation
- Bottom-sheet filters
- Sticky purchase CTA
- Horizontal premium carousels where useful
- Short product-card hierarchy
- Fast WhatsApp access

## Desktop
Use space for:

- Large lifestyle imagery
- Mega menu
- Rich product gallery
- Side-by-side technical information
- Comparison tables

Test at common widths from ~320px through large desktop screens.

---

# 29. CONTENT / CMS PRINCIPLE

Do not require code changes for normal commercial updates.

Admin should control:

- Products
- Prices
- Inventory
- Categories
- Brands
- Bundles
- Hero slides
- Promotional sections
- PDFs
- Testimonials
- FAQs
- Supply statuses
- VIP service prices
- SEO metadata

---

# 30. SEED DATA

Create realistic development seed data across all departments so every layout/filter can be tested.

Include products with different:

- Brands
- Prices
- Dimensions
- Energy ratings
- Availability statuses
- Premium flags
- Personal import statuses
- Product features

Use clearly marked demo data and do not present fabricated commercial claims as real facts.

---

# 31. QA / ACCEPTANCE CHECKLIST

Before considering the project complete, verify:

- [ ] Hebrew RTL is correct on every page
- [ ] Mobile navigation works
- [ ] Mega menu works
- [ ] Search works
- [ ] Category navigation works
- [ ] Filters work together correctly
- [ ] Filters survive refresh via URL/query state where appropriate
- [ ] Niche finder returns correct dimensional matches
- [ ] Comparison supports maximum 3 products
- [ ] Energy calculator produces mathematically correct results
- [ ] Product gallery works
- [ ] PDF downloads work
- [ ] Favorites work
- [ ] Cart works
- [ ] Bundle add-to-cart works
- [ ] VIP services are reflected in cart/order
- [ ] Checkout validation works
- [ ] Payment flow is server-secure
- [ ] Inventory cannot accidentally oversell tracked stock
- [ ] WhatsApp product message contains correct product/model
- [ ] VIP leads reach admin
- [ ] Personal import leads reach admin
- [ ] Trade-in leads reach admin
- [ ] Admin CRUD works
- [ ] Product image/PDF uploads work
- [ ] SEO metadata renders server-side
- [ ] Sitemap works
- [ ] Product structured data is valid
- [ ] 404 page works
- [ ] Forms have spam/rate protection
- [ ] Accessibility basics pass
- [ ] No secrets exist in frontend code
- [ ] No broken buttons or dead links
- [ ] No console errors in production
- [ ] Production build succeeds

---

# 32. IMPLEMENTATION ORDER FOR CLAUDE

Build in controlled phases instead of attempting random pages.

## Phase 1 — Foundation

1. Inspect existing repository before changing anything.
2. Create git checkpoint/backup.
3. Define architecture.
4. Define database schema.
5. Build design tokens and RTL layout.
6. Build shared header/footer/navigation.

## Phase 2 — Catalog

1. Categories
2. Brands
3. Product model
4. Product cards
5. Category pages
6. Filters
7. Search
8. Product page

## Phase 3 — Premium tools

1. Compare
2. Niche finder
3. Energy calculator
4. Complete the Look
5. Bundle Deals
6. VIP services

## Phase 4 — Commerce

1. Cart
2. Checkout
3. Payments abstraction
4. Inventory validation
5. Orders
6. Confirmation flow

## Phase 5 — Admin

1. Admin auth/roles
2. Product management
3. Categories/brands
4. Inventory
5. Bundles
6. Orders
7. Leads
8. Homepage CMS

## Phase 6 — Quality

1. SEO
2. Accessibility
3. Security review
4. Performance optimization
5. Responsive QA
6. Production build
7. End-to-end testing

---

# 33. INSTRUCTIONS TO CLAUDE CODE

When this file is given to Claude Code:

1. **First inspect the complete existing project.**
2. Do not overwrite working functionality without understanding it.
3. Create a backup/git checkpoint before structural changes.
4. Produce a short implementation plan based on the actual repository.
5. Then implement phase-by-phase.
6. Do not stop merely because the UI “looks done”; connect real functionality.
7. Fix TypeScript/build/lint/runtime errors created by your changes.
8. Test desktop and mobile behavior.
9. Preserve existing production data.
10. Use migrations for database changes.
11. Never place secrets/API keys directly in source code.
12. Use `.env.example` for required environment variable names only.
13. If a third-party integration cannot be completed without credentials, build the adapter/interface, document the required env variables and keep the application functional in a safe development mode.
14. Do not invent payment, warranty, importer, delivery or brand-authorisation claims.
15. At completion, provide a concise report of implemented modules, migrations, environment variables, remaining credential-dependent integrations, and test/build status.

---

# FINAL PRODUCT VISION

The finished AppElectric website should combine:

**Luxury showroom aesthetics + serious appliance specifications + smart product discovery + human VIP service + robust e-commerce.**

A visitor buying an expensive refrigerator, integrated kitchen package or premium laundry system must immediately feel that AppElectric understands luxury appliances, installation constraints, logistics and professional service.

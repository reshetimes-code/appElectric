// Core domain types for the AppElectric catalog.
// Shaped closely to the spec's Product data model (§19) so a later swap to a
// real DB (Prisma/Postgres) only touches lib/repo/*, not the UI layer.

export type AvailabilityStatus =
  | "immediate" // זמין לאספקה מיידית
  | "in-stock" // במלאי
  | "limited" // מלאי מוגבל
  | "personal-import" // ייבוא אישי – צרו קשר למועד אספקה
  | "out-of-stock"; // אזל מהמלאי

export type EnergyRating =
  | "A+++"
  | "A++"
  | "A+"
  | "A"
  | "B"
  | "C"
  | "D";

export interface Dimensions {
  widthMm?: number;
  heightMm?: number;
  depthMm?: number;
}

export interface SpecGroup {
  title: string;
  items: { label: string; value: string }[];
}

export interface ProductFeatureRef {
  id: string;
  label: string;
  icon: FeatureIcon;
}

export type FeatureIcon =
  | "no-frost"
  | "quiet"
  | "energy"
  | "heat-pump"
  | "wifi"
  | "pyrolytic"
  | "induction"
  | "steam"
  | "inverter"
  | "touch";

export interface Review {
  id: string;
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  verifiedPurchase?: boolean;
  createdAt: string;
}

export interface VipServiceOption {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  model: string;
  nameHe: string;
  shortDescriptionHe: string;
  descriptionHe: string;

  brandId: string;
  categoryId: string;
  subcategoryId: string;
  departmentId: string;

  price: number;
  compareAtPrice?: number;
  currency: "ILS";
  installmentsMonths?: number;

  images: string[];
  /** Demo catalogs use on-brand SVG illustrations instead of stock photography. */
  artKind: import("@/components/product/ApplianceArt").ApplianceArtKind;

  dimensions: Dimensions;
  /** Required installation cavity — distinct from the physical product dimensions. */
  nicheDimensions?: Dimensions;

  capacityValue?: number;
  capacityUnit?: "L" | 'ק"ג' | "מקומות הגשה";
  energyRating?: EnergyRating;
  annualEnergyKwh?: number;
  noiseDb?: number;

  specGroups: SpecGroup[];
  featureIds: FeatureIcon[];

  warrantyText: string;
  importerText?: string;

  stockQuantity: number;
  manageStock: boolean;
  availabilityStatus: AvailabilityStatus;
  supplyText?: string;

  premium: boolean;
  featured: boolean;
  active: boolean;

  seoTitle?: string;
  seoDescription?: string;

  technicalPdfUrl?: string;
  installationPdfUrl?: string;
  manualPdfUrl?: string;

  relatedProductIds?: string[];
  completeTheLookIds?: string[];
  vipServiceIds?: string[];
  reviews: Review[];

  createdAt: string;
}

export interface Subcategory {
  id: string;
  slug: string;
  nameHe: string;
}

export interface Category {
  id: string;
  slug: string;
  nameHe: string;
  departmentId: string;
  image: string;
  subcategories: Subcategory[];
  filterKind: "cooling" | "cooking" | "laundry" | "dishwasher" | "multimedia" | "generic";
}

export interface Department {
  id: string;
  slug: string;
  nameHe: string;
  icon: string;
}

export interface Brand {
  id: string;
  slug: string;
  nameHe: string;
  logo: string;
  description: string;
  heroImage: string;
  premium: boolean;
}

export interface BundleItem {
  productId: string;
}

export interface Bundle {
  id: string;
  slug: string;
  nameHe: string;
  description: string;
  heroImage: string;
  productIds: string[];
  bundlePrice: number;
  active: boolean;
}

export interface Testimonial {
  id: string;
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  location?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: "general" | "delivery" | "warranty" | "import" | "payment";
}

export interface CartServiceSelection {
  vipServiceId: string;
  name: string;
  price: number;
}

export interface CartLine {
  id: string; // unique line id (product + services signature)
  productId: string;
  quantity: number;
  services: CartServiceSelection[];
  bundleId?: string;
}

export type LeadSource = "vip" | "personal-import" | "trade-in" | "contact";

export interface LeadPayload {
  id: string;
  source: LeadSource;
  name: string;
  phone: string;
  email?: string;
  productOrCategory?: string;
  preferredContactTime?: string;
  notes?: string;
  tradeIn?: {
    category: string;
    brand: string;
    model: string;
    age: string;
    condition: string;
    desiredCategory: string;
  };
  createdAt: string;
}

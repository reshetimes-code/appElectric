import type { Product } from "@/lib/types";
import { brands } from "@/lib/data/brands";

/**
 * Props for a `<script type="application/ld+json" dangerouslySetInnerHTML=.../>`.
 * JSON.stringify does NOT escape "<" — a product name/description (admin-
 * editable) containing a literal "</script>" would otherwise close the tag
 * early and let anything after it run as HTML/JS on every visitor's page.
 * Replacing every "<" with its unicode escape keeps the JSON perfectly
 * valid (parsers treat it identically) while making that breakout impossible.
 */
export function jsonLdScriptProps(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AppElectric",
    url: "https://appelectric.example",
    description: "חנות פרימיום למכשירי חשמל ומטבח יוקרתיים, ייבוא אישי ושירות VIP.",
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function productJsonLd(product: Product) {
  const brand = brands.find((b) => b.id === product.brandId);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.nameHe,
    sku: product.sku,
    model: product.model,
    description: product.shortDescriptionHe,
    brand: brand ? { "@type": "Brand", name: brand.nameHe } : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "ILS",
      price: product.price,
      availability:
        product.availabilityStatus === "out-of-stock" || product.availabilityStatus === "call-me-back"
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
    },
    aggregateRating:
      product.reviews.length > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: (product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length).toFixed(1),
            reviewCount: product.reviews.length,
          }
        : undefined,
  };
}

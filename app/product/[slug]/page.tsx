import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Gallery } from "@/components/product/Gallery";
import { SpecTable } from "@/components/product/SpecTable";
import { FeatureIcons } from "@/components/product/FeatureIcons";
import { AvailabilityBadge } from "@/components/product/AvailabilityBadge";
import { AddToCartPanel } from "@/components/product/AddToCartPanel";
import { StickyBuyBar } from "@/components/product/StickyBuyBar";
import { CompleteTheLook } from "@/components/product/CompleteTheLook";
import { ReviewsSection } from "@/components/product/ReviewsSection";
import { PriceTag } from "@/components/ui/PriceTag";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { products } from "@/lib/data/products";
import { getRelatedProducts } from "@/lib/repo/products";
import { getAllProducts } from "@/lib/server/adminProducts";
import { categories } from "@/lib/data/categories";
import { getBrandBySlug } from "@/lib/data/brands";
import { productJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { ShieldCheck, Info } from "lucide-react";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getAllProducts().find((p) => p.slug === slug);
  if (!product) return {};
  return {
    title: product.seoTitle ?? product.nameHe,
    description: product.seoDescription ?? product.shortDescriptionHe,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const allProducts = getAllProducts();
  const product = allProducts.find((p) => p.slug === slug);
  if (!product) notFound();

  const productBrand = getBrandBySlug(product.brandId) ?? { nameHe: "", slug: "" };
  const category = categories.find((c) => c.id === product.categoryId);
  const related = getRelatedProducts(product, 4, allProducts);

  const jsonLd = productJsonLd(product);
  const crumbs = breadcrumbJsonLd([
    { name: category?.nameHe ?? "מוצרים", url: `https://appelectric.example/category/${category?.slug ?? ""}` },
    { name: product.nameHe, url: `https://appelectric.example/product/${product.slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />

      <Container className="flex flex-col gap-6 py-6 pb-28 sm:py-10 lg:pb-10">
        <Breadcrumbs
          items={[
            ...(category ? [{ label: category.nameHe, href: `/category/${category.slug}` }] : []),
            { label: product.nameHe },
          ]}
        />

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <Gallery artKind={product.artKind} images={product.images} name={product.nameHe} />

          <div className="flex flex-col gap-5">
            <div>
              <div className="mb-2 flex items-center gap-2">
                {productBrand.slug && (
                  <a href={`/brand/${productBrand.slug}`} className="text-sm font-medium text-brand-700 hover:underline">
                    {productBrand.nameHe}
                  </a>
                )}
                {product.premium && <Badge tone="brand">פרימיום</Badge>}
              </div>
              <h1 className="font-heading text-2xl font-bold text-charcoal-900 sm:text-3xl">{product.nameHe}</h1>
              <p className="mt-1 text-sm text-charcoal-500">דגם {product.model} · מק&quot;ט {product.sku}</p>
            </div>

            <p className="leading-relaxed text-charcoal-600">{product.shortDescriptionHe}</p>

            <div className="flex flex-wrap items-center gap-3">
              <AvailabilityBadge status={product.availabilityStatus} />
              {product.energyRating && <Badge tone="success">דירוג אנרגטי {product.energyRating}</Badge>}
            </div>
            {product.supplyText && (
              <p className="flex items-start gap-2 rounded-[var(--radius-control)] bg-sand-100 p-3 text-sm text-charcoal-600">
                <Info size={16} className="mt-0.5 shrink-0 text-charcoal-400" />
                {product.supplyText}
              </p>
            )}

            <PriceTag price={product.price} compareAtPrice={product.compareAtPrice} installmentsMonths={product.installmentsMonths} size="lg" />

            <FeatureIcons featureIds={product.featureIds} />

            <AddToCartPanel product={product} />

            <p className="flex items-center gap-2 text-xs text-charcoal-500">
              <ShieldCheck size={15} className="text-brand-600" />
              {product.warrantyText}
            </p>
            {product.importerText && <p className="text-xs text-charcoal-400">{product.importerText}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 border-t border-sand-200 pt-10 lg:grid-cols-[1fr_320px]">
          <div className="flex flex-col gap-10">
            <div>
              <h2 className="mb-3 font-heading text-xl font-semibold text-charcoal-900">אודות המוצר</h2>
              <p className="leading-relaxed text-charcoal-600">{product.descriptionHe}</p>
            </div>
            <div>
              <h2 className="mb-3 font-heading text-xl font-semibold text-charcoal-900">מפרט טכני</h2>
              <SpecTable groups={product.specGroups} />
            </div>
            <CompleteTheLook products={related} />
            <ReviewsSection reviews={product.reviews} />
          </div>
          <aside className="h-fit rounded-[var(--radius-card)] border border-sand-300 bg-sand-50 p-5">
            <h3 className="mb-3 font-heading text-sm font-semibold text-charcoal-900">מסמכים להורדה</h3>
            {product.technicalPdfUrl || product.installationPdfUrl || product.manualPdfUrl ? (
              <ul className="flex flex-col gap-2 text-sm text-brand-700">
                {product.technicalPdfUrl && <li><a href={product.technicalPdfUrl}>מפרט טכני (PDF)</a></li>}
                {product.installationPdfUrl && <li><a href={product.installationPdfUrl}>מידות התקנה (PDF)</a></li>}
                {product.manualPdfUrl && <li><a href={product.manualPdfUrl}>הוראות שימוש (PDF)</a></li>}
              </ul>
            ) : (
              <p className="text-sm text-charcoal-500">מסמכים מלאים זמינים לבקשת אדריכלים/מתקינים דרך צוות ה-VIP.</p>
            )}
          </aside>
        </div>
      </Container>

      <StickyBuyBar product={product} />
    </>
  );
}

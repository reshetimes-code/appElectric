import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { getBundleBySlug, bundles } from "@/lib/data/bundles";
import { getProductsByIds } from "@/lib/data/products";
import { AddBundleButton } from "@/components/product/AddBundleButton";
import { formatPrice } from "@/lib/utils";

export function generateStaticParams() {
  return bundles.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const bundle = getBundleBySlug(slug);
  if (!bundle) return {};
  return { title: bundle.nameHe, description: bundle.description };
}

export default async function BundleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const bundle = getBundleBySlug(slug);
  if (!bundle) notFound();

  const bundleProducts = getProductsByIds(bundle.productIds);
  const combined = bundleProducts.reduce((sum, p) => sum + p.price, 0);
  const savings = Math.max(0, combined - bundle.bundlePrice);
  const anyOutOfStock = bundleProducts.some((p) => p.availabilityStatus === "out-of-stock");

  return (
    <div className="py-8 sm:py-10">
      <Container className="flex flex-col gap-8">
        <Breadcrumbs items={[{ label: "מארזי מבצע", href: "/bundles" }, { label: bundle.nameHe }]} />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius-card)]">
            <Image src={bundle.heroImage} alt={bundle.nameHe} fill className="object-cover" />
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="font-heading text-2xl font-semibold text-charcoal-900 sm:text-3xl">{bundle.nameHe}</h1>
            <p className="leading-relaxed text-charcoal-600">{bundle.description}</p>
            <div className="flex items-end gap-3">
              <span className="text-sm text-charcoal-400 line-through">{formatPrice(combined)}</span>
              <span className="font-heading text-3xl font-bold text-brand-700">{formatPrice(bundle.bundlePrice)}</span>
              {savings > 0 && <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-600">חיסכון {formatPrice(savings)}</span>}
            </div>
            <AddBundleButton bundleId={bundle.id} productIds={bundle.productIds} disabled={anyOutOfStock} bundleName={bundle.nameHe} />
            {anyOutOfStock && <p className="text-xs text-red-500">אחד המוצרים במארז אזל זמנית מהמלאי — צרו קשר לבדיקת זמינות.</p>}
            <p className="text-xs text-charcoal-400">זמינות כל מוצר במארז נבדקת בנפרד. המארז כולל את המוצרים המפורטים למטה בלבד.</p>
          </div>
        </div>

        <div>
          <h2 className="mb-4 font-heading text-xl font-semibold text-charcoal-900">כלול במארז</h2>
          <ProductGrid products={bundleProducts} />
        </div>
      </Container>
    </div>
  );
}

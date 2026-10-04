import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { BundleCover } from "@/components/product/BundleCover";
import { BundleProductSlider } from "@/components/product/BundleProductSlider";
import { getBundleBySlug, resolveBundleItems } from "@/lib/server/adminBundles";
import { getAllProducts } from "@/lib/server/adminProducts";
import { AddBundleButton } from "@/components/product/AddBundleButton";
import { formatPrice } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const bundle = await getBundleBySlug(decodeURIComponent(slug));
  if (!bundle) return {};
  return { title: bundle.nameHe, description: bundle.description };
}

export default async function BundleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [bundle, allProducts] = await Promise.all([getBundleBySlug(decodeURIComponent(slug)), getAllProducts()]);
  if (!bundle || !bundle.active) notFound();

  const productMap = new Map(allProducts.map((p) => [p.id, p]));
  const { items, combined, total, savings } = resolveBundleItems(bundle, productMap);
  const anyOutOfStock = items.some((it) => it.product.availabilityStatus === "out-of-stock");

  return (
    <div className="py-8 sm:py-10">
      <Container className="flex flex-col gap-8">
        <Breadcrumbs items={[{ label: "סטי פרימיום", href: "/bundles" }, { label: bundle.nameHe }]} />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <BundleCover
                    coverUrl={bundle.coverUrl}
            artKinds={items.map((it) => it.product.artKind)}
            nameHe={bundle.nameHe}
            itemCount={items.length}
            priority
            className="aspect-[16/10] overflow-hidden rounded-[var(--radius-card)]"
          />
          <div className="flex flex-col gap-4">
            <h1 className="font-heading text-2xl font-semibold text-charcoal-900 sm:text-3xl">{bundle.nameHe}</h1>
            {bundle.description && <p className="leading-relaxed text-charcoal-600">{bundle.description}</p>}
            <div className="flex items-end gap-3">
              {savings > 0 && <span className="text-sm text-charcoal-400 line-through">{formatPrice(combined)}</span>}
              <span className="font-heading text-3xl font-bold text-brand-700">{formatPrice(total)}</span>
              {savings > 0 && <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-600">חיסכון {formatPrice(savings)}</span>}
            </div>
            <AddBundleButton
              bundleId={bundle.id}
              items={items.map((it) => ({ productId: it.product.id, price: it.price }))}
              disabled={anyOutOfStock}
              bundleName={bundle.nameHe}
            />
            {anyOutOfStock && <p className="text-xs text-red-500">אחד המוצרים בסט אזל זמנית מהמלאי — צרו קשר לבדיקת זמינות.</p>}
            <p className="text-xs text-charcoal-400">זמינות כל מוצר בסט נבדקת בנפרד. הסט כולל את המוצרים והמחירים המפורטים למטה בלבד.</p>
          </div>
        </div>

        <div>
          <h2 className="mb-4 font-heading text-xl font-semibold text-charcoal-900">כלול בסט</h2>
          <BundleProductSlider
            items={items.map((it) => ({
              id: it.product.id,
              slug: it.product.slug,
              nameHe: it.product.nameHe,
              model: it.product.model,
              image: it.product.images[0],
              artKind: it.product.artKind,
              price: it.price,
            }))}
          />
        </div>
      </Container>
    </div>
  );
}

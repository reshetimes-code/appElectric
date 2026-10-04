import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { BundleCover } from "@/components/product/BundleCover";
import { getActiveBundles, resolveBundleItems } from "@/lib/server/adminBundles";
import { getAllProducts } from "@/lib/server/adminProducts";

export const metadata: Metadata = {
  title: "סטי פרימיום",
  description: "שילובי מוצרים שנבחרו עבורכם — סטים במחיר משתלם, כל אחד עם המוצרים והמחירים שנקבעו לו.",
};

export default async function BundlesPage() {
  const [bundles, allProducts] = await Promise.all([getActiveBundles(), getAllProducts()]);
  const productMap = new Map(allProducts.map((p) => [p.id, p]));

  return (
    <div className="py-8 sm:py-10">
      <Container className="flex flex-col gap-8">
        <Breadcrumbs items={[{ label: "סטי פרימיום" }]} />
        <div>
          <h1 className="font-heading text-2xl font-semibold text-charcoal-900 sm:text-3xl">סטי פרימיום</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-charcoal-500">
            שילובי מוצרים שאצרנו עבורכם, במחיר משתלם שנקבע במיוחד לכל סט. המלאי לכל מוצר בסט נבדק בנפרד בעת ההזמנה.
          </p>
        </div>

        {bundles.length === 0 ? (
          <p className="text-sm text-charcoal-500">אין כרגע סטים פעילים.</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {bundles.map((bundle) => {
              const { items } = resolveBundleItems(bundle, productMap);
              if (items.length === 0) return null;
              return (
                <Link
                  key={bundle.id}
                  href={`/bundles/${bundle.slug}`}
                  className="group flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-sand-300 bg-sand-50"
                >
                  <BundleCover
                    coverUrl={bundle.coverUrl}
                    productImages={items.flatMap((it) => (it.product.images[0] ? [it.product.images[0]] : []))}
                    artKinds={items.map((it) => it.product.artKind)}
                    nameHe={bundle.nameHe}
                    itemCount={items.length}
                    className="aspect-[16/10] transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    {bundle.description && <p className="text-sm leading-relaxed text-charcoal-500">{bundle.description}</p>}
                    <span className="mt-auto inline-flex h-11 items-center justify-center rounded-[var(--radius-control)] bg-brand-600 px-5 text-sm font-semibold text-white transition-colors group-hover:bg-brand-700">להצעת מחיר וצפייה במוצרים</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </Container>
    </div>
  );
}

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { BundleCover } from "@/components/product/BundleCover";
import { getActiveBundles, resolveBundleItems } from "@/lib/server/adminBundles";
import { getAllProducts } from "@/lib/server/adminProducts";
import { getSiteContent } from "@/lib/server/siteContent";
import { siteImage, siteText } from "@/lib/siteContent";
import { formatPrice } from "@/lib/utils";

export async function BundleTeaser() {
  const [bundles, allProducts, c] = await Promise.all([getActiveBundles(), getAllProducts(), getSiteContent()]);
  if (bundles.length === 0) return null;

  const productMap = new Map(allProducts.map((p) => [p.id, p]));
  const active = bundles.slice(0, 3);

  return (
    <section className="bg-white py-16 sm:py-20">
      <Container className="flex flex-col gap-8">
        <SectionHeading eyebrow={siteText(c, "bundles.eyebrow")} title={siteText(c, "bundles.title")} description={siteText(c, "bundles.description")} />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {active.map((bundle) => {
            const { items, combined, total, savings } = resolveBundleItems(bundle, productMap);
            if (items.length === 0) return null;
            return (
              <Link
                key={bundle.id}
                href={`/bundles/${bundle.slug}`}
                className="group flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-sand-300 bg-sand-50"
              >
                <BundleCover
                    coverUrl={bundle.coverUrl}
                  artKinds={items.map((it) => it.product.artKind)}
                  nameHe={bundle.nameHe}
                  itemCount={items.length}
                  className="aspect-[16/10] transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <div className="flex flex-1 flex-col gap-2 p-5">
                  {bundle.description && <p className="text-sm leading-relaxed text-charcoal-500">{bundle.description}</p>}
                  <div className="mt-auto flex items-end justify-between pt-3">
                    <div>
                      {savings > 0 && <p className="text-xs text-charcoal-400 line-through">{formatPrice(combined)}</p>}
                      <p className="font-heading text-xl font-semibold text-brand-700">{formatPrice(total)}</p>
                    </div>
                    {savings > 0 && <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-600">חיסכון {formatPrice(savings)}</span>}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        <Button href="/bundles" variant="secondary" className="self-start">
          {siteText(c, "bundles.cta")}
        </Button>
      </Container>
    </section>
  );
}

import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { bundles } from "@/lib/data/bundles";
import { getProductsByIds } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils";

export function BundleTeaser() {
  const active = bundles.filter((b) => b.active).slice(0, 3);
  return (
    <section className="bg-white py-16 sm:py-20">
      <Container className="flex flex-col gap-8">
        <SectionHeading eyebrow="מארזי מבצע" title="מארזים משתלמים לחלל אחיד" description="שילובי מוצרים תואמים ממותג אחד, במחיר משתלם מרכישה נפרדת." />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {active.map((bundle) => {
            const bundleProducts = getProductsByIds(bundle.productIds);
            const combined = bundleProducts.reduce((sum, p) => sum + p.price, 0);
            const savings = Math.max(0, combined - bundle.bundlePrice);
            return (
              <Link
                key={bundle.id}
                href={`/bundles/${bundle.slug}`}
                className="group flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-sand-300 bg-sand-50"
              >
                <div className="relative aspect-[16/10]">
                  <Image src={bundle.heroImage} alt={bundle.nameHe} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <h3 className="font-heading text-lg font-semibold text-charcoal-900">{bundle.nameHe}</h3>
                  <p className="text-sm leading-relaxed text-charcoal-500">{bundle.description}</p>
                  <div className="mt-auto flex items-end justify-between pt-3">
                    <div>
                      <p className="text-xs text-charcoal-400 line-through">{formatPrice(combined)}</p>
                      <p className="font-heading text-xl font-semibold text-brand-700">{formatPrice(bundle.bundlePrice)}</p>
                    </div>
                    {savings > 0 && <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-600">חיסכון {formatPrice(savings)}</span>}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        <Button href="/bundles" variant="secondary" className="self-start">
          כל מארזי המבצע
        </Button>
      </Container>
    </section>
  );
}

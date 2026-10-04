import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { brands } from "@/lib/data/brands";
import { getAllProducts } from "@/lib/server/adminProducts";

export async function BrandStrip() {
  const usedBrandIds = new Set((await getAllProducts()).map((p) => p.brandId));
  const shownBrands = brands.filter((b) => usedBrandIds.has(b.id));
  if (shownBrands.length === 0) return null;

  return (
    <section className="border-y border-sand-300 bg-white py-8">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-6">
          {shownBrands.map((b) => (
            <Link
              key={b.id}
              href={`/brand/${b.slug}`}
              className="opacity-90 transition-opacity hover:opacity-100"
              aria-label={b.nameHe}
            >
              <BrandLogo brand={b} />
            </Link>
          ))}
        </div>
        <p className="mt-5 text-xs text-charcoal-400">
          המותגים המוצגים הינם לצורכי הדגמה בלבד ואינם מהווים אישור להסכם הפצה רשמי עם היבואן.
        </p>
      </Container>
    </section>
  );
}

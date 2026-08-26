import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { brands } from "@/lib/data/brands";

export function BrandStrip() {
  return (
    <section className="border-y border-sand-300 bg-white py-8">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-6">
          {brands.map((b) => (
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

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { brands } from "@/lib/data/brands";

export function BrandStrip() {
  return (
    <section className="border-y border-sand-300 bg-white py-8">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
          {brands.map((b) => (
            <Link
              key={b.id}
              href={`/brand/${b.slug}`}
              className="font-heading text-lg font-semibold tracking-tight text-charcoal-400 transition-colors hover:text-charcoal-900"
            >
              {b.nameHe}
            </Link>
          ))}
        </div>
        <p className="mt-4 text-xs text-charcoal-400">
          המותגים המוצגים הינם לצורכי הדגמה בלבד ואינם מהווים אישור להסכם הפצה רשמי עם היבואן.
        </p>
      </Container>
    </section>
  );
}

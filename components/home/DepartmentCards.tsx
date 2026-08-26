import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/Container";
import { categories } from "@/lib/data/categories";

export function DepartmentCards() {
  return (
    <section className="py-16 sm:py-20">
      <Container className="flex flex-col gap-8">
        <SectionHeading eyebrow="מחלקות" title="קניה לפי תחום" description="כל מחלקה אצרנית, עם מבחר ממותגי הפרימיום המובילים בעולם." />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-[var(--radius-card)]"
            >
              <Image
                src={cat.image}
                alt={cat.nameHe}
                fill
                sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-charcoal-950/10 to-transparent" />
              <span className="absolute bottom-4 start-4 font-heading text-base font-semibold text-white sm:text-lg">
                {cat.nameHe}
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

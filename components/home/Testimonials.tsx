import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/Container";
import { Rating } from "@/components/ui/Rating";
import { testimonials } from "@/lib/data/testimonials";

export function Testimonials() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <Container className="flex flex-col gap-8">
        <SectionHeading eyebrow="לקוחות מספרים" title="חוויית שירות שמדברת בעד עצמה" align="center" className="mx-auto" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t) => (
            <div key={t.id} className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-sand-300 p-6">
              <Rating value={t.rating} />
              <p className="text-sm leading-relaxed text-charcoal-700">&quot;{t.text}&quot;</p>
              <p className="mt-auto text-xs font-semibold text-charcoal-400">
                {t.author}
                {t.location && ` · ${t.location}`}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

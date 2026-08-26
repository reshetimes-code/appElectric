import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { faqs } from "@/lib/data/faqs";

export const metadata: Metadata = { title: "שאלות נפוצות" };

const CATEGORY_LABELS: Record<string, string> = {
  general: "כללי",
  delivery: "משלוח",
  warranty: "אחריות",
  import: "ייבוא אישי",
  payment: "תשלום",
};

export default function FaqPage() {
  const groups = Object.entries(CATEGORY_LABELS).map(([key, label]) => ({
    key,
    label,
    items: faqs.filter((f) => f.category === key),
  })).filter((g) => g.items.length > 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <Container className="flex flex-col gap-8 py-8 sm:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs items={[{ label: "שאלות נפוצות" }]} />
      <h1 className="font-heading text-3xl font-bold text-charcoal-900 sm:text-4xl">שאלות נפוצות</h1>

      <div className="flex flex-col gap-10">
        {groups.map((group) => (
          <div key={group.key}>
            <h2 className="mb-3 font-heading text-lg font-semibold text-charcoal-900">{group.label}</h2>
            <div className="flex flex-col gap-3">
              {group.items.map((f) => (
                <details key={f.id} className="group rounded-[var(--radius-control)] border border-sand-300 p-4">
                  <summary className="cursor-pointer list-none text-sm font-medium text-charcoal-900">{f.question}</summary>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal-600">{f.answer}</p>
                </details>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}

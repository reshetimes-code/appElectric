import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import type { LegalPageContent } from "@/lib/content/legalPages";

export function LegalPageLayout({ content }: { content: LegalPageContent }) {
  return (
    <Container className="flex flex-col gap-8 py-8 sm:py-12">
      <Breadcrumbs items={[{ label: content.title }]} />
      <div className="max-w-3xl">
        <h1 className="font-heading text-3xl font-bold text-charcoal-900 sm:text-4xl">{content.title}</h1>
        <p className="mt-4 leading-relaxed text-charcoal-600">{content.intro}</p>
      </div>
      <div className="flex max-w-3xl flex-col gap-8">
        {content.sections.map((section) => (
          <div key={section.heading}>
            <h2 className="mb-2 font-heading text-lg font-semibold text-charcoal-900">{section.heading}</h2>
            <div className="flex flex-col gap-2">
              {section.body.map((p, i) => (
                <p key={i} className="leading-relaxed text-charcoal-600">{p}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}

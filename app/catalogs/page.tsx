import type { Metadata } from "next";
import Image from "next/image";
import { FileText, Download } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { getCatalogs } from "@/lib/server/catalogs";

export const metadata: Metadata = {
  title: "קטלוגים",
  description: "קטלוגים להורדה וצפייה של AppElectric.",
};

export default async function CatalogsPage() {
  const catalogs = await getCatalogs();
  return (
    <Container className="flex flex-col gap-8 py-12">
      <SectionHeading eyebrow="קטלוגים" title="קטלוגים" description="צפו בקטלוגים שלנו או הורידו אותם." />
      {catalogs.length === 0 ? (
        <p className="text-sm text-charcoal-500">אין כרגע קטלוגים להצגה.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {catalogs.map((c) => (
            <li key={c.id} className="flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-sand-300 bg-white">
              {c.coverUrl && (
                <div className="relative aspect-[16/7] w-full bg-sand-100">
                  <Image src={c.coverUrl} alt={c.title} fill priority sizes="(min-width: 1280px) 1200px, 100vw" className="object-cover" />
                </div>
              )}
              <div className="flex flex-col gap-3 p-5">
                <p className="text-base font-medium text-charcoal-900">{c.title}</p>
                <div className="flex flex-wrap items-center gap-4">
                  <a href={c.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-brand-700 hover:underline">
                    <FileText size={16} />
                    צפייה בקטלוג (PDF)
                  </a>
                  <a href={c.url} download className="inline-flex items-center gap-2 text-sm text-charcoal-600 hover:underline">
                    <Download size={16} />
                    הורדה
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}

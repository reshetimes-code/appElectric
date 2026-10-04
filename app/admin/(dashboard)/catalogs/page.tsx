import Image from "next/image";
import { FileText } from "lucide-react";
import { getCatalogs } from "@/lib/server/catalogs";
import { CatalogUploadForm } from "@/components/admin/CatalogUploadForm";
import { DeleteCatalogButton } from "@/components/admin/DeleteCatalogButton";

export default async function AdminCatalogsPage() {
  const catalogs = await getCatalogs();
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-charcoal-900">קטלוגים</h1>
        <p className="mt-1 text-sm text-charcoal-500">קבצי PDF שיוצגו ללקוחות בעמוד &quot;קטלוגים&quot; באתר, כל אחד עם שורת טקסט מעליו.</p>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div className="overflow-hidden rounded-[var(--radius-card)] border border-sand-300 bg-white">
          {catalogs.length === 0 ? (
            <p className="p-8 text-center text-sm text-charcoal-500">עדיין לא הועלו קטלוגים.</p>
          ) : (
            catalogs.map((c) => (
              <div key={c.id} className="flex items-center gap-3 border-b border-sand-200 p-4 last:border-none">
                {c.coverUrl ? (
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-sand-100">
                    <Image src={c.coverUrl} alt={c.title} fill className="object-cover" />
                  </div>
                ) : (
                  <FileText size={18} className="shrink-0 text-charcoal-400" />
                )}
                <p className="min-w-0 flex-1 text-sm font-medium text-charcoal-900">{c.title}</p>
                <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-700 hover:underline">צפייה</a>
                <DeleteCatalogButton id={c.id} />
              </div>
            ))
          )}
        </div>
        <CatalogUploadForm />
      </div>
    </div>
  );
}

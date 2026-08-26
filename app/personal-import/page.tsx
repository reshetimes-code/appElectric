import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { LeadForm } from "@/components/leads/LeadForm";
import { lifestylePhoto } from "@/lib/images";
import { faqs } from "@/lib/data/faqs";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "ייבוא אישי",
  description: "שירות ייבוא אישי למכשירי חשמל ומטבח יוקרתיים שאינם מוחזקים במלאי בישראל.",
};

const STEPS = [
  { title: "ייעוץ אישי", text: "שיחה עם צוות ה-VIP להבנת הצרכים והמידות." },
  { title: "בחירת מוצר", text: "איתור הדגם המדויק המתאים למטבח שלכם." },
  { title: "בדיקת זמינות ומקור", text: "בדיקת זמינות מול הספק ומועד אספקה משוער." },
  { title: "תיאום ייבוא", text: "הזמנת המוצר ותיאום כל שלבי הלוגיסטיקה." },
  { title: "אספקה", text: "עדכון שוטף עד להגעת המוצר לישראל." },
  { title: "התקנה מקצועית", text: "תיאום התקנה על ידי טכנאי מוסמך." },
];

const importFaqs = faqs.filter((f) => f.category === "import");

export default function PersonalImportPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-charcoal-950">
        <Image src={lifestylePhoto("appelectric-import-hero", 1800, 900)} alt="ייבוא אישי" fill sizes="100vw" className="object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/60 to-transparent" />
        <Container className="relative flex min-h-[320px] flex-col justify-end gap-3 py-12 text-white">
          <p className="text-sm font-semibold text-brand-400">ייבוא אישי</p>
          <h1 className="max-w-xl font-heading text-3xl font-bold sm:text-4xl">דגמי יוקרה שלא תמצאו בשום מקום אחר בארץ</h1>
        </Container>
      </section>

      <Container className="flex flex-col gap-14 py-12 sm:py-16">
        <Breadcrumbs items={[{ label: "ייבוא אישי" }]} />

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1fr]">
          <div className="flex flex-col gap-4">
            <h2 className="font-heading text-xl font-semibold text-charcoal-900">מה זה ייבוא אישי?</h2>
            <p className="leading-relaxed text-charcoal-600">
              חלק ממותגי היוקרה המובילים בעולם משווקים דגמים ייחודיים שאינם מוחזקים במלאי קבוע בישראל. במסגרת שירות הייבוא
              האישי, צוות ה-VIP שלנו מאתר, מזמין ומלווה עבורכם את המוצר המדויק שביקשתם — משלב הייעוץ ועד ההתקנה בבית.
            </p>
            <h2 className="mt-4 font-heading text-xl font-semibold text-charcoal-900">למי זה מתאים?</h2>
            <p className="leading-relaxed text-charcoal-600">
              לבעלי בתים ואדריכלים המחפשים דגם ספציפי, גימור נדיר או מפרט טכני שאינו זמין דרך היבוא הרגיל בארץ.
            </p>
          </div>
          <div className="rounded-[var(--radius-card)] border border-sand-300 bg-sand-50 p-6">
            <h2 className="mb-4 font-heading text-lg font-semibold text-charcoal-900">תהליך העבודה</h2>
            <ol className="flex flex-col gap-3">
              {STEPS.map((step, i) => (
                <li key={step.title} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-white">{i + 1}</span>
                  <span>
                    <span className="block text-sm font-semibold text-charcoal-900">{step.title}</span>
                    <span className="block text-sm text-charcoal-500">{step.text}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="rounded-[var(--radius-card)] bg-charcoal-950 p-6 text-charcoal-200">
          <p className="flex items-start gap-2 text-sm leading-relaxed">
            <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-brand-400" />
            מועדי אספקה, תנאי אחריות ועלויות מדויקות נקבעים מול הספק בכל הזמנה בנפרד ומועברים אליכם על ידי צוות ה-VIP —
            איננו מציגים כאן התחייבות גורפת מראש.
          </p>
        </div>

        {importFaqs.length > 0 && (
          <div>
            <h2 className="mb-4 font-heading text-xl font-semibold text-charcoal-900">שאלות נפוצות על ייבוא אישי</h2>
            <div className="flex flex-col gap-3">
              {importFaqs.map((f) => (
                <details key={f.id} className="group rounded-[var(--radius-control)] border border-sand-300 p-4">
                  <summary className="cursor-pointer list-none text-sm font-medium text-charcoal-900">{f.question}</summary>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal-600">{f.answer}</p>
                </details>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="mb-4 font-heading text-xl font-semibold text-charcoal-900">קבלת ייעוץ ייבוא אישי</h2>
          <LeadForm source="personal-import" productOrCategoryLabel="דגם / מותג מבוקש" submitLabel="לייעוץ ייבוא אישי" />
        </div>
      </Container>
    </div>
  );
}

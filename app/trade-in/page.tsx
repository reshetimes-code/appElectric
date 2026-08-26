import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { TradeInForm } from "@/components/leads/TradeInForm";
import { Info } from "lucide-react";

export const metadata: Metadata = {
  title: "טרייד-אין",
  description: "מסרו לנו את המכשיר הישן שלכם וקבלו הצעה למכשיר החדש שאתם רוצים.",
};

export default function TradeInPage() {
  return (
    <Container className="flex flex-col gap-8 py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "טרייד-אין" }]} />
      <div className="max-w-2xl">
        <p className="mb-2 text-sm font-semibold text-brand-600">טרייד-אין</p>
        <h1 className="font-heading text-3xl font-bold text-charcoal-900 sm:text-4xl">שדרגו את המכשיר הישן שלכם</h1>
        <p className="mt-4 leading-relaxed text-charcoal-600">
          ספרו לנו על המכשיר הקיים שלכם ועל המכשיר החדש שאתם מתעניינים בו — נבדוק את הפרטים ונחזור אליכם עם הצעה מותאמת אישית.
        </p>
      </div>

      <p className="flex items-start gap-2 rounded-[var(--radius-control)] bg-amber-50 p-4 text-sm text-amber-700">
        <Info size={17} className="mt-0.5 shrink-0" />
        זוהי בקשה ראשונית בלבד — לא נקבע ערך טרייד-אין סופי בשלב זה. ההצעה הסופית תימסר לאחר בדיקת המכשיר בפועל.
      </p>

      <TradeInForm />
    </Container>
  );
}

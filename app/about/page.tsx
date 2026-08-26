import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { WhyUs } from "@/components/home/WhyUs";
import { lifestylePhoto } from "@/lib/images";

export const metadata: Metadata = {
  title: "אודות",
  description: "AppElectric — חנות פרימיום למכשירי חשמל ומטבח יוקרתיים עם שירות VIP אישי.",
};

export default function AboutPage() {
  return (
    <div>
      <Container className="flex flex-col gap-10 py-8 sm:py-12">
        <Breadcrumbs items={[{ label: "אודות" }]} />
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-semibold text-brand-600">אודות AppElectric</p>
            <h1 className="font-heading text-3xl font-bold text-charcoal-900 sm:text-4xl">מטבח יוקרה מתחיל בבחירה הנכונה</h1>
            <p className="mt-4 leading-relaxed text-charcoal-600">
              AppElectric הוקמה מתוך אמונה שקניית מכשירי חשמל למטבח צריכה להרגיש כמו ביקור בשואו-רום עיצוב — לא כמו חנות
              אלקטרוניקה רגילה. אנחנו עובדים עם מותגי היוקרה המובילים בעולם, מציעים שירות ייבוא אישי לדגמים ייחודיים,
              ומלווים כל לקוח באופן אישי מהייעוץ הראשוני ועד ההתקנה בבית.
            </p>
            <p className="mt-4 leading-relaxed text-charcoal-600">
              הצוות שלנו מורכב מאנשי מקצוע המכירים לעומק את עולם המכשירים המשולבים, אילוצי התקנה במטבחים מעוצבים,
              ולוגיסטיקת ייבוא מורכבת — כדי שאתם תוכלו להתמקד בבחירה שמתאימה לכם.
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)]">
            <Image src={lifestylePhoto("appelectric-about", 900, 700)} alt="שואו-רום AppElectric" fill className="object-cover" />
          </div>
        </div>
      </Container>
      <WhyUs />
    </div>
  );
}

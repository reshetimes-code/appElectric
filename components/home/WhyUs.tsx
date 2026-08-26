import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/Container";
import { Gem, Lightbulb, HeartHandshake, Truck } from "lucide-react";

const ITEMS = [
  { icon: Gem, title: "איכות פרימיום", text: "ייבוא אישי ומותגי יוקרה נבחרים, ללא פשרות על חומרים וגימור." },
  { icon: Lightbulb, title: "חדשנות", text: "טכנולוגיות מכשירים מתקדמות, מעודכנות לפי הדגמים האחרונים בעולם." },
  { icon: HeartHandshake, title: "שירות ראשון", text: "ליווי אישי וייעוץ מקצועי לאורך כל התהליך — לא רק עד לתשלום." },
  { icon: Truck, title: "לוגיסטיקה מקצועית", text: "משלוח, תיאום התקנה ואפשרות לפינוי מכשיר ישן." },
];

export function WhyUs() {
  return (
    <section className="py-16 sm:py-20">
      <Container className="flex flex-col gap-8">
        <SectionHeading eyebrow="למה AppElectric" title="חוויית קניה ברמת שואו-רום" align="center" className="mx-auto" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-[var(--radius-card)] border border-sand-300 bg-white p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <Icon size={22} />
              </div>
              <h3 className="font-heading text-base font-semibold text-charcoal-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal-500">{text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

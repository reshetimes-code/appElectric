import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { LeadForm } from "@/components/leads/LeadForm";
import { Button } from "@/components/ui/Button";
import { vipServices } from "@/lib/data/vipServices";
import { formatPrice } from "@/lib/utils";
import { MessageCircle, Wrench, Truck, Building2 } from "lucide-react";

export const metadata: Metadata = {
  title: "שירותי VIP",
  description: "ייעוץ אישי, התקנה מקצועית ושירות מלווה לאורך כל תהליך הרכישה.",
};

const ICONS = [Wrench, Truck, Building2, MessageCircle];

export default function VipPage() {
  return (
    <div className="py-8 sm:py-12">
      <Container className="flex flex-col gap-12">
        <Breadcrumbs items={[{ label: "שירותי VIP" }]} />
        <div className="max-w-2xl">
          <p className="mb-2 text-sm font-semibold text-brand-600">שירותי VIP</p>
          <h1 className="font-heading text-3xl font-bold text-charcoal-900 sm:text-4xl">ליווי אישי מהייעוץ ועד ההתקנה</h1>
          <p className="mt-4 leading-relaxed text-charcoal-600">
            צוות ה-VIP שלנו זמין לכל שאלה — בחירת מוצר מתאים, תיאום מידות, ייבוא אישי, התקנה מקצועית ותמיכה גם אחרי הרכישה.
          </p>
          <Button
            href="https://wa.me/972500000000?text=%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%99%D7%99%D7%A2%D7%95%D7%A5%20VIP"
            target="_blank"
            rel="noopener noreferrer"
            size="lg"
            className="mt-6"
          >
            <MessageCircle size={17} />
            שיחת WhatsApp מיידית
          </Button>
        </div>

        <div>
          <h2 className="mb-4 font-heading text-xl font-semibold text-charcoal-900">שירותים נלווים</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {vipServices.map((s, i) => {
              const Icon = ICONS[i % ICONS.length];
              return (
                <div key={s.id} className="flex gap-4 rounded-[var(--radius-card)] border border-sand-300 p-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="font-heading text-sm font-semibold text-charcoal-900">{s.name}</p>
                    <p className="mt-1 text-sm text-charcoal-500">{s.description}</p>
                    <p className="mt-2 text-sm font-medium text-charcoal-700">{s.price > 0 ? formatPrice(s.price) : "ללא עלות"}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-charcoal-400">מחירי השירותים משתנים בהתאם למוצר ולאזור המגורים ומאושרים סופית מול צוות ה-VIP.</p>
        </div>

        <div>
          <h2 className="mb-4 font-heading text-xl font-semibold text-charcoal-900">השאירו פרטים לייעוץ VIP</h2>
          <LeadForm source="vip" submitLabel="לקביעת ייעוץ VIP" />
        </div>
      </Container>
    </div>
  );
}

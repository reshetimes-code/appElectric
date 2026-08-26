import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { LeadForm } from "@/components/leads/LeadForm";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "צור קשר",
  description: "יצירת קשר עם צוות AppElectric — טלפון, אימייל וטופס פנייה.",
};

export default function ContactPage() {
  return (
    <Container className="flex flex-col gap-10 py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "צור קשר" }]} />
      <div>
        <h1 className="font-heading text-3xl font-bold text-charcoal-900 sm:text-4xl">צור קשר</h1>
        <p className="mt-3 max-w-xl leading-relaxed text-charcoal-600">נשמח לעזור בכל שאלה — לגבי מוצר, הזמנה קיימת או ייעוץ כללי.</p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[320px_1fr]">
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3 rounded-[var(--radius-card)] border border-sand-300 p-4">
            <Phone size={18} className="mt-0.5 text-brand-600" />
            <div>
              <p className="text-sm font-semibold text-charcoal-900">טלפון</p>
              <a href="tel:+972300000000" className="text-sm text-charcoal-500">03-0000000</a>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-[var(--radius-card)] border border-sand-300 p-4">
            <Mail size={18} className="mt-0.5 text-brand-600" />
            <div>
              <p className="text-sm font-semibold text-charcoal-900">אימייל</p>
              <a href="mailto:info@appelectric.co.il" className="text-sm text-charcoal-500">info@appelectric.co.il</a>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-[var(--radius-card)] border border-sand-300 p-4">
            <MapPin size={18} className="mt-0.5 text-brand-600" />
            <div>
              <p className="text-sm font-semibold text-charcoal-900">שואו-רום</p>
              <p className="text-sm text-charcoal-500">בתיאום מראש, גוש דן</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-[var(--radius-card)] border border-sand-300 p-4">
            <Clock size={18} className="mt-0.5 text-brand-600" />
            <div>
              <p className="text-sm font-semibold text-charcoal-900">שעות פעילות</p>
              <p className="text-sm text-charcoal-500">א'–ה' 9:00–18:00</p>
            </div>
          </div>
        </div>

        <LeadForm source="contact" productOrCategoryLabel="נושא הפנייה" submitLabel="שליחת הודעה" />
      </div>
    </Container>
  );
}

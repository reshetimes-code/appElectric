import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/Container";
import { getSiteContent } from "@/lib/server/siteContent";
import { siteImage, siteText } from "@/lib/siteContent";
import { Gem, Lightbulb, HeartHandshake, Truck } from "lucide-react";

const ICONS = [Gem, Lightbulb, HeartHandshake, Truck];

export async function WhyUs() {
  const c = await getSiteContent();
  const ITEMS = ICONS.map((icon, i) => ({
    icon,
    title: siteText(c, `whyUs.${i + 1}.title`),
    text: siteText(c, `whyUs.${i + 1}.text`),
  }));
  return (
    <section className="py-16 sm:py-20">
      <Container className="flex flex-col gap-8">
        <SectionHeading eyebrow={siteText(c, "whyUs.eyebrow")} title={siteText(c, "whyUs.title")} align="center" className="mx-auto" />
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

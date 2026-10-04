import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { getSiteContent } from "@/lib/server/siteContent";
import { siteImage, siteText } from "@/lib/siteContent";
import { CheckCircle2 } from "lucide-react";

const STEPS = ["ייעוץ אישי", "בחירת מוצר", "בדיקת זמינות ומקור", "תיאום ייבוא", "אספקה", "התקנה מקצועית"];

export async function PersonalImportTeaser() {
  const c = await getSiteContent();
  return (
    <section className="bg-charcoal-950 py-16 text-white sm:py-20">
      <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="mb-2 text-sm font-semibold text-brand-400">{siteText(c, "importTeaser.eyebrow")}</p>
          <h2 className="font-heading text-2xl font-semibold sm:text-3xl">{siteText(c, "importTeaser.title")}</h2>
          <p className="mt-4 max-w-lg leading-relaxed text-charcoal-300">
            {siteText(c, "importTeaser.description")}
          </p>
          <ul className="mt-6 grid grid-cols-2 gap-3">
            {STEPS.map((step, i) => (
              <li key={step} className="flex items-center gap-2 text-sm text-charcoal-200">
                <CheckCircle2 size={16} className="shrink-0 text-brand-400" />
                {i + 1}. {step}
              </li>
            ))}
          </ul>
          <Button href="/personal-import" variant="primary" size="lg" className="mt-7">
            {siteText(c, "importTeaser.cta")}
          </Button>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)]">
          <Image src={siteImage(c, "importTeaser")} alt="ייבוא אישי של מכשירי חשמל יוקרתיים" fill className="object-cover" />
        </div>
      </Container>
    </section>
  );
}

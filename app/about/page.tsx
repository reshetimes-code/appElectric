import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { WhyUs } from "@/components/home/WhyUs";
import { getSiteContent } from "@/lib/server/siteContent";
import { siteImage, siteText } from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "אודות",
  description: "AppElectric — חנות פרימיום למכשירי חשמל ומטבח יוקרתיים עם שירות VIP אישי.",
};

export default async function AboutPage() {
  const c = await getSiteContent();
  return (
    <div>
      <Container className="flex flex-col gap-10 py-8 sm:py-12">
        <Breadcrumbs items={[{ label: "אודות" }]} />
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-semibold text-brand-600">{siteText(c, "about.eyebrow")}</p>
            <h1 className="font-heading text-3xl font-bold text-charcoal-900 sm:text-4xl">{siteText(c, "about.title")}</h1>
            <p className="mt-4 leading-relaxed text-charcoal-600">
              {siteText(c, "about.p1")}
            </p>
            <p className="mt-4 leading-relaxed text-charcoal-600">
              {siteText(c, "about.p2")}
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)]">
            <Image src={siteImage(c, "about")} alt="שואו-רום AppElectric" fill className="object-cover" />
          </div>
        </div>
      </Container>
      <WhyUs />
    </div>
  );
}

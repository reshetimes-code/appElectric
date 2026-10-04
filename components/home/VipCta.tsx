import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { getSiteContent } from "@/lib/server/siteContent";
import { siteImage, siteText } from "@/lib/siteContent";
import { WHATSAPP_NUMBER } from "@/lib/siteConfig";

export async function VipCta() {
  const c = await getSiteContent();
  return (
    <section className="bg-brand-700 py-14 text-white sm:py-16">
      <Container className="flex flex-col items-center gap-5 text-center">
        <h2 className="font-heading text-2xl font-semibold sm:text-3xl">{siteText(c, "vipCta.title")}</h2>
        <p className="max-w-xl leading-relaxed text-brand-50">
          {siteText(c, "vipCta.description")}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("שלום, אשמח לייעוץ VIP")}`}
            target="_blank"
            rel="noopener noreferrer"
            variant="dark"
            size="lg"
          >
            {siteText(c, "vipCta.cta1")}
          </Button>
          <Button href="/vip" variant="outline-light" size="lg">
            {siteText(c, "vipCta.cta2")}
          </Button>
        </div>
      </Container>
    </section>
  );
}

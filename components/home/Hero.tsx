import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getSiteContent } from "@/lib/server/siteContent";
import { siteImage, siteText } from "@/lib/siteContent";

export async function Hero() {
  const c = await getSiteContent();
  return (
    <section className="relative overflow-hidden bg-charcoal-950">
      <Image
        src={siteImage(c, "hero")}
        alt="מטבח יוקרה עם מכשירי חשמל משולבים"
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/60 to-charcoal-950/20" />
      <Container className="relative flex min-h-[560px] flex-col justify-end gap-6 py-16 sm:min-h-[640px] sm:py-20">
        <p className="text-sm font-semibold tracking-wide text-brand-400">{siteText(c, "hero.eyebrow")}</p>
        <h1 className="max-w-2xl font-heading text-4xl font-bold leading-tight text-white sm:text-6xl">
          {siteText(c, "hero.title")}
        </h1>
        <p className="max-w-xl text-lg leading-relaxed text-charcoal-200">
          {siteText(c, "hero.subtitle")}
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Button href="/bundles" size="lg">
            {siteText(c, "hero.cta1")}
          </Button>
          <Button href="/vip" variant="outline-light" size="lg">
            {siteText(c, "hero.cta2")}
          </Button>
        </div>
      </Container>
    </section>
  );
}

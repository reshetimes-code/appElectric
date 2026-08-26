import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PHOTOS } from "@/lib/images";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-charcoal-950">
      <Image
        src={PHOTOS.heroKitchen}
        alt="מטבח יוקרה עם מכשירי חשמל משולבים"
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/60 to-charcoal-950/20" />
      <Container className="relative flex min-h-[560px] flex-col justify-end gap-6 py-16 sm:min-h-[640px] sm:py-20">
        <p className="text-sm font-semibold tracking-wide text-brand-400">AppElectric — מטבחי יוקרה</p>
        <h1 className="max-w-2xl font-heading text-4xl font-bold leading-tight text-white sm:text-6xl">
          מכשירי חשמל פרימיום, בסטנדרט של שואו-רום עיצוב
        </h1>
        <p className="max-w-xl text-lg leading-relaxed text-charcoal-200">
          קירור, בישול, כביסה ומולטימדיה ממיטב המותגים העולמיים — עם ייעוץ אישי, ייבוא ייעודי והתקנה מקצועית מקצה לקצה.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Button href="/shop?premium=1" size="lg">
            לקולקציית הפרימיום
          </Button>
          <Button href="/vip" variant="outline-light" size="lg">
            ייעוץ VIP אישי
          </Button>
        </div>
      </Container>
    </section>
  );
}

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/Container";
import { getSiteContent } from "@/lib/server/siteContent";
import { siteImage, siteText } from "@/lib/siteContent";

const TILES = [
  { key: "lifestyle1", alt: "מטבח מודרני בהיר עם מכשירי חשמל משולבים" },
  { key: "lifestyle2", alt: "כיריים אינדוקציה משולבות במטבח מעוצב" },
  { key: "lifestyle3", alt: "מטבח עיצובי עם תנור בנוי" },
  { key: "lifestyle4", alt: "מדיח כלים פתוח עם כלים נקיים" },
];

export async function LifestyleGrid() {
  const c = await getSiteContent();
  return (
    <section className="py-16 sm:py-20">
      <Container className="flex flex-col gap-8">
        <SectionHeading eyebrow={siteText(c, "lifestyle.eyebrow")} title={siteText(c, "lifestyle.title")} description={siteText(c, "lifestyle.description")} />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {TILES.map((tile, i) => (
            <div key={tile.key} className={`relative overflow-hidden rounded-[var(--radius-card)] ${i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"}`}>
              <Image src={siteImage(c, tile.key)} alt={tile.alt} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

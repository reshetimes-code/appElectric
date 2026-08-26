import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/Container";
import { PHOTOS } from "@/lib/images";

const TILES = [
  { photo: PHOTOS.kitchenBright, alt: "מטבח מודרני בהיר עם מכשירי חשמל משולבים" },
  { photo: PHOTOS.cookingTwoTone, alt: "כיריים אינדוקציה משולבות במטבח מעוצב" },
  { photo: PHOTOS.kitchenWood, alt: "מטבח עיצובי עם תנור בנוי" },
  { photo: PHOTOS.dishwasher, alt: "מדיח כלים פתוח עם כלים נקיים" },
];

export function LifestyleGrid() {
  return (
    <section className="py-16 sm:py-20">
      <Container className="flex flex-col gap-8">
        <SectionHeading eyebrow="השראה" title="מכשירים שמתמזגים בעיצוב הבית" description="מבחר פרויקטים שבהם המכשירים הם חלק בלתי נפרד מהעיצוב האדריכלי." />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {TILES.map((tile, i) => (
            <div key={tile.photo} className={`relative overflow-hidden rounded-[var(--radius-card)] ${i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"}`}>
              <Image src={tile.photo} alt={tile.alt} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

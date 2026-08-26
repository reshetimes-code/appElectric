import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/Container";
import { lifestylePhoto } from "@/lib/images";

const SEEDS = ["appelectric-life-1", "appelectric-life-2", "appelectric-life-3", "appelectric-life-4"];

export function LifestyleGrid() {
  return (
    <section className="py-16 sm:py-20">
      <Container className="flex flex-col gap-8">
        <SectionHeading eyebrow="השראה" title="מכשירים שמתמזגים בעיצוב הבית" description="מבחר פרויקטים שבהם המכשירים הם חלק בלתי נפרד מהעיצוב האדריכלי." />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {SEEDS.map((seed, i) => (
            <div key={seed} className={`relative overflow-hidden rounded-[var(--radius-card)] ${i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"}`}>
              <Image src={lifestylePhoto(seed, 700, 700)} alt="מטבח יוקרה עם מכשירי חשמל משולבים" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

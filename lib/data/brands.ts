import type { Brand } from "@/lib/types";
import { lifestylePhoto } from "@/lib/images";

// Demo catalog data. Brand names are used for illustrative/demo purposes only —
// no official distribution/authorization relationship is implied or configured.
export const brands: Brand[] = [
  {
    id: "miele",
    slug: "miele",
    nameHe: "Miele",
    logo: "",
    description: "מותג גרמני מוביל בטכנולוגיית מטבח ומכשירי חשמל פרימיום, ידוע באיכות ייצור ועמידות ארוכת שנים.",
    heroImage: lifestylePhoto("appelectric-miele", 1200, 700),
    premium: true,
  },
  {
    id: "vzug",
    slug: "vzug",
    nameHe: "V-ZUG",
    logo: "",
    description: "מותג שוויצרי המתמחה במכשירי מטבח משולבים בעיצוב מינימליסטי וטכנולוגיה מתקדמת.",
    heroImage: lifestylePhoto("appelectric-vzug", 1200, 700),
    premium: true,
  },
  {
    id: "bertazzoni",
    slug: "bertazzoni",
    nameHe: "Bertazzoni",
    logo: "",
    description: "מותג איטלקי עתיר מסורת, מתמחה בכיריים ותנורים בעיצוב איטלקי קלאסי.",
    heroImage: lifestylePhoto("appelectric-bertazzoni", 1200, 700),
    premium: true,
  },
  {
    id: "de-dietrich",
    slug: "de-dietrich",
    nameHe: "De Dietrich",
    logo: "",
    description: "מותג צרפתי יוקרתי המשלב עיצוב אלגנטי עם חדשנות טכנולוגית במכשירי מטבח בנויים.",
    heroImage: lifestylePhoto("appelectric-dedietrich", 1200, 700),
    premium: true,
  },
  {
    id: "electrolux",
    slug: "electrolux",
    nameHe: "Electrolux",
    logo: "",
    description: "מותג סקנדינבי מוביל עולמית במכשירי חשמל ביתיים איכותיים ואמינים.",
    heroImage: lifestylePhoto("appelectric-electrolux", 1200, 700),
    premium: false,
  },
  {
    id: "samsung",
    slug: "samsung",
    nameHe: "Samsung",
    logo: "",
    description: "טכנולוגיה חכמה ועיצוב חדשני במגוון רחב של מכשירי חשמל ומולטימדיה.",
    heroImage: lifestylePhoto("appelectric-samsung", 1200, 700),
    premium: false,
  },
];

export function getBrandBySlug(slug: string) {
  return brands.find((b) => b.slug === slug);
}

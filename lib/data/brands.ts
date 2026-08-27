import type { Brand } from "@/lib/types";
import { PHOTOS } from "@/lib/images";

// Demo catalog data. Brand names/logos are shown for product-identification purposes only
// (standard retailer practice) — no official distribution/authorization relationship is
// implied or configured. See IMAGE_SOURCES.md for logo provenance.
export const brands: Brand[] = [
  {
    id: "miele",
    slug: "miele",
    nameHe: "Miele",
    logo: "/brand-logos/miele.svg",
    description: "מותג גרמני מוביל בטכנולוגיית מטבח ומכשירי חשמל פרימיום, ידוע באיכות ייצור ועמידות ארוכת שנים.",
    heroImage: PHOTOS.cookingWhite,
    premium: true,
  },
  {
    id: "vzug",
    slug: "vzug",
    nameHe: "V-ZUG",
    logo: "",
    description: "מותג שוויצרי המתמחה במכשירי מטבח משולבים בעיצוב מינימליסטי וטכנולוגיה מתקדמת.",
    heroImage: PHOTOS.cookingTwoTone,
    premium: true,
  },
  {
    id: "bertazzoni",
    slug: "bertazzoni",
    nameHe: "Bertazzoni",
    logo: "",
    description: "מותג איטלקי עתיר מסורת, מתמחה בכיריים ותנורים בעיצוב איטלקי קלאסי.",
    heroImage: PHOTOS.cookingFlame,
    premium: true,
  },
  {
    id: "de-dietrich",
    slug: "de-dietrich",
    nameHe: "De Dietrich",
    logo: "/brand-logos/dedietrich.jpg",
    description: "מותג צרפתי יוקרתי המשלב עיצוב אלגנטי עם חדשנות טכנולוגית במכשירי מטבח בנויים.",
    heroImage: PHOTOS.kitchenWood,
    premium: true,
  },
  {
    id: "electrolux",
    slug: "electrolux",
    nameHe: "Electrolux",
    logo: "/brand-logos/electrolux.svg",
    description: "מותג סקנדינבי מוביל עולמית במכשירי חשמל ביתיים איכותיים ואמינים.",
    heroImage: PHOTOS.laundry,
    premium: false,
  },
  {
    id: "samsung",
    slug: "samsung",
    nameHe: "Samsung",
    logo: "/brand-logos/samsung.svg",
    description: "טכנולוגיה חכמה ועיצוב חדשני במגוון רחב של מכשירי חשמל ומולטימדיה.",
    heroImage: PHOTOS.multimedia,
    premium: false,
  },
  {
    id: "bosch",
    slug: "bosch",
    nameHe: "Bosch",
    logo: "",
    description: "מותג גרמני ותיק המוכר באמינות הנדסית גבוהה ובמגוון רחב של מכשירי מטבח וכביסה.",
    heroImage: PHOTOS.kitchenBright,
    premium: false,
  },
  {
    id: "lg",
    slug: "lg",
    nameHe: "LG",
    logo: "",
    description: "מותג קוריאני מוביל בטכנולוגיות כביסה, קירור ומולטימדיה חכמה.",
    heroImage: PHOTOS.laundry,
    premium: false,
  },
  {
    id: "blomberg",
    slug: "blomberg",
    nameHe: "Blomberg",
    logo: "",
    description: "מותג סקנדינבי המתמחה במכשירי חשמל פרקטיים ואיכותיים במחיר משתלם.",
    heroImage: PHOTOS.cookingOven,
    premium: false,
  },
];

export function getBrandBySlug(slug: string) {
  return brands.find((b) => b.slug === slug);
}

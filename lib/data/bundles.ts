import type { Bundle } from "@/lib/types";
import { PHOTOS } from "@/lib/images";

export const bundles: Bundle[] = [
  {
    id: "de-dietrich-kitchen",
    slug: "de-dietrich-kitchen-package",
    nameHe: "מארז מטבח De Dietrich",
    description: "תנור בנוי, קולט אדים מעוצב ומגירת חימום מסדרת De Dietrich — שלישייה מושלמת למטבח יוקרתי ואחיד.",
    heroImage: PHOTOS.kitchenWood,
    productIds: ["ape-ovn-dd01", "ape-hood-dd02", "ape-drw-dd03"],
    bundlePrice: 14990,
    active: true,
  },
  {
    id: "miele-laundry",
    slug: "miele-laundry-set",
    nameHe: "מארז כביסה Miele",
    description: "מכונת כביסה ומייבש משאבת חום מסדרת Miele התואמת — ביצועים חסכוניים ושקטים לכל בית.",
    heroImage: PHOTOS.laundry,
    productIds: ["ape-wfr-mi05", "ape-dry-mi06"],
    bundlePrice: 14990,
    active: true,
  },
  {
    id: "vzug-cooking-duo",
    slug: "vzug-cooking-duo",
    nameHe: "מארז בישול V-ZUG",
    description: "כיריים PITT Cooking ומדיח כלים משולב מלא מסדרת V-ZUG — לחוויית מטבח פתוחה ומתוחכמת.",
    heroImage: PHOTOS.cookingFlame,
    productIds: ["ape-pitt-vz03", "ape-dw-full-vz06"],
    bundlePrice: 22990,
    active: true,
  },
];

export function getBundleBySlug(slug: string) {
  return bundles.find((b) => b.slug === slug);
}

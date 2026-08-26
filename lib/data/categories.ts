import type { Category } from "@/lib/types";
import { PHOTOS } from "@/lib/images";

export const categories: Category[] = [
  {
    id: "cooling",
    slug: "cooling",
    nameHe: "קירור והקפאה",
    departmentId: "cooling",
    image: PHOTOS.wineFridge,
    filterKind: "cooling",
    subcategories: [
      { id: "fridge-4door", slug: "fridge-4door", nameHe: "מקררי 4 דלתות" },
      { id: "fridge-3-5door", slug: "fridge-3-5door", nameHe: "מקררי 3–5 דלתות" },
      { id: "fridge-side-by-side", slug: "side-by-side", nameHe: "Side-by-Side" },
      { id: "fridge-top-freezer", slug: "top-freezer", nameHe: "מקפיא עליון" },
      { id: "fridge-bottom-freezer", slug: "bottom-freezer", nameHe: "מקפיא תחתון" },
      { id: "fridge-integrated", slug: "integrated-luxury", nameHe: "מקררים משולבים — יוקרה" },
      { id: "freezers", slug: "freezers", nameHe: "מקפיאים" },
      { id: "wine-fridges", slug: "wine-fridges", nameHe: "מקררי יין" },
      { id: "display-fridges", slug: "display-fridges", nameHe: "מקררי תצוגה / משרד" },
    ],
  },
  {
    id: "cooking",
    slug: "cooking",
    nameHe: "בישול ואפייה",
    departmentId: "cooking",
    image: PHOTOS.cookingTwoTone,
    filterKind: "cooking",
    subcategories: [
      { id: "built-in-ovens", slug: "built-in-ovens", nameHe: "תנורים בנויים" },
      { id: "combi-ovens", slug: "combi-ovens", nameHe: "תנורי קומבי" },
      { id: "cooktops-induction", slug: "cooktops-induction", nameHe: "כיריים אינדוקציה" },
      { id: "cooktops-gas", slug: "cooktops-gas", nameHe: "כיריים גז" },
      { id: "cooktops-pitt", slug: "cooktops-pitt", nameHe: "PITT Cooking" },
      { id: "hoods", slug: "hoods", nameHe: "קולטי אדים מעוצבים" },
      { id: "built-in-microwaves", slug: "built-in-microwaves", nameHe: "מיקרוגל בנוי" },
      { id: "warming-drawers", slug: "warming-drawers", nameHe: "מגירות חימום" },
      { id: "pizza-ovens", slug: "pizza-ovens", nameHe: "תנורי פיצה / טאבון יוקרה" },
    ],
  },
  {
    id: "laundry",
    slug: "laundry",
    nameHe: "כביסה וייבוש",
    departmentId: "laundry",
    image: PHOTOS.laundry,
    filterKind: "laundry",
    subcategories: [
      { id: "washers-front", slug: "washers-front", nameHe: "מכונות כביסה פתח קדמי" },
      { id: "washers-top", slug: "washers-top", nameHe: "מכונות כביסה פתח עליון" },
      { id: "dryers", slug: "dryers", nameHe: "מייבשים" },
      { id: "washer-dryer-combo", slug: "washer-dryer-combo", nameHe: "מכונות כביסה-ייבוש משולבות" },
    ],
  },
  {
    id: "dishwashers",
    slug: "dishwashers",
    nameHe: "מדיחי כלים",
    departmentId: "dishwashers",
    image: PHOTOS.dishwasher,
    filterKind: "dishwasher",
    subcategories: [
      { id: "dw-full", slug: "fully-integrated", nameHe: "משולב מלא" },
      { id: "dw-semi", slug: "semi-integrated", nameHe: "משולב חלקי" },
      { id: "dw-60", slug: "60cm", nameHe: '60 ס"מ' },
      { id: "dw-45", slug: "45cm", nameHe: '45 ס"מ' },
      { id: "dw-countertop", slug: "countertop", nameHe: "מדיח שולחני" },
    ],
  },
  {
    id: "multimedia",
    slug: "multimedia",
    nameHe: "מולטימדיה",
    departmentId: "multimedia",
    image: PHOTOS.multimedia,
    filterKind: "multimedia",
    subcategories: [
      { id: "tv-75plus", slug: "large-screens-75", nameHe: 'מסכים ״75+' },
      { id: "tv-oled", slug: "oled", nameHe: "OLED" },
      { id: "tv-qled", slug: "qled", nameHe: "QLED" },
      { id: "soundbars", slug: "soundbars", nameHe: "סאונדבארים" },
    ],
  },
];

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getSubcategory(categorySlug: string, subSlug: string) {
  const category = getCategoryBySlug(categorySlug);
  return category?.subcategories.find((s) => s.slug === subSlug);
}

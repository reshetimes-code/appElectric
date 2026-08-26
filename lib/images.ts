// Curated, on-topic photography (kitchens/appliances only — no landscapes, animals, or
// unrelated stock imagery), self-hosted in /public/images. Sourced under CC0/public-domain
// or CC-BY-compatible licenses suitable for commercial use; see IMAGE_SOURCES.md for credits.
export const PHOTOS = {
  heroKitchen: "/images/hero-kitchen.jpg",
  kitchenBright: "/images/kitchen-bright.jpg",
  cookingWhite: "/images/cooking-white.jpg",
  cookingTwoTone: "/images/cooking-twotone.jpg",
  kitchenWood: "/images/kitchen-wood.jpg",
  dishwasher: "/images/dishwasher.jpg",
  laundry: "/images/laundry.jpg",
  multimedia: "/images/multimedia.jpg",
  cookingOven: "/images/cooking-oven.jpg",
  cookingFlame: "/images/cooking-flame.jpg",
  wineFridge: "/images/wine-fridge.jpg",
} as const;

export type PhotoKey = keyof typeof PHOTOS;

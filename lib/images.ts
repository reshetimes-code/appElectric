// Deterministic lifestyle/editorial photography via picsum.photos (verified reachable,
// stable per-seed). Used for hero/lifestyle/category/brand backdrops — never for literal
// product photography, which uses the on-brand SVG illustrations in components/product/ApplianceArt.
export function lifestylePhoto(seed: string, width = 1200, height = 800) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`;
}

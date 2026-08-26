"use client";

import { useState } from "react";
import { Ruler, Info } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { categories } from "@/lib/data/categories";
import { findByNiche } from "@/lib/repo/products";
import type { Product } from "@/lib/types";

export default function NicheFinderPage() {
  const [categorySlug, setCategorySlug] = useState<string>("");
  const [width, setWidth] = useState<number>(600);
  const [height, setHeight] = useState<number>(1800);
  const [depth, setDepth] = useState<number>(600);
  const [tolerance, setTolerance] = useState<number>(10);
  const [results, setResults] = useState<Product[] | null>(null);

  function search(e: React.FormEvent) {
    e.preventDefault();
    setResults(
      findByNiche({
        widthMm: width,
        heightMm: height,
        depthMm: depth,
        categorySlug: categorySlug || undefined,
        toleranceMm: tolerance,
      }),
    );
  }

  return (
    <Container className="flex flex-col gap-8 py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "מציאת מידה לנישה" }]} />
      <div className="max-w-2xl">
        <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-brand-600">
          <Ruler size={16} /> מציאת מידה לנישה
        </p>
        <h1 className="font-heading text-3xl font-bold text-charcoal-900 sm:text-4xl">מצאו מוצרים שמתאימים למידה שלכם</h1>
        <p className="mt-3 leading-relaxed text-charcoal-600">
          הזינו את מידות הנישה הפנויה במטבח ואנחנו נציג מוצרים שמידות ההתקנה הנדרשות שלהם מתאימות.
        </p>
      </div>

      <form onSubmit={search} className="grid grid-cols-1 gap-4 rounded-[var(--radius-card)] border border-sand-300 p-6 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-charcoal-700">קטגוריה</label>
          <select value={categorySlug} onChange={(e) => setCategorySlug(e.target.value)} className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm">
            <option value="">כל הקטגוריות</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>{c.nameHe}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-charcoal-700">רוחב (מ&quot;מ)</label>
          <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-charcoal-700">גובה (מ&quot;מ)</label>
          <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-charcoal-700">עומק (מ&quot;מ)</label>
          <input type="number" value={depth} onChange={(e) => setDepth(Number(e.target.value))} className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-charcoal-700">סבילות (מ&quot;מ)</label>
          <input type="number" value={tolerance} onChange={(e) => setTolerance(Number(e.target.value))} className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm" />
        </div>
        <Button type="submit" className="sm:col-span-2 lg:col-span-5">
          מצא מוצרים שמתאימים למידה שלי
        </Button>
      </form>

      <p className="flex items-start gap-2 rounded-[var(--radius-control)] bg-amber-50 p-4 text-sm text-amber-700">
        <Info size={16} className="mt-0.5 shrink-0" />
        התוצאות מבוססות על מידות נישת ההתקנה הנדרשות כפי שמופיעות בעמוד המוצר, ולא רק על מידות המוצר עצמו. יש לאמת את המידות הסופיות מול תיעוד היצרן לפני רכישה או התקנה.
      </p>

      {results && (
        <div>
          <p className="mb-4 text-sm text-charcoal-500">{results.length} מוצרים מתאימים</p>
          <ProductGrid products={results} />
        </div>
      )}
    </Container>
  );
}

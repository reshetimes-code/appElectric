import { notFound } from "next/navigation";
import { getAnyProductById } from "@/lib/server/adminProducts";
import { ProductImagesForm } from "@/components/admin/ProductImagesForm";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export default async function ProductImagesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getAnyProductById(id);
  if (!product) notFound();

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <Breadcrumbs items={[{ label: "מוצרים", href: "/admin/products" }, { label: product.nameHe }]} />
      <div>
        <h1 className="font-heading text-2xl font-semibold text-charcoal-900">תמונות — {product.nameHe}</h1>
        <p className="mt-1 text-sm text-charcoal-500">
          מק&quot;ט {product.sku} · דגם {product.model}. שינוי כאן משפיע רק על התמונות של המוצר הזה — כל שאר הפרטים (מפרט, מידות, מחיר וכו&apos;) נשארים כמו שהם.
        </p>
      </div>
      <ProductImagesForm productId={product.id} initialImages={product.images} />
    </div>
  );
}

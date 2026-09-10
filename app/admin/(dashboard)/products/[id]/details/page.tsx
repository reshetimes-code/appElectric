import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getAnyProductById, listBrandsAndCategoriesForForm } from "@/lib/server/adminProducts";

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getAnyProductById(id);
  if (!product) notFound();

  const { brands, categories } = listBrandsAndCategoriesForForm();
  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <Breadcrumbs items={[{ label: "מוצרים", href: "/admin/products" }, { label: product.nameHe }]} />
      <div>
        <h1 className="font-heading text-2xl font-semibold text-charcoal-900">פרטי מוצר — {product.nameHe}</h1>
        <p className="mt-1 text-sm text-charcoal-500">
          עריכת הפרטים הקיימים של המוצר. התמונות נשארות כמו שהן — לעריכתן יש עמוד &quot;תמונות&quot; נפרד.
        </p>
      </div>
      <ProductForm brands={brands} categories={categories} initial={product} productId={id} mode="details" />
    </div>
  );
}

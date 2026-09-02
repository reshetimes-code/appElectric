import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { getAdminProductById, listBrandsAndCategoriesForForm } from "@/lib/server/adminProducts";

export default async function EditAdminProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getAdminProductById(id);
  if (!product) notFound();

  const { brands, categories } = listBrandsAndCategoriesForForm();
  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <h1 className="font-heading text-2xl font-semibold text-charcoal-900">עריכת מוצר</h1>
      <ProductForm brands={brands} categories={categories} initial={product} productId={id} />
    </div>
  );
}

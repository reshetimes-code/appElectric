import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { getProductCosts } from "@/lib/server/productCosts";
import { getAdminProductById, listBrandsAndCategoriesForForm } from "@/lib/server/adminProducts";

export default async function EditAdminProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getAdminProductById(id);
  if (!product) notFound();

  const { brands, categories, screenSizes } = await listBrandsAndCategoriesForForm();
  const initialCost = (await getProductCosts())[id];
  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <h1 className="font-heading text-2xl font-semibold text-charcoal-900">עריכת מוצר</h1>
      <ProductForm brands={brands} categories={categories} screenSizes={screenSizes} initial={product} initialCost={initialCost} productId={id} />
    </div>
  );
}

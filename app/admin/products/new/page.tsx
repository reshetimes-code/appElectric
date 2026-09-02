import { ProductForm } from "@/components/admin/ProductForm";
import { listBrandsAndCategoriesForForm } from "@/lib/server/adminProducts";

export default function NewAdminProductPage() {
  const { brands, categories } = listBrandsAndCategoriesForForm();
  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <h1 className="font-heading text-2xl font-semibold text-charcoal-900">הוספת מוצר</h1>
      <ProductForm brands={brands} categories={categories} />
    </div>
  );
}

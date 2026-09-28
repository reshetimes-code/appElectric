import { BundleForm } from "@/components/admin/BundleForm";
import { getAllProducts } from "@/lib/server/adminProducts";

export default async function NewBundlePage() {
  const products = await getAllProducts();
  const productOptions = products.map((p) => ({ id: p.id, nameHe: p.nameHe, price: p.price }));

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <h1 className="font-heading text-2xl font-semibold text-charcoal-900">סט חדש</h1>
      <BundleForm products={productOptions} />
    </div>
  );
}

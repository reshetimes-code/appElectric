import { notFound } from "next/navigation";
import { BundleForm } from "@/components/admin/BundleForm";
import { getBundleById } from "@/lib/server/adminBundles";
import { getAllProducts } from "@/lib/server/adminProducts";

export default async function EditBundlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [bundle, products] = await Promise.all([getBundleById(id), getAllProducts()]);
  if (!bundle) notFound();
  const productOptions = products.map((p) => ({ id: p.id, nameHe: p.nameHe, price: p.price }));

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <h1 className="font-heading text-2xl font-semibold text-charcoal-900">עריכת סט</h1>
      <BundleForm products={productOptions} bundle={bundle} />
    </div>
  );
}

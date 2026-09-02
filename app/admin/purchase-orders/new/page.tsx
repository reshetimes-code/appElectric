import { getSuppliers } from "@/lib/server/suppliers";
import { PurchaseOrderForm } from "@/components/admin/PurchaseOrderForm";
import { Button } from "@/components/ui/Button";

export default async function NewPurchaseOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const suppliers = getSuppliers();
  const sp = await searchParams;
  const str = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

  if (suppliers.length === 0) {
    return (
      <div className="flex max-w-lg flex-col gap-4 rounded-[var(--radius-card)] border border-dashed border-sand-300 p-8 text-center">
        <p className="text-sm text-charcoal-600">כדי ליצור הזמנת רכש צריך קודם להוסיף לפחות ספק אחד.</p>
        <Button href="/admin/suppliers" className="mx-auto">הוספת ספק</Button>
      </div>
    );
  }

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <h1 className="font-heading text-2xl font-semibold text-charcoal-900">הזמנת רכש חדשה</h1>
      <PurchaseOrderForm
        suppliers={suppliers}
        initialProductName={str(sp.productName)}
        initialDeliveryAddress={str(sp.deliveryAddress)}
        initialNotes={str(sp.notes)}
      />
    </div>
  );
}

import { notFound } from "next/navigation";
import { getPurchaseOrderById } from "@/lib/server/purchaseOrders";
import { PurchaseOrderActions } from "@/components/admin/PurchaseOrderActions";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { formatPrice } from "@/lib/utils";

export default async function PurchaseOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const po = getPurchaseOrderById(id);
  if (!po) notFound();

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <Breadcrumbs items={[{ label: "הזמנות רכש", href: "/admin/purchase-orders" }, { label: po.poNumber }]} />
      <div>
        <h1 dir="ltr" className="text-end font-heading text-2xl font-semibold text-charcoal-900">{po.poNumber}</h1>
        <p className="mt-1 text-sm text-charcoal-500">נוצרה ב-{new Date(po.createdAt).toLocaleDateString("he-IL")}</p>
      </div>

      <div className="rounded-[var(--radius-card)] border border-sand-300 bg-white p-6">
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-charcoal-400">ספק</dt>
            <dd className="text-sm font-medium text-charcoal-900">{po.supplierName}</dd>
          </div>
          <div>
            <dt className="text-xs text-charcoal-400">פרטי קשר</dt>
            <dd dir="ltr" className="text-end text-sm text-charcoal-900">{po.supplierEmail}</dd>
            <dd dir="ltr" className="text-end text-sm text-charcoal-900">{po.supplierWhatsapp}</dd>
          </div>
          <div>
            <dt className="text-xs text-charcoal-400">מוצר</dt>
            <dd className="text-sm font-medium text-charcoal-900">{po.productName}</dd>
          </div>
          <div>
            <dt className="text-xs text-charcoal-400">כמות</dt>
            <dd className="text-sm text-charcoal-900">{po.quantity}</dd>
          </div>
          <div>
            <dt className="text-xs text-charcoal-400">מחיר עלות ליחידה</dt>
            <dd className="text-sm text-charcoal-900">{formatPrice(po.costPrice)}</dd>
          </div>
          <div>
            <dt className="text-xs text-charcoal-400">סה&quot;כ</dt>
            <dd className="text-sm font-semibold text-charcoal-900">{formatPrice(po.costPrice * po.quantity)}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs text-charcoal-400">כתובת להספקה</dt>
            <dd className="text-sm text-charcoal-900">{po.deliveryAddress}</dd>
          </div>
          {po.notes && (
            <div className="sm:col-span-2">
              <dt className="text-xs text-charcoal-400">הערות</dt>
              <dd className="text-sm text-charcoal-900">{po.notes}</dd>
            </div>
          )}
        </dl>
      </div>

      <PurchaseOrderActions po={po} />
    </div>
  );
}

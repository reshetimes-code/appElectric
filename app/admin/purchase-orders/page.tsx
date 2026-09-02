import Link from "next/link";
import { Plus, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getPurchaseOrders } from "@/lib/server/purchaseOrders";
import { formatPrice } from "@/lib/utils";
import type { PurchaseOrderStatus } from "@/lib/types";

const STATUS_LABEL: Record<PurchaseOrderStatus, string> = {
  draft: "טיוטה",
  sent: "נשלחה לספק",
  confirmed: "אושרה ע\"י הספק",
  shipped: "נשלחה אליך",
};
const STATUS_TONE: Record<PurchaseOrderStatus, "muted" | "info" | "warning" | "success"> = {
  draft: "muted",
  sent: "info",
  confirmed: "warning",
  shipped: "success",
};

export default async function AdminPurchaseOrdersPage() {
  const purchaseOrders = getPurchaseOrders();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-charcoal-900">הזמנות רכש</h1>
          <p className="mt-1 text-sm text-charcoal-500">יצירה ומעקב אחר הזמנות רכש מול ספקים.</p>
        </div>
        <Button href="/admin/purchase-orders/new">
          <Plus size={17} />
          הזמנת רכש חדשה
        </Button>
      </div>

      {purchaseOrders.length === 0 ? (
        <div className="rounded-[var(--radius-card)] border border-dashed border-sand-300 p-8 text-center text-sm text-charcoal-500">
          <ClipboardList size={24} className="mx-auto mb-2 text-charcoal-300" />
          עדיין אין הזמנות רכש.
        </div>
      ) : (
        <div className="overflow-hidden rounded-[var(--radius-card)] border border-sand-300 bg-white">
          {purchaseOrders.map((po) => (
            <Link
              key={po.id}
              href={`/admin/purchase-orders/${po.id}`}
              className="flex flex-wrap items-center gap-3 border-b border-sand-200 p-4 last:border-none hover:bg-sand-50"
            >
              <span dir="ltr" className="w-24 shrink-0 text-sm font-semibold text-charcoal-900">{po.poNumber}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-charcoal-900">{po.productName}</p>
                <p className="text-xs text-charcoal-500">ספק: {po.supplierName}</p>
              </div>
              <span className="w-24 shrink-0 text-sm text-charcoal-600">{formatPrice(po.costPrice)}</span>
              <Badge tone={STATUS_TONE[po.status]}>{STATUS_LABEL[po.status]}</Badge>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

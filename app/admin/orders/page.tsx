import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { getOrders } from "@/lib/server/orders";
import { formatPrice } from "@/lib/utils";
import type { OrderStatus } from "@/lib/types";

const STATUS_LABEL: Record<OrderStatus, string> = {
  new: "חדשה",
  processing: "בטיפול",
  fulfilled: "טופלה",
};
const STATUS_TONE: Record<OrderStatus, "info" | "warning" | "success"> = {
  new: "info",
  processing: "warning",
  fulfilled: "success",
};

export default async function AdminOrdersPage() {
  const orders = getOrders();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-charcoal-900">הזמנות</h1>
        <p className="mt-1 text-sm text-charcoal-500">הזמנות שביצעו לקוחות באתר. מכל הזמנה אפשר ליצור הזמנת רכש מהספק בלחיצה.</p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-[var(--radius-card)] border border-dashed border-sand-300 p-8 text-center text-sm text-charcoal-500">
          <ShoppingBag size={24} className="mx-auto mb-2 text-charcoal-300" />
          עדיין אין הזמנות מלקוחות.
        </div>
      ) : (
        <div className="overflow-hidden rounded-[var(--radius-card)] border border-sand-300 bg-white">
          {orders.map((o) => (
            <Link
              key={o.id}
              href={`/admin/orders/${o.id}`}
              className="flex flex-col gap-2 border-b border-sand-200 p-4 last:border-none hover:bg-sand-50 sm:flex-row sm:items-center sm:gap-4"
            >
              <span dir="ltr" className="text-sm font-semibold text-charcoal-900 sm:w-28 sm:shrink-0">{o.orderNumber}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-charcoal-900">{o.customer.name}</p>
                <p className="text-xs text-charcoal-500">{o.lines.length} פריטים · {new Date(o.createdAt).toLocaleDateString("he-IL")}</p>
              </div>
              <span className="text-sm font-semibold text-charcoal-900 sm:w-24 sm:shrink-0">{formatPrice(o.subtotal)}</span>
              <Badge tone={STATUS_TONE[o.status]}>{STATUS_LABEL[o.status]}</Badge>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

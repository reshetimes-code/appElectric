import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/server/orders";
import { getAllProducts } from "@/lib/server/adminProducts";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { OrderStatusControls } from "@/components/admin/OrderStatusControls";
import { OrderLineItems } from "@/components/admin/OrderLineItems";
import { Pencil } from "lucide-react";
import type { OrderStatus } from "@/lib/types";

const STATUS_LABEL: Record<OrderStatus, string> = { new: "חדשה", processing: "בטיפול", fulfilled: "טופלה" };
const STATUS_TONE: Record<OrderStatus, "info" | "warning" | "success"> = { new: "info", processing: "warning", fulfilled: "success" };

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  const allProducts = await getAllProducts();
  const productMap = new Map(allProducts.map((p) => [p.id, p]));
  const address = `${order.customer.address}, ${order.customer.city}`;

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <Breadcrumbs items={[{ label: "הזמנות", href: "/admin/orders" }, { label: order.orderNumber }]} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 dir="ltr" className="text-end font-heading text-2xl font-semibold text-charcoal-900">{order.orderNumber}</h1>
          <p className="mt-1 text-sm text-charcoal-500">נוצרה ב-{new Date(order.createdAt).toLocaleDateString("he-IL")}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge tone={STATUS_TONE[order.status]}>{STATUS_LABEL[order.status]}</Badge>
          <Button href={`/admin/orders/${order.id}/edit`} variant="secondary" size="sm">
            <Pencil size={14} />
            עריכה
          </Button>
        </div>
      </div>

      <div className="rounded-[var(--radius-card)] border border-sand-300 bg-white p-6">
        <h2 className="mb-3 font-heading text-sm font-semibold text-charcoal-900">פרטי הלקוח</h2>
        <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs text-charcoal-400">שם</dt>
            <dd className="text-charcoal-900">{order.customer.name}</dd>
          </div>
          <div>
            <dt className="text-xs text-charcoal-400">טלפון</dt>
            <dd dir="ltr" className="text-end text-charcoal-900">{order.customer.phone}</dd>
          </div>
          {order.customer.email && (
            <div>
              <dt className="text-xs text-charcoal-400">מייל</dt>
              <dd dir="ltr" className="text-end text-charcoal-900">{order.customer.email}</dd>
            </div>
          )}
          <div className="sm:col-span-2">
            <dt className="text-xs text-charcoal-400">כתובת</dt>
            <dd className="text-charcoal-900">{address}</dd>
          </div>
          <div>
            <dt className="text-xs text-charcoal-400">משלוח</dt>
            <dd className="text-charcoal-900">{order.deliveryOption}</dd>
          </div>
          {order.notes && (
            <div className="sm:col-span-2">
              <dt className="text-xs text-charcoal-400">הערות</dt>
              <dd className="text-charcoal-900">{order.notes}</dd>
            </div>
          )}
        </dl>
      </div>

      <div className="rounded-[var(--radius-card)] border border-sand-300 bg-white p-6">
        <h2 className="mb-3 font-heading text-sm font-semibold text-charcoal-900">פריטים בהזמנה</h2>
        <OrderLineItems
          items={order.lines.map((line) => ({
            lineId: line.id,
            name: productMap.get(line.productId)?.nameHe ?? "מוצר לא ידוע",
            quantity: line.quantity,
            unitPrice: line.priceOverride ?? productMap.get(line.productId)?.price,
          }))}
          deliveryAddress={address}
          notesFor={() => `עבור הזמנת לקוח ${order.orderNumber} (${order.customer.name}, ${order.customer.phone})`}
        />
        <div className="mt-3 flex justify-between border-t border-sand-200 pt-3 text-sm font-semibold text-charcoal-900">
          <span>סה&quot;כ הזמנה</span>
          <span>{formatPrice(order.subtotal)}</span>
        </div>
      </div>

      <OrderStatusControls orderId={order.id} status={order.status} />
    </div>
  );
}

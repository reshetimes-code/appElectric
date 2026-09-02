import { notFound } from "next/navigation";
import Link from "next/link";
import { getOrderById } from "@/lib/server/orders";
import { getAllProducts } from "@/lib/server/adminProducts";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";
import { OrderStatusControls } from "@/components/admin/OrderStatusControls";
import { PackagePlus } from "lucide-react";
import type { OrderStatus } from "@/lib/types";

const STATUS_LABEL: Record<OrderStatus, string> = { new: "חדשה", processing: "בטיפול", fulfilled: "טופלה" };
const STATUS_TONE: Record<OrderStatus, "info" | "warning" | "success"> = { new: "info", processing: "warning", fulfilled: "success" };

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = getOrderById(id);
  if (!order) notFound();

  const allProducts = getAllProducts();
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
        <Badge tone={STATUS_TONE[order.status]}>{STATUS_LABEL[order.status]}</Badge>
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
        <div className="flex flex-col divide-y divide-sand-200">
          {order.lines.map((line) => {
            const product = productMap.get(line.productId);
            const name = product?.nameHe ?? "מוצר לא ידוע";
            const poParams = new URLSearchParams({
              productName: `${name} × ${line.quantity}`,
              deliveryAddress: address,
              notes: `עבור הזמנת לקוח ${order.orderNumber} (${order.customer.name}, ${order.customer.phone})`,
            });
            return (
              <div key={line.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-charcoal-900">{name} × {line.quantity}</p>
                  {product && <p className="text-xs text-charcoal-500">{formatPrice(product.price)} ליחידה</p>}
                </div>
                <Link
                  href={`/admin/purchase-orders/new?${poParams.toString()}`}
                  className="flex items-center gap-1.5 rounded-full border border-brand-600 px-3 py-1.5 text-xs font-medium text-brand-700 hover:bg-brand-50"
                >
                  <PackagePlus size={14} />
                  הזמן מהספק
                </Link>
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex justify-between border-t border-sand-200 pt-3 text-sm font-semibold text-charcoal-900">
          <span>סה&quot;כ הזמנה</span>
          <span>{formatPrice(order.subtotal)}</span>
        </div>
      </div>

      <OrderStatusControls orderId={order.id} status={order.status} />
    </div>
  );
}

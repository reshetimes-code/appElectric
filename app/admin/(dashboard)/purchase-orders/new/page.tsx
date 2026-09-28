import { getSuppliers } from "@/lib/server/suppliers";
import { getOrders } from "@/lib/server/orders";
import { getAllProducts } from "@/lib/server/adminProducts";
import { PurchaseOrderForm, type OrderOption } from "@/components/admin/PurchaseOrderForm";
import { Button } from "@/components/ui/Button";

export default async function NewPurchaseOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [suppliers, orders, products] = await Promise.all([getSuppliers(), getOrders(), getAllProducts()]);
  const sp = await searchParams;
  const str = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

  let initialItems: { productName: string; quantity: number }[] | undefined;
  const itemsParam = str(sp.items);
  if (itemsParam) {
    try {
      const parsed = JSON.parse(itemsParam);
      if (Array.isArray(parsed)) {
        initialItems = parsed
          .filter((it) => it && typeof it.productName === "string")
          .map((it) => ({ productName: it.productName, quantity: Number(it.quantity) || 1 }));
      }
    } catch {
      // malformed/tampered query param — fall back to the empty-form default
    }
  }

  const productMap = new Map(products.map((p) => [p.id, p]));
  const orderOptions: OrderOption[] = orders.flatMap((order) => {
    const address = `${order.customer.address}, ${order.customer.city}`;
    return order.lines.map((line) => {
      const name = productMap.get(line.productId)?.nameHe ?? "מוצר לא ידוע";
      return {
        value: `${order.id}:${line.id}`,
        label: `${order.orderNumber} — ${order.customer.name} — ${name} × ${line.quantity}`,
        productName: name,
        quantity: line.quantity,
        deliveryAddress: address,
        notes: `עבור הזמנת לקוח ${order.orderNumber} (${order.customer.name}, ${order.customer.phone})`,
      };
    });
  });

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
        orderOptions={orderOptions}
        initialProductName={str(sp.productName)}
        initialItems={initialItems}
        initialDeliveryAddress={str(sp.deliveryAddress)}
        initialNotes={str(sp.notes)}
      />
    </div>
  );
}

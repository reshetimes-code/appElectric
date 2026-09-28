import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/server/orders";
import { getAllProducts } from "@/lib/server/adminProducts";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { OrderEditForm } from "@/components/admin/OrderEditForm";

export default async function OrderEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  const products = await getAllProducts();

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <Breadcrumbs
        items={[
          { label: "הזמנות", href: "/admin/orders" },
          { label: order.orderNumber, href: `/admin/orders/${order.id}` },
          { label: "עריכה" },
        ]}
      />
      <h1 dir="ltr" className="text-end font-heading text-2xl font-semibold text-charcoal-900">עריכת {order.orderNumber}</h1>
      <OrderEditForm order={order} products={products} />
    </div>
  );
}

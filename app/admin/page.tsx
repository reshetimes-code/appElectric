import Link from "next/link";
import { Package, Truck, ClipboardList, AlertTriangle, ShoppingBag } from "lucide-react";
import { getAdminProducts } from "@/lib/server/adminProducts";
import { getSuppliers } from "@/lib/server/suppliers";
import { getPurchaseOrders } from "@/lib/server/purchaseOrders";
import { getOrders } from "@/lib/server/orders";
import { products as seedProducts } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const adminProducts = getAdminProducts();
  const suppliers = getSuppliers();
  const purchaseOrders = getPurchaseOrders();
  const orders = getOrders();
  const totalProducts = adminProducts.length + seedProducts.length;
  const lowStock = [...adminProducts, ...seedProducts].filter((p) => p.manageStock && p.stockQuantity > 0 && p.stockQuantity <= 3);
  const openPOs = purchaseOrders.filter((po) => po.status !== "shipped");
  const newOrders = orders.filter((o) => o.status === "new");

  const cards = [
    { href: "/admin/orders", label: "הזמנות חדשות", value: newOrders.length, icon: ShoppingBag },
    { href: "/admin/products", label: "מוצרים בקטלוג", value: totalProducts, icon: Package },
    { href: "/admin/suppliers", label: "ספקים", value: suppliers.length, icon: Truck },
    { href: "/admin/purchase-orders", label: "הזמנות רכש פתוחות", value: openPOs.length, icon: ClipboardList },
    { href: "/admin/products", label: "מוצרים במלאי נמוך", value: lowStock.length, icon: AlertTriangle },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-semibold text-charcoal-900">דשבורד</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="rounded-[var(--radius-card)] border border-sand-300 bg-white p-5 transition-colors hover:border-charcoal-400">
            <c.icon size={20} className="mb-3 text-brand-600" />
            <p className="font-heading text-2xl font-bold text-charcoal-900">{c.value}</p>
            <p className="text-sm text-charcoal-500">{c.label}</p>
          </Link>
        ))}
      </div>

      <div>
        <h2 className="mb-3 font-heading text-base font-semibold text-charcoal-900">הזמנות לקוחות אחרונות</h2>
        {orders.length === 0 ? (
          <p className="text-sm text-charcoal-500">אין עדיין הזמנות מלקוחות.</p>
        ) : (
          <div className="overflow-hidden rounded-[var(--radius-card)] border border-sand-300 bg-white">
            {orders.slice(0, 5).map((o) => (
              <Link key={o.id} href={`/admin/orders/${o.id}`} className="flex items-center justify-between gap-3 border-b border-sand-200 p-4 text-sm last:border-none hover:bg-sand-50">
                <span dir="ltr" className="font-medium text-charcoal-900">{o.orderNumber}</span>
                <span className="text-charcoal-600">{o.customer.name}</span>
                <span className="text-charcoal-500">{formatPrice(o.subtotal)}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {lowStock.length > 0 && (
        <div>
          <h2 className="mb-3 font-heading text-base font-semibold text-charcoal-900">מלאי נמוך — כדאי להזמין רכש</h2>
          <div className="overflow-hidden rounded-[var(--radius-card)] border border-sand-300 bg-white">
            {lowStock.slice(0, 8).map((p) => (
              <div key={p.id} className="flex items-center justify-between border-b border-sand-200 p-4 text-sm last:border-none">
                <span className="text-charcoal-900">{p.nameHe}</span>
                <span className="text-amber-600">{p.stockQuantity} יח&apos; במלאי</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="mb-3 font-heading text-base font-semibold text-charcoal-900">הזמנות רכש אחרונות</h2>
        {purchaseOrders.length === 0 ? (
          <p className="text-sm text-charcoal-500">אין עדיין הזמנות רכש.</p>
        ) : (
          <div className="overflow-hidden rounded-[var(--radius-card)] border border-sand-300 bg-white">
            {purchaseOrders.slice(0, 5).map((po) => (
              <Link key={po.id} href={`/admin/purchase-orders/${po.id}`} className="flex items-center justify-between border-b border-sand-200 p-4 text-sm last:border-none hover:bg-sand-50">
                <span dir="ltr" className="font-medium text-charcoal-900">{po.poNumber}</span>
                <span className="text-charcoal-600">{po.productName}</span>
                <span className="text-charcoal-500">{po.supplierName}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

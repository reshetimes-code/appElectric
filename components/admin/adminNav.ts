import { LayoutDashboard, Package, Truck, ClipboardList, ShoppingBag, PackageOpen, FileText, Palette } from "lucide-react";

export const ADMIN_NAV = [
  { href: "/admin", label: "לוח בקרה", icon: LayoutDashboard },
  { href: "/admin/orders", label: "הזמנות", icon: ShoppingBag },
  { href: "/admin/products", label: "מוצרים", icon: Package },
  { href: "/admin/bundles", label: "סטי פרימיום", icon: PackageOpen },
  { href: "/admin/catalogs", label: "קטלוגים", icon: FileText },
  { href: "/admin/site-content", label: "עיצוב האתר", icon: Palette },
  { href: "/admin/suppliers", label: "ספקים", icon: Truck },
  { href: "/admin/purchase-orders", label: "הזמנות רכש", icon: ClipboardList },
];

const WORKER_HREFS = new Set(["/admin/products", "/admin/bundles"]);

export function navForRole(role: "admin" | "worker") {
  return role === "worker" ? ADMIN_NAV.filter((i) => WORKER_HREFS.has(i.href)) : ADMIN_NAV;
}

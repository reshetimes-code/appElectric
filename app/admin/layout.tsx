import Link from "next/link";
import { LayoutDashboard, Package, Truck, ClipboardList, ExternalLink } from "lucide-react";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";

const NAV = [
  { href: "/admin", label: "דשבורד", icon: LayoutDashboard },
  { href: "/admin/products", label: "מוצרים", icon: Package },
  { href: "/admin/suppliers", label: "ספקים", icon: Truck },
  { href: "/admin/purchase-orders", label: "הזמנות רכש", icon: ClipboardList },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div dir="rtl" className="flex min-h-screen bg-sand-100">
      <aside className="hidden w-60 shrink-0 flex-col border-e border-sand-300 bg-charcoal-950 p-5 text-charcoal-200 lg:flex">
        <p className="mb-6 font-heading text-lg font-semibold text-white">ניהול AppElectric</p>
        <nav className="flex flex-1 flex-col gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-white/10 hover:text-white"
            >
              <item.icon size={17} />
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href="/" className="mb-2 flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm hover:bg-white/10 hover:text-white">
          <ExternalLink size={17} />
          חזרה לאתר
        </Link>
        <AdminLogoutButton />
      </aside>

      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-4 overflow-x-auto border-b border-sand-300 bg-white px-4 py-3 lg:hidden">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-charcoal-700">
              <item.icon size={15} />
              {item.label}
            </Link>
          ))}
          <Link href="/" className="mr-auto flex shrink-0 items-center gap-1.5 text-sm text-charcoal-500">
            <ExternalLink size={14} />
            לאתר
          </Link>
        </div>
        <main className="flex-1 p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}

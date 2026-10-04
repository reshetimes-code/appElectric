import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { ADMIN_NAV } from "@/components/admin/adminNav";
import { AdminMobileMenu } from "@/components/admin/AdminMobileMenu";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { OrderNotificationBell } from "@/components/admin/OrderNotificationBell";

// The whole admin area reads data-store/*.json at request time (products,
// suppliers, purchase orders). Without this, Next.js's automatic static
// optimization prerenders these pages once at build time (they call no
// fetch(), read no cookies/headers directly) and then serves that frozen
// snapshot forever from `next start` — so anything added after the build
// (a supplier, a PO, a product) would never show up. This forces every page
// under /admin to render fresh on each request instead.
export const dynamic = "force-dynamic";

const NAV = ADMIN_NAV;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-e border-sand-300 bg-charcoal-950 p-5 text-charcoal-200 lg:flex">
        <div className="mb-6 flex items-center justify-between gap-2">
          <p className="font-heading text-lg font-semibold text-white">ניהול AppElectric</p>
          <OrderNotificationBell className="text-charcoal-200 hover:text-white" />
        </div>
        <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
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

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminMobileMenu />
        <main className="min-w-0 flex-1 p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, Menu, X } from "lucide-react";
import { ADMIN_NAV } from "./adminNav";
import { AdminLogoutButton } from "./AdminLogoutButton";
import { OrderNotificationBell } from "./OrderNotificationBell";

export function AdminMobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-sand-300 bg-white px-4 py-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="פתיחת תפריט"
          aria-expanded={open}
          className="-m-1 rounded-lg p-1 text-charcoal-700"
        >
          <Menu size={24} />
        </button>
        <p className="font-heading text-base font-semibold text-charcoal-900">ניהול AppElectric</p>
        <OrderNotificationBell className="text-charcoal-700" />
      </div>

      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 start-0 flex w-72 max-w-[85%] flex-col bg-charcoal-950 p-5 text-charcoal-200 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <p className="font-heading text-lg font-semibold text-white">ניהול AppElectric</p>
              <button type="button" onClick={() => setOpen(false)} aria-label="סגירת תפריט" className="text-charcoal-200 hover:text-white">
                <X size={22} />
              </button>
            </div>
            <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
              {ADMIN_NAV.map((item) => {
                const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-3 text-sm transition-colors hover:bg-white/10 hover:text-white ${
                      active ? "bg-white/10 text-white" : ""
                    }`}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <Link href="/" className="mb-2 flex items-center gap-2.5 rounded-lg px-3 py-3 text-sm hover:bg-white/10 hover:text-white">
              <ExternalLink size={18} />
              חזרה לאתר
            </Link>
            <AdminLogoutButton />
          </aside>
        </div>
      )}
    </div>
  );
}

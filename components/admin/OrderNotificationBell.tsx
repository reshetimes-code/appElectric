"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { notifyNewOrder } from "@/lib/alert";
import { formatPrice, cn } from "@/lib/utils";
import type { CustomerOrder } from "@/lib/types";

const LAST_SEEN_KEY = "ae_admin_last_seen_order_id";
const POLL_MS = 20_000;

/**
 * Admin panel bell: polls the existing /api/admin/orders endpoint for new
 * customer orders. The badge always reflects the count of unhandled orders
 * (status "new" — same convention as the dashboard's "הזמנות חדשות" card).
 * A SweetAlert popup additionally fires once per order the first time this
 * browser sees it, so an admin browsing any /admin page gets notified
 * without needing to be on the orders page. Orders that already existed
 * before the bell was first loaded in this browser don't trigger a popup —
 * only ones that arrive afterward.
 */
export function OrderNotificationBell({ className }: { className?: string }) {
  const router = useRouter();
  const [newCount, setNewCount] = useState(0);
  const lastSeenIdRef = useRef<string | null>(null);
  const initializedRef = useRef(false);
  const alertingRef = useRef(false);

  useEffect(() => {
    try {
      lastSeenIdRef.current = localStorage.getItem(LAST_SEEN_KEY);
    } catch {
      // localStorage unavailable (e.g. blocked) — just skip persistence.
    }

    let cancelled = false;

    async function poll() {
      let orders: CustomerOrder[];
      try {
        const res = await fetch("/api/admin/orders", { cache: "no-store" });
        if (!res.ok) return;
        ({ orders } = (await res.json()) as { orders: CustomerOrder[] });
      } catch {
        return; // transient network error — try again next tick
      }
      if (cancelled) return;

      setNewCount(orders.filter((o) => o.status === "new").length);
      // getOrders() sorts newest-first server-side.
      const newest = orders[0];

      if (!initializedRef.current) {
        initializedRef.current = true;
        if (!lastSeenIdRef.current && newest) {
          lastSeenIdRef.current = newest.id;
          try {
            localStorage.setItem(LAST_SEEN_KEY, newest.id);
          } catch {}
        }
        return;
      }
      if (!newest || alertingRef.current) return;

      const lastSeenIndex = lastSeenIdRef.current ? orders.findIndex((o) => o.id === lastSeenIdRef.current) : -1;
      const freshOrders = lastSeenIndex === -1 ? orders.slice(0, 1) : orders.slice(0, lastSeenIndex);
      if (freshOrders.length === 0) return;

      lastSeenIdRef.current = newest.id;
      try {
        localStorage.setItem(LAST_SEEN_KEY, newest.id);
      } catch {}

      alertingRef.current = true;
      for (const order of freshOrders.slice().reverse()) {
        const viewIt = await notifyNewOrder({
          orderNumber: order.orderNumber,
          customerName: order.customer.name,
          total: formatPrice(order.subtotal),
        });
        if (cancelled) break;
        if (viewIt) {
          router.push(`/admin/orders/${order.id}`);
          break;
        }
      }
      alertingRef.current = false;
    }

    poll();
    const interval = setInterval(poll, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [router]);

  return (
    <Link href="/admin/orders" className={cn("relative", className)} aria-label="הזמנות חדשות">
      <Bell size={17} />
      {newCount > 0 && (
        <span className="absolute -end-2 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-semibold leading-none text-white">
          {newCount > 99 ? "99+" : newCount}
        </span>
      )}
    </Link>
  );
}

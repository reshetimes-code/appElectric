"use client";

import { useState } from "react";
import { Clock3, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useDelayedPending } from "@/lib/hooks/useDelayedPending";
import { useLoadedRefresh } from "@/lib/hooks/useLoadedRefresh";
import { useGlobalLoading } from "@/lib/context/GlobalLoadingContext";
import type { OrderStatus } from "@/lib/types";

export function OrderStatusControls({ orderId, status }: { orderId: string; status: OrderStatus }) {
  const refresh = useLoadedRefresh();
  const { withLoading } = useGlobalLoading();
  const [busy, setBusy] = useState(false);
  const showSpinner = useDelayedPending(busy, 500);

  async function setStatus(next: OrderStatus) {
    setBusy(true);
    await withLoading(() =>
      fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      }),
    );
    setBusy(false);
    refresh();
  }

  return (
    <div className="rounded-[var(--radius-card)] border border-sand-300 bg-white p-5">
      <h2 className="mb-3 font-heading text-sm font-semibold text-charcoal-900">עדכון סטטוס הזמנה</h2>
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => setStatus("processing")} variant="secondary" disabled={busy || status !== "new"}>
          {showSpinner ? <Spinner size={16} /> : <Clock3 size={16} />}
          סמן כבטיפול
        </Button>
        <Button onClick={() => setStatus("fulfilled")} variant="secondary" disabled={busy || status === "fulfilled"}>
          {showSpinner ? <Spinner size={16} /> : <CheckCircle2 size={16} />}
          סמן כטופלה
        </Button>
      </div>
    </div>
  );
}

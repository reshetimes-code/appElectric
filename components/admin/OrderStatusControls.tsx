"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Clock3, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { OrderStatus } from "@/lib/types";

export function OrderStatusControls({ orderId, status }: { orderId: string; status: OrderStatus }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function setStatus(next: OrderStatus) {
    setBusy(true);
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="rounded-[var(--radius-card)] border border-sand-300 bg-white p-5">
      <h2 className="mb-3 font-heading text-sm font-semibold text-charcoal-900">עדכון סטטוס הזמנה</h2>
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => setStatus("processing")} variant="secondary" disabled={busy || status !== "new"}>
          <Clock3 size={16} />
          סמן כבטיפול
        </Button>
        <Button onClick={() => setStatus("fulfilled")} variant="secondary" disabled={busy || status === "fulfilled"}>
          <CheckCircle2 size={16} />
          סמן כטופלה
        </Button>
      </div>
    </div>
  );
}

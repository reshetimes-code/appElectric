"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MessageCircle, Mail, CheckCircle2, PackageCheck, Info } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";
import type { PurchaseOrder, PurchaseOrderStatus } from "@/lib/types";

const STATUS_LABEL: Record<PurchaseOrderStatus, string> = {
  draft: "טיוטה",
  sent: "נשלחה לספק",
  confirmed: "אושרה ע\"י הספק",
  shipped: "נשלחה אליך",
};
const STATUS_TONE: Record<PurchaseOrderStatus, "muted" | "info" | "warning" | "success"> = {
  draft: "muted",
  sent: "info",
  confirmed: "warning",
  shipped: "success",
};

function buildMessage(po: PurchaseOrder) {
  return [
    `הזמנת רכש ${po.poNumber}`,
    `מוצר: ${po.productName}`,
    `כמות: ${po.quantity}`,
    `מחיר עלות ליחידה: ${formatPrice(po.costPrice)}`,
    `סה"כ: ${formatPrice(po.costPrice * po.quantity)}`,
    `כתובת להספקה: ${po.deliveryAddress}`,
    po.notes ? `הערות: ${po.notes}` : "",
    "",
    "אנא אשרו קבלת ההזמנה ומועד אספקה משוער.",
    "— AppElectric",
  ]
    .filter(Boolean)
    .join("\n");
}

export function PurchaseOrderActions({ po }: { po: PurchaseOrder }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function setStatus(status: PurchaseOrderStatus, sentVia?: "whatsapp" | "email") {
    setBusy(true);
    await fetch(`/api/admin/purchase-orders/${po.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, sentVia }),
    });
    setBusy(false);
    router.refresh();
  }

  function sendWhatsapp() {
    const text = encodeURIComponent(buildMessage(po));
    window.open(`https://wa.me/${po.supplierWhatsapp}?text=${text}`, "_blank");
    if (po.status === "draft") setStatus("sent", "whatsapp");
  }

  function sendEmail() {
    const subject = encodeURIComponent(`הזמנת רכש ${po.poNumber} — AppElectric`);
    const body = encodeURIComponent(buildMessage(po));
    window.location.href = `mailto:${po.supplierEmail}?subject=${subject}&body=${body}`;
    if (po.status === "draft") setStatus("sent", "email");
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 rounded-[var(--radius-card)] border border-sand-300 bg-white p-5">
        <span className="text-sm text-charcoal-500">סטטוס נוכחי:</span>
        <Badge tone={STATUS_TONE[po.status]}>{STATUS_LABEL[po.status]}</Badge>
        {po.sentVia?.length ? (
          <span className="text-xs text-charcoal-400">נשלחה דרך: {po.sentVia.map((v) => (v === "whatsapp" ? "וואטסאפ" : "מייל")).join(", ")}</span>
        ) : null}
      </div>

      <div className="rounded-[var(--radius-card)] border border-sand-300 bg-white p-5">
        <h2 className="mb-3 font-heading text-sm font-semibold text-charcoal-900">שליחה לספק</h2>
        <div className="flex flex-wrap gap-3">
          <Button onClick={sendWhatsapp} disabled={busy}>
            <MessageCircle size={17} />
            שליחה בוואטסאפ
          </Button>
          <Button onClick={sendEmail} variant="secondary" disabled={busy}>
            <Mail size={17} />
            שליחה במייל
          </Button>
        </div>
        <p className="mt-3 text-xs text-charcoal-400">
          כל כפתור פותח הודעה מוכנה מראש עם כל פרטי ההזמנה — נותר רק ללחוץ שליחה בוואטסאפ/במייל שלך.
        </p>
      </div>

      <div className="rounded-[var(--radius-card)] border border-sand-300 bg-white p-5">
        <h2 className="mb-3 font-heading text-sm font-semibold text-charcoal-900">עדכון סטטוס</h2>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setStatus("confirmed")} variant="secondary" disabled={busy || po.status === "confirmed" || po.status === "shipped"}>
            <CheckCircle2 size={17} />
            סמן כאושרה ע&quot;י הספק
          </Button>
          <Button onClick={() => setStatus("shipped")} variant="secondary" disabled={busy || po.status === "shipped"}>
            <PackageCheck size={17} />
            סמן כנשלחה אליי
          </Button>
        </div>
        <p className="mt-3 flex items-start gap-2 text-xs text-charcoal-400">
          <Info size={13} className="mt-0.5 shrink-0" />
          עדכון סטטוס אוטומטי כשהספק עונה בוואטסאפ/מייל דורש חיבור אמיתי ל-WhatsApp Business API / תיבת מייל נכנס (עם
          מפתחות API אמיתיים) — כרגע יש לעדכן ידנית כאן לאחר שהספק אישר.
        </p>
      </div>
    </div>
  );
}

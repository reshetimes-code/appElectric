"use client";

import { useState } from "react";
import { MessageCircle, Mail, Link2, CheckCircle2, PackageCheck, Info } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { useDelayedPending } from "@/lib/hooks/useDelayedPending";
import { useLoadedRefresh } from "@/lib/hooks/useLoadedRefresh";
import { useToast } from "@/components/ui/ToastProvider";
import { showEmailProviderChooser, showWhatsappRecipientChooser } from "@/lib/alert";
import { formatPrice } from "@/lib/utils";
import { useGlobalLoading } from "@/lib/context/GlobalLoadingContext";
import type { PurchaseOrder, PurchaseOrderStatus, Supplier } from "@/lib/types";

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

function poDocumentLink(po: PurchaseOrder) {
  return `${window.location.origin}/po/${po.id}`;
}

function buildMessage(po: PurchaseOrder) {
  const total = po.items.reduce((sum, item) => sum + item.costPrice * item.quantity, 0);
  return [
    `הזמנת רכש ${po.poNumber} מ-AppElectric`,
    ...po.items.map((item) => `מוצר: ${item.productName} (כמות: ${item.quantity})`),
    `סה"כ: ${formatPrice(total)}`,
    "",
    `למסמך ההזמנה המלא: ${poDocumentLink(po)}`,
    "",
    "אנא אשרו קבלת ההזמנה ומועד אספקה משוער.",
    "— AppElectric",
  ]
    .filter(Boolean)
    .join("\n");
}

export function PurchaseOrderActions({ po, suppliers }: { po: PurchaseOrder; suppliers: Supplier[] }) {
  const refresh = useLoadedRefresh();
  const toast = useToast();
  const { withLoading } = useGlobalLoading();
  const [busy, setBusy] = useState(false);
  const showSpinner = useDelayedPending(busy, 500);

  async function setStatus(status: PurchaseOrderStatus, sentVia?: "whatsapp" | "email") {
    setBusy(true);
    await withLoading(() =>
      fetch(`/api/admin/purchase-orders/${po.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, sentVia }),
      }),
    );
    setBusy(false);
    refresh();
  }

  function sendWhatsapp() {
    // The supplier this PO was created for is listed first, but any saved
    // supplier (or a number typed in on the spot) can be picked instead —
    // useful when a PO ends up going to a different contact.
    const ordered = [...suppliers].sort((a, b) => Number(b.id === po.supplierId) - Number(a.id === po.supplierId));
    const recipients = ordered.map((s) => ({ label: `${s.name} — ${s.whatsapp}`, whatsapp: s.whatsapp }));
    showWhatsappRecipientChooser(recipients, buildMessage(po));
    if (po.status === "draft") setStatus("sent", "whatsapp");
  }

  function sendEmail() {
    const pdfHref = `${poDocumentLink(po)}?autoprint=1`;
    showEmailProviderChooser(po.supplierEmail, `הזמנת רכש ${po.poNumber} — AppElectric`, buildMessage(po), pdfHref);
    if (po.status === "draft") setStatus("sent", "email");
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(poDocumentLink(po));
      toast.show("הקישור למסמך ההזמנה הועתק");
    } catch {
      toast.show("העתקה נכשלה — נסו שוב");
    }
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
            {showSpinner ? <Spinner size={17} /> : <MessageCircle size={17} />}
            שליחה בוואטסאפ
          </Button>
          <Button onClick={sendEmail} variant="secondary" disabled={busy}>
            {showSpinner ? <Spinner size={17} /> : <Mail size={17} />}
            שליחה במייל
          </Button>
          <Button onClick={copyLink} variant="secondary" disabled={busy}>
            <Link2 size={17} />
            העתקת קישור למסמך
          </Button>
        </div>
        <p className="mt-3 text-xs text-charcoal-400">
          וואטסאפ ומייל פותחים הודעה מוכנה מראש עם קישור למסמך ההזמנה המעוצב — נותר רק ללחוץ שליחה. כפתור הקישור מעתיק את
          קישור המסמך עצמו, לשליחה בכל ערוץ אחר.
        </p>
      </div>

      <div className="rounded-[var(--radius-card)] border border-sand-300 bg-white p-5">
        <h2 className="mb-3 font-heading text-sm font-semibold text-charcoal-900">עדכון סטטוס</h2>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setStatus("confirmed")} variant="secondary" disabled={busy || po.status === "confirmed" || po.status === "shipped"}>
            {showSpinner ? <Spinner size={17} /> : <CheckCircle2 size={17} />}
            סמן כאושרה ע&quot;י הספק
          </Button>
          <Button onClick={() => setStatus("shipped")} variant="secondary" disabled={busy || po.status === "shipped"}>
            {showSpinner ? <Spinner size={17} /> : <PackageCheck size={17} />}
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

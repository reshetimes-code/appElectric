"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useDelayedPending } from "@/lib/hooks/useDelayedPending";
import { useLoadedRefresh } from "@/lib/hooks/useLoadedRefresh";
import { showError, showSuccess } from "@/lib/alert";
import { toWhatsappNumber } from "@/lib/utils";
import { useGlobalLoading } from "@/lib/context/GlobalLoadingContext";

export function SupplierForm() {
  const refresh = useLoadedRefresh();
  const { withLoading } = useGlobalLoading();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [saving, setSaving] = useState(false);
  const showSpinner = useDelayedPending(saving, 500);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !/^\S+@\S+\.\S+$/.test(email) || !/^\d{9,15}$/.test(whatsapp.replace(/[\s-+]/g, ""))) {
      showError("יש למלא שם, מייל תקין ומספר וואטסאפ תקין (למשל 0501234567)");
      return;
    }
    setSaving(true);
    const res = await withLoading(() =>
      fetch("/api/admin/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, whatsapp: toWhatsappNumber(whatsapp) }),
      }),
    );
    setSaving(false);
    if (res.ok) {
      setName("");
      setEmail("");
      setWhatsapp("");
      showSuccess("הספק נוסף בהצלחה");
      refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      showError(data.error || "שמירה נכשלה");
    }
  }

  return (
    <form onSubmit={submit} className="flex h-fit flex-col gap-3 rounded-[var(--radius-card)] border border-sand-300 bg-white p-5">
      <h2 className="font-heading text-base font-semibold text-charcoal-900">הוספת ספק</h2>
      <div>
        <label className="mb-1 block text-sm text-charcoal-600">שם הספק</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm" />
      </div>
      <div>
        <label className="mb-1 block text-sm text-charcoal-600">מייל</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} dir="ltr" className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm" />
      </div>
      <div>
        <label className="mb-1 block text-sm text-charcoal-600">וואטסאפ (מספר ישראלי רגיל)</label>
        <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} dir="ltr" placeholder="0501234567" className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm" />
      </div>
      <Button type="submit" disabled={saving}>
        {showSpinner ? <Spinner size={16} /> : <UserPlus size={16} />}
        {saving ? "שומר..." : "הוספת ספק"}
      </Button>
    </form>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function SupplierForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim() || !/^\S+@\S+\.\S+$/.test(email) || !/^\d{9,15}$/.test(whatsapp.replace(/[\s-+]/g, ""))) {
      setError("יש למלא שם, מייל תקין ומספר וואטסאפ תקין (עם קידומת מדינה, ללא +)");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/admin/suppliers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, whatsapp: whatsapp.replace(/[\s-+]/g, "") }),
    });
    setSaving(false);
    if (res.ok) {
      setName("");
      setEmail("");
      setWhatsapp("");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "שמירה נכשלה");
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
        <label className="mb-1 block text-sm text-charcoal-600">וואטסאפ (קידומת מדינה, ללא +)</label>
        <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} dir="ltr" placeholder="972501234567" className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm" />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" disabled={saving}>
        <UserPlus size={16} />
        {saving ? "שומר..." : "הוספת ספק"}
      </Button>
    </form>
  );
}

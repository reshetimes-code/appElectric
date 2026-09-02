"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Supplier } from "@/lib/types";

export function PurchaseOrderForm({
  suppliers,
  initialProductName = "",
  initialDeliveryAddress = "",
  initialNotes = "",
}: {
  suppliers: Supplier[];
  initialProductName?: string;
  initialDeliveryAddress?: string;
  initialNotes?: string;
}) {
  const router = useRouter();
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id ?? "");
  const [productName, setProductName] = useState(initialProductName);
  const [costPrice, setCostPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [deliveryAddress, setDeliveryAddress] = useState(initialDeliveryAddress);
  const [notes, setNotes] = useState(initialNotes);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const supplier = suppliers.find((s) => s.id === supplierId);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!supplier || !productName.trim() || !deliveryAddress.trim()) {
      setError("יש למלא ספק, שם מוצר וכתובת להספקה");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/admin/purchase-orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        supplierId: supplier.id,
        supplierName: supplier.name,
        supplierEmail: supplier.email,
        supplierWhatsapp: supplier.whatsapp,
        productName,
        costPrice: Number(costPrice),
        quantity: Number(quantity) || 1,
        deliveryAddress,
        notes: notes || undefined,
      }),
    });
    setSaving(false);
    if (res.ok) {
      const data = await res.json();
      router.push(`/admin/purchase-orders/${data.purchaseOrder.id}`);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "יצירת ההזמנה נכשלה");
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4 rounded-[var(--radius-card)] border border-sand-300 bg-white p-6">
      <div>
        <label className="mb-1 block text-sm text-charcoal-600">ספק *</label>
        <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)} className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm">
          {suppliers.map((s) => (
            <option key={s.id} value={s.id}>{s.name} — {s.email}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm text-charcoal-600">שם המוצר *</label>
          <input value={productName} onChange={(e) => setProductName(e.target.value)} className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm text-charcoal-600">מחיר עלות (₪) *</label>
          <input type="number" value={costPrice} onChange={(e) => setCostPrice(Number(e.target.value))} className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm text-charcoal-600">כמות</label>
          <input type="number" min={1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm" />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm text-charcoal-600">כתובת להספקה *</label>
          <input value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm" />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm text-charcoal-600">הערות (אופציונלי)</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full rounded-[var(--radius-control)] border border-sand-300 p-3 text-sm" />
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" size="lg" disabled={saving} className="self-start">
        <Send size={17} />
        {saving ? "יוצר..." : "יצירת הזמנת רכש"}
      </Button>
    </form>
  );
}

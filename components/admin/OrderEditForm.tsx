"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useDelayedPending } from "@/lib/hooks/useDelayedPending";
import { showError } from "@/lib/alert";
import { genId, formatPrice } from "@/lib/utils";
import { useGlobalLoading } from "@/lib/context/GlobalLoadingContext";
import type { CustomerOrder, CartLine, Product } from "@/lib/types";

export function OrderEditForm({ order, products }: { order: CustomerOrder; products: Product[] }) {
  const router = useRouter();
  const { withLoading } = useGlobalLoading();
  const [name, setName] = useState(order.customer.name);
  const [phone, setPhone] = useState(order.customer.phone);
  const [email, setEmail] = useState(order.customer.email ?? "");
  const [address, setAddress] = useState(order.customer.address);
  const [city, setCity] = useState(order.customer.city);
  const [deliveryOption, setDeliveryOption] = useState(order.deliveryOption);
  const [notes, setNotes] = useState(order.notes ?? "");
  const [lines, setLines] = useState<CartLine[]>(order.lines);
  const [newProductId, setNewProductId] = useState(products[0]?.id ?? "");
  const [newQuantity, setNewQuantity] = useState("1");
  const [saving, setSaving] = useState(false);
  const showSpinner = useDelayedPending(saving, 500);

  const productMap = new Map(products.map((p) => [p.id, p]));

  function addLine() {
    if (!newProductId) return;
    const quantity = Math.max(1, Number(newQuantity) || 1);
    setLines((prev) => [...prev, { id: genId("line"), productId: newProductId, quantity, services: [] }]);
    setNewQuantity("1");
  }

  function removeLine(id: string) {
    setLines((prev) => prev.filter((l) => l.id !== id));
  }

  function updateQuantity(id: string, quantity: number) {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, quantity: Math.max(1, quantity) } : l)));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !phone || !address || !city) {
      showError("יש למלא את כל שדות החובה");
      return;
    }
    if (lines.length === 0) {
      showError("יש להשאיר לפחות פריט אחד בהזמנה");
      return;
    }
    setSaving(true);
    const payload = {
      customer: { name, phone, email: email || undefined, address, city },
      deliveryOption,
      notes: notes || undefined,
      lines,
    };
    const res = await withLoading(() =>
      fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
    );
    setSaving(false);
    if (res.ok) {
      router.push(`/admin/orders/${order.id}`);
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      showError(data.error || "שמירת ההזמנה נכשלה");
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <div className="rounded-[var(--radius-card)] border border-sand-300 bg-white p-5">
        <h2 className="mb-4 font-heading text-base font-semibold text-charcoal-900">פרטי הלקוח</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-xs text-charcoal-500">שם *</span>
            <input value={name} onChange={(e) => setName(e.target.value)} className="rounded-[var(--radius-control)] border border-sand-300 px-3 py-2 text-sm" />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-xs text-charcoal-500">טלפון *</span>
            <input dir="ltr" value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-[var(--radius-control)] border border-sand-300 px-3 py-2 text-end text-sm" />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-xs text-charcoal-500">מייל</span>
            <input dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-[var(--radius-control)] border border-sand-300 px-3 py-2 text-end text-sm" />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-xs text-charcoal-500">משלוח</span>
            <input value={deliveryOption} onChange={(e) => setDeliveryOption(e.target.value)} className="rounded-[var(--radius-control)] border border-sand-300 px-3 py-2 text-sm" />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-xs text-charcoal-500">כתובת *</span>
            <input value={address} onChange={(e) => setAddress(e.target.value)} className="rounded-[var(--radius-control)] border border-sand-300 px-3 py-2 text-sm" />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-xs text-charcoal-500">עיר *</span>
            <input value={city} onChange={(e) => setCity(e.target.value)} className="rounded-[var(--radius-control)] border border-sand-300 px-3 py-2 text-sm" />
          </label>
          <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
            <span className="text-xs text-charcoal-500">הערות</span>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="rounded-[var(--radius-control)] border border-sand-300 px-3 py-2 text-sm" />
          </label>
        </div>
      </div>

      <div className="rounded-[var(--radius-card)] border border-sand-300 bg-white p-5">
        <h2 className="mb-4 font-heading text-base font-semibold text-charcoal-900">פריטים בהזמנה</h2>
        <div className="flex flex-col divide-y divide-sand-200">
          {lines.map((line) => {
            const product = productMap.get(line.productId);
            const name = product?.nameHe ?? "מוצר לא ידוע";
            return (
              <div key={line.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-charcoal-900">{name}</p>
                  {product && <p className="text-xs text-charcoal-500">{formatPrice(product.price)} ליחידה</p>}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    value={line.quantity}
                    onChange={(e) => updateQuantity(line.id, Number(e.target.value))}
                    className="w-16 rounded-[var(--radius-control)] border border-sand-300 px-2 py-1.5 text-center text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeLine(line.id)}
                    aria-label="הסר פריט"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-sand-300 text-charcoal-500 hover:border-red-300 hover:text-red-600"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>
            );
          })}
          {lines.length === 0 && <p className="py-3 text-sm text-charcoal-500">אין פריטים בהזמנה</p>}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-sand-200 pt-4">
          <select
            value={newProductId}
            onChange={(e) => setNewProductId(e.target.value)}
            className="min-w-0 flex-1 rounded-[var(--radius-control)] border border-sand-300 px-3 py-2 text-sm"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nameHe}
              </option>
            ))}
          </select>
          <input
            type="number"
            min={1}
            value={newQuantity}
            onChange={(e) => setNewQuantity(e.target.value)}
            className="w-16 rounded-[var(--radius-control)] border border-sand-300 px-2 py-2 text-center text-sm"
          />
          <Button type="button" size="sm" variant="secondary" onClick={addLine}>
            <Plus size={15} />
            הוסף פריט
          </Button>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" size="lg" disabled={saving}>
          {showSpinner ? <Spinner size={17} /> : <Save size={17} />}
          {saving ? "שומר..." : "שמירת שינויים"}
        </Button>
        <Button href={`/admin/orders/${order.id}`} variant="secondary" size="lg">
          ביטול
        </Button>
      </div>
    </form>
  );
}

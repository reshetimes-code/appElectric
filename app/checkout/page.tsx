"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Info } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/lib/context/CartContext";
import { getProductsByIds } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils";
import { saveOrder } from "@/lib/orders";

interface FormState {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  delivery: "standard" | "scheduled";
  notes: string;
  terms: boolean;
}

const INITIAL: FormState = { name: "", phone: "", email: "", address: "", city: "", delivery: "standard", notes: "", terms: false };

export default function CheckoutPage() {
  const cart = useCart();
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const productMap = new Map(getProductsByIds(cart.lines.map((l) => l.productId)).map((p) => [p.id, p]));

  if (cart.hydrated && cart.lines.length === 0) {
    return (
      <Container className="flex flex-col items-center gap-3 py-24 text-center">
        <p className="font-heading text-lg font-semibold text-charcoal-800">אין פריטים בעגלה</p>
        <Button href="/shop" className="mt-2">מעבר לחנות</Button>
      </Container>
    );
  }

  function validate() {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = "נא להזין שם מלא";
    if (!/^0\d{8,9}$/.test(form.phone.replace(/[\s-]/g, ""))) next.phone = "מספר טלפון לא תקין";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) next.email = "כתובת אימייל לא תקינה";
    if (!form.address.trim()) next.address = "נא להזין כתובת";
    if (!form.city.trim()) next.city = "נא להזין עיר";
    if (!form.terms) next.terms = "יש לאשר את תנאי השימוש";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const order = saveOrder({
      lines: cart.lines,
      subtotal: cart.subtotal,
      deliveryOption: form.delivery === "standard" ? "משלוח סטנדרטי" : "משלוח מתואם",
      customer: { name: form.name, phone: form.phone, email: form.email || undefined, address: form.address, city: form.city },
      notes: form.notes || undefined,
    });
    cart.clear();
    router.push(`/order-confirmation?order=${order.orderNumber}`);
  }

  const field = (key: keyof FormState) => ({
    value: form[key] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  return (
    <Container className="flex flex-col gap-8 py-8 sm:py-10">
      <h1 className="font-heading text-2xl font-semibold text-charcoal-900 sm:text-3xl">קופה</h1>
      <p className="flex items-center gap-2 rounded-[var(--radius-control)] bg-amber-50 p-3 text-sm text-amber-700">
        <Info size={16} className="shrink-0" />
        זהו תהליך הדגמה — לא יבוצע חיוב אמיתי. חיבור לסליקה אמיתית ייעשה בשלב הבא של הפרויקט.
      </p>

      <form onSubmit={submit} className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-6">
          <section className="rounded-[var(--radius-card)] border border-sand-300 p-5">
            <h2 className="mb-4 font-heading text-lg font-semibold text-charcoal-900">פרטי קשר</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm text-charcoal-600">שם מלא</label>
                <input {...field("name")} className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm" />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>
              <div>
                <label className="mb-1 block text-sm text-charcoal-600">טלפון</label>
                <input {...field("phone")} dir="ltr" className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm" />
                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm text-charcoal-600">אימייל (אופציונלי)</label>
                <input {...field("email")} dir="ltr" className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm" />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>
            </div>
          </section>

          <section className="rounded-[var(--radius-card)] border border-sand-300 p-5">
            <h2 className="mb-4 font-heading text-lg font-semibold text-charcoal-900">כתובת למשלוח</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm text-charcoal-600">כתובת</label>
                <input {...field("address")} className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm" />
                {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
              </div>
              <div>
                <label className="mb-1 block text-sm text-charcoal-600">עיר</label>
                <input {...field("city")} className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm" />
                {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
              </div>
            </div>
          </section>

          <section className="rounded-[var(--radius-card)] border border-sand-300 p-5">
            <h2 className="mb-4 font-heading text-lg font-semibold text-charcoal-900">אפשרות משלוח</h2>
            <div className="flex flex-col gap-2">
              {(["standard", "scheduled"] as const).map((opt) => (
                <label key={opt} className="flex cursor-pointer items-center gap-3 rounded-[var(--radius-control)] border border-sand-300 p-3 text-sm has-[:checked]:border-brand-600 has-[:checked]:bg-brand-50">
                  <input type="radio" name="delivery" checked={form.delivery === opt} onChange={() => setForm((f) => ({ ...f, delivery: opt }))} />
                  {opt === "standard" ? "משלוח סטנדרטי (3–7 ימי עסקים)" : "משלוח מתואם — נחזור אליכם לתיאום מועד"}
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-[var(--radius-card)] border border-sand-300 p-5">
            <h2 className="mb-4 font-heading text-lg font-semibold text-charcoal-900">הערות להזמנה (אופציונלי)</h2>
            <textarea {...field("notes")} rows={3} className="w-full rounded-[var(--radius-control)] border border-sand-300 p-3 text-sm" />
          </section>

          <label className="flex items-start gap-2.5 text-sm text-charcoal-600">
            <input type="checkbox" checked={form.terms} onChange={(e) => setForm((f) => ({ ...f, terms: e.target.checked }))} className="mt-0.5 h-4 w-4 rounded border-sand-400 text-brand-600" />
            קראתי ואני מסכימ/ה ל<a href="/terms" className="text-brand-700 hover:underline">תקנון האתר</a> ול<a href="/privacy" className="text-brand-700 hover:underline">מדיניות הפרטיות</a>
          </label>
          {errors.terms && <p className="text-xs text-red-500">{errors.terms}</p>}
        </div>

        <aside className="h-fit flex flex-col gap-4 rounded-[var(--radius-card)] border border-sand-300 bg-sand-50 p-5">
          <h2 className="font-heading text-lg font-semibold text-charcoal-900">סיכום הזמנה</h2>
          <ul className="flex flex-col gap-2 text-sm text-charcoal-600">
            {cart.lines.map((line) => {
              const product = productMap.get(line.productId);
              if (!product) return null;
              return (
                <li key={line.id} className="flex justify-between">
                  <span>{product.nameHe} × {line.quantity}</span>
                  <span>{formatPrice(product.price * line.quantity)}</span>
                </li>
              );
            })}
          </ul>
          <div className="flex items-center justify-between border-t border-sand-300 pt-4">
            <span className="font-heading text-base font-semibold text-charcoal-900">סה&quot;כ לתשלום</span>
            <span className="font-heading text-xl font-bold text-charcoal-900">{formatPrice(cart.subtotal)}</span>
          </div>
          <Button type="submit" size="lg" fullWidth disabled={submitting}>
            <ShieldCheck size={17} />
            {submitting ? "מבצע הזמנה..." : "בצע הזמנה"}
          </Button>
        </aside>
      </form>
    </Container>
  );
}

"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { saveLead } from "@/lib/leads";

interface FormState {
  name: string;
  phone: string;
  category: string;
  brand: string;
  model: string;
  age: string;
  condition: string;
  desiredCategory: string;
  consent: boolean;
}

const CONDITIONS = ["חדש/כמעט חדש", "מצב טוב", "מצב סביר", "לא פועל"];

const INITIAL: FormState = {
  name: "",
  phone: "",
  category: "",
  brand: "",
  model: "",
  age: "",
  condition: CONDITIONS[1],
  desiredCategory: "",
  consent: false,
};

export function TradeInForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [sent, setSent] = useState(false);

  function validate() {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = "נא להזין שם מלא";
    if (!/^0\d{8,9}$/.test(form.phone.replace(/[\s-]/g, ""))) next.phone = "מספר טלפון לא תקין";
    if (!form.category.trim()) next.category = "נא לציין סוג מכשיר";
    if (!form.brand.trim()) next.brand = "נא לציין מותג";
    if (!form.consent) next.consent = "יש לאשר יצירת קשר";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    saveLead({
      source: "trade-in",
      name: form.name,
      phone: form.phone,
      tradeIn: {
        category: form.category,
        brand: form.brand,
        model: form.model,
        age: form.age,
        condition: form.condition,
        desiredCategory: form.desiredCategory,
      },
    });
    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-[var(--radius-card)] border border-brand-200 bg-brand-50 p-8 text-center">
        <CheckCircle2 size={32} className="text-brand-600" />
        <p className="font-heading text-lg font-semibold text-charcoal-900">בקשת הטרייד-אין נשלחה</p>
        <p className="text-sm text-charcoal-600">נבדוק את הפרטים ונחזור אליכם עם הצעה — ללא התחייבות בשלב זה.</p>
      </div>
    );
  }

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <form onSubmit={submit} className="flex flex-col gap-4 rounded-[var(--radius-card)] border border-sand-300 bg-white p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-charcoal-600">שם מלא</label>
          <input value={form.name} onChange={set("name")} className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm" />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm text-charcoal-600">טלפון</label>
          <input value={form.phone} onChange={set("phone")} dir="ltr" className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm" />
          {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm text-charcoal-600">סוג המכשיר הקיים</label>
          <input value={form.category} onChange={set("category")} placeholder="לדוגמה: מקרר 4 דלתות" className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm" />
          {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm text-charcoal-600">מותג</label>
          <input value={form.brand} onChange={set("brand")} className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm" />
          {errors.brand && <p className="mt-1 text-xs text-red-500">{errors.brand}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm text-charcoal-600">דגם (אם ידוע)</label>
          <input value={form.model} onChange={set("model")} className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm text-charcoal-600">גיל המכשיר</label>
          <input value={form.age} onChange={set("age")} placeholder="לדוגמה: 3 שנים" className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm text-charcoal-600">מצב המכשיר</label>
          <select value={form.condition} onChange={(e) => setForm((f) => ({ ...f, condition: e.target.value }))} className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm">
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm text-charcoal-600">מכשיר חדש מבוקש (אופציונלי)</label>
          <input value={form.desiredCategory} onChange={set("desiredCategory")} className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm" />
        </div>
      </div>

      <label className="flex items-start gap-2.5 text-sm text-charcoal-600">
        <input type="checkbox" checked={form.consent} onChange={(e) => setForm((f) => ({ ...f, consent: e.target.checked }))} className="mt-0.5 h-4 w-4 rounded border-sand-400 text-brand-600" />
        אני מבין/ה שמדובר בבקשה ראשונית בלבד וכי לא נקבע ערך טרייד-אין סופי בשלב זה.
      </label>
      {errors.consent && <p className="text-xs text-red-500">{errors.consent}</p>}

      <Button type="submit" size="lg" className="self-start">
        <Send size={16} />
        שליחת בקשת טרייד-אין
      </Button>
    </form>
  );
}

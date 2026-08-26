"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { saveLead } from "@/lib/leads";
import type { LeadSource } from "@/lib/types";

interface FormState {
  name: string;
  phone: string;
  email: string;
  productOrCategory: string;
  preferredContactTime: string;
  notes: string;
  consent: boolean;
}

const INITIAL: FormState = { name: "", phone: "", email: "", productOrCategory: "", preferredContactTime: "", notes: "", consent: false };

export function LeadForm({
  source,
  productOrCategoryLabel = "מוצר / קטגוריה בעניין",
  submitLabel = "שליחת פנייה",
  defaultProductOrCategory,
}: {
  source: LeadSource;
  productOrCategoryLabel?: string;
  submitLabel?: string;
  defaultProductOrCategory?: string;
}) {
  const [form, setForm] = useState<FormState>({ ...INITIAL, productOrCategory: defaultProductOrCategory ?? "" });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [sent, setSent] = useState(false);

  function validate() {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = "נא להזין שם מלא";
    if (!/^0\d{8,9}$/.test(form.phone.replace(/[\s-]/g, ""))) next.phone = "מספר טלפון לא תקין";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) next.email = "כתובת אימייל לא תקינה";
    if (!form.consent) next.consent = "יש לאשר יצירת קשר";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    saveLead({
      source,
      name: form.name,
      phone: form.phone,
      email: form.email || undefined,
      productOrCategory: form.productOrCategory || undefined,
      preferredContactTime: form.preferredContactTime || undefined,
      notes: form.notes || undefined,
    });
    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-[var(--radius-card)] border border-brand-200 bg-brand-50 p-8 text-center">
        <CheckCircle2 size={32} className="text-brand-600" />
        <p className="font-heading text-lg font-semibold text-charcoal-900">הפנייה נשלחה בהצלחה</p>
        <p className="text-sm text-charcoal-600">נציג מטעם צוות ה-VIP שלנו יחזור אליכם בהקדם.</p>
      </div>
    );
  }

  const field = (key: "name" | "phone" | "email" | "productOrCategory" | "preferredContactTime" | "notes") => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  return (
    <form onSubmit={submit} className="flex flex-col gap-4 rounded-[var(--radius-card)] border border-sand-300 bg-white p-6">
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
        <div>
          <label className="mb-1 block text-sm text-charcoal-600">אימייל (אופציונלי)</label>
          <input {...field("email")} dir="ltr" className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm" />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm text-charcoal-600">{productOrCategoryLabel}</label>
          <input {...field("productOrCategory")} className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm" />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm text-charcoal-600">שעה מועדפת ליצירת קשר (אופציונלי)</label>
          <input {...field("preferredContactTime")} className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm" />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm text-charcoal-600">הערות</label>
          <textarea {...field("notes")} rows={3} className="w-full rounded-[var(--radius-control)] border border-sand-300 p-3 text-sm" />
        </div>
      </div>

      <label className="flex items-start gap-2.5 text-sm text-charcoal-600">
        <input
          type="checkbox"
          checked={form.consent}
          onChange={(e) => setForm((f) => ({ ...f, consent: e.target.checked }))}
          className="mt-0.5 h-4 w-4 rounded border-sand-400 text-brand-600"
        />
        אני מאשר/ת ל-AppElectric ליצור עמי קשר בנוגע לפנייה זו.
      </label>
      {errors.consent && <p className="text-xs text-red-500">{errors.consent}</p>}

      <Button type="submit" size="lg" className="self-start">
        <Send size={16} />
        {submitLabel}
      </Button>
    </form>
  );
}

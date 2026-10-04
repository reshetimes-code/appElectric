"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { showError } from "@/lib/alert";
import { useGlobalLoading } from "@/lib/context/GlobalLoadingContext";

export function CatalogUploadForm() {
  const router = useRouter();
  const { withLoading } = useGlobalLoading();
  const fileRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [fileName, setFileName] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!title.trim()) return showError("יש להזין שורת טקסט שתופיע מעל ה-PDF");
    if (!file) return showError("יש לבחור קובץ PDF");
    if (file.size > 30 * 1024 * 1024) {
      return showError(`הקובץ גדול מדי (${(file.size / 1024 / 1024).toFixed(1)}MB, מקסימום 30MB). יש לכווץ את ה-PDF ולנסות שוב.`);
    }
    const body = new FormData();
    body.set("title", title);
    body.set("file", file);
    setSaving(true);
    const res = await withLoading(() => fetch("/api/admin/catalogs", { method: "POST", body }));
    setSaving(false);
    if (res.status === 413) {
      showError("הקובץ גדול מדי לשרת (מעל 30MB). יש לכווץ את ה-PDF ולנסות שוב.");
    } else if (res.ok) {
      setTitle("");
      if (fileRef.current) fileRef.current.value = "";
      setFileName("");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      showError(data.error || "ההעלאה נכשלה");
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-sand-300 bg-white p-5">
      <h2 className="font-heading text-base font-semibold text-charcoal-900">העלאת קטלוג</h2>
      <label className="flex flex-col gap-1 text-sm text-charcoal-600">
        שורת טקסט (תופיע מעל ה-PDF) *
        <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={300} className="h-11 rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm" />
      </label>
      <div className="flex flex-col gap-1 text-sm text-charcoal-600">
        קובץ PDF (עד 30MB) *
        <input
          ref={fileRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex h-11 items-center justify-center gap-2 rounded-[var(--radius-control)] border border-dashed border-brand-600 bg-brand-50 px-3 text-sm font-medium text-brand-800 hover:bg-brand-100"
        >
          <FileUp size={16} />
          {fileName || "לחצו כאן לבחירת קובץ PDF"}
        </button>
      </div>
      <Button type="submit" disabled={saving}>
        <Upload size={16} />
        {saving ? "מעלה..." : "העלאה"}
      </Button>
    </form>
  );
}

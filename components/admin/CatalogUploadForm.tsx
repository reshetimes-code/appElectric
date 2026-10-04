"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { showError } from "@/lib/alert";
import { CATALOG_CHUNK_BYTES, CATALOG_MAX_BYTES } from "@/lib/catalogLimits";

async function sendChunk(uploadId: string, index: number, slice: Blob) {
  let lastError = "ההעלאה נכשלה";
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(`/api/admin/catalogs/chunk?uploadId=${uploadId}&index=${index}`, { method: "POST", body: slice });
      if (res.ok) return;
      lastError = (await res.json().catch(() => ({}))).error || lastError;
      if (res.status < 500) break;
    } catch {
      lastError = "בעיית רשת בהעלאה";
    }
  }
  throw new Error(lastError);
}

export function CatalogUploadForm() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [fileName, setFileName] = useState("");
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState(0);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!title.trim()) return showError("יש להזין שורת טקסט שתופיע מעל ה-PDF");
    if (!file) return showError("יש לבחור קובץ PDF");
    if (file.size > CATALOG_MAX_BYTES) {
      return showError(`הקובץ גדול מדי (${(file.size / 1024 / 1024).toFixed(1)}MB, מקסימום 500MB). יש לכווץ את ה-PDF ולנסות שוב.`);
    }

    // Sent in small slices — a single request can't carry a big file through Cloud Run.
    const uploadId = crypto.randomUUID();
    const total = Math.ceil(file.size / CATALOG_CHUNK_BYTES);
    setSaving(true);
    try {
      for (let i = 0; i < total; i++) {
        setProgress(Math.round((i / total) * 100));
        const slice = file.slice(i * CATALOG_CHUNK_BYTES, (i + 1) * CATALOG_CHUNK_BYTES);
        await sendChunk(uploadId, i, slice);
      }
      setProgress(100);
      const res = await fetch("/api/admin/catalogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uploadId, chunks: total, title }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "ההעלאה נכשלה");
      setTitle("");
      if (fileRef.current) fileRef.current.value = "";
      setFileName("");
      router.refresh();
    } catch (err) {
      showError(err instanceof Error ? err.message : "ההעלאה נכשלה");
    } finally {
      setSaving(false);
      setProgress(0);
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
        קובץ PDF (עד 500MB) *
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
        {saving ? `מעלה... ${progress}%` : "העלאה"}
      </Button>
    </form>
  );
}

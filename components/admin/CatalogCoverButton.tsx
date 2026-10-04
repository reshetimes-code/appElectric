"use client";

import { useRef, useState } from "react";
import { ImagePlus } from "lucide-react";
import { useLoadedRefresh } from "@/lib/hooks/useLoadedRefresh";
import { showError } from "@/lib/alert";

/** Sets or replaces the cover image of an already-uploaded catalog. */
export function CatalogCoverButton({ id, hasCover }: { id: string; hasCover: boolean }) {
  const refresh = useLoadedRefresh();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function upload(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      const form = new FormData();
      form.set("file", file);
      const up = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = await up.json().catch(() => ({}));
      if (!up.ok) throw new Error(data.error || "העלאת התמונה נכשלה");
      const res = await fetch(`/api/admin/catalogs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverUrl: data.url }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "השמירה נכשלה");
      refresh();
    } catch (err) {
      showError(err instanceof Error ? err.message : "העלאת התמונה נכשלה");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => upload(e.target.files?.[0])} />
      <button
        type="button"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-1 text-sm text-charcoal-600 hover:underline disabled:opacity-50"
      >
        <ImagePlus size={14} />
        {busy ? "מעלה..." : hasCover ? "החלפת תמונה" : "הוספת תמונה"}
      </button>
    </>
  );
}

"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useLoadedRefresh } from "@/lib/hooks/useLoadedRefresh";
import { confirmDelete } from "@/lib/alert";
import { useGlobalLoading } from "@/lib/context/GlobalLoadingContext";

export function DeleteCatalogButton({ id }: { id: string }) {
  const refresh = useLoadedRefresh();
  const { withLoading } = useGlobalLoading();
  const [busy, setBusy] = useState(false);

  return (
    <button
      onClick={async () => {
        if (!(await confirmDelete("למחוק את הקטלוג הזה?"))) return;
        setBusy(true);
        await withLoading(() => fetch(`/api/admin/catalogs/${id}`, { method: "DELETE" }));
        setBusy(false);
        refresh();
      }}
      disabled={busy}
      aria-label="מחיקת קטלוג"
      className="rounded-full p-1.5 text-charcoal-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
    >
      <Trash2 size={15} />
    </button>
  );
}

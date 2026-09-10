"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import { useDelayedPending } from "@/lib/hooks/useDelayedPending";
import { confirmDelete } from "@/lib/alert";

export function DeleteSupplierButton({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const showSpinner = useDelayedPending(busy, 500);

  return (
    <button
      onClick={async () => {
        if (!(await confirmDelete("למחוק את הספק הזה?"))) return;
        setBusy(true);
        await fetch(`/api/admin/suppliers/${id}`, { method: "DELETE" });
        setBusy(false);
        router.refresh();
      }}
      disabled={busy}
      aria-label="מחיקת ספק"
      className="shrink-0 rounded-full p-1.5 text-charcoal-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
    >
      {showSpinner ? <Spinner size={15} /> : <Trash2 size={15} />}
    </button>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import { useDelayedPending } from "@/lib/hooks/useDelayedPending";
import { confirmDelete } from "@/lib/alert";

export function DeleteProductButton({ id, isSeed = false }: { id: string; isSeed?: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const showSpinner = useDelayedPending(busy, 500);

  return (
    <button
      onClick={async () => {
        const message = isSeed
          ? "להסיר את מוצר הדמו הזה מהקטלוג? (הוא יוסתר מהאתר, לא יימחק מהמערכת)"
          : "למחוק את המוצר הזה?";
        if (!(await confirmDelete(message))) return;
        setBusy(true);
        await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
        setBusy(false);
        router.refresh();
      }}
      disabled={busy}
      aria-label="מחיקת מוצר"
      className="rounded-full p-1.5 text-charcoal-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
    >
      {showSpinner ? <Spinner size={15} /> : <Trash2 size={15} />}
    </button>
  );
}

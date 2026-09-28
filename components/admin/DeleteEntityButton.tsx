"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import { useDelayedPending } from "@/lib/hooks/useDelayedPending";
import { useLoadedRefresh } from "@/lib/hooks/useLoadedRefresh";
import { confirmDelete } from "@/lib/alert";
import { useGlobalLoading } from "@/lib/context/GlobalLoadingContext";

/** Generic delete button for an admin list row backed by a plain DELETE endpoint. */
export function DeleteEntityButton({ endpoint, confirmMessage, label }: { endpoint: string; confirmMessage: string; label: string }) {
  const refresh = useLoadedRefresh();
  const { withLoading } = useGlobalLoading();
  const [busy, setBusy] = useState(false);
  const showSpinner = useDelayedPending(busy, 500);

  return (
    <button
      type="button"
      onClick={async (e) => {
        // Rows this sits in are often themselves a clickable Link — stop that
        // navigation from firing when the delete button itself is clicked.
        e.preventDefault();
        e.stopPropagation();
        if (!(await confirmDelete(confirmMessage))) return;
        setBusy(true);
        await withLoading(() => fetch(endpoint, { method: "DELETE" }));
        setBusy(false);
        refresh();
      }}
      disabled={busy}
      aria-label={label}
      className="relative z-10 shrink-0 rounded-full p-1.5 text-charcoal-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
    >
      {showSpinner ? <Spinner size={15} /> : <Trash2 size={15} />}
    </button>
  );
}

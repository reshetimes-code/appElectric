"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

/** Opens the browser's print dialog automatically when linked to with ?autoprint=1 — used by the "send by email" popup so downloading the PO as a PDF to attach is one click instead of two. */
export function AutoPrint() {
  const searchParams = useSearchParams();
  const autoprint = searchParams.get("autoprint") === "1";

  useEffect(() => {
    if (autoprint) window.print();
  }, [autoprint]);

  return null;
}

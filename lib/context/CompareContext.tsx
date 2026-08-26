"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";

const MAX_COMPARE = 3;

interface CompareContextValue {
  ids: string[];
  hydrated: boolean;
  toggle: (productId: string) => { ok: boolean; reason?: "full" };
  remove: (productId: string) => void;
  clear: () => void;
  isSelected: (productId: string) => boolean;
  isFull: boolean;
  max: number;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [ids, setIds, hydrated] = useLocalStorage<string[]>("appelectric:compare", []);

  const toggle: CompareContextValue["toggle"] = (productId) => {
    if (ids.includes(productId)) {
      setIds((prev) => prev.filter((id) => id !== productId));
      return { ok: true };
    }
    if (ids.length >= MAX_COMPARE) {
      return { ok: false, reason: "full" };
    }
    setIds((prev) => [...prev, productId]);
    return { ok: true };
  };

  const remove = (productId: string) => setIds((prev) => prev.filter((id) => id !== productId));
  const clear = () => setIds([]);
  const isSelected = (productId: string) => ids.includes(productId);

  return (
    <CompareContext.Provider
      value={{ ids, hydrated, toggle, remove, clear, isSelected, isFull: ids.length >= MAX_COMPARE, max: MAX_COMPARE }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}

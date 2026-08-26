"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";

interface FavoritesContextValue {
  ids: string[];
  hydrated: boolean;
  toggle: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds, hydrated] = useLocalStorage<string[]>("appelectric:favorites", []);

  const toggle = (productId: string) =>
    setIds((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]));

  const isFavorite = (productId: string) => ids.includes(productId);

  return (
    <FavoritesContext.Provider value={{ ids, hydrated, toggle, isFavorite }}>{children}</FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}

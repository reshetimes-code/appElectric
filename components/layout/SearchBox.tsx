"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { searchProducts } from "@/lib/repo/products";
import { ApplianceArt } from "@/components/product/ApplianceArt";
import { brands } from "@/lib/data/brands";
import { categories } from "@/lib/data/categories";
import { formatPrice } from "@/lib/utils";

export function SearchBox({ variant = "header" }: { variant?: "header" | "page" }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const results = query.trim().length >= 2 ? searchProducts(query, 6) : [];
  const brandMatches = query.trim().length >= 2 ? brands.filter((b) => b.nameHe.toLowerCase().includes(query.toLowerCase())).slice(0, 3) : [];
  const categoryMatches =
    query.trim().length >= 2 ? categories.filter((c) => c.nameHe.includes(query)).slice(0, 3) : [];

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function submit() {
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="flex h-11 items-center gap-2 rounded-full border border-sand-300 bg-sand-50 px-4 focus-within:border-brand-500">
        <Search size={17} className="shrink-0 text-charcoal-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="חיפוש מוצר, מותג או דגם..."
          aria-label="חיפוש מוצרים"
          className="h-full flex-1 bg-transparent text-sm outline-none placeholder:text-charcoal-400"
        />
        {query && (
          <button type="button" onClick={() => setQuery("")} aria-label="נקה חיפוש" className="text-charcoal-400 hover:text-charcoal-700">
            <X size={15} />
          </button>
        )}
      </div>

      {open && query.trim().length >= 2 && (
        <div className={`absolute z-40 mt-2 w-full min-w-[320px] rounded-2xl border border-sand-300 bg-white p-3 shadow-xl ${variant === "header" ? "start-0" : ""}`}>
          {results.length === 0 && categoryMatches.length === 0 && brandMatches.length === 0 ? (
            <p className="p-3 text-sm text-charcoal-500">לא נמצאו תוצאות עבור &quot;{query}&quot;</p>
          ) : (
            <div className="flex flex-col gap-3">
              {categoryMatches.length > 0 && (
                <div>
                  <p className="px-2 pb-1 text-xs font-semibold text-charcoal-400">קטגוריות</p>
                  {categoryMatches.map((c) => (
                    <Link key={c.id} href={`/category/${c.slug}`} onClick={() => setOpen(false)} className="block rounded-lg px-2 py-1.5 text-sm hover:bg-sand-100">
                      {c.nameHe}
                    </Link>
                  ))}
                </div>
              )}
              {brandMatches.length > 0 && (
                <div>
                  <p className="px-2 pb-1 text-xs font-semibold text-charcoal-400">מותגים</p>
                  {brandMatches.map((b) => (
                    <Link key={b.id} href={`/brand/${b.slug}`} onClick={() => setOpen(false)} className="block rounded-lg px-2 py-1.5 text-sm hover:bg-sand-100">
                      {b.nameHe}
                    </Link>
                  ))}
                </div>
              )}
              {results.length > 0 && (
                <div>
                  <p className="px-2 pb-1 text-xs font-semibold text-charcoal-400">מוצרים</p>
                  {results.map((p) => (
                    <Link key={p.id} href={`/product/${p.slug}`} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-sand-100">
                      <ApplianceArt kind={p.artKind} className="h-10 w-10 shrink-0 rounded-lg p-1" />
                      <span className="flex-1 text-sm text-charcoal-800">{p.nameHe}</span>
                      <span className="text-xs font-medium text-charcoal-500">{formatPrice(p.price)}</span>
                    </Link>
                  ))}
                </div>
              )}
              <button type="button" onClick={submit} className="rounded-lg bg-sand-100 px-2 py-2 text-center text-sm font-medium text-brand-700 hover:bg-sand-200">
                הצג את כל התוצאות עבור &quot;{query}&quot;
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

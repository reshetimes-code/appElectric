"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import type { ProductFilters } from "@/lib/repo/products";

/** Reads/writes catalog filters to the URL query string so they survive refresh & are shareable. */
export function useFilterParams() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const filters: ProductFilters = useMemo(() => {
    const get = (key: string) => searchParams.get(key) ?? undefined;
    const getList = (key: string) => searchParams.get(key)?.split(",").filter(Boolean);
    return {
      subcategory: get("subcategory"),
      brand: getList("brand"),
      priceMin: get("priceMin") ? Number(get("priceMin")) : undefined,
      priceMax: get("priceMax") ? Number(get("priceMax")) : undefined,
      availability: getList("availability"),
      energyRating: getList("energyRating"),
      premium: get("premium") === "1",
      personalImport: get("personalImport") === "1",
      deals: get("deals") === "1",
      widthMin: get("widthMin") ? Number(get("widthMin")) : undefined,
      widthMax: get("widthMax") ? Number(get("widthMax")) : undefined,
      q: get("q"),
      sort: (get("sort") as ProductFilters["sort"]) ?? "relevance",
    };
  }, [searchParams]);

  const activeCount = useMemo(() => {
    let n = 0;
    if (filters.subcategory) n++;
    if (filters.brand?.length) n += filters.brand.length;
    if (filters.priceMin != null || filters.priceMax != null) n++;
    if (filters.availability?.length) n += filters.availability.length;
    if (filters.energyRating?.length) n += filters.energyRating.length;
    if (filters.premium) n++;
    if (filters.personalImport) n++;
    if (filters.deals) n++;
    return n;
  }, [filters]);

  const setParam = useCallback(
    (key: string, value: string | string[] | boolean | number | undefined) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === undefined || value === false || value === "" || (Array.isArray(value) && value.length === 0)) {
        params.delete(key);
      } else if (Array.isArray(value)) {
        params.set(key, value.join(","));
      } else if (typeof value === "boolean") {
        params.set(key, "1");
      } else {
        params.set(key, String(value));
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const toggleListValue = useCallback(
    (key: string, value: string) => {
      const current = searchParams.get(key)?.split(",").filter(Boolean) ?? [];
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      setParam(key, next);
    },
    [searchParams, setParam],
  );

  const clearAll = useCallback(() => {
    const params = new URLSearchParams();
    const q = searchParams.get("q");
    if (q) params.set("q", q);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router, searchParams]);

  return { filters, activeCount, setParam, toggleListValue, clearAll };
}

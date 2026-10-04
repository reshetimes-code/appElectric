"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ApplianceArt, type ApplianceArtKind } from "@/components/product/ApplianceArt";

export interface SliderItem {
  id: string;
  slug: string;
  nameHe: string;
  model: string;
  image?: string;
  artKind: ApplianceArtKind;
}

export function BundleProductSlider({ items }: { items: SliderItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "next" | "prev") {
    const el = trackRef.current;
    if (!el) return;
    const rtl = getComputedStyle(el).direction === "rtl";
    // "next" = toward the end of the row, which is physical-left in RTL.
    const sign = (direction === "next" ? 1 : -1) * (rtl ? -1 : 1);
    el.scrollBy({ left: sign * el.clientWidth * 0.8, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-3 [scrollbar-width:thin]"
      >
        {items.map((it) => (
          <Link
            key={it.id}
            href={`/product/${it.slug}`}
            className="group w-64 shrink-0 snap-start overflow-hidden rounded-[var(--radius-card)] border border-sand-300 bg-white sm:w-72"
          >
            <div className="relative aspect-square bg-sand-100">
              {it.image ? (
                <Image src={it.image} alt={it.nameHe} fill sizes="288px" className="object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
              ) : (
                <ApplianceArt kind={it.artKind} className="h-full w-full" />
              )}
            </div>
            <div className="flex flex-col gap-1 p-4">
              <p className="line-clamp-2 min-h-10 text-sm font-medium text-charcoal-900">{it.nameHe}</p>
              {it.model && <p className="text-xs text-charcoal-500">דגם {it.model}</p>}
            </div>
          </Link>
        ))}
      </div>
      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => scroll("prev")}
            aria-label="הקודם"
            className="absolute start-2 top-1/3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-charcoal-800 shadow-md hover:bg-white"
          >
            <ChevronRight size={20} />
          </button>
          <button
            type="button"
            onClick={() => scroll("next")}
            aria-label="הבא"
            className="absolute end-2 top-1/3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-charcoal-800 shadow-md hover:bg-white"
          >
            <ChevronLeft size={20} />
          </button>
        </>
      )}
    </div>
  );
}

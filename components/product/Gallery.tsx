"use client";

import { useState } from "react";
import Image from "next/image";
import { ApplianceArt, type ApplianceArtKind } from "@/components/product/ApplianceArt";
import { ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

export function Gallery({
  artKind,
  images = [],
  name,
}: {
  artKind: ApplianceArtKind;
  images?: string[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const hasPhotos = images.length > 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="group relative overflow-hidden rounded-[var(--radius-card)] border border-sand-300 bg-white">
        {hasPhotos ? (
          <div className="relative aspect-square">
            <Image
              src={images[active]}
              alt={name}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        ) : (
          <ApplianceArt kind={artKind} className="aspect-square transition-transform duration-500 group-hover:scale-110" />
        )}
        <div className="absolute bottom-3 end-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs text-charcoal-500 opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
          <ZoomIn size={13} />
          רחפו להגדלה
        </div>
        <span className="sr-only">תמונת המחשה של {name}</span>
      </div>

      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`תמונה ${i + 1}`}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2",
                i === active ? "border-brand-600" : "border-sand-300",
              )}
            >
              <Image src={src} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

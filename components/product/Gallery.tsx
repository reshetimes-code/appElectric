"use client";

import { ApplianceArt, type ApplianceArtKind } from "@/components/product/ApplianceArt";
import { ZoomIn } from "lucide-react";

export function Gallery({ artKind, name }: { artKind: ApplianceArtKind; name: string }) {
  return (
    <div className="group relative overflow-hidden rounded-[var(--radius-card)] border border-sand-300 bg-white">
      <ApplianceArt kind={artKind} className="aspect-square transition-transform duration-500 group-hover:scale-110" />
      <div className="absolute bottom-3 end-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs text-charcoal-500 opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
        <ZoomIn size={13} />
        רחפו להגדלה
      </div>
      <span className="sr-only">תמונת המחשה של {name}</span>
    </div>
  );
}

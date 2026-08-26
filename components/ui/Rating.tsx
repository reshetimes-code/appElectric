import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Rating({ value, size = 14, className }: { value: number; size?: number; className?: string }) {
  return (
    <div className={cn("flex items-center gap-0.5", className)} aria-label={`דירוג ${value} מתוך 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={i <= Math.round(value) ? "fill-amber-400 text-amber-400" : "fill-sand-300 text-sand-300"}
        />
      ))}
    </div>
  );
}

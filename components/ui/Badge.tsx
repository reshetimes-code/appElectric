import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Tone = "success" | "warning" | "info" | "muted" | "brand" | "amber";

const TONE_CLASSES: Record<Tone, string> = {
  success: "bg-brand-50 text-brand-700 border border-brand-200",
  warning: "bg-amber-50 text-amber-600 border border-amber-100",
  info: "bg-charcoal-50 text-charcoal-600 border border-charcoal-200",
  muted: "bg-sand-200 text-charcoal-500 border border-sand-300",
  brand: "bg-brand-600 text-white",
  amber: "bg-amber-400 text-charcoal-900",
};

export function Badge({
  tone = "info",
  children,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium leading-none",
        TONE_CLASSES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

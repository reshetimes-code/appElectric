import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** Small inline spinner for use inside buttons/inline states. */
export function Spinner({ size = 16, className }: { size?: number; className?: string }) {
  return <Loader2 size={size} className={cn("animate-spin", className)} aria-hidden />;
}

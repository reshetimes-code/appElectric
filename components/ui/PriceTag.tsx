import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function PriceTag({
  price,
  compareAtPrice,
  installmentsMonths,
  size = "md",
  className,
}: {
  price: number;
  compareAtPrice?: number;
  installmentsMonths?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClass = size === "lg" ? "text-3xl" : size === "sm" ? "text-base" : "text-xl";
  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <div className="flex items-baseline gap-2">
        <span className={cn("font-heading font-semibold text-charcoal-900", sizeClass)}>{formatPrice(price)}</span>
        {compareAtPrice && compareAtPrice > price && (
          <span className="text-sm text-charcoal-400 line-through">{formatPrice(compareAtPrice)}</span>
        )}
      </div>
      {installmentsMonths && (
        <span className="text-xs text-charcoal-500">
          או {installmentsMonths} תשלומים של {formatPrice(Math.round(price / installmentsMonths))}
        </span>
      )}
    </div>
  );
}

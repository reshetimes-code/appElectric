import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronLeft } from "lucide-react";

export function Pagination({
  page,
  totalPages,
  buildHref,
}: {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="mt-8 flex items-center justify-center gap-1.5" aria-label="דפדוף עמודים">
      <Link
        href={buildHref(Math.max(1, page - 1))}
        aria-disabled={page === 1}
        className={cn("flex h-9 w-9 items-center justify-center rounded-full border border-sand-300", page === 1 && "pointer-events-none opacity-40")}
      >
        <ChevronRight size={16} />
      </Link>
      {pages.map((p) => (
        <Link
          key={p}
          href={buildHref(p)}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full text-sm",
            p === page ? "bg-charcoal-900 text-white" : "border border-sand-300 text-charcoal-700 hover:border-charcoal-400",
          )}
        >
          {p}
        </Link>
      ))}
      <Link
        href={buildHref(Math.min(totalPages, page + 1))}
        aria-disabled={page === totalPages}
        className={cn("flex h-9 w-9 items-center justify-center rounded-full border border-sand-300", page === totalPages && "pointer-events-none opacity-40")}
      >
        <ChevronLeft size={16} />
      </Link>
    </nav>
  );
}

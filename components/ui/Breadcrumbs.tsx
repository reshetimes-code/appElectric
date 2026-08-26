import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="פירורי לחם" className="flex flex-wrap items-center gap-1.5 text-xs text-charcoal-500">
      <Link href="/" className="hover:text-charcoal-800">
        בית
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronLeft size={12} />
          {item.href ? (
            <Link href={item.href} className="hover:text-charcoal-800">
              {item.label}
            </Link>
          ) : (
            <span className="text-charcoal-800">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

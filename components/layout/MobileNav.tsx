"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, X, MessageCircle } from "lucide-react";
import { categories } from "@/lib/data/categories";
import { cn } from "@/lib/utils";
import { SECONDARY_NAV_LINKS } from "@/lib/nav";

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] lg:hidden">
      <div className="absolute inset-0 bg-charcoal-950/50" onClick={onClose} />
      <div className="absolute inset-y-0 start-0 flex w-[86%] max-w-sm flex-col overflow-y-auto bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-sand-200 p-4">
          <span className="font-heading text-lg font-semibold text-charcoal-900">תפריט</span>
          <button onClick={onClose} aria-label="סגור תפריט" className="rounded-full p-2 hover:bg-sand-100">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4">
          <ul className="flex flex-col gap-1">
            {categories.map((cat) => (
              <li key={cat.id} className="border-b border-sand-100 last:border-none">
                <div className="flex items-center justify-between">
                  <Link href={`/category/${cat.slug}`} onClick={onClose} className="flex-1 py-3 text-[15px] font-medium text-charcoal-900">
                    {cat.nameHe}
                  </Link>
                  <button
                    onClick={() => setExpanded((prev) => (prev === cat.id ? null : cat.id))}
                    aria-expanded={expanded === cat.id}
                    aria-label={`הרחב ${cat.nameHe}`}
                    className="p-3 text-charcoal-500"
                  >
                    <ChevronDown size={18} className={cn("transition-transform", expanded === cat.id && "rotate-180")} />
                  </button>
                </div>
                {expanded === cat.id && (
                  <ul className="mb-3 grid grid-cols-2 gap-2 ps-1">
                    {cat.subcategories.map((sub) => (
                      <li key={sub.id}>
                        <Link
                          href={`/category/${cat.slug}?subcategory=${sub.slug}`}
                          onClick={onClose}
                          className="block rounded-lg bg-sand-100 px-3 py-2 text-sm text-charcoal-700"
                        >
                          {sub.nameHe}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          <ul className="mt-4 flex flex-col gap-1">
            {SECONDARY_NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} onClick={onClose} className="block py-3 text-[15px] font-medium text-charcoal-900">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <a
          href="https://wa.me/972500000000?text=%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%99%D7%99%D7%A2%D7%95%D7%A5%20VIP"
          target="_blank"
          rel="noopener noreferrer"
          className="m-4 flex items-center justify-center gap-2 rounded-full bg-brand-600 py-3 text-sm font-medium text-white"
        >
          <MessageCircle size={17} />
          ייעוץ VIP בוואטסאפ
        </a>
      </div>
    </div>
  );
}

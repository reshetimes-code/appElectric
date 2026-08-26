import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { ArrowLeft } from "lucide-react";

export function MegaMenu({ category, onNavigate }: { category: Category; onNavigate?: () => void }) {
  return (
    <div className="absolute inset-x-0 top-full z-30 border-t border-sand-300 bg-white shadow-xl">
      <Container className="grid grid-cols-1 gap-8 py-8 md:grid-cols-[1fr_360px]">
        <div>
          <p className="mb-4 text-xs font-semibold tracking-wide text-charcoal-400">{category.nameHe}</p>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3">
            {category.subcategories.map((sub) => (
              <Link
                key={sub.id}
                href={`/category/${category.slug}?subcategory=${sub.slug}`}
                onClick={onNavigate}
                className="text-sm text-charcoal-700 transition-colors hover:text-brand-700"
              >
                {sub.nameHe}
              </Link>
            ))}
          </div>
          <Link
            href={`/category/${category.slug}`}
            onClick={onNavigate}
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:text-brand-800"
          >
            כל המוצרים ב{category.nameHe}
            <ArrowLeft size={15} />
          </Link>
        </div>
        <Link href={`/category/${category.slug}`} onClick={onNavigate} className="group relative hidden overflow-hidden rounded-2xl md:block">
          <Image
            src={category.image}
            alt={category.nameHe}
            width={360}
            height={220}
            className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/70 via-charcoal-950/10 to-transparent" />
          <span className="absolute bottom-4 right-4 text-sm font-semibold text-white">גלו את קולקציית {category.nameHe}</span>
        </Link>
      </Container>
    </div>
  );
}

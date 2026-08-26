"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, Heart, Scale, ShoppingBag } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SearchBox } from "@/components/layout/SearchBox";
import { MegaMenu } from "@/components/layout/MegaMenu";
import { MobileNav } from "@/components/layout/MobileNav";
import { categories } from "@/lib/data/categories";
import { SECONDARY_NAV_LINKS } from "@/lib/nav";
import { useCart } from "@/lib/context/CartContext";
import { useFavorites } from "@/lib/context/FavoritesContext";
import { useCompare } from "@/lib/context/CompareContext";
import { cn } from "@/lib/utils";

function IconLink({ href, count, label, children }: { href: string; count: number; label: string; children: React.ReactNode }) {
  return (
    <Link href={href} aria-label={label} className="relative flex h-10 w-10 items-center justify-center rounded-full text-charcoal-700 hover:bg-sand-100">
      {children}
      {count > 0 && (
        <span className="absolute -top-1 -end-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-semibold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const cart = useCart();
  const favorites = useFavorites();
  const compare = useCompare();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeCategory = categories.find((c) => c.id === activeMenu);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-white backdrop-blur transition-shadow",
        scrolled ? "border-sand-300 shadow-sm" : "border-transparent",
      )}
      onMouseLeave={() => setActiveMenu(null)}
    >
      <Container className="relative flex h-20 items-center gap-3 sm:h-24 sm:gap-6">
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full text-charcoal-700 hover:bg-sand-100 lg:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="פתח תפריט"
        >
          <Menu size={22} />
        </button>

        <Link href="/" className="shrink-0 sm:hidden" aria-label="AppElectric — לעמוד הבית">
          <Image src="/logo.png" alt="AppElectric" width={150} height={34} className="h-7 w-auto" priority />
        </Link>
        <Link
          href="/"
          className="absolute left-1/2 top-1/2 z-20 hidden -translate-x-1/2 -translate-y-1/2 sm:block"
          aria-label="AppElectric — לעמוד הבית"
        >
          <Image src="/logo.png" alt="AppElectric" width={300} height={68} className="h-14 w-auto sm:h-16" priority />
        </Link>

        <div className="ms-auto flex items-center gap-1 sm:gap-1.5">
          <IconLink href="/compare" count={compare.ids.length} label="השוואת מוצרים">
            <Scale size={20} />
          </IconLink>
          <IconLink href="/favorites" count={favorites.ids.length} label="מועדפים">
            <Heart size={20} />
          </IconLink>
          <IconLink href="/cart" count={cart.count} label="עגלת קניות">
            <ShoppingBag size={20} />
          </IconLink>
        </div>
      </Container>

      <div className="border-y border-brand-100 bg-brand-50/70">
        <Container className="py-3">
          <div className="mx-auto max-w-xl">
            <SearchBox />
          </div>
        </Container>
      </div>

      <nav className="relative hidden border-t border-sand-200 lg:block">
        <Container className="flex h-12 items-center gap-7">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onMouseEnter={() => setActiveMenu(cat.id)}
              onFocus={() => setActiveMenu(cat.id)}
              className={cn(
                "text-sm font-medium transition-colors",
                activeMenu === cat.id ? "text-brand-700" : "text-charcoal-700 hover:text-brand-700",
              )}
            >
              <Link href={`/category/${cat.slug}`}>{cat.nameHe}</Link>
            </button>
          ))}
          <span className="mx-1 h-4 w-px bg-sand-300" />
          {SECONDARY_NAV_LINKS.slice(0, 5).map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-charcoal-600 hover:text-brand-700">
              {link.label}
            </Link>
          ))}
        </Container>
        {activeCategory && <MegaMenu category={activeCategory} onNavigate={() => setActiveMenu(null)} />}
      </nav>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}

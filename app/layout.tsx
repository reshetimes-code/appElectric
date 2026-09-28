import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import { ConditionalChrome } from "@/components/layout/ConditionalChrome";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { CartProvider } from "@/lib/context/CartContext";
import { FavoritesProvider } from "@/lib/context/FavoritesContext";
import { CompareProvider } from "@/lib/context/CompareContext";
import { CatalogProvider } from "@/lib/context/CatalogContext";
import { getAdminCategories } from "@/lib/server/adminCategories";
import { getAdminProducts } from "@/lib/server/adminProducts";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://appelectric.co.il"),
  title: {
    default: "AppElectric — מכשירי חשמל ומטבח פרימיום",
    template: "%s | AppElectric",
  },
  description:
    "AppElectric — חנות פרימיום למכשירי חשמל ומטבח יוקרתיים: קירור, בישול, כביסה, מדיחים ומולטימדיה. ייבוא אישי ושירות VIP אישי.",
  openGraph: {
    type: "website",
    locale: "he_IL",
    siteName: "AppElectric",
  },
};

// Every page's data ultimately comes from Firestore and can be edited by an
// admin at any time (see the force-dynamic notes on category/product pages),
// and the root layout below now reads it too (for the nav/department cards).
// Forcing the whole app dynamic here means nothing gets statically prerendered
// at build time — avoiding a build-time Firestore dependency for pages like
// /brand/[slug] that don't otherwise need one, and keeping every page's data
// as fresh as the ones that already opted into this individually.
export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Fetched server-side (and merged with the static seed catalog inside
  // CatalogProvider) so the header nav / department cards show admin-added
  // categories and products on first paint — see the comment in
  // CatalogContext.tsx for why this matters.
  const [initialCategories, initialProducts] = await Promise.all([getAdminCategories(), getAdminProducts()]);

  return (
    <html lang="he" dir="rtl" className={`${rubik.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-sand-100 font-sans antialiased">
        <ToastProvider>
          <CatalogProvider initialCategories={initialCategories} initialProducts={initialProducts}>
            <CartProvider>
              <FavoritesProvider>
                <CompareProvider>
                  <ConditionalChrome>{children}</ConditionalChrome>
                </CompareProvider>
              </FavoritesProvider>
            </CartProvider>
          </CatalogProvider>
        </ToastProvider>
      </body>
    </html>
  );
}

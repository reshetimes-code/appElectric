import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import { ConditionalChrome } from "@/components/layout/ConditionalChrome";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { CartProvider } from "@/lib/context/CartContext";
import { FavoritesProvider } from "@/lib/context/FavoritesContext";
import { CompareProvider } from "@/lib/context/CompareContext";
import { CatalogProvider } from "@/lib/context/CatalogContext";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://appelectric.example"),
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={`${rubik.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-sand-100 font-sans antialiased">
        <ToastProvider>
          <CatalogProvider>
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

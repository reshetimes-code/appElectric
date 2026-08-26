import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { BundleTeaser } from "@/components/home/BundleTeaser";

export const metadata: Metadata = {
  title: "מארזי מבצע",
  description: "שילובי מוצרים תואמים במחיר משתלם — מארזי מטבח, כביסה ובישול.",
};

export default function BundlesPage() {
  return (
    <div className="py-8 sm:py-10">
      <Container className="mb-2 flex flex-col gap-6">
        <Breadcrumbs items={[{ label: "מארזי מבצע" }]} />
        <div>
          <h1 className="font-heading text-2xl font-semibold text-charcoal-900 sm:text-3xl">מארזי מבצע</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-charcoal-500">
            שילובי מוצרים תואמים ממותג אחד, במחיר משתלם משמעותית מרכישה נפרדת. המלאי לכל מוצר במארז נבדק בנפרד בעת ההזמנה.
          </p>
        </div>
      </Container>
      <BundleTeaser />
    </div>
  );
}

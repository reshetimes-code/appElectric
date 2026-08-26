import { Hero } from "@/components/home/Hero";
import { BrandStrip } from "@/components/home/BrandStrip";
import { DepartmentCards } from "@/components/home/DepartmentCards";
import { ProductRail } from "@/components/home/ProductRail";
import { BundleTeaser } from "@/components/home/BundleTeaser";
import { WhyUs } from "@/components/home/WhyUs";
import { PersonalImportTeaser } from "@/components/home/PersonalImportTeaser";
import { LifestyleGrid } from "@/components/home/LifestyleGrid";
import { Testimonials } from "@/components/home/Testimonials";
import { VipCta } from "@/components/home/VipCta";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { getFeaturedProducts } from "@/lib/repo/products";
import { organizationJsonLd } from "@/lib/seo";

export default function Home() {
  const featured = getFeaturedProducts(8);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }} />
      <Hero />
      <BrandStrip />
      <DepartmentCards />
      <section className="bg-white py-16 sm:py-20">
        <Container className="flex flex-col gap-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="קולקציה נבחרת" title="קולקציית הפרימיום" description="מוצרים נבחרים בקפידה על ידי צוות ה-VIP שלנו." />
            <Button href="/shop?premium=1" variant="secondary">כל הקולקציה</Button>
          </div>
          <ProductRail products={featured} />
        </Container>
      </section>
      <BundleTeaser />
      <WhyUs />
      <PersonalImportTeaser />
      <LifestyleGrid />
      <Testimonials />
      <VipCta />
    </>
  );
}

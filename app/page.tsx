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
import { getSiteContent } from "@/lib/server/siteContent";
import { siteText } from "@/lib/siteContent";
import { organizationJsonLd, jsonLdScriptProps } from "@/lib/seo";

export default async function Home() {
  const featured = getFeaturedProducts(8);
  const c = await getSiteContent();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(organizationJsonLd())} />
      <Hero />
      <BrandStrip />
      <DepartmentCards
        eyebrow={siteText(c, "departments.eyebrow")}
        title={siteText(c, "departments.title")}
        description={siteText(c, "departments.description")}
      />
      <section className="bg-white py-16 sm:py-20">
        <Container className="flex flex-col gap-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow={siteText(c, "featured.eyebrow")} title={siteText(c, "featured.title")} description={siteText(c, "featured.description")} />
            <Button href="/bundles" variant="secondary">{siteText(c, "featured.cta")}</Button>
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

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { CatalogPage } from "@/components/catalog/CatalogPage";
import { getBrandBySlug, brands } from "@/lib/data/brands";
import { getProducts, parseFilters } from "@/lib/repo/products";
import { getAllProducts } from "@/lib/server/adminProducts";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { BrandLogo } from "@/components/brand/BrandLogo";

export function generateStaticParams() {
  return brands.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) return {};
  return { title: brand.nameHe, description: brand.description };
}

export default async function BrandDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) notFound();

  const sp = await searchParams;
  const filters = { ...parseFilters(sp), brand: [slug] };
  const products = getProducts(filters, getAllProducts());
  const page = sp.page ? Number(Array.isArray(sp.page) ? sp.page[0] : sp.page) : 1;

  const buildPageHref = (p: number) => (p > 1 ? `/brand/${slug}?page=${p}` : `/brand/${slug}`);

  return (
    <>
      <section className="relative overflow-hidden bg-charcoal-950">
        <Image src={brand.heroImage} alt={brand.nameHe} fill sizes="100vw" className="object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/60 to-transparent" />
        <Container className="relative flex min-h-[280px] flex-col justify-end gap-3 py-12 text-white">
          {brand.logo && (
            <div className="w-fit rounded-xl bg-white px-4 py-2.5">
              <BrandLogo brand={brand} />
            </div>
          )}
          {brand.premium && <Badge tone="brand">מותג פרימיום</Badge>}
          <h1 className="font-heading text-3xl font-bold sm:text-4xl">{brand.nameHe}</h1>
          <p className="max-w-xl leading-relaxed text-charcoal-200">{brand.description}</p>
          <p className="text-xs text-charcoal-400">מוצג לצורכי הדגמה בלבד — ללא הצהרת יבואן רשמי מאומתת.</p>
        </Container>
      </section>
      <CatalogPage
        title={`מוצרי ${brand.nameHe}`}
        breadcrumb={[{ label: "מותגים" }, { label: brand.nameHe }]}
        products={products}
        page={page}
        buildPageHref={buildPageHref}
      />
    </>
  );
}

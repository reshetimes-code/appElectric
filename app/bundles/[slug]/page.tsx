import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { BundleCover } from "@/components/product/BundleCover";
import { BundleProductSlider } from "@/components/product/BundleProductSlider";
import { getBundleBySlug, resolveBundleItems } from "@/lib/server/adminBundles";
import { getAllProducts } from "@/lib/server/adminProducts";
import { MessageCircle } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/siteConfig";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const bundle = await getBundleBySlug(decodeURIComponent(slug));
  if (!bundle) return {};
  return { title: bundle.nameHe, description: bundle.description };
}

export default async function BundleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [bundle, allProducts] = await Promise.all([getBundleBySlug(decodeURIComponent(slug)), getAllProducts()]);
  if (!bundle || !bundle.active) notFound();

  const productMap = new Map(allProducts.map((p) => [p.id, p]));
  const { items } = resolveBundleItems(bundle, productMap);
  const anyOutOfStock = items.some((it) => it.product.availabilityStatus === "out-of-stock");

  return (
    <div className="py-8 sm:py-10">
      <Container className="flex flex-col gap-8">
        <Breadcrumbs items={[{ label: "סטי פרימיום", href: "/bundles" }, { label: bundle.nameHe }]} />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <BundleCover
                    coverUrl={bundle.coverUrl}
                    productImages={items.flatMap((it) => (it.product.images[0] ? [it.product.images[0]] : []))}
            artKinds={items.map((it) => it.product.artKind)}
            nameHe={bundle.nameHe}
            itemCount={items.length}
            priority
            className="aspect-[16/10] overflow-hidden rounded-[var(--radius-card)]"
          />
          <div className="flex flex-col gap-4">
            <h1 className="font-heading text-2xl font-semibold text-charcoal-900 sm:text-3xl">{bundle.nameHe}</h1>
            {bundle.description && <p className="leading-relaxed text-charcoal-600">{bundle.description}</p>}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`שלום, אשמח לקבל מחיר עבור הסט "${bundle.nameHe}"`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-[var(--radius-control)] bg-brand-600 px-6 text-base font-semibold text-white hover:bg-brand-700"
            >
              <MessageCircle size={20} />
              לקבלת מחיר — צרו קשר בוואטסאפ
            </a>
            {anyOutOfStock && <p className="text-xs text-red-500">אחד המוצרים בסט אזל זמנית מהמלאי — צרו קשר לבדיקת זמינות.</p>}
            <p className="text-xs text-charcoal-400">זמינות כל מוצר בסט נבדקת בנפרד. הסט כולל את המוצרים המפורטים למטה בלבד.</p>
          </div>
        </div>

        <div>
          <h2 className="mb-4 font-heading text-xl font-semibold text-charcoal-900">כלול בסט</h2>
          <BundleProductSlider
            items={items.map((it) => ({
              id: it.product.id,
              slug: it.product.slug,
              nameHe: it.product.nameHe,
              model: it.product.model,
              image: it.product.images[0],
              artKind: it.product.artKind,
            }))}
          />
        </div>
      </Container>
    </div>
  );
}

import { getSiteContent } from "@/lib/server/siteContent";
import { getAllCategories } from "@/lib/server/adminCategories";
import { getAllBrands } from "@/lib/server/adminBrands";
import { SiteContentForm } from "@/components/admin/SiteContentForm";

export default async function AdminSiteContentPage() {
  const [content, categories, brands] = await Promise.all([getSiteContent(), getAllCategories(), getAllBrands()]);
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-charcoal-900">עיצוב האתר</h1>
        <p className="mt-1 text-sm text-charcoal-500">
          החלפת תמונות (Header, קטגוריות, מותגים ועוד) ועריכת טקסטים של דף הבית ועמוד אודות. השינויים מופיעים באתר מיד אחרי השמירה.
        </p>
      </div>
      <SiteContentForm
        content={content}
        categories={categories.map((c) => ({ id: c.id, name: c.nameHe, image: c.image }))}
        brands={brands.map((b) => ({ slug: b.slug, name: b.nameHe, image: b.heroImage }))}
      />
    </div>
  );
}

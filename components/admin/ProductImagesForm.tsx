"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useDelayedPending } from "@/lib/hooks/useDelayedPending";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { showError, showSuccess } from "@/lib/alert";
import { useGlobalLoading } from "@/lib/context/GlobalLoadingContext";

export function ProductImagesForm({ productId, initialImages }: { productId: string; initialImages: string[] }) {
  const router = useRouter();
  const { withLoading } = useGlobalLoading();
  const [images, setImages] = useState<string[]>(initialImages);
  const [saving, setSaving] = useState(false);
  const showSpinner = useDelayedPending(saving, 500);

  async function save() {
    setSaving(true);
    const res = await withLoading(() =>
      fetch(`/api/admin/products/${productId}/images`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images }),
      }),
    );
    setSaving(false);
    if (res.ok) {
      showSuccess("התמונות נשמרו בהצלחה");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      showError(data.error || "השמירה נכשלה");
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-[var(--radius-card)] border border-sand-300 bg-white p-6">
      <ImageUploader images={images} onChange={setImages} />
      <p className="text-xs text-charcoal-400">התמונה הראשונה תוצג ככרטיס המוצר הראשי בחנות.</p>
      <div className="flex gap-3">
        <Button onClick={save} size="lg" disabled={saving}>
          {showSpinner ? <Spinner size={17} /> : <Save size={17} />}
          {saving ? "שומר..." : "שמירת תמונות"}
        </Button>
        <Button href="/admin/products" variant="secondary" size="lg">
          חזרה לרשימת מוצרים
        </Button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "@/components/admin/ImageUploader";

export function ProductImagesForm({ productId, initialImages }: { productId: string; initialImages: string[] }) {
  const router = useRouter();
  const [images, setImages] = useState<string[]>(initialImages);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    setSaving(true);
    setError("");
    setSaved(false);
    const res = await fetch(`/api/admin/products/${productId}/images`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ images }),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "השמירה נכשלה");
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-[var(--radius-card)] border border-sand-300 bg-white p-6">
      <ImageUploader images={images} onChange={setImages} />
      <p className="text-xs text-charcoal-400">התמונה הראשונה תוצג ככרטיס המוצר הראשי בחנות.</p>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {saved && <p className="text-sm text-brand-700">נשמר בהצלחה.</p>}
      <div className="flex gap-3">
        <Button onClick={save} size="lg" disabled={saving}>
          <Save size={17} />
          {saving ? "שומר..." : "שמירת תמונות"}
        </Button>
        <Button href="/admin/products" variant="secondary" size="lg">
          חזרה לרשימת מוצרים
        </Button>
      </div>
    </div>
  );
}

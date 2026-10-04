"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, RotateCcw, Save, Loader2 } from "lucide-react";
import { ImageCropDialog } from "@/components/admin/ImageCropDialog";
import { Button } from "@/components/ui/Button";
import { showError, showSuccess } from "@/lib/alert";
import { useGlobalLoading } from "@/lib/context/GlobalLoadingContext";
import { IMAGE_SLOTS, TEXT_SLOTS, type SiteContentData } from "@/lib/siteContent";

interface CategoryInfo {
  id: string;
  name: string;
  image: string;
}
interface BrandInfo {
  slug: string;
  name: string;
  image: string;
}

interface ImageField {
  key: string;
  label: string;
  group: string;
  fallback: string;
  aspect: number;
}

const BRANDS_GROUP = "תמונות רקע של מותגים (עמוד מותג)";

function ImageCard({
  field,
  current,
  overridden,
  onChange,
  onReset,
}: {
  field: ImageField;
  current: string;
  overridden: boolean;
  onChange: (url: string) => void;
  onReset: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [cropping, setCropping] = useState<File | null>(null);

  async function upload(file: File) {
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "העלאה נכשלה");
      onChange(data.url);
    } catch (e) {
      showError(e instanceof Error ? e.message : "העלאה נכשלה", "העלאת תמונה נכשלה");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-2 rounded-[var(--radius-card)] border border-sand-300 bg-white p-3">
      {cropping && (
        <ImageCropDialog
          file={cropping}
          defaultAspect={field.aspect}
          onCancel={() => {
            setCropping(null);
            if (inputRef.current) inputRef.current.value = "";
          }}
          onDone={(cropped) => {
            setCropping(null);
            upload(cropped);
          }}
        />
      )}
      <div className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius-control)] bg-sand-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={current} alt={field.label} className="h-full w-full object-cover" />
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <Loader2 className="animate-spin text-brand-600" />
          </div>
        )}
      </div>
      <p className="text-sm font-medium text-charcoal-900">{field.label}</p>
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && setCropping(e.target.files[0])}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1.5 rounded-[var(--radius-control)] border border-sand-300 px-3 py-1.5 text-sm text-charcoal-700 hover:border-charcoal-400"
        >
          <ImagePlus size={15} />
          החלפת תמונה
        </button>
        {overridden && (
          <button type="button" onClick={onReset} className="inline-flex items-center gap-1.5 text-sm text-charcoal-500 hover:text-charcoal-900">
            <RotateCcw size={14} />
            איפוס למקורית
          </button>
        )}
      </div>
    </div>
  );
}

export function SiteContentForm({
  content,
  categories,
  brands,
}: {
  content: SiteContentData;
  categories: CategoryInfo[];
  brands: BrandInfo[];
}) {
  const router = useRouter();
  const { withLoading } = useGlobalLoading();
  // Staged edits: a null image = reset to default; an absent key = untouched.
  const [images, setImages] = useState<Record<string, string | null>>({});
  const [texts, setTexts] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const imageFields: ImageField[] = [
    ...IMAGE_SLOTS,
    ...categories.map((c) => ({ key: "category:" + c.id, label: c.name, group: "תמונות קטגוריות", fallback: c.image, aspect: 3 / 4 })),
    ...brands.map((b) => ({ key: "brand:" + b.slug, label: b.name, group: BRANDS_GROUP, fallback: b.image, aspect: 21 / 9 })),
  ];
  const imageGroups = [...new Set(imageFields.map((f) => f.group))];
  const textGroups = [...new Set(TEXT_SLOTS.map((s) => s.group))];

  const dirty = Object.keys(images).length > 0 || Object.keys(texts).length > 0;

  async function save() {
    const textPatch: Record<string, string | null> = {};
    for (const slot of TEXT_SLOTS) {
      const edited = texts[slot.key];
      if (edited === undefined) continue;
      // Empty or identical to the built-in text = drop the override.
      textPatch[slot.key] = edited.trim() === "" || edited === slot.fallback ? null : edited;
    }
    setSaving(true);
    try {
      const res = await withLoading(() =>
        fetch("/api/admin/site-content", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ images, texts: textPatch }),
        }),
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "השמירה נכשלה");
      setImages({});
      setTexts({});
      router.refresh();
      showSuccess("השינויים נשמרו ויופיעו באתר");
    } catch (e) {
      showError(e instanceof Error ? e.message : "השמירה נכשלה");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-6">
        <h2 className="font-heading text-xl font-semibold text-charcoal-900">תמונות</h2>
        {imageGroups.map((group) => {
          const fields = imageFields.filter((f) => f.group === group);
          const grid = (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {fields.map((f) => {
                const staged = images[f.key];
                const saved = content.images[f.key];
                const effective = staged === undefined ? saved : staged;
                return (
                  <ImageCard
                    key={f.key}
                    field={f}
                    current={effective || f.fallback}
                    overridden={Boolean(effective)}
                    onChange={(url) => setImages((s) => ({ ...s, [f.key]: url }))}
                    onReset={() => setImages((s) => ({ ...s, [f.key]: null }))}
                  />
                );
              })}
            </div>
          );
          return group === BRANDS_GROUP ? (
            <details key={group} className="rounded-[var(--radius-card)] border border-sand-300 bg-sand-50 p-4">
              <summary className="cursor-pointer text-base font-semibold text-charcoal-800">
                {group} ({fields.length})
              </summary>
              <div className="mt-4">{grid}</div>
            </details>
          ) : (
            <div key={group} className="flex flex-col gap-3">
              <h3 className="text-base font-semibold text-charcoal-800">{group}</h3>
              {grid}
            </div>
          );
        })}
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="font-heading text-xl font-semibold text-charcoal-900">טקסטים</h2>
        {textGroups.map((group) => (
          <div key={group} className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-sand-300 bg-white p-5">
            <h3 className="text-base font-semibold text-charcoal-800">{group}</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {TEXT_SLOTS.filter((s) => s.group === group).map((slot) => {
                const value = texts[slot.key] ?? content.texts[slot.key] ?? slot.fallback;
                const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                  setTexts((s) => ({ ...s, [slot.key]: e.target.value }));
                const base = "rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm";
                return (
                  <label key={slot.key} className={"flex flex-col gap-1 text-sm text-charcoal-600 " + (slot.multiline ? "md:col-span-2" : "")}>
                    {slot.label}
                    {slot.multiline ? (
                      <textarea value={value} onChange={onChange} maxLength={2000} rows={3} className={base + " py-2 leading-relaxed"} />
                    ) : (
                      <input value={value} onChange={onChange} maxLength={2000} className={base + " h-11"} />
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      <div className="sticky bottom-0 -mx-5 flex items-center justify-between gap-3 border-t border-sand-300 bg-white/95 px-5 py-3 backdrop-blur sm:-mx-8 sm:px-8">
        <p className="text-sm text-charcoal-500">{dirty ? "יש שינויים שלא נשמרו" : "אין שינויים"}</p>
        <Button onClick={save} disabled={!dirty || saving}>
          <Save size={16} />
          {saving ? "שומר..." : "שמירת שינויים"}
        </Button>
      </div>
    </div>
  );
}

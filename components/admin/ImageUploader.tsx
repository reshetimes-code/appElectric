"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ImageUploader({ images, onChange }: { images: string[]; onChange: (urls: string[]) => void }) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFiles(files: FileList | File[]) {
    setError("");
    setUploading(true);
    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "העלאה נכשלה");
        uploaded.push(data.url);
      } catch (e) {
        setError(e instanceof Error ? e.message : "העלאה נכשלה");
      }
    }
    setUploading(false);
    if (uploaded.length) onChange([...images, ...uploaded]);
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[var(--radius-card)] border-2 border-dashed p-8 text-center transition-colors",
          dragOver ? "border-brand-500 bg-brand-50" : "border-sand-300 hover:border-charcoal-400",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && uploadFiles(e.target.files)}
        />
        {uploading ? (
          <Loader2 size={24} className="animate-spin text-brand-600" />
        ) : (
          <Upload size={24} className="text-charcoal-400" />
        )}
        <p className="text-sm font-medium text-charcoal-700">גררו תמונות לכאן או לחצו לבחירה</p>
        <p className="text-xs text-charcoal-400">JPG, PNG, WEBP או GIF — עד 8MB לתמונה</p>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((url, i) => (
            <div key={url} className="group relative aspect-square overflow-hidden rounded-[var(--radius-control)] border border-sand-300">
              <Image src={url} alt={`תמונה ${i + 1}`} fill className="object-cover" />
              {i === 0 && (
                <span className="absolute bottom-1 start-1 rounded bg-charcoal-900/80 px-1.5 py-0.5 text-[10px] text-white">
                  ראשית
                </span>
              )}
              <button
                type="button"
                onClick={() => onChange(images.filter((u) => u !== url))}
                aria-label="הסר תמונה"
                className="absolute end-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-charcoal-700 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, X, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

const RATIOS = [
  { label: "ברירת מחדל", value: 0 },
  { label: "1:1", value: 1 },
  { label: "4:3", value: 4 / 3 },
  { label: "16:9", value: 16 / 9 },
  { label: "21:9", value: 21 / 9 },
  { label: "3:4", value: 3 / 4 },
];

const OUTPUT_LONG_SIDE = 2000;

/**
 * Drag-to-position + zoom cropper that runs entirely in the browser: the
 * admin picks a file, frames it inside a fixed-ratio window, and only the
 * cropped result (JPEG) is uploaded — no library, no server-side processing.
 */
export function ImageCropDialog({
  file,
  defaultAspect,
  onCancel,
  onDone,
}: {
  file: File;
  defaultAspect: number;
  onCancel: () => void;
  onDone: (cropped: File) => void;
}) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [aspect, setAspect] = useState(defaultAspect);
  const [zoom, setZoom] = useState(1);
  // (u, v): the point of the image (0..1) shown at the centre of the frame.
  const [center, setCenter] = useState({ u: 0.5, v: 0.5 });
  const [box, setBox] = useState({ w: 0, h: 0 });
  const drag = useRef<{ x: number; y: number } | null>(null);
  const observer = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    const el = new window.Image();
    el.onload = () => setImg(el);
    el.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const frameRef = useCallback((node: HTMLDivElement | null) => {
    observer.current?.disconnect();
    if (!node) return;
    observer.current = new ResizeObserver(() => setBox({ w: node.clientWidth, h: node.clientHeight }));
    observer.current.observe(node);
  }, []);

  const nw = img?.naturalWidth ?? 1;
  const nh = img?.naturalHeight ?? 1;
  const cover = box.w && box.h ? Math.max(box.w / nw, box.h / nh) : 1;
  const scale = cover * zoom;

  function clampCenter(u: number, v: number, s = scale) {
    const hu = box.w / 2 / (nw * s);
    const hv = box.h / 2 / (nh * s);
    return { u: Math.min(1 - hu, Math.max(hu, u)), v: Math.min(1 - hv, Math.max(hv, v)) };
  }

  function changeZoom(next: number) {
    setZoom(next);
    setCenter((c) => clampCenter(c.u, c.v, cover * next));
  }

  function changeAspect(next: number) {
    setAspect(next || defaultAspect);
    setZoom(1);
    setCenter({ u: 0.5, v: 0.5 });
  }

  function onPointerDown(e: React.PointerEvent) {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY };
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    drag.current = { x: e.clientX, y: e.clientY };
    setCenter((c) => clampCenter(c.u - dx / (nw * scale), c.v - dy / (nh * scale)));
  }

  function confirm() {
    if (!img || !box.w) return;
    const sw = box.w / scale;
    const sh = box.h / scale;
    const sx = center.u * nw - sw / 2;
    const sy = center.v * nh - sh / 2;
    const k = OUTPUT_LONG_SIDE / Math.max(sw, sh);
    // Never upscale beyond the source resolution.
    const ratio = Math.min(1, k);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(sw * ratio);
    canvas.height = Math.round(sh * ratio);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => {
        if (blob) onDone(new File([blob], "cropped.jpg", { type: "image/jpeg" }));
      },
      "image/jpeg",
      0.92,
    );
  }

  const left = box.w / 2 - center.u * nw * scale;
  const top = box.h / 2 - center.v * nh * scale;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal-950/70 p-4" role="dialog" aria-modal="true" aria-label="חיתוך תמונה">
      <div className="flex max-h-full w-full max-w-xl flex-col gap-4 overflow-y-auto rounded-[var(--radius-card)] bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-charcoal-900">חיתוך התמונה</h2>
          <button type="button" onClick={onCancel} aria-label="סגירה" className="text-charcoal-500 hover:text-charcoal-900">
            <X size={20} />
          </button>
        </div>
        <p className="text-sm text-charcoal-500">גררו את התמונה למיקום הרצוי והשתמשו בסליידר להתקרבות. מה שבתוך המסגרת הוא מה שיועלה.</p>

        <div className="flex flex-wrap gap-2">
          {RATIOS.map((r) => {
            const active = r.value === 0 ? aspect === defaultAspect : Math.abs(aspect - r.value) < 0.001;
            return (
              <button
                key={r.label}
                type="button"
                onClick={() => changeAspect(r.value)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  active ? "border-brand-600 bg-brand-50 text-brand-700" : "border-sand-300 text-charcoal-600 hover:border-charcoal-400",
                )}
              >
                {r.label}
              </button>
            );
          })}
        </div>

        <div
          ref={frameRef}
          dir="ltr"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={() => (drag.current = null)}
          onPointerCancel={() => (drag.current = null)}
          onWheel={(e) => changeZoom(Math.min(4, Math.max(1, zoom - e.deltaY / 500)))}
          style={{ aspectRatio: String(aspect), touchAction: "none" }}
          className="relative mx-auto max-h-[55vh] w-full cursor-grab select-none overflow-hidden rounded-[var(--radius-control)] bg-charcoal-900 active:cursor-grabbing"
        >
          {img && box.w > 0 && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={img.src}
              alt=""
              draggable={false}
              className="pointer-events-none absolute max-w-none"
              style={{ width: nw * scale, height: nh * scale, left, top }}
            />
          )}
        </div>

        <label className="flex items-center gap-3 text-sm text-charcoal-600">
          <ZoomIn size={18} className="shrink-0" />
          <input
            type="range"
            min={1}
            max={4}
            step={0.01}
            value={zoom}
            onChange={(e) => changeZoom(Number(e.target.value))}
            className="w-full accent-brand-600"
            aria-label="התקרבות"
          />
        </label>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="rounded-[var(--radius-control)] border border-sand-300 px-4 py-2 text-sm text-charcoal-700 hover:border-charcoal-400">
            ביטול
          </button>
          <button
            type="button"
            onClick={confirm}
            disabled={!img}
            className="inline-flex items-center gap-1.5 rounded-[var(--radius-control)] bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
          >
            <Check size={16} />
            חיתוך והעלאה
          </button>
        </div>
      </div>
    </div>
  );
}

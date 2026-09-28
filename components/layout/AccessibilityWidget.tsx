"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Accessibility, Plus, Minus, RotateCcw, Contrast, CircleDashed, Underline, PauseCircle, X, Check } from "lucide-react";

const STORAGE_KEY = "a11y-settings";
const FONT_STEPS = [100, 112, 124, 136];

interface A11ySettings {
  fontStep: number;
  contrast: boolean;
  grayscale: boolean;
  underlineLinks: boolean;
  pauseAnimations: boolean;
}

const DEFAULT_SETTINGS: A11ySettings = {
  fontStep: 0,
  contrast: false,
  grayscale: false,
  underlineLinks: false,
  pauseAnimations: false,
};

function applySettings(settings: A11ySettings) {
  const html = document.documentElement;
  html.style.fontSize = settings.fontStep === 0 ? "" : `${FONT_STEPS[settings.fontStep]}%`;

  const filters: string[] = [];
  if (settings.contrast) filters.push("contrast(1.3) brightness(1.05)");
  if (settings.grayscale) filters.push("grayscale(1)");
  html.style.filter = filters.join(" ");

  html.classList.toggle("a11y-underline-links", settings.underlineLinks);
  html.classList.toggle("a11y-pause-animations", settings.pauseAnimations);
}

// Reads any saved preferences before first paint. Guarded for SSR (no
// `window`) — safe because `open` (not `settings`) controls whether the
// panel's markup exists at all, so this can't cause a hydration mismatch.
function loadInitialSettings(): A11ySettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    // localStorage unavailable (private browsing, etc.) — widget still works, just doesn't persist.
  }
  return DEFAULT_SETTINGS;
}

export function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<A11ySettings>(loadInitialSettings);

  useEffect(() => {
    applySettings(settings);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  function update(patch: Partial<A11ySettings>) {
    setSettings((s) => ({ ...s, ...patch }));
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="a11y-panel"
        aria-label="תפריט נגישות"
        className="fixed bottom-24 end-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-charcoal-900 text-white shadow-lg transition-transform hover:scale-105 sm:bottom-6 sm:end-6"
      >
        <Accessibility size={26} />
      </button>

      {open && (
        <div
          id="a11y-panel"
          role="dialog"
          aria-label="הגדרות נגישות"
          className="fixed bottom-40 end-5 z-40 w-72 max-w-[calc(100vw-2.5rem)] rounded-[var(--radius-card)] border border-sand-300 bg-white p-4 shadow-xl sm:bottom-24 sm:end-6"
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-heading text-sm font-semibold text-charcoal-900">נגישות</h2>
            <button type="button" onClick={() => setOpen(false)} aria-label="סגור תפריט נגישות" className="rounded-full p-1 text-charcoal-400 hover:bg-sand-100 hover:text-charcoal-800">
              <X size={18} />
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-[var(--radius-control)] border border-sand-300 p-2 text-sm text-charcoal-700">
              <span>גודל טקסט</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => update({ fontStep: Math.max(0, settings.fontStep - 1) })}
                  disabled={settings.fontStep === 0}
                  aria-label="הקטן טקסט"
                  className="rounded-full p-1.5 hover:bg-sand-100 disabled:opacity-30"
                >
                  <Minus size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => update({ fontStep: Math.min(FONT_STEPS.length - 1, settings.fontStep + 1) })}
                  disabled={settings.fontStep === FONT_STEPS.length - 1}
                  aria-label="הגדל טקסט"
                  className="rounded-full p-1.5 hover:bg-sand-100 disabled:opacity-30"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <ToggleRow icon={<Contrast size={16} />} label="ניגודיות גבוהה" checked={settings.contrast} onToggle={() => update({ contrast: !settings.contrast })} />
            <ToggleRow icon={<CircleDashed size={16} />} label="גווני אפור" checked={settings.grayscale} onToggle={() => update({ grayscale: !settings.grayscale })} />
            <ToggleRow icon={<Underline size={16} />} label="הדגשת קישורים" checked={settings.underlineLinks} onToggle={() => update({ underlineLinks: !settings.underlineLinks })} />
            <ToggleRow icon={<PauseCircle size={16} />} label="עצירת אנימציות" checked={settings.pauseAnimations} onToggle={() => update({ pauseAnimations: !settings.pauseAnimations })} />
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-sand-200 pt-3 text-xs">
            <button type="button" onClick={() => setSettings(DEFAULT_SETTINGS)} className="flex items-center gap-1 text-charcoal-500 hover:text-charcoal-800">
              <RotateCcw size={14} />
              איפוס
            </button>
            <Link href="/accessibility" onClick={() => setOpen(false)} className="text-brand-700 hover:underline">
              הצהרת נגישות
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

function ToggleRow({ icon, label, checked, onToggle }: { icon: React.ReactNode; label: string; checked: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={checked}
      className={`flex w-full items-center justify-between rounded-[var(--radius-control)] border p-2 text-sm transition-colors ${
        checked ? "border-brand-600 bg-brand-50 text-brand-700" : "border-sand-300 text-charcoal-700 hover:border-charcoal-400"
      }`}
    >
      <span className="flex items-center gap-2">
        {icon}
        {label}
      </span>
      {checked && <Check size={16} />}
    </button>
  );
}

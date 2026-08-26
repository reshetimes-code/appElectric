import { Snowflake, Volume1, Zap, Wind, Wifi, Flame, CookingPot, Waves, Gauge, Hand } from "lucide-react";
import type { FeatureIcon } from "@/lib/types";

const FEATURE_MAP: Record<FeatureIcon, { label: string; icon: typeof Snowflake }> = {
  "no-frost": { label: "No Frost", icon: Snowflake },
  quiet: { label: "פעולה שקטה", icon: Volume1 },
  energy: { label: "חסכוני באנרגיה", icon: Zap },
  "heat-pump": { label: "משאבת חום", icon: Wind },
  wifi: { label: "Wi-Fi", icon: Wifi },
  pyrolytic: { label: "ניקוי פירוליטי", icon: Flame },
  induction: { label: "אינדוקציה", icon: CookingPot },
  steam: { label: "בישול באדים", icon: Waves },
  inverter: { label: "מנוע Inverter", icon: Gauge },
  touch: { label: "בקרת מגע", icon: Hand },
};

export function FeatureIcons({ featureIds }: { featureIds: FeatureIcon[] }) {
  if (featureIds.length === 0) return null;
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {featureIds.map((id) => {
        const feature = FEATURE_MAP[id];
        if (!feature) return null;
        const Icon = feature.icon;
        return (
          <div key={id} className="flex items-center gap-2.5 rounded-[var(--radius-control)] border border-sand-200 bg-sand-50 px-3 py-2.5">
            <Icon size={17} className="shrink-0 text-brand-600" />
            <span className="text-xs font-medium text-charcoal-700">{feature.label}</span>
          </div>
        );
      })}
    </div>
  );
}

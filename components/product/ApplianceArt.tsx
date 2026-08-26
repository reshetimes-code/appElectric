import { cn } from "@/lib/utils";

export type ApplianceArtKind =
  | "fridge"
  | "fridge-wide"
  | "freezer"
  | "wine"
  | "oven"
  | "cooktop"
  | "hood"
  | "microwave"
  | "drawer"
  | "washer"
  | "dryer"
  | "dishwasher"
  | "tv"
  | "soundbar";

const GRADIENTS: Record<string, string> = {
  fridge: "from-brand-100 to-sand-200",
  "fridge-wide": "from-brand-100 to-sand-200",
  freezer: "from-charcoal-100 to-sand-200",
  wine: "from-amber-50 to-sand-200",
  oven: "from-charcoal-100 to-sand-200",
  cooktop: "from-charcoal-100 to-sand-200",
  hood: "from-sand-200 to-sand-100",
  microwave: "from-sand-200 to-sand-100",
  drawer: "from-sand-200 to-sand-100",
  washer: "from-brand-100 to-sand-200",
  dryer: "from-amber-50 to-sand-200",
  dishwasher: "from-brand-100 to-sand-200",
  tv: "from-charcoal-100 to-sand-200",
  soundbar: "from-charcoal-100 to-sand-200",
};

function Glyph({ kind }: { kind: ApplianceArtKind }) {
  const stroke = "var(--color-charcoal-800)";
  const accent = "var(--color-brand-600)";
  switch (kind) {
    case "fridge":
      return (
        <svg viewBox="0 0 120 160" className="h-full w-full">
          <rect x="20" y="10" width="80" height="140" rx="10" fill="white" stroke={stroke} strokeWidth="3" />
          <line x1="20" y1="62" x2="100" y2="62" stroke={stroke} strokeWidth="3" />
          <rect x="30" y="24" width="6" height="24" rx="3" fill={accent} />
          <rect x="30" y="74" width="6" height="20" rx="3" fill={accent} />
        </svg>
      );
    case "fridge-wide":
      return (
        <svg viewBox="0 0 160 150" className="h-full w-full">
          <rect x="15" y="10" width="130" height="130" rx="10" fill="white" stroke={stroke} strokeWidth="3" />
          <line x1="80" y1="10" x2="80" y2="140" stroke={stroke} strokeWidth="3" />
          <rect x="65" y="30" width="6" height="30" rx="3" fill={accent} />
          <rect x="89" y="30" width="6" height="30" rx="3" fill={accent} />
        </svg>
      );
    case "freezer":
      return (
        <svg viewBox="0 0 130 130" className="h-full w-full">
          <rect x="15" y="20" width="100" height="90" rx="10" fill="white" stroke={stroke} strokeWidth="3" />
          <rect x="30" y="35" width="70" height="8" rx="4" fill={accent} opacity="0.5" />
          <rect x="30" y="50" width="70" height="8" rx="4" fill={accent} opacity="0.3" />
        </svg>
      );
    case "wine":
      return (
        <svg viewBox="0 0 110 160" className="h-full w-full">
          <rect x="20" y="10" width="70" height="140" rx="10" fill="white" stroke={stroke} strokeWidth="3" />
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <circle cx="38" cy={35 + i * 26} r="6" fill="none" stroke={accent} strokeWidth="2.5" />
              <circle cx="58" cy={35 + i * 26} r="6" fill="none" stroke={accent} strokeWidth="2.5" />
              <circle cx="78" cy={35 + i * 26} r="6" fill="none" stroke={accent} strokeWidth="2.5" />
            </g>
          ))}
        </svg>
      );
    case "oven":
      return (
        <svg viewBox="0 0 140 130" className="h-full w-full">
          <rect x="15" y="15" width="110" height="100" rx="8" fill="white" stroke={stroke} strokeWidth="3" />
          <rect x="15" y="15" width="110" height="18" rx="6" fill={stroke} opacity="0.85" />
          <rect x="32" y="48" width="76" height="55" rx="6" fill="none" stroke={accent} strokeWidth="3" />
        </svg>
      );
    case "cooktop":
      return (
        <svg viewBox="0 0 150 90" className="h-full w-full">
          <rect x="10" y="15" width="130" height="60" rx="8" fill="white" stroke={stroke} strokeWidth="3" />
          <circle cx="48" cy="45" r="16" fill="none" stroke={accent} strokeWidth="3" />
          <circle cx="102" cy="45" r="16" fill="none" stroke={accent} strokeWidth="3" />
        </svg>
      );
    case "hood":
      return (
        <svg viewBox="0 0 150 100" className="h-full w-full">
          <path d="M20 20 L130 20 L100 60 L50 60 Z" fill="white" stroke={stroke} strokeWidth="3" />
          <rect x="70" y="60" width="10" height="30" fill={stroke} />
        </svg>
      );
    case "microwave":
      return (
        <svg viewBox="0 0 150 100" className="h-full w-full">
          <rect x="10" y="15" width="130" height="70" rx="8" fill="white" stroke={stroke} strokeWidth="3" />
          <rect x="20" y="25" width="90" height="50" rx="4" fill="none" stroke={accent} strokeWidth="3" />
          <circle cx="128" cy="30" r="4" fill={accent} />
        </svg>
      );
    case "drawer":
      return (
        <svg viewBox="0 0 150 70" className="h-full w-full">
          <rect x="10" y="10" width="130" height="50" rx="8" fill="white" stroke={stroke} strokeWidth="3" />
          <rect x="55" y="30" width="40" height="6" rx="3" fill={accent} />
        </svg>
      );
    case "washer":
      return (
        <svg viewBox="0 0 120 130" className="h-full w-full">
          <rect x="15" y="10" width="90" height="110" rx="10" fill="white" stroke={stroke} strokeWidth="3" />
          <circle cx="60" cy="70" r="34" fill="none" stroke={accent} strokeWidth="3.5" />
          <circle cx="60" cy="70" r="22" fill="none" stroke={accent} strokeWidth="2" opacity="0.5" />
          <rect x="26" y="20" width="14" height="8" rx="3" fill={stroke} opacity="0.6" />
        </svg>
      );
    case "dryer":
      return (
        <svg viewBox="0 0 120 130" className="h-full w-full">
          <rect x="15" y="10" width="90" height="110" rx="10" fill="white" stroke={stroke} strokeWidth="3" />
          <circle cx="60" cy="70" r="34" fill="none" stroke={accent} strokeWidth="3.5" />
          <path d="M46 70 a14 14 0 1 1 28 0" fill="none" stroke={accent} strokeWidth="2" opacity="0.6" />
        </svg>
      );
    case "dishwasher":
      return (
        <svg viewBox="0 0 120 130" className="h-full w-full">
          <rect x="15" y="10" width="90" height="110" rx="10" fill="white" stroke={stroke} strokeWidth="3" />
          <rect x="30" y="30" width="60" height="6" rx="3" fill={accent} />
          <rect x="30" y="50" width="60" height="40" rx="4" fill="none" stroke={accent} strokeWidth="2.5" opacity="0.6" />
        </svg>
      );
    case "tv":
      return (
        <svg viewBox="0 0 160 110" className="h-full w-full">
          <rect x="10" y="10" width="140" height="80" rx="6" fill="white" stroke={stroke} strokeWidth="3" />
          <rect x="20" y="20" width="120" height="60" rx="2" fill={accent} opacity="0.12" />
          <line x1="80" y1="90" x2="80" y2="102" stroke={stroke} strokeWidth="3" />
          <line x1="55" y1="102" x2="105" y2="102" stroke={stroke} strokeWidth="3" />
        </svg>
      );
    case "soundbar":
      return (
        <svg viewBox="0 0 160 60" className="h-full w-full">
          <rect x="10" y="15" width="140" height="30" rx="14" fill="white" stroke={stroke} strokeWidth="3" />
          {[0, 1, 2, 3, 4].map((i) => (
            <circle key={i} cx={35 + i * 24} cy="30" r="5" fill="none" stroke={accent} strokeWidth="2" />
          ))}
        </svg>
      );
    default:
      return null;
  }
}

export function ApplianceArt({
  kind,
  className,
}: {
  kind: ApplianceArtKind;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-gradient-to-br p-8",
        GRADIENTS[kind] ?? "from-sand-200 to-sand-100",
        className,
      )}
    >
      <div className="h-full max-h-40 w-full max-w-40">
        <Glyph kind={kind} />
      </div>
    </div>
  );
}

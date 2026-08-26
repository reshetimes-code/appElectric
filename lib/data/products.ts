import type {
  AvailabilityStatus,
  Dimensions,
  EnergyRating,
  FeatureIcon,
  Product,
  Review,
} from "@/lib/types";
import type { ApplianceArtKind } from "@/components/product/ApplianceArt";

const FEATURE_LABELS: Record<FeatureIcon, string> = {
  "no-frost": "No Frost",
  quiet: "פעולה שקטה",
  energy: "חסכוני באנרגיה",
  "heat-pump": "משאבת חום",
  wifi: "Wi-Fi",
  pyrolytic: "ניקוי פירוליטי",
  induction: "אינדוקציה",
  steam: "אדים",
  inverter: "מנוע Inverter",
  touch: "בקרת מגע",
};

const DEMO_REVIEWS: Review[] = [
  {
    id: "r1",
    author: "מיכל א.",
    rating: 5,
    text: "שירות אישי מעולה מהייעוץ ועד ההתקנה. המוצר בדיוק כמו שתואר.",
    verifiedPurchase: true,
    createdAt: "2025-11-02",
  },
  {
    id: "r2",
    author: "אבי כ.",
    rating: 4,
    text: "איכות בנייה מורגשת, קצת יקר אבל שווה את זה למי שמחפש פרימיום.",
    verifiedPurchase: true,
    createdAt: "2025-09-14",
  },
];

interface ProductSeed {
  sku: string;
  model: string;
  nameHe: string;
  shortDescriptionHe: string;
  descriptionHe?: string;
  brandId: string;
  categoryId: string;
  subcategoryId: string;
  artKind: ApplianceArtKind;
  price: number;
  compareAtPrice?: number;
  dimensions: Dimensions;
  nicheDimensions?: Dimensions;
  capacityValue?: number;
  capacityUnit?: Product["capacityUnit"];
  energyRating?: EnergyRating;
  annualEnergyKwh?: number;
  noiseDb?: number;
  featureIds?: FeatureIcon[];
  availabilityStatus: AvailabilityStatus;
  stockQuantity?: number;
  premium?: boolean;
  featured?: boolean;
  extraSpecs?: { label: string; value: string }[];
}

function buildProduct(seed: ProductSeed): Product {
  const slug = seed.sku.toLowerCase();
  const specGroups: Product["specGroups"] = [];

  const dimItems = [];
  if (seed.dimensions.widthMm) dimItems.push({ label: "רוחב", value: `${seed.dimensions.widthMm} מ"מ` });
  if (seed.dimensions.heightMm) dimItems.push({ label: "גובה", value: `${seed.dimensions.heightMm} מ"מ` });
  if (seed.dimensions.depthMm) dimItems.push({ label: "עומק", value: `${seed.dimensions.depthMm} מ"מ` });
  if (dimItems.length) specGroups.push({ title: "מידות המוצר", items: dimItems });

  if (seed.nicheDimensions) {
    const nicheItems = [];
    if (seed.nicheDimensions.widthMm) nicheItems.push({ label: "רוחב נישה", value: `${seed.nicheDimensions.widthMm} מ"מ` });
    if (seed.nicheDimensions.heightMm) nicheItems.push({ label: "גובה נישה", value: `${seed.nicheDimensions.heightMm} מ"מ` });
    if (seed.nicheDimensions.depthMm) nicheItems.push({ label: "עומק נישה", value: `${seed.nicheDimensions.depthMm} מ"מ` });
    specGroups.push({ title: "מידות נישת התקנה נדרשות", items: nicheItems });
  }

  const capacityEnergyItems = [];
  if (seed.capacityValue) capacityEnergyItems.push({ label: "קיבולת", value: `${seed.capacityValue} ${seed.capacityUnit ?? ""}` });
  if (seed.energyRating) capacityEnergyItems.push({ label: "דירוג אנרגטי", value: seed.energyRating });
  if (seed.annualEnergyKwh) capacityEnergyItems.push({ label: 'צריכת אנרגיה שנתית', value: `${seed.annualEnergyKwh} קוט"ש` });
  if (seed.noiseDb) capacityEnergyItems.push({ label: "רמת רעש", value: `${seed.noiseDb} dB` });
  if (capacityEnergyItems.length) specGroups.push({ title: "קיבולת ואנרגיה", items: capacityEnergyItems });

  if (seed.extraSpecs?.length) specGroups.push({ title: "מפרט נוסף", items: seed.extraSpecs });

  const supplyText =
    seed.availabilityStatus === "personal-import"
      ? "המוצר מגיע בייבוא אישי. צוות ה-VIP שלנו יחזור אליכם עם מועד אספקה משוער."
      : seed.availabilityStatus === "limited"
        ? "כמות מוגבלת במלאי — מומלץ ליצור קשר לפני הגעה לסניף."
        : undefined;

  return {
    id: slug,
    slug,
    sku: seed.sku,
    model: seed.model,
    nameHe: seed.nameHe,
    shortDescriptionHe: seed.shortDescriptionHe,
    descriptionHe:
      seed.descriptionHe ??
      `${seed.nameHe} הינו מוצר פרימיום מסדרת ${seed.model}, המשלב חומרים איכותיים, ביצועים גבוהים ועיצוב מוקפד המתאים למטבחי יוקרה. ${seed.shortDescriptionHe}`,
    brandId: seed.brandId,
    categoryId: seed.categoryId,
    subcategoryId: seed.subcategoryId,
    departmentId: seed.categoryId,
    price: seed.price,
    compareAtPrice: seed.compareAtPrice,
    currency: "ILS",
    installmentsMonths: seed.price >= 4000 ? 12 : seed.price >= 1500 ? 6 : undefined,
    images: [],
    artKind: seed.artKind,
    dimensions: seed.dimensions,
    nicheDimensions: seed.nicheDimensions,
    capacityValue: seed.capacityValue,
    capacityUnit: seed.capacityUnit,
    energyRating: seed.energyRating,
    annualEnergyKwh: seed.annualEnergyKwh,
    noiseDb: seed.noiseDb,
    specGroups,
    featureIds: seed.featureIds ?? [],
    warrantyText: seed.premium ? "אחריות יצרן מלאה ל-3 שנים, כולל שירות בית." : "אחריות יצרן מלאה לשנתיים.",
    importerText: seed.availabilityStatus === "personal-import" ? "מוצר המסופק במסגרת שירות הייבוא האישי של AppElectric." : undefined,
    stockQuantity: seed.stockQuantity ?? (seed.availabilityStatus === "out-of-stock" ? 0 : 8),
    manageStock: true,
    availabilityStatus: seed.availabilityStatus,
    supplyText,
    premium: seed.premium ?? false,
    featured: seed.featured ?? false,
    active: true,
    seoTitle: `${seed.nameHe} | ${seed.model} | AppElectric`,
    seoDescription: seed.shortDescriptionHe,
    reviews: DEMO_REVIEWS,
    createdAt: "2025-06-01",
  };
}

const FEATURE = FEATURE_LABELS; // silence unused-export lint in case of future use
void FEATURE;

const seeds: ProductSeed[] = [
  // ---------- Cooling ----------
  {
    sku: "APE-FR4-MI01", model: "KFN 4395 AD", nameHe: "מקרר 4 דלתות Miele פרימיום", brandId: "miele",
    categoryId: "cooling", subcategoryId: "fridge-4door", artKind: "fridge-wide",
    shortDescriptionHe: "מקרר 4 דלתות נפח ענק עם טכנולוגיית No Frost ובקרת לחות דו-אזורית.",
    price: 24990, compareAtPrice: 27990,
    dimensions: { widthMm: 908, heightMm: 1848, depthMm: 700 },
    capacityValue: 605, capacityUnit: "L", energyRating: "A+++", annualEnergyKwh: 280, noiseDb: 38,
    featureIds: ["no-frost", "wifi", "quiet"], availabilityStatus: "immediate", premium: true, featured: true,
  },
  {
    sku: "APE-FR35-VZ01", model: "Excellence V6000", nameHe: "מקרר 3–5 דלתות V-ZUG", brandId: "vzug",
    categoryId: "cooling", subcategoryId: "fridge-3-5door", artKind: "fridge-wide",
    shortDescriptionHe: "עיצוב שוויצרי נקי עם תא יין משולב ובקרת טמפרטורה חכמה.",
    price: 32990, dimensions: { widthMm: 900, heightMm: 1935, depthMm: 730 },
    capacityValue: 540, capacityUnit: "L", energyRating: "A++", annualEnergyKwh: 310, noiseDb: 36,
    featureIds: ["no-frost", "wifi"], availabilityStatus: "personal-import", premium: true, featured: true,
  },
  {
    sku: "APE-SBS-SAM01", model: "RS68A884", nameHe: "מקרר Side-by-Side Samsung", brandId: "samsung",
    categoryId: "cooling", subcategoryId: "fridge-side-by-side", artKind: "fridge-wide",
    shortDescriptionHe: "מסך תצוגה חכם, מתקן קרח ומים ונפח אחסון גדול למשפחה.",
    price: 12990, compareAtPrice: 14490, dimensions: { widthMm: 912, heightMm: 1780, depthMm: 716 },
    capacityValue: 634, capacityUnit: "L", energyRating: "A+", annualEnergyKwh: 360, noiseDb: 40,
    featureIds: ["no-frost", "wifi"], availabilityStatus: "in-stock",
  },
  {
    sku: "APE-TF-ELX01", model: "LNT7ME46", nameHe: "מקרר מקפיא עליון Electrolux", brandId: "electrolux",
    categoryId: "cooling", subcategoryId: "fridge-top-freezer", artKind: "fridge",
    shortDescriptionHe: "פתרון קומפקטי וחסכוני לדירות ומטבחים קטנים.",
    price: 4290, dimensions: { widthMm: 595, heightMm: 1855, depthMm: 650 },
    capacityValue: 390, capacityUnit: "L", energyRating: "A+", annualEnergyKwh: 250, noiseDb: 39,
    featureIds: ["no-frost"], availabilityStatus: "in-stock",
  },
  {
    sku: "APE-BF-ELX02", model: "LNT5ME36", nameHe: "מקרר מקפיא תחתון Electrolux", brandId: "electrolux",
    categoryId: "cooling", subcategoryId: "fridge-bottom-freezer", artKind: "fridge",
    shortDescriptionHe: "מגירת הקפאה נגישה ומדפי זכוכית חזקים.",
    price: 5490, dimensions: { widthMm: 595, heightMm: 1860, depthMm: 650 },
    capacityValue: 344, capacityUnit: "L", energyRating: "A", annualEnergyKwh: 270, noiseDb: 41,
    featureIds: ["no-frost"], availabilityStatus: "limited", stockQuantity: 2,
  },
  {
    sku: "APE-INT-MI02", model: "K 7793 D", nameHe: "מקרר משולב יוקרה Miele", brandId: "miele",
    categoryId: "cooling", subcategoryId: "fridge-integrated", artKind: "fridge",
    shortDescriptionHe: "התקנה נסתרת מלאה לחזית מטבח אחידה ורציפה.",
    price: 18990, dimensions: { widthMm: 560, heightMm: 1772, depthMm: 549 },
    nicheDimensions: { widthMm: 600, heightMm: 1780, depthMm: 570 },
    capacityValue: 265, capacityUnit: "L", energyRating: "A+++", annualEnergyKwh: 190, noiseDb: 34,
    featureIds: ["no-frost", "quiet"], availabilityStatus: "personal-import", premium: true,
  },
  {
    sku: "APE-FRZ-ELX03", model: "LUT3NF28", nameHe: "מקפיא עומד Electrolux", brandId: "electrolux",
    categoryId: "cooling", subcategoryId: "freezers", artKind: "freezer",
    shortDescriptionHe: "נפח הקפאה גדול עם מגירות שקופות מסודרות.",
    price: 3290, dimensions: { widthMm: 595, heightMm: 1450, depthMm: 650 },
    capacityValue: 244, capacityUnit: "L", energyRating: "A+", annualEnergyKwh: 230, noiseDb: 40,
    featureIds: ["no-frost"], availabilityStatus: "in-stock",
  },
  {
    sku: "APE-WINE-VZ02", model: "Vinoteca V4000", nameHe: "מקרר יין V-ZUG", brandId: "vzug",
    categoryId: "cooling", subcategoryId: "wine-fridges", artKind: "wine",
    shortDescriptionHe: "שני אזורי טמפרטורה נפרדים לאדום ולבן, תאורת LED רכה.",
    price: 9990, dimensions: { widthMm: 595, heightMm: 820, depthMm: 570 },
    capacityValue: 46, capacityUnit: "L", energyRating: "A", noiseDb: 32,
    featureIds: ["quiet"], availabilityStatus: "immediate", premium: true,
  },
  {
    sku: "APE-DISP-SAM02", model: "Showcase SC300", nameHe: "מקרר תצוגה משרדי Samsung", brandId: "samsung",
    categoryId: "cooling", subcategoryId: "display-fridges", artKind: "fridge",
    shortDescriptionHe: "חזית זכוכית וגימור נירוסטה, מתאים למשרדים ואירוח.",
    price: 5990, dimensions: { widthMm: 500, heightMm: 1250, depthMm: 540 },
    capacityValue: 130, capacityUnit: "L", energyRating: "B", noiseDb: 42,
    availabilityStatus: "out-of-stock",
  },

  // ---------- Cooking ----------
  {
    sku: "APE-OVN-DD01", model: "DOP7350X", nameHe: "תנור בנוי De Dietrich", brandId: "de-dietrich",
    categoryId: "cooking", subcategoryId: "built-in-ovens", artKind: "oven",
    shortDescriptionHe: "ניקוי פירוליטי אוטומטי ו-10 תוכניות בישול מדויקות.",
    price: 7490, dimensions: { widthMm: 595, heightMm: 595, depthMm: 548 },
    nicheDimensions: { widthMm: 560, heightMm: 600, depthMm: 550 },
    energyRating: "A+", featureIds: ["pyrolytic", "touch"], availabilityStatus: "immediate", premium: true, featured: true,
  },
  {
    sku: "APE-COMBI-MI03", model: "DGC 7440 HC", nameHe: "תנור קומבי אדים Miele", brandId: "miele",
    categoryId: "cooking", subcategoryId: "combi-ovens", artKind: "oven",
    shortDescriptionHe: "שילוב אפייה ואדים לתוצאות שף מקצועיות בבית.",
    price: 15990, dimensions: { widthMm: 595, heightMm: 455, depthMm: 548 },
    featureIds: ["steam", "wifi", "touch"], availabilityStatus: "personal-import", premium: true, featured: true,
  },
  {
    sku: "APE-IND-BZ01", model: "Professional P90", nameHe: "כיריים אינדוקציה Bertazzoni", brandId: "bertazzoni",
    categoryId: "cooking", subcategoryId: "cooktops-induction", artKind: "cooktop",
    shortDescriptionHe: "4 אזורי בישול עם Booster ובקרת מגע מדויקת.",
    price: 6990, dimensions: { widthMm: 900, heightMm: 55, depthMm: 520 },
    featureIds: ["induction", "touch"], availabilityStatus: "in-stock",
  },
  {
    sku: "APE-GAS-BZ02", model: "Master Series 60", nameHe: "כיריים גז Bertazzoni", brandId: "bertazzoni",
    categoryId: "cooking", subcategoryId: "cooktops-gas", artKind: "cooktop",
    shortDescriptionHe: "מבער ווק עוצמתי וראשי פליז איטלקיים קלאסיים.",
    price: 4290, dimensions: { widthMm: 600, heightMm: 50, depthMm: 510 },
    availabilityStatus: "in-stock",
  },
  {
    sku: "APE-PITT-VZ03", model: "PITT Line P200", nameHe: "כיריים PITT Cooking V-ZUG", brandId: "vzug",
    categoryId: "cooking", subcategoryId: "cooktops-pitt", artKind: "cooktop",
    shortDescriptionHe: "משטח בישול פתוח ללא הפרדה ויזואלית, לחוויית שף פתוחה.",
    price: 13990, dimensions: { widthMm: 1200, heightMm: 60, depthMm: 520 },
    featureIds: ["induction"], availabilityStatus: "personal-import", premium: true,
  },
  {
    sku: "APE-HOOD-DD02", model: "DHD1266X", nameHe: "קולט אדים מעוצב De Dietrich", brandId: "de-dietrich",
    categoryId: "cooking", subcategoryId: "hoods", artKind: "hood",
    shortDescriptionHe: "עיצוב מעוקל בגימור נירוסטה עם תאורת LED משולבת.",
    price: 5290, dimensions: { widthMm: 900, heightMm: 130, depthMm: 480 },
    featureIds: ["quiet"], availabilityStatus: "immediate", premium: true,
  },
  {
    sku: "APE-MW-MI04", model: "M 7244 TC", nameHe: "מיקרוגל בנוי Miele", brandId: "miele",
    categoryId: "cooking", subcategoryId: "built-in-microwaves", artKind: "microwave",
    shortDescriptionHe: "תפעול קל עם ידית אחיזה מובנית וגימור זכוכית שחורה.",
    price: 5990, dimensions: { widthMm: 595, heightMm: 388, depthMm: 320 },
    featureIds: ["touch"], availabilityStatus: "limited", stockQuantity: 3,
  },
  {
    sku: "APE-DRW-DD03", model: "DWD1160X", nameHe: "מגירת חימום De Dietrich", brandId: "de-dietrich",
    categoryId: "cooking", subcategoryId: "warming-drawers", artKind: "drawer",
    shortDescriptionHe: "שומרת על חום מנות עד להגשה, פתיחה שקטה ורכה.",
    price: 3490, dimensions: { widthMm: 595, heightMm: 140, depthMm: 540 },
    availabilityStatus: "in-stock",
  },
  {
    sku: "APE-PIZZA-BZ03", model: "Forno Napoletano", nameHe: "תנור פיצה / טאבון פרימיום Bertazzoni", brandId: "bertazzoni",
    categoryId: "cooking", subcategoryId: "pizza-ovens", artKind: "oven",
    shortDescriptionHe: "אבן פיצה משולבת ומעל 400 מעלות לתוצאה נאפוליטנית אמיתית.",
    price: 8990, dimensions: { widthMm: 595, heightMm: 455, depthMm: 548 },
    availabilityStatus: "personal-import", premium: true,
  },

  // ---------- Laundry ----------
  {
    sku: "APE-WFR-MI05", model: "WWD 660", nameHe: "מכונת כביסה פתח קדמי Miele", brandId: "miele",
    categoryId: "laundry", subcategoryId: "washers-front", artKind: "washer",
    shortDescriptionHe: "טעינה של 9 ק\"ג עם מנוע Inverter שקט ועמיד.",
    price: 8990, dimensions: { widthMm: 596, heightMm: 850, depthMm: 641 },
    capacityValue: 9, capacityUnit: 'ק"ג', energyRating: "A+++", noiseDb: 47,
    featureIds: ["inverter", "quiet", "wifi"], availabilityStatus: "immediate", premium: true, featured: true,
  },
  {
    sku: "APE-WFR-ELX04", model: "PerfectCare 700", nameHe: "מכונת כביסה פתח קדמי Electrolux", brandId: "electrolux",
    categoryId: "laundry", subcategoryId: "washers-front", artKind: "washer",
    shortDescriptionHe: "חיישן משקל אוטומטי לחיסכון במים ובחשמל בכל כביסה.",
    price: 3990, dimensions: { widthMm: 600, heightMm: 850, depthMm: 630 },
    capacityValue: 8, capacityUnit: 'ק"ג', energyRating: "A++", noiseDb: 51,
    featureIds: ["inverter"], availabilityStatus: "in-stock",
  },
  {
    sku: "APE-WTP-SAM03", model: "WA90", nameHe: "מכונת כביסה פתח עליון Samsung", brandId: "samsung",
    categoryId: "laundry", subcategoryId: "washers-top", artKind: "washer",
    shortDescriptionHe: "טעינה נוחה מלמעלה, אידיאלי למרחבים צרים.",
    price: 3290, dimensions: { widthMm: 550, heightMm: 890, depthMm: 580 },
    capacityValue: 9, capacityUnit: 'ק"ג', energyRating: "A+", noiseDb: 53,
    availabilityStatus: "in-stock",
  },
  {
    sku: "APE-DRY-MI06", model: "TWB 660", nameHe: "מייבש משאבת חום Miele", brandId: "miele",
    categoryId: "laundry", subcategoryId: "dryers", artKind: "dryer",
    shortDescriptionHe: "טכנולוגיית משאבת חום חסכונית במיוחד, עדינה על הבדים.",
    price: 7490, dimensions: { widthMm: 596, heightMm: 850, depthMm: 636 },
    capacityValue: 9, capacityUnit: 'ק"ג', energyRating: "A+++", annualEnergyKwh: 180, noiseDb: 65,
    featureIds: ["heat-pump", "quiet"], availabilityStatus: "immediate", premium: true,
  },
  {
    sku: "APE-DRY-ELX05", model: "DE4100", nameHe: "מייבש קונדנסור Electrolux", brandId: "electrolux",
    categoryId: "laundry", subcategoryId: "dryers", artKind: "dryer",
    shortDescriptionHe: "פתרון יעיל ומהיר לייבוש כביסה יומיומי.",
    price: 3290, dimensions: { widthMm: 596, heightMm: 850, depthMm: 630 },
    capacityValue: 8, capacityUnit: 'ק"ג', energyRating: "B", annualEnergyKwh: 320, noiseDb: 66,
    availabilityStatus: "limited", stockQuantity: 4,
  },
  {
    sku: "APE-COMBO-SAM04", model: "WD90", nameHe: "מכונת כביסה-ייבוש משולבת Samsung", brandId: "samsung",
    categoryId: "laundry", subcategoryId: "washer-dryer-combo", artKind: "washer",
    shortDescriptionHe: "כביסה וייבוש במכשיר אחד, פתרון מושלם לחלל מוגבל.",
    price: 6490, dimensions: { widthMm: 600, heightMm: 850, depthMm: 610 },
    capacityValue: 9, capacityUnit: 'ק"ג', energyRating: "A", noiseDb: 58,
    featureIds: ["inverter", "wifi"], availabilityStatus: "personal-import",
  },
  {
    sku: "APE-WFR-VZ04", model: "Adora SLQ WP", nameHe: "מכונת כביסה פתח קדמי V-ZUG", brandId: "vzug",
    categoryId: "laundry", subcategoryId: "washers-front", artKind: "washer",
    shortDescriptionHe: "עיצוב שוויצרי מוקפד עם תוכנית טיפול עדין לבדים יקרים.",
    price: 11990, dimensions: { widthMm: 596, heightMm: 860, depthMm: 620 },
    capacityValue: 8, capacityUnit: 'ק"ג', energyRating: "A+++", noiseDb: 45,
    featureIds: ["inverter", "quiet"], availabilityStatus: "personal-import", premium: true,
  },
  {
    sku: "APE-DRY-VZ05", model: "Adora SLQ TP", nameHe: "מייבש משאבת חום V-ZUG", brandId: "vzug",
    categoryId: "laundry", subcategoryId: "dryers", artKind: "dryer",
    shortDescriptionHe: "משלים את סדרת ה-Adora בעיצוב אחיד ותפעול שקט.",
    price: 10990, dimensions: { widthMm: 596, heightMm: 860, depthMm: 620 },
    capacityValue: 8, capacityUnit: 'ק"ג', energyRating: "A++", noiseDb: 62,
    featureIds: ["heat-pump", "quiet"], availabilityStatus: "personal-import", premium: true,
  },

  // ---------- Dishwashers ----------
  {
    sku: "APE-DW-FULL-MI07", model: "G 7965 C", nameHe: "מדיח כלים משולב מלא Miele", brandId: "miele",
    categoryId: "dishwashers", subcategoryId: "dw-full", artKind: "dishwasher",
    shortDescriptionHe: "התקנה נסתרת לגמרי, מגש הגשה חכם ותוכנית AutoDos.",
    price: 8990, dimensions: { widthMm: 598, heightMm: 805, depthMm: 570 },
    nicheDimensions: { widthMm: 600, heightMm: 815, depthMm: 570 },
    energyRating: "A+++", noiseDb: 38, featureIds: ["quiet", "wifi"], availabilityStatus: "immediate", premium: true, featured: true,
  },
  {
    sku: "APE-DW-SEMI-DD04", model: "DVH1440J", nameHe: "מדיח כלים משולב חלקי De Dietrich", brandId: "de-dietrich",
    categoryId: "dishwashers", subcategoryId: "dw-semi", artKind: "dishwasher",
    shortDescriptionHe: "חזית נראית בגימור נירוסטה מוברשת עם בקרת מגע.",
    price: 6490, dimensions: { widthMm: 598, heightMm: 820, depthMm: 570 },
    energyRating: "A++", noiseDb: 42, availabilityStatus: "in-stock",
  },
  {
    sku: "APE-DW-60-ELX06", model: "ComfortLift 700", nameHe: 'מדיח כלים 60 ס"מ Electrolux', brandId: "electrolux",
    categoryId: "dishwashers", subcategoryId: "dw-60", artKind: "dishwasher",
    shortDescriptionHe: 'סל תחתון מתרומם המקל על הטענה ופריקה.',
    price: 3990, dimensions: { widthMm: 598, heightMm: 818, depthMm: 550 },
    energyRating: "A+", noiseDb: 44, availabilityStatus: "in-stock",
  },
  {
    sku: "APE-DW-45-BZ04", model: "Slim Line 45", nameHe: 'מדיח כלים 45 ס"מ Bertazzoni', brandId: "bertazzoni",
    categoryId: "dishwashers", subcategoryId: "dw-45", artKind: "dishwasher",
    shortDescriptionHe: 'פתרון קומפקטי ואיכותי למטבחים קטנים ודירות.',
    price: 4990, dimensions: { widthMm: 448, heightMm: 818, depthMm: 550 },
    energyRating: "A", noiseDb: 46, availabilityStatus: "limited", stockQuantity: 2,
  },
  {
    sku: "APE-DW-CT-SAM05", model: "Compact CT200", nameHe: "מדיח שולחני Samsung", brandId: "samsung",
    categoryId: "dishwashers", subcategoryId: "dw-countertop", artKind: "dishwasher",
    shortDescriptionHe: "פתרון ניידת נוח לדירות סטודיו ומטבחונים.",
    price: 1990, dimensions: { widthMm: 550, heightMm: 440, depthMm: 500 },
    energyRating: "B", noiseDb: 49, availabilityStatus: "out-of-stock",
  },
  {
    sku: "APE-DW-FULL-VZ06", model: "Adora 60i", nameHe: "מדיח כלים משולב מלא V-ZUG", brandId: "vzug",
    categoryId: "dishwashers", subcategoryId: "dw-full", artKind: "dishwasher",
    shortDescriptionHe: "טכנולוגיית ייבוש זאוליט חסכונית וללא ריחות שיוריים.",
    price: 10990, dimensions: { widthMm: 598, heightMm: 820, depthMm: 570 },
    nicheDimensions: { widthMm: 600, heightMm: 820, depthMm: 570 },
    energyRating: "A+++", noiseDb: 36, featureIds: ["quiet"], availabilityStatus: "personal-import", premium: true,
  },

  // ---------- Multimedia ----------
  {
    sku: "APE-TV75-SAM06", model: "Neo QLED QN90", nameHe: 'מסך ״75 Samsung QLED', brandId: "samsung",
    categoryId: "multimedia", subcategoryId: "tv-75plus", artKind: "tv",
    shortDescriptionHe: "בהירות גבוהה, Mini LED וחדות תמונה יוצאת דופן.",
    price: 13990, compareAtPrice: 15990, dimensions: { widthMm: 1672, heightMm: 958, depthMm: 60 },
    featureIds: ["wifi"], availabilityStatus: "immediate", featured: true,
  },
  {
    sku: "APE-TVOLED-SAM07", model: "S95D OLED", nameHe: 'מסך ״65 Samsung OLED', brandId: "samsung",
    categoryId: "multimedia", subcategoryId: "tv-oled", artKind: "tv",
    shortDescriptionHe: "שחור אמיתי וניגודיות אינסופית לחוויית קולנוע ביתי.",
    price: 10990, dimensions: { widthMm: 1449, heightMm: 830, depthMm: 45 },
    featureIds: ["wifi"], availabilityStatus: "in-stock", premium: true,
  },
  {
    sku: "APE-TVQLED-SAM08", model: "Q80D QLED", nameHe: 'מסך ״55 Samsung QLED', brandId: "samsung",
    categoryId: "multimedia", subcategoryId: "tv-qled", artKind: "tv",
    shortDescriptionHe: "צבעים עשירים וזוויות צפייה רחבות למשפחה כולה.",
    price: 5990, dimensions: { widthMm: 1229, heightMm: 706, depthMm: 55 },
    availabilityStatus: "in-stock",
  },
  {
    sku: "APE-SND-SAM09", model: "HW-Q990D", nameHe: "סאונדבאר Samsung 11.1.4", brandId: "samsung",
    categoryId: "multimedia", subcategoryId: "soundbars", artKind: "soundbar",
    shortDescriptionHe: "סאונד היקפי Dolby Atmos עם סאב-וופר אלחוטי.",
    price: 4290, dimensions: { widthMm: 1230, heightMm: 70, depthMm: 140 },
    featureIds: ["wifi"], availabilityStatus: "immediate",
  },
];

export const products: Product[] = seeds.map(buildProduct);

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProductsByIds(ids: string[]) {
  return ids.map((id) => products.find((p) => p.id === id)).filter((p): p is Product => Boolean(p));
}

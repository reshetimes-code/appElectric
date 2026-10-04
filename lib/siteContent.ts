import { PHOTOS } from "@/lib/images";

// Registry of every design image / design text the admin can override from
// /admin/site-content. Overrides are stored separately (lib/server/siteContent.ts)
// and layered over the `fallback` values below, so an empty store means the
// site looks exactly as it did before this feature existed.

export interface ImageSlot {
  key: string;
  label: string;
  group: string;
  fallback: string;
  /** Width / height of the frame the picture is shown in — default crop ratio in the admin cropper. */
  aspect: number;
}

export interface TextSlot {
  key: string;
  label: string;
  group: string;
  fallback: string;
  multiline?: boolean;
}

export interface SiteContentData {
  images: Record<string, string>;
  texts: Record<string, string>;
}

export const IMAGE_SLOTS: ImageSlot[] = [
  { key: "hero", label: "תמונת רקע ראשית (Header) בדף הבית", group: "דף הבית", fallback: PHOTOS.heroKitchen, aspect: 16 / 9 },
  { key: "lifestyle1", label: "גלריית השראה — תמונה גדולה", group: "דף הבית", fallback: PHOTOS.kitchenBright, aspect: 1 },
  { key: "lifestyle2", label: "גלריית השראה — תמונה 2", group: "דף הבית", fallback: PHOTOS.cookingTwoTone, aspect: 1 },
  { key: "lifestyle3", label: "גלריית השראה — תמונה 3", group: "דף הבית", fallback: PHOTOS.kitchenWood, aspect: 1 },
  { key: "lifestyle4", label: "גלריית השראה — תמונה 4", group: "דף הבית", fallback: PHOTOS.dishwasher, aspect: 1 },
  { key: "importTeaser", label: "בלוק ייבוא אישי בדף הבית", group: "דף הבית", fallback: PHOTOS.kitchenBright, aspect: 4 / 3 },
  { key: "importHero", label: "תמונת רקע בעמוד ייבוא אישי", group: "עמודים נוספים", fallback: PHOTOS.heroKitchen, aspect: 16 / 9 },
  { key: "about", label: "תמונה בעמוד אודות", group: "עמודים נוספים", fallback: PHOTOS.kitchenWood, aspect: 4 / 3 },
];

export const TEXT_SLOTS: TextSlot[] = [
  // Hero
  { key: "hero.eyebrow", label: "שורה קטנה מעל הכותרת", group: "דף הבית — פתיח (Header)", fallback: "AppElectric — מטבחי יוקרה" },
  { key: "hero.title", label: "כותרת ראשית", group: "דף הבית — פתיח (Header)", fallback: "מכשירי חשמל פרימיום, בסטנדרט של שואו-רום עיצוב", multiline: true },
  {
    key: "hero.subtitle",
    label: "טקסט משנה",
    group: "דף הבית — פתיח (Header)",
    fallback: "קירור, בישול, כביסה ומולטימדיה ממיטב המותגים העולמיים — עם ייעוץ אישי, ייבוא ייעודי והתקנה מקצועית מקצה לקצה.",
    multiline: true,
  },
  { key: "hero.cta1", label: "כפתור ראשון", group: "דף הבית — פתיח (Header)", fallback: "לקולקציית הפרימיום" },
  { key: "hero.cta2", label: "כפתור שני", group: "דף הבית — פתיח (Header)", fallback: "ייעוץ VIP אישי" },

  // Departments
  { key: "departments.eyebrow", label: "שורה קטנה", group: "דף הבית — מחלקות", fallback: "מחלקות" },
  { key: "departments.title", label: "כותרת", group: "דף הבית — מחלקות", fallback: "קניה לפי תחום" },
  { key: "departments.description", label: "תיאור", group: "דף הבית — מחלקות", fallback: "כל מחלקה אצרנית, עם מבחר ממותגי הפרימיום המובילים בעולם.", multiline: true },

  // Featured
  { key: "featured.eyebrow", label: "שורה קטנה", group: "דף הבית — קולקציה נבחרת", fallback: "קולקציה נבחרת" },
  { key: "featured.title", label: "כותרת", group: "דף הבית — קולקציה נבחרת", fallback: "קולקציית הפרימיום" },
  { key: "featured.description", label: "תיאור", group: "דף הבית — קולקציה נבחרת", fallback: "מוצרים נבחרים בקפידה על ידי צוות ה-VIP שלנו.", multiline: true },
  { key: "featured.cta", label: "טקסט הכפתור", group: "דף הבית — קולקציה נבחרת", fallback: "כל הקולקציה" },

  // Bundles
  { key: "bundles.eyebrow", label: "שורה קטנה", group: "דף הבית — סטי פרימיום", fallback: "סטי פרימיום" },
  { key: "bundles.title", label: "כותרת", group: "דף הבית — סטי פרימיום", fallback: "סטים משתלמים לחלל אחיד" },
  {
    key: "bundles.description",
    label: "תיאור",
    group: "דף הבית — סטי פרימיום",
    fallback: "שילובי מוצרים שאצרנו עבורכם, במחיר משתלם שנקבע במיוחד לכל סט.",
    multiline: true,
  },
  { key: "bundles.cta", label: "טקסט הכפתור", group: "דף הבית — סטי פרימיום", fallback: "כל הסטים" },

  // Why us
  { key: "whyUs.eyebrow", label: "שורה קטנה", group: "דף הבית — למה AppElectric", fallback: "למה AppElectric" },
  { key: "whyUs.title", label: "כותרת", group: "דף הבית — למה AppElectric", fallback: "חוויית קניה ברמת שואו-רום" },
  { key: "whyUs.1.title", label: "יתרון 1 — כותרת", group: "דף הבית — למה AppElectric", fallback: "איכות פרימיום" },
  { key: "whyUs.1.text", label: "יתרון 1 — טקסט", group: "דף הבית — למה AppElectric", fallback: "ייבוא אישי ומותגי יוקרה נבחרים, ללא פשרות על חומרים וגימור.", multiline: true },
  { key: "whyUs.2.title", label: "יתרון 2 — כותרת", group: "דף הבית — למה AppElectric", fallback: "חדשנות" },
  { key: "whyUs.2.text", label: "יתרון 2 — טקסט", group: "דף הבית — למה AppElectric", fallback: "טכנולוגיות מכשירים מתקדמות, מעודכנות לפי הדגמים האחרונים בעולם.", multiline: true },
  { key: "whyUs.3.title", label: "יתרון 3 — כותרת", group: "דף הבית — למה AppElectric", fallback: "שירות ראשון" },
  { key: "whyUs.3.text", label: "יתרון 3 — טקסט", group: "דף הבית — למה AppElectric", fallback: "ליווי אישי וייעוץ מקצועי לאורך כל התהליך — לא רק עד לתשלום.", multiline: true },
  { key: "whyUs.4.title", label: "יתרון 4 — כותרת", group: "דף הבית — למה AppElectric", fallback: "לוגיסטיקה מקצועית" },
  { key: "whyUs.4.text", label: "יתרון 4 — טקסט", group: "דף הבית — למה AppElectric", fallback: "משלוח, תיאום התקנה ואפשרות לפינוי מכשיר ישן.", multiline: true },

  // Personal import teaser
  { key: "importTeaser.eyebrow", label: "שורה קטנה", group: "דף הבית — ייבוא אישי", fallback: "ייבוא אישי" },
  { key: "importTeaser.title", label: "כותרת", group: "דף הבית — ייבוא אישי", fallback: "דגמים שלא תמצאו בשום מקום אחר בארץ" },
  {
    key: "importTeaser.description",
    label: "תיאור",
    group: "דף הבית — ייבוא אישי",
    fallback: "צוות ה-VIP שלנו מאתר, מזמין ומלווה עבורכם דגמי יוקרה ייחודיים — משלב הייעוץ ועד ההתקנה בבית.",
    multiline: true,
  },
  { key: "importTeaser.cta", label: "טקסט הכפתור", group: "דף הבית — ייבוא אישי", fallback: "לייעוץ ייבוא אישי" },

  // Lifestyle
  { key: "lifestyle.eyebrow", label: "שורה קטנה", group: "דף הבית — גלריית השראה", fallback: "השראה" },
  { key: "lifestyle.title", label: "כותרת", group: "דף הבית — גלריית השראה", fallback: "מכשירים שמתמזגים בעיצוב הבית" },
  {
    key: "lifestyle.description",
    label: "תיאור",
    group: "דף הבית — גלריית השראה",
    fallback: "מבחר פרויקטים שבהם המכשירים הם חלק בלתי נפרד מהעיצוב האדריכלי.",
    multiline: true,
  },

  // Testimonials
  { key: "testimonials.eyebrow", label: "שורה קטנה", group: "דף הבית — לקוחות מספרים", fallback: "לקוחות מספרים" },
  { key: "testimonials.title", label: "כותרת", group: "דף הבית — לקוחות מספרים", fallback: "חוויית שירות שמדברת בעד עצמה" },

  // VIP CTA
  { key: "vipCta.title", label: "כותרת", group: "דף הבית — פס ייעוץ VIP תחתון", fallback: "לא בטוחים מה מתאים לכם?" },
  {
    key: "vipCta.description",
    label: "תיאור",
    group: "דף הבית — פס ייעוץ VIP תחתון",
    fallback: "קבעו ייעוץ VIP אישי — ללא עלות וללא התחייבות. נעזור לכם לבחור את המכשירים הנכונים למטבח שלכם.",
    multiline: true,
  },
  { key: "vipCta.cta1", label: "כפתור ראשון (WhatsApp)", group: "דף הבית — פס ייעוץ VIP תחתון", fallback: "שיחת WhatsApp מיידית" },
  { key: "vipCta.cta2", label: "כפתור שני", group: "דף הבית — פס ייעוץ VIP תחתון", fallback: "השאירו פרטים" },

  // About
  { key: "about.eyebrow", label: "שורה קטנה", group: "עמוד אודות", fallback: "אודות AppElectric" },
  { key: "about.title", label: "כותרת", group: "עמוד אודות", fallback: "מטבח יוקרה מתחיל בבחירה הנכונה" },
  {
    key: "about.p1",
    label: "פסקה ראשונה",
    group: "עמוד אודות",
    fallback:
      "AppElectric הוקמה מתוך אמונה שקניית מכשירי חשמל למטבח צריכה להרגיש כמו ביקור בשואו-רום עיצוב — לא כמו חנות אלקטרוניקה רגילה. אנחנו עובדים עם מותגי היוקרה המובילים בעולם, מציעים שירות ייבוא אישי לדגמים ייחודיים, ומלווים כל לקוח באופן אישי מהייעוץ הראשוני ועד ההתקנה בבית.",
    multiline: true,
  },
  {
    key: "about.p2",
    label: "פסקה שנייה",
    group: "עמוד אודות",
    fallback:
      "הצוות שלנו מורכב מאנשי מקצוע המכירים לעומק את עולם המכשירים המשולבים, אילוצי התקנה במטבחים מעוצבים, ולוגיסטיקת ייבוא מורכבת — כדי שאתם תוכלו להתמקד בבחירה שמתאימה לכם.",
    multiline: true,
  },
];

const TEXT_FALLBACKS = new Map(TEXT_SLOTS.map((s) => [s.key, s.fallback]));
const IMAGE_FALLBACKS = new Map(IMAGE_SLOTS.map((s) => [s.key, s.fallback]));

export function isValidImageKey(key: string): boolean {
  return IMAGE_FALLBACKS.has(key) || /^(category|brand):[\w-]{1,200}$/.test(key);
}

export function isValidTextKey(key: string): boolean {
  return TEXT_FALLBACKS.has(key);
}

/** Override if the admin set one, otherwise the slot's built-in default (or `fallback` for dynamic keys). */
export function siteImage(data: SiteContentData, key: string, fallback?: string): string {
  return data.images[key] || IMAGE_FALLBACKS.get(key) || fallback || "";
}

export function siteText(data: SiteContentData, key: string): string {
  return data.texts[key] || TEXT_FALLBACKS.get(key) || "";
}

import type { VipServiceOption } from "@/lib/types";

export const vipServices: VipServiceOption[] = [
  { id: "install-cert", name: "התקנה על ידי טכנאי מוסמך", description: "התקנה מקצועית בבית על ידי טכנאי מוסמך מטעמנו.", price: 390 },
  { id: "old-removal", name: "פינוי מכשיר ישן", description: "פינוי אחראי של המכשיר הישן בעת האספקה.", price: 150 },
  { id: "premium-delivery", name: "משלוח פרימיום מתואם", description: "משלוח בחלון זמן מתואם מראש עם הודעה מראש.", price: 190 },
  { id: "install-coord", name: "תיאום התקנה מול קבלן/מטבחייה", description: "תיאום מועדים ומפרט התקנה מול בעל המקצוע שלכם.", price: 0 },
];

export function getVipServicesByIds(ids: string[]) {
  return ids.map((id) => vipServices.find((s) => s.id === id)).filter((s): s is VipServiceOption => Boolean(s));
}

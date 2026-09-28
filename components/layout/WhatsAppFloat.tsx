import { MessageCircle } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/siteConfig";

export function WhatsAppFloat() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("שלום, אשמח לייעוץ VIP")}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="ייעוץ VIP בוואטסאפ"
      className="fixed bottom-24 start-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 sm:bottom-6 sm:start-6"
    >
      <MessageCircle size={26} fill="white" className="text-[#25D366]" />
    </a>
  );
}

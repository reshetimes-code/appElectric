import { MessageCircle } from "lucide-react";

export function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/972500000000?text=%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%99%D7%99%D7%A2%D7%95%D7%A5%20VIP"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="ייעוץ VIP בוואטסאפ"
      className="fixed bottom-24 start-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 sm:bottom-6 sm:start-6"
    >
      <MessageCircle size={26} fill="white" className="text-[#25D366]" />
    </a>
  );
}

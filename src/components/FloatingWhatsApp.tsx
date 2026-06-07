import { MessageCircle } from "lucide-react";
import { WA_NUMBER } from "@/lib/parseOrder";

export function FloatingWhatsApp() {
  return (
    <a
      href={`https://wa.me/${WA_NUMBER}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat WhatsApp"
      className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}

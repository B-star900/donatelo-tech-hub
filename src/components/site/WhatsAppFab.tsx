import { motion } from "framer-motion";
import { WHATSAPP_NUMBER } from "@/lib/cart";

export function WhatsAppFab() {
  return (
    <motion.a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola DONATELO, quiero más info")}`}
      target="_blank"
      rel="noopener"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.6, type: "spring" }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Chatear por WhatsApp"
      className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full text-white shadow-brand"
      style={{ backgroundColor: "#25D366" }}
    >
      <span className="absolute inset-0 -z-10 animate-ping rounded-full opacity-30" style={{ backgroundColor: "#25D366" }} />
      <svg viewBox="0 0 32 32" className="h-7 w-7" fill="currentColor" aria-hidden>
        <path d="M16.003 3.2C9.04 3.2 3.4 8.84 3.4 15.8c0 2.49.74 4.81 2.01 6.77L3.2 28.8l6.4-2.13a12.55 12.55 0 0 0 6.4 1.73c6.96 0 12.6-5.64 12.6-12.6S22.96 3.2 16.003 3.2zm0 22.86c-1.97 0-3.86-.5-5.5-1.46l-.4-.24-3.8 1.27 1.27-3.7-.26-.42a10.36 10.36 0 0 1-1.62-5.51c0-5.75 4.68-10.43 10.43-10.43S26.43 10.05 26.43 15.8c0 5.75-4.68 10.26-10.43 10.26zm5.91-7.77c-.32-.16-1.91-.94-2.2-1.05-.3-.11-.51-.16-.73.16-.21.32-.83 1.05-1.02 1.27-.19.21-.38.24-.7.08-.32-.16-1.36-.5-2.59-1.6-.96-.86-1.6-1.92-1.79-2.24-.19-.32-.02-.49.14-.65.14-.14.32-.38.48-.57.16-.19.21-.32.32-.54.11-.21.05-.4-.03-.57-.08-.16-.7-1.69-.97-2.31-.26-.62-.52-.54-.7-.55-.18-.01-.4-.01-.6-.01-.21 0-.55.08-.83.4s-1.09 1.06-1.09 2.58 1.11 3 1.27 3.21c.16.21 2.2 3.36 5.34 4.7.75.32 1.33.51 1.79.65.75.24 1.44.2 1.98.12.6-.09 1.91-.78 2.18-1.53.27-.75.27-1.39.19-1.53-.08-.13-.29-.21-.6-.37z"/>
      </svg>
    </motion.a>
  );
}

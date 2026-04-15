import React from "react";
import { MessageCircle } from "lucide-react";

const WhatsAppButton: React.FC = () => (
  <a
    href="https://wa.me/919876543210?text=Hi%20BazaarHub!"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-4 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all duration-200 hover:scale-110"
    style={{ backgroundColor: "#25D366" }}
    aria-label="Chat on WhatsApp"
  >
    <MessageCircle className="h-6 w-6 text-white" />
  </a>
);

export default WhatsAppButton;

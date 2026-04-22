import React, { Suspense, useEffect, useState } from "react";
import { Bot } from "lucide-react";

// Lazy panel — only fetched when the user opens the chat
const ChatbotPanel = React.lazy(() => import("./ChatbotPanel"));

const ChatbotWidget: React.FC = () => {
  const [open, setOpen] = useState(false);

  // Close on Esc
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary shadow-lg transition-all duration-200 hover:scale-110"
        aria-label="Chat with BazaarBot"
      >
        <Bot className="h-6 w-6 text-primary-foreground" />
      </button>
    );
  }

  return (
    <Suspense fallback={null}>
      <ChatbotPanel onClose={() => setOpen(false)} />
    </Suspense>
  );
};

export default ChatbotWidget;

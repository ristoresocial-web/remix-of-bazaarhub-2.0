import React, { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Search } from "lucide-react";
import { Link } from "react-router-dom";

interface Message {
  role: "bot" | "user";
  text: string;
  action?: { label: string; to: string };
}

const FAQ: { keywords: string[]; answer: string; action?: { label: string; to: string } }[] = [
  { keywords: ["contact", "seller", "call", "whatsapp", "reach"], answer: "Click the WhatsApp Seller button on any product page to connect directly with the seller!", action: { label: "Search Products", to: "/search" } },
  { keywords: ["price alert", "alert", "notify", "notification"], answer: "Click 'Set Price Alert' on any product page. We'll notify you instantly when the price drops!", action: { label: "Browse Products", to: "/search" } },
  { keywords: ["city", "cities", "available", "location", "where"], answer: "We're live in Madurai! Expanding to Chennai, Coimbatore, Trichy, and 500+ cities across India soon!", action: { label: "See City Offers", to: "/city-offers" } },
  { keywords: ["seller register", "register", "sell", "join", "listing", "signup"], answer: "Click Seller Login → Register FREE with your GST details. Your shop goes live within 24 hours!", action: { label: "Register Now", to: "/seller/register" } },
  { keywords: ["price update", "refresh", "latest", "update", "outdated"], answer: "Online prices update every 6 hours automatically. Click the Refresh button on any product page for the latest!", action: { label: "Search Products", to: "/search" } },
  { keywords: ["about", "bazaar hub", "what is", "company", "who"], answer: "Bazaar Hub is India's first hyperlocal price comparison platform — comparing local shop prices with Amazon, Flipkart, and 10+ platforms across 500+ cities!", action: { label: "About Us", to: "/about" } },
  { keywords: ["free", "cost", "charge", "payment", "subscription"], answer: "Bazaar Hub is 100% FREE for buyers and sellers during our launch phase! No hidden charges.", action: { label: "Register Free", to: "/seller/register" } },
];

const getResponse = (input: string): Message => {
  const lower = input.toLowerCase();
  const match = FAQ.find((f) => f.keywords.some((k) => lower.includes(k)));
  if (match) return { role: "bot", text: match.answer, action: match.action };
  return {
    role: "bot",
    text: "Great question! I can only help with Bazaar Hub related queries. Browse bazaarhub.in to find what you're looking for!",
    action: { label: "Search Now", to: "/search" },
  };
};

const WELCOME: Message = {
  role: "bot",
  text: "Vanakkam! 🙏 I'm BazaarBot. Ask me about prices, sellers, alerts, or anything about Bazaar Hub!",
};

const ChatbotWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const userMsg: Message = { role: "user", text };
    const botMsg = getResponse(text);
    setMessages((m) => [...m, userMsg, botMsg]);
    setInput("");
  };

  return (
    <>
      {/* Toggle Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-20 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary shadow-lg transition-all duration-200 hover:scale-110"
          aria-label="Chat with BazaarBot"
        >
          <Bot className="h-6 w-6 text-primary-foreground" />
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-20 right-4 z-50 flex h-[480px] w-[360px] max-w-[calc(100vw-2rem)] flex-col rounded-card border border-border bg-card shadow-lg overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between bg-primary px-4 py-3">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary-foreground" />
              <div>
                <p className="text-sm font-bold text-primary-foreground">BazaarBot</p>
                <p className="text-[10px] text-primary-foreground/70">Ask me about Bazaar Hub</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="rounded-full p-1 text-primary-foreground/70 hover:text-primary-foreground transition-all duration-200">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-card px-3 py-2 text-sm ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}>
                  <p>{m.text}</p>
                  {m.action && (
                    <Link
                      to={m.action.to}
                      onClick={() => setOpen(false)}
                      className={`mt-2 inline-flex items-center gap-1 rounded-pill px-3 py-1 text-xs font-semibold transition-all duration-200 ${
                        m.role === "user"
                          ? "bg-white/20 text-primary-foreground hover:bg-white/30"
                          : "bg-primary text-primary-foreground hover:bg-primary/90"
                      }`}
                    >
                      <Search className="h-3 w-3" /> {m.action.label}
                    </Link>
                  )}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border p-3">
            <form
              onSubmit={(e) => { e.preventDefault(); send(); }}
              className="flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about prices, sellers..."
                className="flex-1 rounded-input border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="submit"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all duration-200 hover:bg-primary-dark"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;

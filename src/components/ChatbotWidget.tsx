import React, { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Search, Sparkles, Store, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { useApp } from "@/contexts/AppContext";

interface ChatAction {
  type: "search" | "sellers" | "city-offers";
  query?: string;
  label: string;
  to: string;
  icon: React.ElementType;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  action?: ChatAction;
}

const WELCOME: Message = {
  role: "assistant",
  content:
    "Vanakkam! 🙏 I'm **BazaarBot** — your Madurai market guide.\n\nAsk me anything: best phone under ₹20,000, where to buy fresh deals locally, how to set price alerts, or anything about Bazaar Hub!",
};

const parseAction = (text: string): { content: string; action?: ChatAction } => {
  const m = text.match(/\[ACTION:(search|sellers|city-offers)(?::([^\]]+))?\]\s*$/);
  if (!m) return { content: text };
  const cleaned = text.replace(m[0], "").trim();
  const type = m[1] as ChatAction["type"];
  const q = m[2]?.trim();
  if (type === "search" && q)
    return {
      content: cleaned,
      action: { type, query: q, label: `Search "${q}"`, to: `/search?q=${encodeURIComponent(q)}`, icon: Search },
    };
  if (type === "sellers" && q)
    return {
      content: cleaned,
      action: { type, query: q, label: `Find sellers for ${q}`, to: `/find-sellers?q=${encodeURIComponent(q)}`, icon: Store },
    };
  if (type === "city-offers")
    return { content: cleaned, action: { type, label: "View City Offers", to: "/city-offers", icon: MapPin } };
  return { content: cleaned };
};

const ChatbotWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const { selectedCity } = useApp();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || streaming) return;

    const userMsg: Message = { role: "user", content: text };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setStreaming(true);

    // Placeholder assistant message
    setMessages((m) => [...m, { role: "assistant", content: "" }]);

    let assistantSoFar = "";
    const updateLast = (chunk: string) => {
      assistantSoFar += chunk;
      const parsed = parseAction(assistantSoFar);
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: "assistant", content: parsed.content, action: parsed.action };
        return copy;
      });
    };

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-buyer-chat`;
      const apiMessages = history.map((m) => ({ role: m.role, content: m.content }));

      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: apiMessages, city: selectedCity || "Madurai", language: "en" }),
      });

      if (!resp.ok || !resp.body) {
        let errMsg = "AI is taking a quick break. Please try again!";
        try {
          const j = await resp.json();
          if (j?.error) errMsg = j.error;
        } catch {/* ignore */}
        if (resp.status === 429) toast.error("Quick break! AI is busy — try again shortly 🙏");
        else if (resp.status === 402) toast.error("AI credits recharging — contact admin.");
        else toast.error(errMsg);
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: errMsg };
          return copy;
        });
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let done = false;

      while (!done) {
        const { done: rd, value } = await reader.read();
        if (rd) break;
        buffer += decoder.decode(value, { stream: true });

        let nl: number;
        while ((nl = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, nl);
          buffer = buffer.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") {
            done = true;
            break;
          }
          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) updateLast(content);
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      // Final flush
      if (buffer.trim()) {
        for (let raw of buffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (!raw.startsWith("data: ")) continue;
          const j = raw.slice(6).trim();
          if (j === "[DONE]") continue;
          try {
            const p = JSON.parse(j);
            const c = p.choices?.[0]?.delta?.content;
            if (c) updateLast(c);
          } catch {/* ignore */}
        }
      }
    } catch (e) {
      console.error("chat error:", e);
      toast.error("Connection hiccup — please try again!");
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "assistant",
          content: "Almost there! Hit a small bump — please try again in a moment 🙏",
        };
        return copy;
      });
    } finally {
      setStreaming(false);
    }
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-20 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary shadow-lg transition-all duration-200 hover:scale-110"
          aria-label="Chat with BazaarBot"
        >
          <Bot className="h-6 w-6 text-primary-foreground" />
        </button>
      )}

      {open && (
        <div className="fixed bottom-20 right-4 z-50 flex h-[520px] w-[380px] max-w-[calc(100vw-2rem)] flex-col rounded-card border border-border bg-card shadow-lg overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between bg-primary px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Bot className="h-5 w-5 text-primary-foreground" />
                <Sparkles className="absolute -top-1 -right-1 h-2.5 w-2.5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-bold text-primary-foreground">BazaarBot AI</p>
                <p className="text-[10px] text-primary-foreground/70">
                  Powered by Bazaar Hub · {selectedCity || "Madurai"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full p-1 text-primary-foreground/70 hover:text-primary-foreground transition-all duration-200"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-background/30">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[88%] rounded-card px-3 py-2 text-sm ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {m.role === "assistant" ? (
                    <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-strong:text-foreground">
                      {m.content ? (
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      ) : (
                        <span className="inline-flex gap-1 items-center">
                          <span className="h-1.5 w-1.5 bg-foreground/50 rounded-full animate-pulse" />
                          <span className="h-1.5 w-1.5 bg-foreground/50 rounded-full animate-pulse [animation-delay:0.2s]" />
                          <span className="h-1.5 w-1.5 bg-foreground/50 rounded-full animate-pulse [animation-delay:0.4s]" />
                        </span>
                      )}
                    </div>
                  ) : (
                    <p>{m.content}</p>
                  )}
                  {m.action && (
                    <Link
                      to={m.action.to}
                      onClick={() => setOpen(false)}
                      className="mt-2 inline-flex items-center gap-1 rounded-pill px-3 py-1 text-xs font-semibold transition-all duration-200 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <m.action.icon className="h-3 w-3" /> {m.action.label}
                    </Link>
                  )}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border p-3 bg-card">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={streaming ? "BazaarBot is typing..." : "Ask about prices, sellers, deals..."}
                disabled={streaming}
                className="flex-1 rounded-input border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={streaming || !input.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all duration-200 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send"
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

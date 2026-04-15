import React, { useState } from "react";
import {
  Plus, Pencil, Trash2, GripVertical, ExternalLink,
  ToggleLeft, ToggleRight, AlertTriangle, Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  getTickerMessages, saveTickerMessages,
  TICKER_CATEGORIES, MAX_TICKER_LENGTH, MAX_ACTIVE_MESSAGES,
  type TickerMessage, type TickerCategory,
} from "@/data/tickerData";

const CATEGORY_COLORS: Record<TickerCategory, string> = {
  "New Feature": "bg-primary/10 text-primary border-primary/20",
  "City Launch": "bg-success/10 text-success border-success/20",
  "Milestone": "bg-warning/10 text-warning-foreground border-warning/20",
  "Seasonal Greeting": "bg-accent text-accent-foreground border-accent-foreground/20",
  "Platform Offer": "bg-destructive/10 text-destructive border-destructive/20",
  "General Announcement": "bg-muted text-muted-foreground border-border",
};

const TickerMessagesTab: React.FC = () => {
  const [messages, setMessages] = useState<TickerMessage[]>(() => getTickerMessages());
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({
    text: "",
    link: "",
    category: "General Announcement" as TickerCategory,
  });

  const activeCount = messages.filter((m) => m.active).length;

  const persist = (updated: TickerMessage[]) => {
    setMessages(updated);
    saveTickerMessages(updated);
  };

  const startAdd = () => {
    if (activeCount >= MAX_ACTIVE_MESSAGES) {
      toast.error(`Maximum ${MAX_ACTIVE_MESSAGES} active messages allowed. Deactivate one first.`);
    }
    setEditing("new");
    setForm({ text: "", link: "", category: "General Announcement" });
  };

  const startEdit = (m: TickerMessage) => {
    setEditing(m.id);
    setForm({ text: m.text, link: m.link || "", category: m.category });
  };

  const save = () => {
    const trimmed = form.text.trim();
    if (!trimmed) {
      toast.error("Message text is required.");
      return;
    }
    if (trimmed.length > MAX_TICKER_LENGTH) {
      toast.error(`Message must be ${MAX_TICKER_LENGTH} characters or less.`);
      return;
    }

    if (editing === "new") {
      const wouldBeActive = activeCount + 1;
      const newMsg: TickerMessage = {
        id: crypto.randomUUID(),
        text: trimmed,
        category: form.category,
        link: form.link.trim() || undefined,
        active: wouldBeActive <= MAX_ACTIVE_MESSAGES,
        order: messages.length + 1,
      };
      if (wouldBeActive > MAX_ACTIVE_MESSAGES) {
        toast.info("Added as inactive — max active limit reached.");
      }
      persist([...messages, newMsg]);
      toast.success("Message added.");
    } else {
      persist(
        messages.map((m) =>
          m.id === editing
            ? { ...m, text: trimmed, category: form.category, link: form.link.trim() || undefined }
            : m
        )
      );
      toast.success("Message updated.");
    }
    setEditing(null);
  };

  const toggleActive = (id: string) => {
    const msg = messages.find((m) => m.id === id);
    if (!msg) return;
    if (!msg.active && activeCount >= MAX_ACTIVE_MESSAGES) {
      toast.error(`Maximum ${MAX_ACTIVE_MESSAGES} active messages. Deactivate one first.`);
      return;
    }
    persist(messages.map((m) => (m.id === id ? { ...m, active: !m.active } : m)));
  };

  const remove = (id: string) => {
    persist(messages.filter((m) => m.id !== id));
    toast.success("Message deleted.");
  };

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const arr = [...messages];
    [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
    arr.forEach((m, i) => (m.order = i + 1));
    persist(arr);
  };

  const moveDown = (idx: number) => {
    if (idx >= messages.length - 1) return;
    const arr = [...messages];
    [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
    arr.forEach((m, i) => (m.order = i + 1));
    persist(arr);
  };

  const charsLeft = MAX_TICKER_LENGTH - form.text.length;
  const inputClass =
    "w-full rounded-[var(--radius-input)] border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring";

  return (
    <div className="space-y-4">
      {/* Policy notice */}
      <div className="flex items-start gap-3 rounded-card border-2 border-warning/40 bg-warning/5 p-4">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
        <div>
          <p className="text-sm font-bold text-foreground">
            PLATFORM ANNOUNCEMENTS ONLY
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            This ticker is for BazaarHub platform news only. Do not add individual seller
            advertisements. Seller ads go in the{" "}
            <span className="font-semibold text-foreground">Featured Sellers (Ad Slots)</span>{" "}
            section.
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">Ticker Messages</h2>
          <p className="text-xs text-muted-foreground">
            {activeCount}/{MAX_ACTIVE_MESSAGES} active · Max {MAX_TICKER_LENGTH} chars per message · Admin only
          </p>
        </div>
        <button
          onClick={startAdd}
          className="flex items-center gap-1.5 rounded-pill bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-all duration-200 hover:bg-[hsl(var(--primary-dark))]"
        >
          <Plus className="h-3.5 w-3.5" /> Add Message
        </button>
      </div>

      {/* Limits bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              activeCount >= MAX_ACTIVE_MESSAGES ? "bg-destructive" : activeCount >= 8 ? "bg-warning" : "bg-success"
            }`}
            style={{ width: `${(activeCount / MAX_ACTIVE_MESSAGES) * 100}%` }}
          />
        </div>
        <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
          {activeCount}/{MAX_ACTIVE_MESSAGES} active
        </span>
      </div>

      {/* Add/Edit form */}
      {editing && (
        <div className="rounded-card border-2 border-primary bg-card p-4 shadow-card space-y-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground">Message Text *</label>
              <span
                className={`text-xs font-medium ${
                  charsLeft < 0 ? "text-destructive" : charsLeft < 20 ? "text-warning" : "text-muted-foreground"
                }`}
              >
                {charsLeft} chars left
              </span>
            </div>
            <input
              type="text"
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              placeholder="e.g. BazaarHub now live in Chennai!"
              maxLength={MAX_TICKER_LENGTH + 10}
              className={`${inputClass} ${form.text.length > MAX_TICKER_LENGTH ? "border-destructive" : ""}`}
              autoFocus
            />
            {form.text.length > MAX_TICKER_LENGTH && (
              <p className="text-[10px] text-destructive flex items-center gap-1">
                <Info className="h-3 w-3" /> Exceeds {MAX_TICKER_LENGTH} character limit
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Category *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as TickerCategory })}
                className={inputClass}
              >
                {TICKER_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Link URL (optional)</label>
              <input
                type="text"
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                placeholder="/product/compare"
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={save}
              disabled={!form.text.trim() || form.text.length > MAX_TICKER_LENGTH}
              className="rounded-pill bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-50"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(null)}
              className="rounded-pill border border-border px-5 py-2 text-xs font-semibold text-foreground"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Messages list */}
      <div className="space-y-2">
        {messages
          .sort((a, b) => a.order - b.order)
          .map((m, idx) => (
            <div
              key={m.id}
              className={`flex items-center gap-3 rounded-xl border p-3 transition-all duration-200 ${
                m.active ? "border-border bg-card" : "border-border bg-muted/50 opacity-60"
              }`}
            >
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => moveUp(idx)}
                  disabled={idx === 0}
                  className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                >
                  <GripVertical className="h-3 w-3 rotate-180" />
                </button>
                <button
                  onClick={() => moveDown(idx)}
                  disabled={idx === messages.length - 1}
                  className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                >
                  <GripVertical className="h-3 w-3" />
                </button>
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={`text-[10px] shrink-0 ${CATEGORY_COLORS[m.category]}`}>
                    {m.category}
                  </Badge>
                  <p className="text-sm font-medium text-foreground truncate">{m.text}</p>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                  <span>{m.text.length}/{MAX_TICKER_LENGTH} chars</span>
                  {m.link && (
                    <span className="flex items-center gap-0.5 text-primary truncate">
                      <ExternalLink className="h-2.5 w-2.5" /> {m.link}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => toggleActive(m.id)} title={m.active ? "Deactivate" : "Activate"}>
                  {m.active ? (
                    <ToggleRight className="h-5 w-5 text-[hsl(var(--success))]" />
                  ) : (
                    <ToggleLeft className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
                <button
                  onClick={() => startEdit(m)}
                  className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => remove(m.id)}
                  className="rounded-md p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        {messages.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No ticker messages. The default message will be shown.
          </p>
        )}
      </div>

      {/* Admin-only note */}
      <div className="flex items-center gap-2 rounded-card bg-muted/50 p-3 text-xs text-muted-foreground">
        <Info className="h-4 w-4 shrink-0" />
        <span>
          Only admin users can manage ticker messages. Sellers do not have access to this section.
        </span>
      </div>
    </div>
  );
};

export default TickerMessagesTab;

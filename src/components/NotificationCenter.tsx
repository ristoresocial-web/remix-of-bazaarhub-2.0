import React, { useState } from "react";
import { Bell, BellOff, Smartphone, Mail, MessageCircle, CheckCircle, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const NotificationCenter: React.FC = () => {
  const [permission, setPermission] = useState<"default" | "granted" | "denied">("default");
  const [pushEnabled, setPushEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [prefs, setPrefs] = useState({
    priceDrops: true,
    newSellers: true,
    weeklyDeals: false,
    orderUpdates: true,
    reviewReminders: true,
  });

  const requestPush = () => {
    // Mock push notification permission
    setPermission("granted");
    setPushEnabled(true);
  };

  const notifications = [
    { id: 1, type: "price", title: "Price dropped!", body: 'Samsung 43" TV is now ₹27,500 — below your alert!', time: "2 min ago", read: false },
    { id: 2, type: "seller", title: "New seller in Madurai!", body: "Vijay Electronics just joined with 45 products.", time: "1 hr ago", read: false },
    { id: 3, type: "deal", title: "Flash Sale ending soon!", body: "LG Refrigerator at ₹18,999 — 3 hours left.", time: "3 hr ago", read: true },
    { id: 4, type: "review", title: "Review reminder", body: "How was your Samsung TV from Sri Murugan Electronics?", time: "1 day ago", read: true },
  ];

  const [items, setItems] = useState(notifications);
  const unreadCount = items.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Notifications</h2>
          {unreadCount > 0 && <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">{unreadCount}</span>}
        </div>
        <span className="rounded-pill bg-primary-light px-2 py-0.5 text-[10px] font-bold text-primary">PHASE 2</span>
      </div>

      {/* Push Permission */}
      {permission === "default" && (
        <div className="rounded-2xl border-2 border-primary bg-primary-light p-4">
          <div className="flex items-start gap-3">
            <Smartphone className="mt-0.5 h-6 w-6 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-bold text-foreground">Enable Push Notifications</p>
              <p className="text-xs text-muted-foreground">Get instant alerts for price drops, new sellers, and deals!</p>
              <button onClick={requestPush} className="mt-2 rounded-pill bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary-dark">
                Enable Notifications
              </button>
            </div>
          </div>
        </div>
      )}

      {permission === "granted" && (
        <div className="flex items-center gap-2 rounded-xl bg-success-light p-3">
          <CheckCircle className="h-4 w-4 text-success" />
          <p className="text-xs font-medium text-success">Push notifications enabled!</p>
        </div>
      )}

      {/* Channels */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-card space-y-3">
        <h3 className="text-sm font-bold text-foreground">Notification Channels</h3>
        <div className="flex items-center justify-between rounded-input border border-border px-3 py-2.5">
          <div className="flex items-center gap-2"><Smartphone className="h-4 w-4 text-primary" /><span className="text-sm text-foreground">Push Notifications</span></div>
          <Switch checked={pushEnabled} onCheckedChange={setPushEnabled} />
        </div>
        <div className="flex items-center justify-between rounded-input border border-border px-3 py-2.5">
          <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /><span className="text-sm text-foreground">Email</span></div>
          <Switch checked={emailEnabled} onCheckedChange={setEmailEnabled} />
        </div>
        <div className="flex items-center justify-between rounded-input border border-border px-3 py-2.5">
          <div className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-[#25D366]" /><span className="text-sm text-foreground">WhatsApp</span></div>
          <Switch checked={whatsappEnabled} onCheckedChange={setWhatsappEnabled} />
        </div>
      </div>

      {/* Preferences */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-card space-y-3">
        <h3 className="text-sm font-bold text-foreground">What to notify</h3>
        {Object.entries(prefs).map(([key, val]) => (
          <div key={key} className="flex items-center justify-between rounded-input border border-border px-3 py-2.5">
            <span className="text-sm text-foreground">{key.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())}</span>
            <Switch checked={val} onCheckedChange={v => setPrefs(p => ({ ...p, [key]: v }))} />
          </div>
        ))}
      </div>

      {/* Recent */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-foreground">Recent</h3>
        {items.map(n => (
          <div key={n.id} className={`rounded-xl border p-3 transition-all duration-200 ${n.read ? "border-border bg-card" : "border-primary/30 bg-primary-light"}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">{n.title}</p>
                <p className="text-xs text-muted-foreground">{n.body}</p>
                <p className="mt-1 text-[10px] text-muted-foreground">{n.time}</p>
              </div>
              {!n.read && (
                <button onClick={() => setItems(prev => prev.map(i => i.id === n.id ? { ...i, read: true } : i))} className="rounded-full p-1 text-muted-foreground hover:bg-accent">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationCenter;

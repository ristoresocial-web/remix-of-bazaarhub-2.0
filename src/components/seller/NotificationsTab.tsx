import React, { useState } from "react";
import { Bell, MessageSquare } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const NotificationsTab: React.FC = () => {
  const [whatsappReport, setWhatsappReport] = useState(true);
  const [reportTime, setReportTime] = useState("9AM");
  const [threshold, setThreshold] = useState("5%");
  const [weeklyReport, setWeeklyReport] = useState(true);

  return (
    <div className="space-y-6 max-w-xl">
      <h2 className="text-lg font-bold text-foreground">Notification Preferences</h2>

      {/* WhatsApp Morning Report */}
      <div className="rounded-card border border-border bg-card p-5 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-success" />
            <span className="font-semibold text-foreground">WhatsApp Morning Report</span>
          </div>
          <Switch checked={whatsappReport} onCheckedChange={setWhatsappReport} />
        </div>
        {whatsappReport && (
          <div className="space-y-3 pl-7">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Send at</label>
              <div className="mt-1 flex gap-2">
                {["8AM", "9AM", "10AM"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setReportTime(t)}
                    className={`rounded-pill px-3 py-1 text-xs font-medium transition-all duration-200 ${
                      reportTime === t
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-background text-foreground hover:bg-accent"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Only shows products where your price {">"} online price. Max 5 products. If all are best — you get a congratulation!
            </p>
          </div>
        )}
      </div>

      {/* Alert Threshold */}
      <div className="rounded-card border border-border bg-card p-5 shadow-card space-y-3">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          <span className="font-semibold text-foreground">Alert Threshold</span>
        </div>
        <div className="flex gap-2">
          {["5%", "10%", "15%"].map((t) => (
            <button
              key={t}
              onClick={() => setThreshold(t)}
              className={`rounded-pill px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
                threshold === t
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-background text-foreground hover:bg-accent"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">Get alerted when online prices drop by this much below yours.</p>
      </div>

      {/* Weekly Report */}
      <div className="rounded-card border border-border bg-card p-5 shadow-card">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-foreground">Weekly Summary Report</span>
          <Switch checked={weeklyReport} onCheckedChange={setWeeklyReport} />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">Receive a weekly performance summary via WhatsApp every Monday.</p>
      </div>
    </div>
  );
};

export default NotificationsTab;

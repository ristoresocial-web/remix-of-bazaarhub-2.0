import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, AlertCircle, KeyRound, ChevronRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { allCities } from "@/lib/cityUtils";

interface Props {
  holidayMode: boolean;
  setHolidayMode: (v: boolean) => void;
}

const SettingsTab: React.FC<Props> = ({ holidayMode, setHolidayMode }) => {
  const [shopName, setShopName] = useState("Poorvika Mobiles");
  const [shopCity, setShopCity] = useState("Madurai");
  const [shopPhone, setShopPhone] = useState("+91 99434 40384");
  const [language, setLanguage] = useState("en");
  const [holidayStart, setHolidayStart] = useState("");
  const [holidayEnd, setHolidayEnd] = useState("");
  const [holidayMsg, setHolidayMsg] = useState("");

  return (
    <div className="space-y-6 max-w-xl">
      <h2 className="text-lg font-bold text-foreground">Settings</h2>

      {/* Shop Details */}
      <div className="rounded-card border border-border bg-card p-5 shadow-card space-y-4">
        <h3 className="font-semibold text-foreground">Shop Details</h3>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Shop Name</label>
          <input value={shopName} onChange={(e) => setShopName(e.target.value)} className="mt-1 w-full rounded-input border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">City</label>
          <select value={shopCity} onChange={(e) => setShopCity(e.target.value)} className="mt-1 w-full rounded-input border border-border bg-background px-3 py-2 text-sm">
            {allCities.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Phone</label>
          <input value={shopPhone} onChange={(e) => setShopPhone(e.target.value)} className="mt-1 w-full rounded-input border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Language</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="mt-1 w-full rounded-input border border-border bg-background px-3 py-2 text-sm">
            <option value="en">English</option>
            <option value="ta">தமிழ்</option>
            <option value="hi">हिंदी</option>
          </select>
        </div>
        <Button size="sm">Save Changes</Button>
      </div>

      {/* Holiday Mode */}
      <div className={`rounded-card border p-5 shadow-card space-y-4 ${holidayMode ? "border-primary bg-primary-light" : "border-border bg-card"}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">Holiday Mode</span>
          </div>
          <Switch checked={holidayMode} onCheckedChange={setHolidayMode} />
        </div>
        {holidayMode && (
          <div className="space-y-3">
            <div className="rounded-card bg-primary/10 p-3 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-primary mt-0.5" />
              <p className="text-xs text-foreground">
                Your shop is on holiday. Buyers will see "Currently Unavailable". Auto-resumes on end date.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Start Date</label>
                <input type="date" value={holidayStart} onChange={(e) => setHolidayStart(e.target.value)} className="mt-1 w-full rounded-input border border-border bg-background px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">End Date</label>
                <input type="date" value={holidayEnd} onChange={(e) => setHolidayEnd(e.target.value)} className="mt-1 w-full rounded-input border border-border bg-background px-3 py-2 text-sm" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Message (optional)</label>
              <input value={holidayMsg} onChange={(e) => setHolidayMsg(e.target.value)} placeholder="We'll be back soon!" className="mt-1 w-full rounded-input border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
        )}
      </div>

      {/* Security */}
      <div className="rounded-card border border-border bg-card p-5 shadow-card">
        <div className="mb-2 flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Security</h3>
        </div>
        <p className="mb-3 text-xs text-muted-foreground">
          Update your password — verified by mobile OTP for safety.
        </p>
        <Link
          to="/account/change-password"
          className="inline-flex items-center gap-1 rounded-pill border border-primary px-4 py-2 text-xs font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
        >
          Change Password <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default SettingsTab;

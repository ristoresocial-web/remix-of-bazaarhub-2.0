import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  BellRing, Trash2, Search, Target, Lock, Lightbulb, ChevronDown, PartyPopper,
  Clock, Smartphone, Mail, Phone, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/contexts/AppContext";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface PriceAlertRow {
  id: string;
  user_id: string;
  product_name: string;
  product_image: string | null;
  category: string | null;
  target_price: number;
  current_best_price: number | null;
  current_best_seller: string | null;
  city: string;
  notify_whatsapp: boolean;
  notify_email: boolean;
  whatsapp_number: string | null;
  status: string;
  last_checked_at: string | null;
  triggered_at: string | null;
  created_at: string;
  updated_at: string;
}

const formatPrice = (n: number | null) => "₹" + (Number(n) || 0).toLocaleString("en-IN");

const timeAgo = (iso: string | null) => {
  if (!iso) return "just now";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
};

const PriceAlertsPage: React.FC = () => {
  const { user, profile } = useAuth();
  const { selectedCity } = useApp();
  const isLocked = !user;

  const [alerts, setAlerts] = useState<PriceAlertRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [productSearch, setProductSearch] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [whatsappNum, setWhatsappNum] = useState("");
  const [notifyWA, setNotifyWA] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  // Pre-fill WhatsApp number from profile
  useEffect(() => {
    if (profile?.mobile && !whatsappNum) setWhatsappNum(profile.mobile);
  }, [profile]);

  // Fetch alerts on mount / user change
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const fetchAlerts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("price_alerts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) {
        toast.error("Couldn't load alerts. Please refresh.");
      } else {
        setAlerts(data as PriceAlertRow[]);
      }
      setLoading(false);
    };
    fetchAlerts();
  }, [user]);

  const activeAlerts = alerts.filter(a => a.status === "active");
  const triggeredAlerts = alerts.filter(a => a.status === "triggered");
  const pastAlerts = alerts.filter(a => a.status === "expired" || a.status === "deleted");

  const removeAlert = async (id: string) => {
    const prev = alerts;
    setAlerts(prev.filter(a => a.id !== id));
    const { error } = await supabase.from("price_alerts").delete().eq("id", id);
    if (error) {
      setAlerts(prev);
      toast.error("Couldn't remove alert. Try again.");
    } else {
      toast.success("Alert removed!");
    }
  };

  const handleSetAlert = async () => {
    if (!user) return;
    if (!productSearch.trim() || !targetPrice) {
      toast.info("Please enter a product and a target price.");
      return;
    }
    if (!notifyWA && !notifyEmail) {
      toast.info("Pick at least one notification method.");
      return;
    }
    const target = Number(targetPrice);
    if (!target || target <= 0) {
      toast.info("Target price must be greater than zero.");
      return;
    }

    setSubmitting(true);
    const { data, error } = await supabase
      .from("price_alerts")
      .insert({
        user_id: user.id,
        product_name: productSearch.trim(),
        target_price: target,
        city: selectedCity,
        notify_whatsapp: notifyWA,
        notify_email: notifyEmail,
        whatsapp_number: notifyWA ? whatsappNum.trim() || null : null,
        status: "active",
      })
      .select()
      .single();
    setSubmitting(false);

    if (error) {
      toast.error("Couldn't create alert. Please try again.");
      return;
    }
    setAlerts(prev => [data as PriceAlertRow, ...prev]);
    toast.success("Price alert set! We'll notify you when the price drops.");
    setProductSearch("");
    setTargetPrice("");
  };

  return (
    <>
      <Helmet>
        <title>Price Alerts — Bazaar Hub</title>
        <meta name="description" content="Get notified when local prices drop to your target on Bazaar Hub. Set price alerts via WhatsApp or Email." />
      </Helmet>

      <div className="container py-8 space-y-8 max-w-4xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BellRing className="h-6 w-6 text-primary" /> Price Alerts
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Get notified when local prices drop.
            {activeAlerts.length > 0 && (
              <span> Currently tracking <span className="font-semibold text-foreground">{activeAlerts.length} alert{activeAlerts.length !== 1 ? "s" : ""}</span> in <span className="font-semibold text-foreground">{selectedCity}</span></span>
            )}
          </p>
        </motion.div>

        {/* Set New Alert Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="relative overflow-hidden">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-semibold text-lg flex items-center gap-2">+ Set a New Price Alert</h2>

              <div className="space-y-3">
                <div>
                  <Label>Product Name</Label>
                  <div className="relative mt-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="e.g. Samsung Galaxy S24 Ultra" value={productSearch} onChange={e => setProductSearch(e.target.value)} className="pl-9" />
                  </div>
                </div>

                <div>
                  <Label>Target Price (₹)</Label>
                  <Input type="number" placeholder="e.g. 125000" value={targetPrice} onChange={e => setTargetPrice(e.target.value)} className="mt-1" />
                </div>

                <div>
                  <Label>City</Label>
                  <Input value={selectedCity} disabled className="mt-1 notranslate" />
                  <p className="text-xs text-muted-foreground mt-1">Change city from the top navbar</p>
                </div>

                <div>
                  <Label>Notify me via</Label>
                  <div className="flex items-center gap-6 mt-2">
                    <div className="flex items-center gap-2">
                      <Checkbox id="wa" checked={notifyWA} onCheckedChange={v => setNotifyWA(!!v)} />
                      <Label htmlFor="wa" className="flex items-center gap-1 cursor-pointer"><Smartphone className="h-3.5 w-3.5" /> WhatsApp</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="em" checked={notifyEmail} onCheckedChange={v => setNotifyEmail(!!v)} />
                      <Label htmlFor="em" className="flex items-center gap-1 cursor-pointer"><Mail className="h-3.5 w-3.5" /> Email</Label>
                    </div>
                  </div>
                </div>

                {notifyWA && (
                  <div>
                    <Label>WhatsApp Number</Label>
                    <div className="flex gap-2 mt-1">
                      <span className="flex items-center px-3 bg-muted rounded-md text-sm font-medium">+91</span>
                      <Input placeholder="9942440384" value={whatsappNum} onChange={e => setWhatsappNum(e.target.value)} />
                    </div>
                  </div>
                )}

                <Button onClick={handleSetAlert} disabled={submitting} className="w-full sm:w-auto gap-2">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <BellRing className="h-4 w-4" />}
                  {submitting ? "Setting..." : "Set Alert"}
                </Button>
              </div>
            </CardContent>

            {/* Guest Lock Overlay */}
            {isLocked && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-10">
                <Lock className="h-8 w-8 text-muted-foreground" />
                <p className="font-semibold">Login to set price alerts</p>
                <Button asChild><Link to="/buyer/login">Login / Sign Up</Link></Button>
              </div>
            )}
          </Card>
        </motion.div>

        {/* How It Works */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Search, title: "Add Product", desc: "Type any product name" },
            { icon: Target, title: "Set Target Price", desc: "Enter the price you want" },
            { icon: Phone, title: "Get Instant Alert", desc: "We notify you when it drops" },
          ].map((s, i) => (
            <motion.div key={s.title} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }}
              className="text-center space-y-2">
              <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-sm">{s.title}</h3>
              <p className="text-xs text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Triggered Alerts */}
        {triggeredAlerts.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <PartyPopper className="h-5 w-5 text-green-600" /> Price Dropped!
            </h2>
            {triggeredAlerts.map(alert => {
              const savings = Number(alert.target_price) - Number(alert.current_best_price || 0);
              return (
                <Card key={alert.id} className="border-l-4 border-l-green-500 bg-green-50 dark:bg-green-950/20">
                  <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <img src={alert.product_image || "/placeholder.svg"} alt={alert.product_name} className="h-16 w-16 rounded-lg bg-muted object-contain p-1 flex-shrink-0" loading="lazy" />
                    <div className="flex-1 min-w-0">
                      <Badge className="bg-green-500 hover:bg-green-600 mb-1">PRICE DROPPED!</Badge>
                      <p className="font-medium notranslate">{alert.product_name}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your target: <span className="notranslate font-semibold">{formatPrice(alert.target_price)}</span> · Current: <span className="notranslate font-semibold text-green-600">{formatPrice(alert.current_best_price)}</span>
                        {alert.current_best_seller && <> ({alert.current_best_seller})</>}
                      </p>
                      {savings > 0 && (
                        <p className="text-xs text-green-600 font-medium mt-0.5 notranslate">
                          You saved {formatPrice(savings)}! 🎉
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" asChild><Link to={`/search?q=${encodeURIComponent(alert.product_name)}`}>View Deal →</Link></Button>
                      <Button variant="ghost" size="icon" onClick={() => removeAlert(alert.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Active Alerts */}
        {user && (
          <div className="space-y-3">
            <h2 className="font-semibold text-lg">Your Active Alerts ({activeAlerts.length})</h2>
            {loading ? (
              <Card><CardContent className="p-12 text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
              </CardContent></Card>
            ) : activeAlerts.length === 0 ? (
              <Card><CardContent className="p-12 text-center space-y-3">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                  <BellRing className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="font-semibold">No active alerts yet</p>
                <p className="text-sm text-muted-foreground">Add a product above and set your target price — we'll watch the market for you.</p>
              </CardContent></Card>
            ) : (
              activeAlerts.map((alert, i) => {
                const current = Number(alert.current_best_price || 0);
                const target = Number(alert.target_price);
                const diff = current - target;
                return (
                  <motion.div key={alert.id} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                    <Card className="border-l-4 border-l-primary">
                      <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <img src={alert.product_image || "/placeholder.svg"} alt={alert.product_name} className="h-16 w-16 rounded-lg bg-muted object-contain p-1 flex-shrink-0" loading="lazy" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium notranslate">{alert.product_name}</p>
                            {alert.category && <Badge variant="outline" className="text-xs">{alert.category}</Badge>}
                            <Badge variant="secondary" className="text-xs">Active</Badge>
                          </div>
                          <div className="text-sm mt-1 space-y-0.5">
                            <p className="text-muted-foreground">
                              Your target: <span className="notranslate font-semibold text-primary">{formatPrice(alert.target_price)}</span>
                            </p>
                            {current > 0 && (
                              <>
                                <p className="text-muted-foreground">
                                  Current best: <span className="notranslate font-semibold text-foreground">{formatPrice(current)}</span>
                                  {alert.current_best_seller && <> ({alert.current_best_seller})</>}
                                </p>
                                {diff > 0 && (
                                  <p className="text-xs notranslate font-medium text-orange-600">
                                    {formatPrice(diff)} above your target
                                  </p>
                                )}
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground flex-wrap">
                            {alert.notify_whatsapp && <span className="flex items-center gap-1"><Smartphone className="h-3 w-3" /> WhatsApp</span>}
                            {alert.notify_email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> Email</span>}
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {timeAgo(alert.last_checked_at || alert.created_at)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <Button variant="ghost" size="icon" onClick={() => removeAlert(alert.id)} className="text-muted-foreground hover:text-destructive" title="Delete alert">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </div>
        )}

        {/* Past Alerts */}
        {pastAlerts.length > 0 && (
          <Collapsible open={historyOpen} onOpenChange={setHistoryOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between text-muted-foreground">
                Past Alerts ({pastAlerts.length})
                <ChevronDown className={`h-4 w-4 transition-transform ${historyOpen ? "rotate-180" : ""}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="space-y-2 mt-2">
                {pastAlerts.map(pa => (
                  <div key={pa.id} className="flex items-center justify-between py-2 px-3 rounded-md bg-muted/50 text-sm">
                    <div>
                      <span className="font-medium notranslate">{pa.product_name}</span>
                      <span className="text-muted-foreground ml-2">— Target {formatPrice(pa.target_price)}</span>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{new Date(pa.created_at).toLocaleDateString("en-IN")}</span>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Pro Tips */}
        <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
          <CardContent className="p-6">
            <h3 className="font-semibold flex items-center gap-2 mb-3">
              <Lightbulb className="h-5 w-5 text-amber-500" /> Pro Tips for Price Alerts
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Set alerts 10–15% below current price for realistic results</li>
              <li>• Online platform sales happen on Republic Day, Diwali, Big Billion Days</li>
              <li>• Local prices can drop faster — check weekly for best deals</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default PriceAlertsPage;

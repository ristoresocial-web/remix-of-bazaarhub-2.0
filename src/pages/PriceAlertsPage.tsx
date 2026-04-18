import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  BellRing, Trash2, TrendingDown, Search, Target, MessageCircle,
  Pause, Play, Pencil, Lock, Lightbulb, ChevronDown, PartyPopper,
  Clock, Smartphone, Mail, Phone,
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

interface PriceAlertItem {
  id: string;
  productName: string;
  productImage: string;
  category: string;
  targetPrice: number;
  currentBestPrice: number;
  currentBestSeller: string;
  city: string;
  notifyWhatsApp: boolean;
  notifyEmail: boolean;
  status: "active" | "paused" | "triggered" | "expired";
  lastChecked: string;
  createdAt: string;
}

const mockAlerts: PriceAlertItem[] = [
  {
    id: "1",
    productName: "Samsung Galaxy S24 Ultra",
    productImage: "/placeholder.svg",
    category: "Mobiles",
    targetPrice: 125000,
    currentBestPrice: 129990,
    currentBestSeller: "Kumar Electronics",
    city: "Madurai",
    notifyWhatsApp: true,
    notifyEmail: false,
    status: "active",
    lastChecked: "2 hrs ago",
    createdAt: "2025-04-10",
  },
  {
    id: "2",
    productName: "iPhone 15 Pro Max",
    productImage: "/placeholder.svg",
    category: "Mobiles",
    targetPrice: 150000,
    currentBestPrice: 148500,
    currentBestSeller: "Amazon",
    city: "Madurai",
    notifyWhatsApp: true,
    notifyEmail: true,
    status: "triggered",
    lastChecked: "30 min ago",
    createdAt: "2025-04-08",
  },
];

const pastAlerts = [
  { id: "p1", productName: "OnePlus 12", outcome: "Price dropped to ₹59,990", date: "Mar 15, 2025" },
  { id: "p2", productName: "Sony WH-1000XM5", outcome: "Target met at ₹21,490", date: "Feb 28, 2025" },
  { id: "p3", productName: "MacBook Air M3", outcome: "Expired — price never reached target", date: "Jan 10, 2025" },
];

const formatPrice = (n: number) => "₹" + n.toLocaleString("en-IN");

const PriceAlertsPage: React.FC = () => {
  const { user } = useAuth();
  const { selectedCity } = useApp();
  const isLocked = !user;

  const [alerts, setAlerts] = useState(mockAlerts);
  const [productSearch, setProductSearch] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [whatsappNum, setWhatsappNum] = useState("");
  const [notifyWA, setNotifyWA] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const activeAlerts = alerts.filter(a => a.status === "active" || a.status === "paused");
  const triggeredAlerts = alerts.filter(a => a.status === "triggered");

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    toast.success("Alert removed!");
  };

  const togglePause = (id: string) => {
    setAlerts(prev =>
      prev.map(a =>
        a.id === id ? { ...a, status: a.status === "paused" ? "active" : "paused" } as PriceAlertItem : a
      )
    );
    toast.success("Alert updated!");
  };

  const handleSetAlert = () => {
    if (!productSearch.trim() || !targetPrice) {
      toast.info("Please search for a product and set a target price.");
      return;
    }
    toast.success("Price alert set! We'll notify you when the price drops.");
    setProductSearch("");
    setTargetPrice("");
  };

  return (
    <>
      <Helmet>
        <title>Price Alerts — Bazaar Hub</title>
        <meta name="description" content="Set price drop alerts and get notified via WhatsApp when prices hit your target on Bazaar Hub." />
      </Helmet>

      <div className="container py-8 space-y-8 max-w-4xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BellRing className="h-6 w-6 text-primary" /> Price Alerts
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Get notified on WhatsApp or Email when prices drop to your target.
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
                  <Label>Product</Label>
                  <div className="relative mt-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search for product..." value={productSearch} onChange={e => setProductSearch(e.target.value)} className="pl-9" />
                  </div>
                </div>

                <div>
                  <Label>Target Price (₹)</Label>
                  <Input type="number" placeholder="e.g. 125000" value={targetPrice} onChange={e => setTargetPrice(e.target.value)} className="mt-1" />
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

                <Button onClick={handleSetAlert} className="w-full sm:w-auto gap-2">
                  <BellRing className="h-4 w-4" /> Set Alert
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
            { icon: Search, title: "Search Product", desc: "Find any product on BazaarHub" },
            { icon: Target, title: "Set Target Price", desc: "Enter the price you want to pay" },
            { icon: Phone, title: "Get WhatsApp Alert", desc: "We notify you instantly" },
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
            {triggeredAlerts.map(alert => (
              <Card key={alert.id} className="border-l-4 border-l-green-500 bg-green-50 dark:bg-green-950/20">
                <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <img src={alert.productImage} alt={alert.productName} className="h-16 w-16 rounded-lg bg-muted object-contain p-1 flex-shrink-0" loading="lazy" />
                  <div className="flex-1 min-w-0">
                    <Badge className="bg-green-500 hover:bg-green-600 mb-1">PRICE DROPPED!</Badge>
                    <p className="font-medium notranslate">{alert.productName}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your target: <span className="notranslate font-semibold">{formatPrice(alert.targetPrice)}</span> · Current best: <span className="notranslate font-semibold text-green-600">{formatPrice(alert.currentBestPrice)}</span> ({alert.currentBestSeller})
                    </p>
                    <p className="text-xs text-green-600 font-medium mt-0.5">
                      {formatPrice(alert.targetPrice - alert.currentBestPrice)} below your target! 🎉
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" asChild><Link to={`/search?q=${encodeURIComponent(alert.productName)}`}>View Deal →</Link></Button>
                    <Button variant="ghost" size="icon" onClick={() => removeAlert(alert.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Active Alerts */}
        <div className="space-y-3">
          <h2 className="font-semibold text-lg">Your Active Alerts ({activeAlerts.length})</h2>
          {activeAlerts.length === 0 ? (
            <Card><CardContent className="p-12 text-center space-y-2">
              <BellRing className="h-10 w-10 text-muted-foreground mx-auto" />
              <p className="font-semibold">No active alerts</p>
              <p className="text-sm text-muted-foreground">Search for a product above and set your target price!</p>
            </CardContent></Card>
          ) : (
            activeAlerts.map((alert, i) => {
              const diff = alert.currentBestPrice - alert.targetPrice;
              return (
                <motion.div key={alert.id} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className={`border-l-4 ${alert.status === "paused" ? "border-l-muted-foreground opacity-60" : "border-l-primary"}`}>
                    <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <img src={alert.productImage} alt={alert.productName} className="h-16 w-16 rounded-lg bg-muted object-contain p-1 flex-shrink-0" loading="lazy" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium notranslate">{alert.productName}</p>
                          <Badge variant="outline" className="text-xs">{alert.category}</Badge>
                          {alert.status === "paused" && <Badge variant="secondary" className="text-xs">Paused</Badge>}
                        </div>
                        <div className="text-sm mt-1 space-y-0.5">
                          <p className="text-muted-foreground">
                            Your target: <span className="notranslate font-semibold text-primary">{formatPrice(alert.targetPrice)}</span>
                          </p>
                          <p className="text-muted-foreground">
                            Current best: <span className="notranslate font-semibold text-foreground">{formatPrice(alert.currentBestPrice)}</span> ({alert.currentBestSeller})
                          </p>
                          <p className="text-xs text-muted-foreground">
                            <span className="notranslate font-medium text-orange-600">{formatPrice(diff)} above your target</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                          {alert.notifyWhatsApp && <span className="flex items-center gap-1"><Smartphone className="h-3 w-3" /> WhatsApp ON</span>}
                          {alert.notifyEmail && <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> Email ON</span>}
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Checked {alert.lastChecked}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <Button variant="ghost" size="sm" onClick={() => toast.info("Edit coming soon!")} className="gap-1"><Pencil className="h-3.5 w-3.5" /> Edit</Button>
                        <Button variant="ghost" size="icon" onClick={() => togglePause(alert.id)} title={alert.status === "paused" ? "Resume" : "Pause"}>
                          {alert.status === "paused" ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => removeAlert(alert.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Alert History */}
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
                    <span className="font-medium notranslate">{pa.productName}</span>
                    <span className="text-muted-foreground ml-2">— {pa.outcome}</span>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{pa.date}</span>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

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

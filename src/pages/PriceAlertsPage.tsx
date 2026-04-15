import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Bell, BellRing, Trash2, TrendingDown, Search, Plus, Target, MessageCircle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const mockAlerts = [
  { id: "1", product: "Samsung Galaxy S24 Ultra", targetPrice: "₹1,25,000", currentPrice: "₹1,29,999", status: "watching", image: "/placeholder.svg" },
  { id: "2", product: "iPhone 15 Pro Max", targetPrice: "₹1,50,000", currentPrice: "₹1,56,900", status: "watching", image: "/placeholder.svg" },
  { id: "3", product: "Sony WH-1000XM5", targetPrice: "₹22,000", currentPrice: "₹21,490", status: "triggered", image: "/placeholder.svg" },
];

const city = localStorage.getItem("bazaarhub_city") || "Madurai";

const PriceAlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [search, setSearch] = useState("");

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    toast.success("Alert removed successfully!");
  };

  const filtered = alerts.filter(a => a.product.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <Helmet>
        <title>Price Alerts — Bazaar Hub</title>
        <meta name="description" content="Set price drop alerts for your favourite products. Get notified via WhatsApp when prices hit your target on Bazaar Hub." />
      </Helmet>

      <div className="container py-8 space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2"><BellRing className="h-6 w-6 text-primary" /> Price Alerts — {city}</h1>
              <p className="text-sm text-muted-foreground">Set an alert and get notified on WhatsApp when prices drop.</p>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search product to track..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
          </div>
        </motion.div>

        {/* Active Alerts */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-lg">Your Active Alerts</h2>
            <Button size="sm" className="gap-1 rounded-full" onClick={() => toast.info("Search for a product to add an alert!")}>
              <Plus className="h-4 w-4" /> Add New Alert
            </Button>
          </div>

          {filtered.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center space-y-3">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto" />
                <h3 className="font-semibold">No price alerts yet</h3>
                <p className="text-sm text-muted-foreground">Browse products and set your target price to get notified when deals appear!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filtered.map((alert, i) => (
                <motion.div key={alert.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="hover:shadow-sm transition-shadow">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="h-16 w-16 rounded-lg bg-muted flex-shrink-0 flex items-center justify-center">
                        <img src={alert.image} alt={alert.product} className="h-full w-full object-contain p-1" loading="lazy" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate notranslate">{alert.product}</p>
                        <div className="flex items-center gap-3 mt-1 text-sm">
                          <span className="text-muted-foreground">Alert below: <span className="notranslate font-semibold text-primary">{alert.targetPrice}</span></span>
                          <span className="text-muted-foreground">Current best: <span className="notranslate font-semibold text-foreground">{alert.currentPrice}</span></span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={alert.status === "triggered" ? "default" : "outline"} className={alert.status === "triggered" ? "bg-green-500 hover:bg-green-600" : ""}>
                          {alert.status === "triggered" ? <><TrendingDown className="h-3 w-3 mr-1" /> Price Dropped!</> : "Watching"}
                        </Badge>
                        <Button variant="ghost" size="sm" onClick={() => toast.info("Edit coming soon!")}>Edit</Button>
                        <Button variant="ghost" size="icon" onClick={() => removeAlert(alert.id)} className="text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* How Alerts Work */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-accent/50">
            <CardContent className="p-8">
              <h2 className="text-lg font-bold text-center mb-6">How Alerts Work</h2>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                {[
                  { icon: Target, step: "1", title: "Set your target price", desc: "Choose a product and enter the price you're willing to pay." },
                  { icon: MessageCircle, step: "2", title: "Save your WhatsApp number", desc: "We'll send notifications directly to your WhatsApp." },
                  { icon: Zap, step: "3", title: "Get notified instantly", desc: "When prices hit your target, you'll know right away!" },
                ].map(s => (
                  <div key={s.step} className="space-y-2">
                    <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-lg font-bold">{s.step}</div>
                    <h3 className="font-semibold">{s.title}</h3>
                    <p className="text-sm text-muted-foreground">{s.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default PriceAlertsPage;

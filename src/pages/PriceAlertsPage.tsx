import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Bell, BellRing, Trash2, TrendingDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const mockAlerts = [
  { id: "1", product: "Samsung Galaxy S24 Ultra", targetPrice: "₹1,15,000", currentPrice: "₹1,29,999", status: "watching", image: "/placeholder.svg" },
  { id: "2", product: "Sony WH-1000XM5", targetPrice: "₹22,000", currentPrice: "₹21,490", status: "triggered", image: "/placeholder.svg" },
  { id: "3", product: "MacBook Air M3", targetPrice: "₹1,00,000", currentPrice: "₹1,14,900", status: "watching", image: "/placeholder.svg" },
];

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
        <meta name="description" content="Set price drop alerts for your favourite products. Get notified when prices hit your target on Bazaar Hub." />
      </Helmet>

      <div className="container py-8 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2"><BellRing className="h-6 w-6 text-primary" /> Price Alerts</h1>
              <p className="text-sm text-muted-foreground">Get notified when prices drop to your target</p>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search alerts..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
          </div>
        </motion.div>

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
                        <span className="text-muted-foreground">Current: <span className="notranslate font-semibold text-foreground">{alert.currentPrice}</span></span>
                        <span className="text-muted-foreground">Target: <span className="notranslate font-semibold text-primary">{alert.targetPrice}</span></span>
                      </div>
                    </div>
                    <Badge variant={alert.status === "triggered" ? "default" : "outline"} className={alert.status === "triggered" ? "bg-green-500 hover:bg-green-600" : ""}>
                      {alert.status === "triggered" ? <><TrendingDown className="h-3 w-3 mr-1" /> Price Dropped!</> : "Watching"}
                    </Badge>
                    <Button variant="ghost" size="icon" onClick={() => removeAlert(alert.id)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default PriceAlertsPage;

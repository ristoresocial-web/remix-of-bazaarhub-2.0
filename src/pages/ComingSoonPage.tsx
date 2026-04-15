import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BazaarLogo from "@/components/BazaarLogo";
import {
  Users, Tag, GitBranch, Image, BarChart3, Search,
  Bell, Rocket, Mail, ArrowLeft, Clock,
} from "lucide-react";
import { toast } from "sonner";

interface FeatureConfig {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

const FEATURES: Record<string, FeatureConfig> = {
  "buyer-management": {
    title: "Buyer Management Dashboard",
    description: "Track your purchase history, manage your wishlist, view your price alerts and earn loyalty rewards.",
    icon: Users,
    color: "text-primary",
  },
  "city-offer-management": {
    title: "City Offer Management for Sellers",
    description: "Manage your pop-up shop listings, update your stall details, and track buyer interest in your city offers.",
    icon: Tag,
    color: "text-success",
  },
  "model-mapping": {
    title: "Model Mapping",
    description: "Automatic linking of your product listings to our master product database for accurate specs and better discovery.",
    icon: GitBranch,
    color: "text-warning",
  },
  "banners-management": {
    title: "Banners Management",
    description: "Upload and manage your homepage advertisement banners. Track impressions, clicks and buyer engagement.",
    icon: Image,
    color: "text-primary",
  },
  "analytics-management": {
    title: "Seller Analytics Dashboard",
    description: "See how many buyers viewed your listings, clicked your contact, set price alerts, and compared your products.",
    icon: BarChart3,
    color: "text-success",
  },
  "seo-management": {
    title: "SEO Management",
    description: "Monitor your search rankings, discover which keywords drive buyers to your listings, and optimise your visibility.",
    icon: Search,
    color: "text-warning",
  },
};

const ComingSoonPage: React.FC = () => {
  const { feature } = useParams<{ feature: string }>();
  const config = feature ? FEATURES[feature] : null;
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!config) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-lg font-semibold text-foreground">Feature not found</p>
          <Link to="/" className="text-primary underline text-sm">Back to Home</Link>
        </div>
      </div>
    );
  }

  const Icon = config.icon;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;
    setSubmitted(true);
    toast.success("You'll be notified when this feature launches!");
  };

  return (
    <div className="min-h-[60vh]">
      <Helmet>
        <title>{config.title} — Coming Soon | BazaarHub</title>
        <meta name="description" content={`${config.title} is coming soon to BazaarHub. ${config.description}`} />
      </Helmet>

      <div className="max-w-2xl mx-auto px-4 py-16 md:py-24">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
        <BazaarLogo className="mb-8" showTagline={false} />

        <div className="rounded-card border border-border bg-card p-8 md:p-12 shadow-card text-center space-y-6">
          {/* Icon */}
          <div className={`inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 ${config.color}`}>
            <Icon className="h-8 w-8" />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-pill bg-warning/10 border border-warning/20 px-4 py-1.5">
            <Clock className="h-3.5 w-3.5 text-warning" />
            <span className="text-xs font-bold text-warning uppercase tracking-wide">Launching Soon</span>
          </div>

          {/* Title & Description */}
          <div className="space-y-3">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{config.title}</h1>
            <p className="text-base text-muted-foreground max-w-md mx-auto leading-relaxed">{config.description}</p>
          </div>

          {/* Notification Signup */}
          <div className="pt-4 border-t border-border">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-3">
                <p className="text-sm font-medium text-foreground flex items-center justify-center gap-1.5">
                  <Bell className="h-4 w-4 text-primary" /> Notify me when this launches
                </p>
                <div className="flex gap-2 max-w-sm mx-auto">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="w-full rounded-input border border-border bg-background py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <Button type="submit" size="sm" className="shrink-0 gap-1">
                    <Rocket className="h-3.5 w-3.5" /> Notify Me
                  </Button>
                </div>
              </form>
            ) : (
              <div className="rounded-input bg-success/10 border border-success/20 p-4 max-w-sm mx-auto">
                <p className="text-sm font-semibold text-success">✅ You're on the list!</p>
                <p className="text-xs text-muted-foreground mt-1">We'll email you as soon as this feature goes live.</p>
              </div>
            )}
          </div>

          {/* Branding */}
          <p className="text-xs text-muted-foreground pt-2">
            <span className="bazaar-logo-text">
              <span className="bazaar-logo-navy">Bazaar</span>
              <span className="bazaar-logo-orange">Hub</span>
            </span>
            {" — "}Your Market. Your Choice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPage;

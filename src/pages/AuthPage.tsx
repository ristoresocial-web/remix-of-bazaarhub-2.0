import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Store } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import PriceTagLogo from "@/components/auth/PriceTagLogo";
import LoginForm from "@/components/auth/LoginForm";
import BuyerRegisterForm from "@/components/auth/BuyerRegisterForm";
import SellerRegisterForm from "@/components/auth/SellerRegisterForm";

type TabValue = "login" | "register";
type RoleValue = "buyer" | "seller";

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { user, profile, loading } = useAuth();

  const initialTab: TabValue = params.get("tab") === "register" ? "register" : "login";
  const initialRole: RoleValue = params.get("role") === "seller" ? "seller" : "buyer";

  const [tab, setTab] = useState<TabValue>(initialTab);
  const [role, setRole] = useState<RoleValue>(initialRole);

  useEffect(() => {
    if (loading) return;
    if (user && profile) {
      if (profile.is_admin || (profile as any).role === "admin") navigate("/admin");
      else if ((profile as any).role === "seller") navigate("/seller/dashboard");
      else navigate("/buyer/dashboard");
    }
  }, [user, profile, loading, navigate]);

  return (
    <>
      <Helmet>
        <title>Login or Register — Bazaar Hub</title>
        <meta
          name="description"
          content="Log in or sign up to Bazaar Hub. Buyers compare prices and set alerts; sellers list products and reach local customers."
        />
      </Helmet>

      <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-gradient-to-br from-bh-orange-light/40 via-bh-bg to-bh-green-light/30">
        {/* decorative glows */}
        <div className="pointer-events-none absolute -top-32 -left-20 h-80 w-80 rounded-full bg-bh-orange/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-bh-green/15 blur-3xl" />

        <div className="container relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">
          <div className="w-full max-w-md">
            <div className="mb-6 flex flex-col items-center text-center">
              <PriceTagLogo size={56} />
              <h1 className="mt-3 font-display text-3xl font-bold text-bh-text">
                <span className="text-bh-orange">Bazaar</span>
                <span className="text-bh-green">Hub</span>
              </h1>
              <p className="mt-1 text-sm italic text-bh-text-secondary">
                Empowering Your Market Choices
              </p>
            </div>

            <div className="rounded-3xl border border-bh-border bg-bh-surface/95 backdrop-blur-xl p-5 shadow-bh-lg sm:p-6">
              <Tabs value={tab} onValueChange={(v) => setTab(v as TabValue)} className="w-full">
                <TabsList className="grid w-full grid-cols-2 rounded-pill bg-bh-surface-2 p-1">
                  <TabsTrigger value="login" className="rounded-pill data-[state=active]:bg-bh-orange data-[state=active]:text-white data-[state=active]:shadow-price font-semibold">Login</TabsTrigger>
                  <TabsTrigger value="register" className="rounded-pill data-[state=active]:bg-bh-orange data-[state=active]:text-white data-[state=active]:shadow-price font-semibold">Register</TabsTrigger>
                </TabsList>

                <AnimatePresence mode="wait">
                  <TabsContent value="login" key="login" forceMount={tab === "login" ? true : undefined}>
                    {tab === "login" && (
                      <motion.div
                        key="login-pane"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="mt-5"
                      >
                        <LoginForm />
                      </motion.div>
                    )}
                  </TabsContent>

                  <TabsContent value="register" key="register" forceMount={tab === "register" ? true : undefined}>
                    {tab === "register" && (
                      <motion.div
                        key="register-pane"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="mt-5 space-y-5"
                      >
                        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-bh-surface-2 p-1">
                          <button
                            type="button"
                            onClick={() => setRole("buyer")}
                            className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                              role === "buyer"
                                ? "bg-white text-bh-orange shadow-bh-sm"
                                : "text-bh-text-secondary hover:text-bh-text"
                            }`}
                          >
                            <ShoppingBag className="h-4 w-4" /> I am a Buyer
                          </button>
                          <button
                            type="button"
                            onClick={() => setRole("seller")}
                            className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                              role === "seller"
                                ? "bg-white text-bh-orange shadow-bh-sm"
                                : "text-bh-text-secondary hover:text-bh-text"
                            }`}
                          >
                            <Store className="h-4 w-4" /> I am a Seller
                          </button>
                        </div>

                        <AnimatePresence mode="wait">
                          <motion.div
                            key={role}
                            initial={{ opacity: 0, x: role === "buyer" ? -8 : 8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: role === "buyer" ? 8 : -8 }}
                            transition={{ duration: 0.18 }}
                          >
                            {role === "buyer" ? <BuyerRegisterForm /> : <SellerRegisterForm />}
                          </motion.div>
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </TabsContent>
                </AnimatePresence>
              </Tabs>
            </div>

            <p className="mt-4 text-center text-[11px] text-bh-text-muted">
              By continuing, you agree to our{" "}
              <a href="/terms" className="font-semibold text-bh-orange hover:underline">
                Terms
              </a>{" "}
              and{" "}
              <a href="/privacy" className="font-semibold text-bh-orange hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPage;

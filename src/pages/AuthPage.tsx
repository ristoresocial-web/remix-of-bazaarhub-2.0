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

      <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="mb-6 flex flex-col items-center text-center">
            <PriceTagLogo size={56} />
            <h1 className="mt-3 text-2xl font-bold text-foreground">Bazaar Hub</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Empowering Your Market Choices
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
            <Tabs value={tab} onValueChange={(v) => setTab(v as TabValue)} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
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
                      <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-1">
                        <button
                          type="button"
                          onClick={() => setRole("buyer")}
                          className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all ${
                            role === "buyer"
                              ? "bg-card text-primary shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <ShoppingBag className="h-4 w-4" /> I am a Buyer
                        </button>
                        <button
                          type="button"
                          onClick={() => setRole("seller")}
                          className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all ${
                            role === "seller"
                              ? "bg-card text-primary shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
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

          <p className="mt-4 text-center text-[11px] text-muted-foreground">
            By continuing, you agree to our{" "}
            <a href="/terms" className="underline hover:text-foreground">
              Terms
            </a>{" "}
            and{" "}
            <a href="/privacy" className="underline hover:text-foreground">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </>
  );
};

export default AuthPage;

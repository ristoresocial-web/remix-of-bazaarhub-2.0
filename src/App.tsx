import React, { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AnimatePresence } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppProvider } from "@/contexts/AppContext";
import Navbar from "@/components/Navbar";
import MobileBottomNav from "@/components/MobileBottomNav";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ChatbotWidget from "@/components/ChatbotWidget";
import ScrollToTop from "@/components/ScrollToTop";
import LoadingFallback from "@/components/LoadingFallback";

// Eager-loaded pages
import Index from "./pages/Index";
import ProductPage from "./pages/ProductPage";
import CityOffersPage from "./pages/CityOffersPage";
import FindSellersPage from "./pages/FindSellersPage";
import BuyerLoginPage from "./pages/BuyerLoginPage";
import BuyerDashboardPage from "./pages/BuyerDashboardPage";
import AuthPage from "./pages/AuthPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import NotFound from "./pages/NotFound";
import ComingSoonPage from "./pages/ComingSoonPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import SellerTermsPage from "./pages/SellerTermsPage";
import SellerProfilePage from "./pages/SellerProfilePage";
import BecomeSellerPage from "./pages/BecomeSellerPage";
import PriceAlertsPage from "./pages/PriceAlertsPage";
import ContactPage from "./pages/ContactPage";
import FAQPage from "./pages/FAQPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import SitemapPage from "./pages/SitemapPage";
import AboutPage from "./pages/AboutPage";
import SellerLoginPage from "./pages/SellerLoginPage";

// Lazy-loaded heavy pages
const SearchPage = lazy(() => import("./pages/SearchPage"));
const ComparePage = lazy(() => import("./pages/ComparePage"));
const SellerRegisterPage = lazy(() => import("./pages/SellerRegisterPage"));
const SellerDashboardPage = lazy(() => import("./pages/SellerDashboardPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/seller/dashboard") || location.pathname.startsWith("/admin");

  return (
    <>
      {!isDashboard && <Navbar />}
      <main className="min-h-screen pb-16 md:pb-0">
        <Suspense fallback={<LoadingFallback />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageTransition><Index /></PageTransition>} />
              <Route path="/search" element={<PageTransition><SearchPage /></PageTransition>} />
              <Route path="/product/:id/:slug" element={<PageTransition><ProductPage /></PageTransition>} />
              <Route path="/product/compare" element={<PageTransition><ComparePage /></PageTransition>} />
              <Route path="/compare" element={<PageTransition><ComparePage /></PageTransition>} />
              <Route path="/city-offers" element={<PageTransition><CityOffersPage /></PageTransition>} />
              <Route path="/offers" element={<PageTransition><CityOffersPage /></PageTransition>} />
              <Route path="/city-offers/food" element={<PageTransition><CityOffersPage /></PageTransition>} />
              <Route path="/find-sellers" element={<PageTransition><FindSellersPage /></PageTransition>} />
              <Route path="/auth" element={<PageTransition><AuthPage /></PageTransition>} />
              <Route path="/forgot-password" element={<PageTransition><ForgotPasswordPage /></PageTransition>} />
              <Route path="/reset-password" element={<PageTransition><ResetPasswordPage /></PageTransition>} />
              <Route path="/account/change-password" element={<PageTransition><ChangePasswordPage /></PageTransition>} />
              <Route path="/seller/register" element={<PageTransition><SellerRegisterPage /></PageTransition>} />
              <Route path="/login" element={<PageTransition><SellerLoginPage /></PageTransition>} />
              <Route path="/seller/dashboard" element={<PageTransition><SellerDashboardPage /></PageTransition>} />
              <Route path="/admin" element={<PageTransition><AdminPage /></PageTransition>} />
              <Route path="/buyer/login" element={<PageTransition><BuyerLoginPage /></PageTransition>} />
              <Route path="/buyer/dashboard" element={<PageTransition><BuyerDashboardPage /></PageTransition>} />
              <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
              <Route path="/terms" element={<PageTransition><TermsPage /></PageTransition>} />
              <Route path="/privacy" element={<PageTransition><PrivacyPage /></PageTransition>} />
              <Route path="/seller-terms" element={<PageTransition><SellerTermsPage /></PageTransition>} />
              <Route path="/seller/:id" element={<PageTransition><SellerProfilePage /></PageTransition>} />
              <Route path="/become-seller" element={<PageTransition><BecomeSellerPage /></PageTransition>} />
              <Route path="/price-alerts" element={<PageTransition><PriceAlertsPage /></PageTransition>} />
              <Route path="/alerts" element={<PageTransition><PriceAlertsPage /></PageTransition>} />
              <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
              <Route path="/faq" element={<PageTransition><FAQPage /></PageTransition>} />
              <Route path="/blog" element={<PageTransition><BlogPage /></PageTransition>} />
              <Route path="/blog/:slug" element={<PageTransition><BlogPostPage /></PageTransition>} />
              <Route path="/sitemap" element={<PageTransition><SitemapPage /></PageTransition>} />
              <Route path="/coming-soon/:feature" element={<PageTransition><ComingSoonPage /></PageTransition>} />
              <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>
      {!isDashboard && <Footer />}
      {!isDashboard && <MobileBottomNav />}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <LanguageProvider>
        <AppProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AuthProvider>
                <AnimatedRoutes />
                <WhatsAppButton />
                <ChatbotWidget />
                <ScrollToTop />
              </AuthProvider>
            </BrowserRouter>
          </TooltipProvider>
        </AppProvider>
      </LanguageProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;

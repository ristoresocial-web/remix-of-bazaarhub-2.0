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
import Navbar from "@/components/Navbar";
import MobileBottomNav from "@/components/MobileBottomNav";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ChatbotWidget from "@/components/ChatbotWidget";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import SearchPage from "./pages/SearchPage";
import ProductPage from "./pages/ProductPage";
import ComparePage from "./pages/ComparePage";
import CityOffersPage from "./pages/CityOffersPage";
import FindSellersPage from "./pages/FindSellersPage";
import SellerRegisterPage from "./pages/SellerRegisterPage";
import SellerDashboardPage from "./pages/SellerDashboardPage";
import AdminPage from "./pages/AdminPage";
import AboutPage from "./pages/AboutPage";
import BuyerLoginPage from "./pages/BuyerLoginPage";
import BuyerDashboardPage from "./pages/BuyerDashboardPage";
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
import SitemapPage from "./pages/SitemapPage";
import SellerLoginPage from "./pages/SellerLoginPage";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <main className="min-h-screen pb-16 md:pb-0">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Index /></PageTransition>} />
          <Route path="/search" element={<PageTransition><SearchPage /></PageTransition>} />
          <Route path="/product/:id/:slug" element={<PageTransition><ProductPage /></PageTransition>} />
          <Route path="/product/compare" element={<PageTransition><ComparePage /></PageTransition>} />
          <Route path="/city-offers" element={<PageTransition><CityOffersPage /></PageTransition>} />
          <Route path="/city-offers/food" element={<PageTransition><CityOffersPage /></PageTransition>} />
          <Route path="/find-sellers" element={<PageTransition><FindSellersPage /></PageTransition>} />
          <Route path="/seller/register" element={<PageTransition><SellerRegisterPage /></PageTransition>} />
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
          <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
          <Route path="/faq" element={<PageTransition><FAQPage /></PageTransition>} />
          <Route path="/blog" element={<PageTransition><BlogPage /></PageTransition>} />
          <Route path="/sitemap" element={<PageTransition><SitemapPage /></PageTransition>} />
          <Route path="/coming-soon/:feature" element={<PageTransition><ComingSoonPage /></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </main>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <Navbar />
              <AnimatedRoutes />
              <Footer />
              <MobileBottomNav />
              <WhatsAppButton />
              <ChatbotWidget />
              <ScrollToTop />
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;

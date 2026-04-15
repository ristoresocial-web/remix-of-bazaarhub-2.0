import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, Link } from "react-router-dom";
import { Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import BazaarLogo from "@/components/BazaarLogo";

const SellerLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  const validPhone = /^[6-9]\d{9}$/.test(phone);

  const sendOTP = () => {
    setOtpSent(true);
    setCountdown(45);
  };

  const verifyOTP = () => {
    setVerifying(true);
    setTimeout(() => navigate("/seller/dashboard"), 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 pb-20 md:pb-0">
      <Helmet>
        <title>Seller Login — Bazaar Hub</title>
        <meta name="description" content="Log in to your Bazaar Hub seller account." />
      </Helmet>

      <div className="w-full max-w-md rounded-2xl border bg-card shadow-card p-8 space-y-6">
        {/* Logo & tagline */}
        <div className="text-center space-y-1">
          <div className="flex justify-center"><BazaarLogo /></div>
          <p className="text-sm text-muted-foreground italic">Your Town. Your Price.</p>
        </div>

        <div className="h-px bg-border" />

        {!otpSent ? (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-foreground text-center">Welcome Back</h2>

            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">Phone Number</label>
              <div className="flex gap-2">
                <span className="flex items-center rounded-input border border-border bg-muted px-3 text-sm font-medium text-muted-foreground">+91</span>
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="w-full rounded-input border border-border bg-background py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring focus:border-primary"
                    placeholder="98765 43210"
                    maxLength={10}
                    inputMode="numeric"
                  />
                </div>
              </div>
            </div>

            <Button onClick={sendOTP} disabled={!validPhone} className="w-full" size="lg">
              Send OTP <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <h2 className="text-lg font-bold text-foreground">Enter OTP</h2>
              <p className="text-sm text-muted-foreground">
                Sent to +91 {phone.slice(0, 5)} {phone.slice(5)}
              </p>
              <button onClick={() => { setOtpSent(false); setOtp(""); }} className="text-xs text-primary font-medium hover:underline">
                Change number
              </button>
            </div>

            <div className="flex justify-center">
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button onClick={verifyOTP} disabled={otp.length < 6 || verifying} className="w-full" size="lg">
              {verifying ? "Verifying..." : "Verify OTP"}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              {countdown > 0 ? (
                <>Resend in 0:{countdown.toString().padStart(2, "0")}</>
              ) : (
                <button onClick={sendOTP} className="text-primary font-medium hover:underline">Resend OTP</button>
              )}
            </p>
          </div>
        )}

        <div className="h-px bg-border" />

        <div className="text-center space-y-2 text-sm">
          <p className="text-muted-foreground">
            New seller?{" "}
            <Link to="/seller/register" className="text-primary font-semibold hover:underline">Register here</Link>
          </p>
          <p className="text-muted-foreground">
            Buyer?{" "}
            <Link to="/buyer/login" className="text-primary font-semibold hover:underline">Continue as Buyer</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellerLoginPage;

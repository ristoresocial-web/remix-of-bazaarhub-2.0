import React, { useEffect, useRef, useState } from "react";
import { Loader2, ArrowLeft } from "lucide-react";

interface OtpVerifyStepProps {
  mobile: string;
  loading: boolean;
  error: string;
  onVerify: (code: string) => void;
  onResend: () => void | Promise<void>;
  onBack: () => void;
  adminBypass?: boolean;
}

const OtpVerifyStep: React.FC<OtpVerifyStepProps> = ({
  mobile,
  loading,
  error,
  onVerify,
  onResend,
  onBack,
  adminBypass,
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [secondsLeft, setSecondsLeft] = useState(30);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft]);

  const handleChange = (i: number, val: string) => {
    if (val.length > 1) val = val[val.length - 1];
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
    if (next.every((d) => d) && next.join("").length === 6) {
      onVerify(next.join(""));
    }
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const handleResend = async () => {
    setOtp(["", "", "", "", "", ""]);
    setSecondsLeft(30);
    await onResend();
    refs.current[0]?.focus();
  };

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back
      </button>
      <div className="text-center">
        <h2 className="text-lg font-bold text-foreground">Verify your mobile</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          OTP sent via SMS to{" "}
          <strong className="notranslate">+91 {mobile}</strong>
        </p>
        {adminBypass && (
          <p className="mt-1 text-[11px] text-primary">
            Admin bypass active — enter <span className="notranslate font-mono">999999</span>
          </p>
        )}
      </div>

      <div className="mx-auto flex justify-center gap-2">
        {otp.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="h-12 w-10 rounded-lg border border-input bg-background text-center text-lg font-bold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        ))}
      </div>

      {error && <p className="text-center text-xs text-destructive">{error}</p>}

      <button
        onClick={() => onVerify(otp.join(""))}
        disabled={loading || otp.join("").length !== 6}
        className="h-11 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-all duration-200 hover:bg-[hsl(var(--primary-dark))] disabled:opacity-50"
      >
        {loading ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : "Verify & Create Account"}
      </button>

      <div className="text-center">
        {secondsLeft > 0 ? (
          <p className="text-xs text-muted-foreground">
            Resend OTP in <span className="notranslate">{secondsLeft}s</span>
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={loading}
            className="text-xs font-semibold text-primary hover:underline disabled:opacity-50"
          >
            Resend OTP
          </button>
        )}
      </div>
    </div>
  );
};

export default OtpVerifyStep;

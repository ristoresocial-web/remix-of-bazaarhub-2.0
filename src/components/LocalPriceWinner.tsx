import React from "react";
import { motion } from "framer-motion";

interface LocalPriceWinnerProps {
  localLowest: number | null;
  onlineLowest: number | null;
  city: string;
}

const LocalPriceWinner: React.FC<LocalPriceWinnerProps> = ({ localLowest, onlineLowest, city }) => {
  if (!localLowest || !onlineLowest) return null;

  const diff = Math.abs(localLowest - onlineLowest);
  const formattedDiff = `₹${diff.toLocaleString("en-IN")}`;

  if (diff <= 100) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="rounded-lg bg-primary/10 border border-primary/20 p-3 text-sm"
      >
        <span className="font-semibold">⚖️ Same price via city partner and online</span>
        <span className="text-muted-foreground ml-1">— visit your city partner for instant pickup!</span>
      </motion.div>
    );
  }

  if (localLowest < onlineLowest) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="rounded-lg bg-[hsl(var(--success))]/10 border border-[hsl(var(--success))]/20 p-3 text-sm"
      >
        <span className="font-semibold text-[hsl(var(--success))]">
          💚 {city} City Partners beat online by {formattedDiff}!
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-lg bg-[hsl(var(--warning))]/10 border border-[hsl(var(--warning))]/20 p-3 text-sm"
    >
      <span className="font-semibold text-[hsl(var(--warning-foreground))]">
        🌐 Online is cheaper by {formattedDiff}.
      </span>
      <span className="text-muted-foreground ml-1">Check city partners for faster delivery!</span>
    </motion.div>
  );
};

export default LocalPriceWinner;

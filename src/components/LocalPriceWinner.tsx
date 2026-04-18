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
        className="rounded-2xl bg-bh-orange-light border border-bh-orange/20 p-3 text-sm"
      >
        <span className="font-display font-bold text-bh-orange-dark">⚖️ Same price — local & online</span>
        <span className="text-bh-text-secondary ml-1">— pick up locally for instant delivery!</span>
      </motion.div>
    );
  }

  if (localLowest < onlineLowest) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="rounded-2xl bg-bh-green-light/60 border border-bh-green/20 p-3 text-sm"
      >
        <span className="font-display font-bold text-bh-green-dark">
          💚 {city} City Partners beat online by{" "}
          <span className="font-mono notranslate">{formattedDiff}</span>!
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-2xl bg-bh-blue-light border border-bh-blue/20 p-3 text-sm"
    >
      <span className="font-display font-bold text-bh-blue">
        🌐 Online is cheaper by <span className="font-mono notranslate">{formattedDiff}</span>
      </span>
      <span className="text-bh-text-secondary ml-1">— or pick up locally for faster delivery!</span>
    </motion.div>
  );
};

export default LocalPriceWinner;

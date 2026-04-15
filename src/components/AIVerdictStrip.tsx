import React from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

interface AIVerdictStripProps {
  modelA: { name: string; score: number; verdict?: string };
  modelB: { name: string; score: number; verdict?: string };
  city: string;
}

const AIVerdictStrip: React.FC<AIVerdictStripProps> = ({ modelA, modelB, city }) => {
  const winner = modelA.score >= modelB.score ? modelA : modelB;
  const loser = modelA.score >= modelB.score ? modelB : modelA;

  const shareText = encodeURIComponent(
    `AI says ${winner.name} scores ${winner.score}/100 in ${city}! Check it on BazaarHub`
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-gradient-to-r from-primary to-[hsl(var(--success))] p-5 text-white"
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">🤖</span>
        <div className="flex-1 space-y-2">
          <p className="font-bold text-base">
            BazaarHub AI Verdict: {winner.name} wins for value in {city}.
          </p>
          <p className="text-sm text-white/90">
            Score {winner.score} vs {loser.score}.{" "}
            {winner.verdict || "Better overall value proposition."}
          </p>
          <p className="text-[10px] text-white/60">
            This analysis is AI-generated based on specs, price & local availability.
          </p>
          <a
            href={`https://wa.me/?text=${shareText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/30 transition-colors"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Share this comparison
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default AIVerdictStrip;

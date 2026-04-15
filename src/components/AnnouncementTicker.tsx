import React from "react";
import { Link } from "react-router-dom";
import { Megaphone } from "lucide-react";
import { getActiveTickerMessages, DEFAULT_TICKER_TEXT } from "@/data/tickerData";

const AnnouncementTicker: React.FC = () => {
  const messages = getActiveTickerMessages();

  return (
    <div
      className="w-full overflow-hidden"
      style={{ backgroundColor: "#8E24AA" }}
    >
      <div className="group relative flex items-center h-8">
        <div
          className="animate-marquee whitespace-nowrap group-hover:[animation-play-state:paused]"
          style={{ display: "inline-flex", gap: 0 }}
        >
          {[0, 1].map((copy) => (
            <span key={copy} className="inline-flex items-center">
              {messages.length > 0 ? (
                messages.map((m, i) => (
                  <span key={`${copy}-${i}`} className="inline-flex items-center">
                    {/* BazaarHub official icon */}
                    <Megaphone className="mr-1.5 h-3 w-3 text-white/80" />
                    <span className="mr-1 rounded bg-white/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white/70">
                      BazaarHub
                    </span>
                    {m.link ? (
                      <Link
                        to={m.link}
                        className="font-[Arial,sans-serif] text-[13px] font-bold text-white hover:underline"
                      >
                        {m.text}
                      </Link>
                    ) : (
                      <span className="font-[Arial,sans-serif] text-[13px] font-bold text-white">
                        {m.text}
                      </span>
                    )}
                    <span className="mx-6 font-[Arial,sans-serif] text-[13px] text-white/60">
                      •
                    </span>
                  </span>
                ))
              ) : (
                <span
                  key={copy}
                  className="inline-flex items-center"
                >
                  <Megaphone className="mr-1.5 h-3 w-3 text-white/80" />
                  <span className="mr-1 rounded bg-white/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white/70">
                    BazaarHub
                  </span>
                  <span className="font-[Arial,sans-serif] text-[13px] font-bold text-white">
                    {DEFAULT_TICKER_TEXT}
                  </span>
                  <span className="mx-6 text-white/60">•</span>
                </span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementTicker;

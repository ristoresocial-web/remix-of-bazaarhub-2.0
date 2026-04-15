export const TICKER_CATEGORIES = [
  "New Feature",
  "City Launch",
  "Milestone",
  "Seasonal Greeting",
  "Platform Offer",
  "General Announcement",
] as const;

export type TickerCategory = (typeof TICKER_CATEGORIES)[number];

export const MAX_TICKER_LENGTH = 120;
export const MAX_ACTIVE_MESSAGES = 10;

export interface TickerMessage {
  id: string;
  text: string;
  category: TickerCategory;
  link?: string;
  active: boolean;
  order: number;
}

const STORAGE_KEY = "bazaarhub_ticker_messages";

const DEFAULT_MESSAGES: TickerMessage[] = [
  { id: "1", text: "BazaarHub now live in 50+ cities across India!", category: "City Launch", active: true, order: 1 },
  { id: "2", text: "New Feature: Compare TVs, ACs and Laptops side-by-side!", category: "New Feature", link: "/product/compare", active: true, order: 2 },
  { id: "3", text: "Happy Pongal from BazaarHub! Great deals in your city today.", category: "Seasonal Greeting", active: true, order: 3 },
  { id: "4", text: "BazaarHub Food Festival listings now available in Madurai!", category: "Platform Offer", link: "/city-offers/food", active: true, order: 4 },
  { id: "5", text: "1 Lakh price comparisons completed on BazaarHub!", category: "Milestone", active: true, order: 5 },
];

export function getTickerMessages(): TickerMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as TickerMessage[];
      // Migrate old messages without category
      return parsed.map((m) => ({
        ...m,
        category: m.category || "General Announcement",
      }));
    }
  } catch {}
  return DEFAULT_MESSAGES;
}

export function saveTickerMessages(messages: TickerMessage[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

export function getActiveTickerMessages(): TickerMessage[] {
  return getTickerMessages()
    .filter((m) => m.active)
    .sort((a, b) => a.order - b.order);
}

export function getActiveCount(): number {
  return getTickerMessages().filter((m) => m.active).length;
}

export const DEFAULT_TICKER_TEXT =
  "Your Market. Your Choice. — Compare prices from local shops and online platforms near you!";

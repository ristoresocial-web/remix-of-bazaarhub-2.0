// Buyer authentication utilities — now backed by Supabase auth
// Legacy exports maintained for backward compatibility

export interface BuyerProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  mobile: string;
  city: string;
  language: string;
  isAdmin: boolean;
  registrationComplete: boolean;
  createdAt: string;
}

const ADMIN_PHONE = "9943440384";

/** @deprecated Use useAuth() hook instead */
export function getBuyer(): BuyerProfile | null {
  try {
    const raw = localStorage.getItem("bazaarhub_buyer");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** @deprecated Use useAuth().signOut() instead */
export function logoutBuyer() {
  localStorage.removeItem("bazaarhub_buyer");
}

/** @deprecated Use useAuth().isLoggedIn instead */
export function isLoggedIn(): boolean {
  return !!getBuyer();
}

export function isAdminPhone(phone: string): boolean {
  return phone.replace(/\s/g, "") === ADMIN_PHONE;
}

export function generateOTP(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// Mock OTP store (in-memory, resets on refresh)
let otpStore: { value: string; expiresAt: number; attempts: number } | null = null;

export function storeOTP(otp: string) {
  otpStore = { value: otp, expiresAt: Date.now() + 10 * 60 * 1000, attempts: 0 };
}

export function verifyOTP(input: string): { valid: boolean; error?: string } {
  if (!otpStore) return { valid: false, error: "No OTP generated" };
  if (Date.now() > otpStore.expiresAt) return { valid: false, error: "OTP expired" };
  if (otpStore.attempts >= 3) return { valid: false, error: "Max attempts exceeded. Please request a new OTP." };
  otpStore.attempts++;
  if (otpStore.value !== input) return { valid: false, error: `Invalid OTP (${3 - otpStore.attempts} attempts left)` };
  otpStore = null;
  return { valid: true };
}

export function saveBuyer(profile: BuyerProfile) {
  localStorage.setItem("bazaarhub_buyer", JSON.stringify(profile));
}

export function createPartialProfile(method: "email" | "whatsapp" | "google", identifier: string): BuyerProfile {
  return {
    id: crypto.randomUUID(),
    name: "",
    username: "",
    email: method === "email" || method === "google" ? identifier : "",
    mobile: method === "whatsapp" ? identifier : "",
    city: localStorage.getItem("bazaarhub_city") || "Madurai",
    language: "en",
    isAdmin: method === "whatsapp" && isAdminPhone(identifier),
    registrationComplete: false,
    createdAt: new Date().toISOString(),
  };
}

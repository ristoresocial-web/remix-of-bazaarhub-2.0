import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["DM Sans", "Poppins", "sans-serif"],
        display: ["Syne", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
        mono: ["DM Mono", "ui-monospace", "monospace"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          dark: "hsl(var(--primary-dark))",
          light: "hsl(var(--primary-light))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
          light: "hsl(var(--destructive-light))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
          light: "hsl(var(--success-light))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        navy: {
          DEFAULT: "hsl(var(--navy))",
          deep: "hsl(var(--navy-deep))",
        },
        orange: {
          DEFAULT: "hsl(var(--orange))",
          light: "hsl(var(--orange-light))",
          dark: "hsl(var(--orange-dark))",
          deep: "hsl(var(--orange-deep))",
        },
        bh: {
          orange: "hsl(var(--bh-orange))",
          "orange-light": "hsl(var(--bh-orange-light))",
          "orange-dark": "hsl(var(--bh-orange-dark))",
          green: "hsl(var(--bh-green))",
          "green-light": "hsl(var(--bh-green-light))",
          "green-dark": "hsl(var(--bh-green-dark))",
          blue: "hsl(var(--bh-blue))",
          "blue-light": "hsl(var(--bh-blue-light))",
          bg: "hsl(var(--bh-bg))",
          surface: "hsl(var(--bh-surface))",
          "surface-2": "hsl(var(--bh-surface-2))",
          border: "hsl(var(--bh-border))",
          sidebar: "hsl(var(--bh-sidebar))",
          "sidebar-text": "hsl(var(--bh-sidebar-text))",
          "sidebar-muted": "hsl(var(--bh-sidebar-muted))",
          text: "hsl(var(--bh-text-primary))",
          "text-secondary": "hsl(var(--bh-text-secondary))",
          "text-muted": "hsl(var(--bh-text-muted))",
          "price-local": "hsl(var(--bh-price-local))",
          "price-online": "hsl(var(--bh-price-online))",
          "price-savings": "hsl(var(--bh-price-savings))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        pill: "9999px",
        card: "var(--radius)",
        input: "var(--radius-input)",
        "2xl": "16px",
        "3xl": "24px",
      },
      boxShadow: {
        card: "var(--shadow-md)",
        "card-hover": "var(--shadow-hover)",
        price: "var(--bh-shadow-price)",
        bh: "var(--bh-shadow-md)",
        "bh-sm": "var(--bh-shadow-sm)",
        "bh-lg": "var(--bh-shadow-lg)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "fade-in": "fade-in 0.3s ease-out",
        marquee: "marquee 25s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

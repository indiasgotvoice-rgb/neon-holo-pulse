import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: {
          DEFAULT: "hsl(var(--background))",
          secondary: "hsl(var(--background-secondary))",
        },
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
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
        neon: {
          cyan: "hsl(var(--neon-cyan))",
          blue: "hsl(var(--neon-blue))",
          green: "hsl(var(--neon-green))",
          purple: "hsl(var(--neon-purple))",
          magenta: "hsl(var(--neon-magenta))",
        },
        glow: {
          cyan: "hsl(var(--glow-cyan))",
          blue: "hsl(var(--glow-blue))",
          purple: "hsl(var(--glow-purple))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        "neon-pulse": {
          "0%, 100%": {
            textShadow: "0 0 10px hsl(var(--glow-cyan) / 0.8), 0 0 20px hsl(var(--glow-cyan) / 0.6), 0 0 30px hsl(var(--glow-cyan) / 0.4)",
            filter: "brightness(1)",
          },
          "50%": {
            textShadow: "0 0 15px hsl(var(--glow-cyan) / 1), 0 0 30px hsl(var(--glow-cyan) / 0.8), 0 0 45px hsl(var(--glow-cyan) / 0.6)",
            filter: "brightness(1.2)",
          },
        },
        "logo-rotate": {
          "0%, 100%": { transform: "rotate(-2deg) scale(1)" },
          "50%": { transform: "rotate(2deg) scale(1.05)" },
        },
        "matrix-fall": {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateY(100vh)", opacity: "0" },
        },
        "particle-float": {
          "0%, 100%": { transform: "translate(0, 0)" },
          "25%": { transform: "translate(10px, -10px)" },
          "50%": { transform: "translate(-5px, 5px)" },
          "75%": { transform: "translate(-10px, -5px)" },
        },
        "volumetric-pulse": {
          "0%, 100%": { opacity: "0.1", transform: "scale(1)" },
          "50%": { opacity: "0.2", transform: "scale(1.1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "neon-pulse": "neon-pulse 2.2s ease-in-out infinite",
        "logo-rotate": "logo-rotate 4s ease-in-out infinite",
        "matrix-fall": "matrix-fall linear infinite",
        "particle-float": "particle-float 6s ease-in-out infinite",
        "volumetric-pulse": "volumetric-pulse 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

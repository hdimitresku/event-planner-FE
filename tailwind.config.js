/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
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
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        // Warm earth tone color aliases
        "warm-cream": "hsl(30 15% 95%)",
        "deep-brown": "hsl(25 20% 25%)",
        "rich-taupe": "hsl(25 25% 40%)",
        "warm-mushroom": "hsl(28 18% 60%)",
        "warm-sand": "hsl(35 30% 70%)",
        "soft-taupe": "hsl(30 15% 85%)",
        "warm-gray": "hsl(25 15% 50%)",
        // Chart colors with warm tones
        chart: {
          1: "hsl(25 25% 40%)", // Rich taupe
          2: "hsl(28 18% 60%)", // Warm mushroom
          3: "hsl(35 30% 70%)", // Warm sand
          4: "hsl(30 15% 85%)", // Soft taupe
          5: "hsl(25 15% 50%)", // Warm gray
        },
        // Sidebar colors with warm tones
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
      },
      boxShadow: {
        soft: "0 1px 3px rgba(107, 95, 84, 0.1), 0 1px 2px rgba(107, 95, 84, 0.06)",
        medium: "0 4px 6px -1px rgba(107, 95, 84, 0.1), 0 2px 4px -1px rgba(107, 95, 84, 0.06)",
        large: "0 10px 15px -3px rgba(107, 95, 84, 0.1), 0 4px 6px -2px rgba(107, 95, 84, 0.05)",
        hover: "0 10px 25px -5px rgba(107, 95, 84, 0.15), 0 8px 10px -6px rgba(107, 95, 84, 0.1)",
        "hover-dark": "0 10px 25px -5px rgba(184, 166, 144, 0.3), 0 8px 10px -6px rgba(184, 166, 144, 0.2)",
      },
      container: {
        center: true,
        padding: "2rem",
        screens: {
          "2xl": "1400px",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "loading-dots": "loadingDots 1.4s infinite ease-in-out both",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        slideDown: {
          from: { transform: "translateY(-100%)" },
          to: { transform: "translateY(0)" },
        },
        loadingDots: {
          "0%, 80%, 100%": { transform: "scale(0)" },
          "40%": { transform: "scale(1)" },
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

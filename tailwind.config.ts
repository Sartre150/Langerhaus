import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-nunito)', 'Nunito', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'monospace'],
      },
      colors: {
        bg: {
          primary: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          card: "var(--bg-card)",
          hover: "var(--bg-hover)",
        },
        neon: {
          cyan: "var(--neon-cyan)",
          purple: "var(--neon-purple)",
          pink: "var(--neon-pink)",
          green: "var(--neon-green)",
          orange: "var(--neon-orange)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
      },
      borderRadius: {
        theme: "var(--radius-base)",
        "theme-lg": "var(--radius-lg)",
        "theme-xl": "var(--radius-xl)",
      },
      boxShadow: {
        "soft": "0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)",
        "card": "0 1px 3px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)",
        "elevated": "0 4px 12px rgba(0,0,0,0.1), 0 16px 48px rgba(0,0,0,0.08)",
        "neon-cyan": "0 2px 12px color-mix(in srgb, var(--neon-cyan) 15%, transparent)",
        "neon-purple": "0 2px 12px color-mix(in srgb, var(--neon-purple) 15%, transparent)",
        "neon-green": "0 2px 12px color-mix(in srgb, var(--neon-green) 15%, transparent)",
      },
      animation: {
        "pulse-warm": "pulseWarm 2s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "shake": "shake 0.5s ease-in-out",
      },
      keyframes: {
        pulseWarm: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        glow: {
          "0%": { boxShadow: "0 2px 8px color-mix(in srgb, var(--neon-cyan) 10%, transparent)" },
          "100%": { boxShadow: "0 4px 20px color-mix(in srgb, var(--neon-cyan) 20%, transparent)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-4px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(4px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

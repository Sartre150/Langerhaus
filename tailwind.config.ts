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
        "neon-cyan": "0 0 15px color-mix(in srgb, var(--neon-cyan) 30%, transparent), 0 0 40px color-mix(in srgb, var(--neon-cyan) 10%, transparent)",
        "neon-purple": "0 0 15px color-mix(in srgb, var(--neon-purple) 30%, transparent), 0 0 40px color-mix(in srgb, var(--neon-purple) 10%, transparent)",
        "neon-green": "0 0 15px color-mix(in srgb, var(--neon-green) 30%, transparent), 0 0 40px color-mix(in srgb, var(--neon-green) 10%, transparent)",
      },
      animation: {
        "pulse-neon": "pulseNeon 2s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "shake": "shake 0.5s ease-in-out",
      },
      keyframes: {
        pulseNeon: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px color-mix(in srgb, var(--neon-cyan) 20%, transparent)" },
          "100%": { boxShadow: "0 0 20px color-mix(in srgb, var(--neon-cyan) 60%, transparent)" },
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

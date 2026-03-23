"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

export type ThemeId =
  | "cyberpunk" | "solarpunk" | "neobrutal" | "bauhaus" | "midnight" | "retrowave"
  | "dark-academia" | "nordic" | "obsidian" | "forest" | "ink" | "ember";

export interface ThemeInfo {
  id: ThemeId;
  name: string;
  description: string;
  preview: { bg: string; accent: string; accent2: string; text: string };
}

export const themes: ThemeInfo[] = [
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    description: "Neón futurista con tonos oscuros y brillos eléctricos",
    preview: { bg: "#0a0a0f", accent: "#00f0ff", accent2: "#b24bff", text: "#e8e8f0" },
  },
  {
    id: "solarpunk",
    name: "Solarpunk",
    description: "Naturaleza digital con verdes orgánicos y esperanza",
    preview: { bg: "#0f1a12", accent: "#4ade80", accent2: "#a78bfa", text: "#e8f5e9" },
  },
  {
    id: "neobrutal",
    name: "Neobrutalismo",
    description: "Diseño crudo con bordes gruesos y colores planos",
    preview: { bg: "#fffbe6", accent: "#000000", accent2: "#6d28d9", text: "#1a1a1a" },
  },
  {
    id: "bauhaus",
    name: "Bauhaus",
    description: "Geométrico y funcional, inspirado en la escuela clásica",
    preview: { bg: "#f5f0e8", accent: "#1a56db", accent2: "#dc2626", text: "#111827" },
  },
  {
    id: "midnight",
    name: "Midnight",
    description: "Violetas profundos y azules etéreos del cielo nocturno",
    preview: { bg: "#0c0a1d", accent: "#818cf8", accent2: "#c084fc", text: "#eef2ff" },
  },
  {
    id: "retrowave",
    name: "Retrowave",
    description: "Sintetizadores, puestas de sol y nostalgia de los 80s",
    preview: { bg: "#1a0828", accent: "#ff6ec7", accent2: "#7b2dff", text: "#ffe4f1" },
  },
  // ── Calm / Sober ──
  {
    id: "dark-academia",
    name: "Dark Academia",
    description: "Bibliotecas antiguas, sepia y conocimiento en penumbra",
    preview: { bg: "#1c1814", accent: "#c9a96e", accent2: "#8b6f47", text: "#e8dcc8" },
  },
  {
    id: "nordic",
    name: "Nordic",
    description: "Minimalismo escandinavo, grises fríos y calma invernal",
    preview: { bg: "#1a1e24", accent: "#88b4c8", accent2: "#7e9aaf", text: "#d8dee8" },
  },
  {
    id: "obsidian",
    name: "Obsidian",
    description: "Negro absoluto con acentos plateados, puro y silencioso",
    preview: { bg: "#0d0d0d", accent: "#a0a0a0", accent2: "#787878", text: "#e0e0e0" },
  },
  {
    id: "forest",
    name: "Forest",
    description: "Verdes apagados y tierra húmeda, como un bosque de noche",
    preview: { bg: "#141a14", accent: "#6b8f6b", accent2: "#7a6e5a", text: "#c8d4c0" },
  },
  {
    id: "ink",
    name: "Ink",
    description: "Azul marino profundo y tiza blanca, como un cuaderno antiguo",
    preview: { bg: "#101828", accent: "#94a8c8", accent2: "#7888a8", text: "#d0d8e8" },
  },
  {
    id: "ember",
    name: "Ember",
    description: "Carbón y brasas, terracota suave sobre oscuridad cálida",
    preview: { bg: "#181210", accent: "#c08050", accent2: "#8a6040", text: "#e0d0c0" },
  },
];

const STORAGE_KEY = "langerhaus-theme";

interface ThemeContextType {
  theme: ThemeId;
  setTheme: (id: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "cyberpunk",
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>("cyberpunk");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeId | null;
    if (stored && themes.some((t) => t.id === stored)) {
      setThemeState(stored);
      document.documentElement.setAttribute("data-theme", stored);
    }
    setMounted(true);
  }, []);

  const setTheme = useCallback((id: ThemeId) => {
    setThemeState(id);
    localStorage.setItem(STORAGE_KEY, id);
    document.documentElement.setAttribute("data-theme", id);
  }, []);

  // Prevent flash of wrong theme
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

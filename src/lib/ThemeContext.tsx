"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

export type ThemeId =
  | "cuaderno" | "atardecer" | "pizarron" | "domingo" | "biblioteca" | "cosmos";

export interface ThemeInfo {
  id: ThemeId;
  name: string;
  description: string;
  preview: { bg: string; accent: string; accent2: string; text: string };
}

export const themes: ThemeInfo[] = [
  {
    id: "cuaderno",
    name: "Cuaderno",
    description: "Crema cálida, como un cuaderno recién abierto bajo la luz de la mañana",
    preview: { bg: "#faf7f2", accent: "#b87a3d", accent2: "#6b8e6b", text: "#2d2418" },
  },
  {
    id: "domingo",
    name: "Domingo",
    description: "Tarde soleada, coca-cola en la mesa, poca prisa — inspirado en Temporada de Patos",
    preview: { bg: "#fdf8ee", accent: "#b07830", accent2: "#788aa0", text: "#3a3028" },
  },
  {
    id: "atardecer",
    name: "Atardecer",
    description: "Hora dorada sobre un campo de maíz, la luz entra por la ventana",
    preview: { bg: "#1c1610", accent: "#e0a050", accent2: "#8aaa7a", text: "#e8dcc8" },
  },
  {
    id: "biblioteca",
    name: "Biblioteca",
    description: "Madera, cuero y una lámpara encendida entre estantes de libros",
    preview: { bg: "#1e1a14", accent: "#c9a96e", accent2: "#8b7a5a", text: "#e8dcc8" },
  },
  {
    id: "pizarron",
    name: "Pizarrón",
    description: "Tiza, borrador y polvo de gis — la magia del salón de clases",
    preview: { bg: "#1a2a20", accent: "#e8e0c8", accent2: "#d4c478", text: "#e0d8c4" },
  },
  {
    id: "cosmos",
    name: "Cosmos",
    description: "El amor es la única fuerza que trasciende el tiempo — inspirado en Interstellar",
    preview: { bg: "#101824", accent: "#d0a050", accent2: "#7090b0", text: "#d8dce4" },
  },
];

const STORAGE_KEY = "langerhaus-theme";

interface ThemeContextType {
  theme: ThemeId;
  setTheme: (id: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "cuaderno",
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>("cuaderno");
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

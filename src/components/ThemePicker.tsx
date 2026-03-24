"use client";

import { motion } from "framer-motion";
import { Check, Palette } from "lucide-react";
import { themes, useTheme, ThemeId } from "@/lib/ThemeContext";

interface ThemePickerProps {
  onClose: () => void;
}

export default function ThemePicker({ onClose }: ThemePickerProps) {
  const { theme, setTheme } = useTheme();

  const lightThemes = themes.filter((t) => ["cuaderno", "domingo"].includes(t.id));
  const darkThemes = themes.filter((t) => ["atardecer", "biblioteca", "pizarron", "cosmos"].includes(t.id));

  const renderCard = (t: (typeof themes)[0]) => {
    const isActive = theme === t.id;
    return (
      <motion.button
        key={t.id}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          setTheme(t.id as ThemeId);
          setTimeout(onClose, 300);
        }}
        className={`relative rounded-2xl p-3.5 text-left transition-all border-2 ${
          isActive
            ? "border-neon-cyan ring-2 ring-neon-cyan/15"
            : "border-text-muted/15 hover:border-text-muted/30"
        }`}
        style={{ background: t.preview.bg }}
      >
        <div className="flex gap-1.5 mb-2">
          <div className="w-4 h-4 rounded-full border border-white/20" style={{ background: t.preview.accent }} />
          <div className="w-4 h-4 rounded-full border border-white/20" style={{ background: t.preview.accent2 }} />
          <div className="w-4 h-4 rounded-full border border-white/20" style={{ background: t.preview.bg }} />
        </div>
        <p className="text-sm font-bold mb-0.5" style={{ color: t.preview.text }}>{t.name}</p>
        <p className="text-[10px] leading-tight" style={{ color: t.preview.text, opacity: 0.6 }}>{t.description}</p>
        {isActive && (
          <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
            style={{ background: t.preview.accent }}>
            <Check size={12} style={{ color: t.preview.bg }} />
          </div>
        )}
      </motion.button>
    );
  };

  return (
    <div className="max-h-[70vh] overflow-y-auto pr-1">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-2xl bg-neon-cyan/10 flex items-center justify-center">
          <Palette size={20} className="text-neon-cyan" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-text-primary">Ambiente</h3>
          <p className="text-xs text-text-secondary">Elige cómo se siente tu cuaderno</p>
        </div>
      </div>

      <p className="text-[10px] uppercase tracking-widest text-text-muted font-semibold mb-2">Claros</p>
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        {lightThemes.map(renderCard)}
      </div>

      <p className="text-[10px] uppercase tracking-widest text-text-muted font-semibold mb-2">Oscuros</p>
      <div className="grid grid-cols-2 gap-2.5">
        {darkThemes.map(renderCard)}
      </div>
    </div>
  );
}

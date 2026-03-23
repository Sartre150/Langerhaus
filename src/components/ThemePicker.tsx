"use client";

import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { themes, useTheme, ThemeId } from "@/lib/ThemeContext";

interface ThemePickerProps {
  onClose: () => void;
}

export default function ThemePicker({ onClose }: ThemePickerProps) {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-neon-purple/20 flex items-center justify-center">
          <Sparkles size={20} className="text-neon-purple" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-text-primary">Estética Visual</h3>
          <p className="text-xs text-text-secondary">Elige tu estilo favorito</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {themes.map((t) => {
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
              className={`relative rounded-xl p-3 text-left transition-all border-2 ${
                isActive
                  ? "border-neon-cyan ring-2 ring-neon-cyan/20"
                  : "border-text-muted/20 hover:border-text-muted/40"
              }`}
              style={{ background: t.preview.bg }}
            >
              {/* Color circles */}
              <div className="flex gap-1.5 mb-2">
                <div
                  className="w-5 h-5 rounded-full border border-white/20"
                  style={{ background: t.preview.accent }}
                />
                <div
                  className="w-5 h-5 rounded-full border border-white/20"
                  style={{ background: t.preview.accent2 }}
                />
                <div
                  className="w-5 h-5 rounded-full border border-white/20"
                  style={{ background: t.preview.bg }}
                />
              </div>
              <p className="text-sm font-bold mb-0.5" style={{ color: t.preview.text }}>
                {t.name}
              </p>
              <p className="text-xs leading-tight" style={{ color: t.preview.text, opacity: 0.6 }}>
                {t.description}
              </p>
              {isActive && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: t.preview.accent }}>
                  <Check size={12} style={{ color: t.preview.bg }} />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

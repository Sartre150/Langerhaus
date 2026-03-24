"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { TopicWithProgress } from "@/lib/types";
import SkillNode from "./SkillNode";
import TopicModal from "./TopicModal";

interface SkillTreeProps {
  topics: TopicWithProgress[];
}

const levelLabels: Record<number, { title: string; subtitle: string }> = {
  0: { title: "Aritmética", subtitle: "Los fundamentos de todo" },
  1: { title: "Pre-Álgebra", subtitle: "Construyendo el puente" },
  2: { title: "Álgebra I", subtitle: "Ecuaciones y factorización" },
  3: { title: "Álgebra II", subtitle: "Funciones y logaritmos" },
  4: { title: "Trigonometría", subtitle: "El lenguaje de los ángulos" },
  5: { title: "Cálculo Diferencial", subtitle: "El arte del cambio" },
  6: { title: "Cálculo Integral", subtitle: "Sumando infinitos" },
  7: { title: "Cálculo Multivariable", subtitle: "Más allá de una dimensión" },
  8: { title: "Álgebra Lineal", subtitle: "Vectores y transformaciones" },
  9: { title: "Ec. Diferenciales", subtitle: "El movimiento hecho ecuación" },
  10: { title: "Probabilidad & Datos", subtitle: "Entendiendo la incertidumbre" },
};

export default function SkillTree({ topics }: SkillTreeProps) {
  const [selectedTopic, setSelectedTopic] = useState<TopicWithProgress | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleNodeClick = useCallback((topic: TopicWithProgress) => {
    setSelectedTopic(topic);
    setModalOpen(true);
  }, []);

  return (
    <div className="relative">
      {/* Vertical connecting line */}
      <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-neon-cyan/20 via-neon-purple/15 to-neon-cyan/5 hidden lg:block" />

      <div className="space-y-8">
        {topics.map((mainTopic, i) => {
          const label = levelLabels[mainTopic.level];
          const isLocked = mainTopic.status === "locked";

          return (
            <motion.div
              key={mainTopic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              {/* Level Header */}
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`
                    relative z-10 flex-shrink-0 w-12 h-12 rounded-2xl border-2 flex items-center justify-center
                    font-mono text-xs font-bold
                    ${
                      isLocked
                        ? "border-text-muted/30 text-text-muted bg-bg-primary"
                        : mainTopic.status === "mastered"
                        ? "border-neon-green/50 text-neon-green bg-neon-green/10"
                        : i % 2 === 0
                        ? "border-neon-cyan/50 text-neon-cyan bg-neon-cyan/10"
                        : "border-neon-purple/50 text-neon-purple bg-neon-purple/10"
                    }
                  `}
                >
                  {mainTopic.level + 1}
                </div>
                <div>
                  <h2
                    className={`text-sm font-bold tracking-wider ${
                      isLocked ? "text-text-muted" : "text-text-primary"
                    }`}
                  >
                    {label?.title || `NIVEL ${mainTopic.level}`}
                  </h2>
                  <p className="text-xs text-text-secondary">
                    {label?.subtitle || mainTopic.description}
                  </p>
                </div>
              </div>

              {/* Main topic node */}
              <div className="lg:ml-16 space-y-2">
                <SkillNode topic={mainTopic} onClick={handleNodeClick} index={i} />

                {/* Subtopic nodes */}
                {mainTopic.children.length > 0 && (
                  <div className="ml-4 lg:ml-8 space-y-2 border-l border-text-muted/10 pl-4">
                    {mainTopic.children.map((child, j) => (
                      <SkillNode
                        key={child.id}
                        topic={child}
                        onClick={handleNodeClick}
                        index={i + j + 1}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Topic Modal */}
      <TopicModal
        topic={selectedTopic}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}

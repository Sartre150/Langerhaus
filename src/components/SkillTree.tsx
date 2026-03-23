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
  0: { title: "ARITMÉTICA", subtitle: "Fundamentos Absolutos" },
  1: { title: "PRE-ÁLGEBRA", subtitle: "El Puente" },
  2: { title: "ÁLGEBRA I", subtitle: "Ecuaciones & Factorización" },
  3: { title: "ÁLGEBRA II", subtitle: "Funciones & Logaritmos" },
  4: { title: "TRIGONOMETRÍA", subtitle: "Geometría Analítica" },
  5: { title: "CÁLCULO DIFERENCIAL", subtitle: "Límites & Derivadas" },
  6: { title: "CÁLCULO INTEGRAL", subtitle: "Integrales & Series" },
  7: { title: "CÁLCULO MULTI", subtitle: "Varias Variables" },
  8: { title: "ÁLGEBRA LINEAL", subtitle: "Vectores & Matrices" },
  9: { title: "EC. DIFERENCIALES", subtitle: "EDOs & Laplace" },
  10: { title: "DATA SCIENCE", subtitle: "Probabilidad & ML" },
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
      <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-neon-cyan/30 via-neon-purple/30 to-neon-cyan/10 hidden lg:block" />

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
                    relative z-10 flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center
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
                  L{mainTopic.level}
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

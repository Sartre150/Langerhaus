"use client";

import { useRouter } from "next/navigation";
import { PenLine, Trophy, X, BookOpen, BarChart3, Target } from "lucide-react";
import { TopicWithProgress, MASTERY_CONFIG } from "@/lib/types";
import { NeonButton, ProgressBar, Badge } from "./ui";
import { Modal } from "./ui";
import { useProgress } from "@/lib/ProgressContext";

interface TopicModalProps {
  topic: TopicWithProgress | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TopicModal({ topic, isOpen, onClose }: TopicModalProps) {
  const router = useRouter();
  const { getExerciseStats } = useProgress();

  if (!topic) return null;

  const isMastered = topic.status === "mastered";
  const problemCount = topic.children.length > 0
    ? `${topic.children.length} subtemas`
    : "Problemas disponibles";

  // Collect exercise stats for children or the topic itself
  const statsTopics = topic.children.length > 0 ? topic.children : [topic];
  const totalStats = statsTopics.reduce(
    (acc, t) => {
      const s = getExerciseStats(t.id);
      return { attempted: acc.attempted + s.attempted, correct: acc.correct + s.correct };
    },
    { attempted: 0, correct: 0 }
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-neon-purple/20 flex items-center justify-center">
              {isMastered ? (
                <Trophy size={24} className="text-neon-green" />
              ) : (
                <PenLine size={24} className="text-neon-purple" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-primary">{topic.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge color="purple">Nivel {topic.level}</Badge>
                <Badge color={isMastered ? "green" : "gray"}>{problemCount}</Badge>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-text-secondary mb-4">{topic.description}</p>

        {/* Progress */}
        <div className="mb-6">
          <ProgressBar value={topic.score} color={isMastered ? "green" : "purple"} />
          <p className="text-xs text-text-muted mt-2 text-center">
            Nivel de Maestría: <span className="text-text-primary font-mono">{topic.score}/100</span>
          </p>
        </div>

        {/* Mastery Requirements Checklist */}
        {!isMastered && topic.status !== "locked" && (
          <div className="mb-6 p-3 rounded-lg bg-bg-secondary/50 border border-neon-purple/20">
            <div className="flex items-center gap-2 mb-3">
              <Target size={14} className="text-neon-purple" />
              <span className="text-xs font-semibold text-text-primary uppercase tracking-wider">
                Requisitos para dominar
              </span>
            </div>
            {(() => {
              const accuracy = totalStats.attempted > 0 ? totalStats.correct / totalStats.attempted : 0;
              const hardProblems = statsTopics.reduce((sum, t) => {
                const s = getExerciseStats(t.id);
                return sum + Object.entries(s.byDifficulty || {})
                  .filter(([d]) => Number(d) >= MASTERY_CONFIG.HARD_DIFFICULTY_THRESHOLD)
                  .reduce((acc, [, b]) => acc + b.correct, 0);
              }, 0);
              const checks = [
                {
                  done: totalStats.attempted >= MASTERY_CONFIG.MIN_EXERCISES,
                  label: `Mínimo ${MASTERY_CONFIG.MIN_EXERCISES} ejercicios`,
                  detail: `${totalStats.attempted}/${MASTERY_CONFIG.MIN_EXERCISES}`,
                },
                {
                  done: accuracy >= MASTERY_CONFIG.MIN_ACCURACY,
                  label: `Precisión ≥ ${MASTERY_CONFIG.MIN_ACCURACY * 100}%`,
                  detail: totalStats.attempted > 0 ? `${Math.round(accuracy * 100)}%` : "—",
                },
                {
                  done: hardProblems >= MASTERY_CONFIG.MIN_HARD_PROBLEMS,
                  label: `${MASTERY_CONFIG.MIN_HARD_PROBLEMS}+ aciertos en dificultad ≥ ${MASTERY_CONFIG.HARD_DIFFICULTY_THRESHOLD}`,
                  detail: `${hardProblems}/${MASTERY_CONFIG.MIN_HARD_PROBLEMS}`,
                },
              ];
              return (
                <div className="space-y-2">
                  {checks.map((c, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${c.done ? "bg-neon-green/20 border-neon-green/50 text-neon-green" : "border-text-muted/30 text-text-muted"}`}>
                        {c.done ? "✓" : ""}
                      </span>
                      <span className={`flex-1 ${c.done ? "text-text-primary" : "text-text-secondary"}`}>
                        {c.label}
                      </span>
                      <span className="text-text-muted font-mono">{c.detail}</span>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        {/* Exercise Stats */}
        {totalStats.attempted > 0 && (
          <div className="mb-6 p-3 rounded-lg bg-bg-secondary/50 border border-text-muted/10">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 size={14} className="text-neon-cyan" />
              <span className="text-xs font-semibold text-text-primary uppercase tracking-wider">Ejercicios Resueltos</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center mb-3">
              <div>
                <p className="text-lg font-bold text-text-primary font-mono">{totalStats.attempted}</p>
                <p className="text-xs text-text-muted">Intentados</p>
              </div>
              <div>
                <p className="text-lg font-bold text-neon-green font-mono">{totalStats.correct}</p>
                <p className="text-xs text-text-muted">Correctos</p>
              </div>
              <div>
                <p className="text-lg font-bold text-red-400 font-mono">{totalStats.attempted - totalStats.correct}</p>
                <p className="text-xs text-text-muted">Incorrectos</p>
              </div>
              <div>
                <p className="text-lg font-bold text-neon-cyan font-mono">
                  {Math.round((totalStats.correct / totalStats.attempted) * 100)}%
                </p>
                <p className="text-xs text-text-muted">Precisión</p>
              </div>
            </div>
            {/* Per-subtopic breakdown */}
            {topic.children.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-text-muted/10">
                {topic.children.map((child) => {
                  const cs = getExerciseStats(child.id);
                  if (cs.attempted === 0) return null;
                  const pct = Math.round((cs.correct / cs.attempted) * 100);
                  return (
                    <div key={child.id} className="flex items-center gap-2 text-xs">
                      <span className="text-text-secondary flex-1 truncate">{child.title}</span>
                      <span className="text-text-muted font-mono">{cs.correct}/{cs.attempted}</span>
                      <span className={`font-mono w-8 text-right ${pct >= 70 ? "text-neon-green" : "text-text-muted"}`}>
                        {pct}%
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Subtopics preview */}
        {topic.children.length > 0 && (
          <div className="mb-6 space-y-2">
            <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Subtemas
            </h4>
            {topic.children.map((child) => (
              <div
                key={child.id}
                className="flex items-center justify-between px-3 py-2 rounded-lg bg-bg-secondary/50"
              >
                <span className="text-sm text-text-primary">{child.title}</span>
                <Badge color={child.status === "mastered" ? "green" : child.status === "unlocked" ? "cyan" : "gray"}>
                  {child.status === "mastered" ? "✓" : child.status === "unlocked" ? `${child.score}%` : "🔒"}
                </Badge>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <NeonButton
            variant="ghost"
            size="md"
            onClick={onClose}
            className="flex-1"
          >
            Cerrar
          </NeonButton>
          <NeonButton
            variant="purple"
            size="md"
            icon={BookOpen}
            onClick={() => {
              onClose();
              const targetId = topic.children.find((c) => c.status === "unlocked")?.id || topic.id;
              router.push(`/learn/${targetId}`);
            }}
            className="flex-1"
          >
            Aprender
          </NeonButton>
          <NeonButton
            variant="cyan"
            size="md"
            icon={PenLine}
            onClick={() => {
              onClose();
              // Navigate to arena with the parent topic (config page will show subtopics)
              router.push(`/arena/${topic.id}`);
            }}
            className="flex-1"
          >
            Arena
          </NeonButton>
        </div>
      </div>
    </Modal>
  );
}

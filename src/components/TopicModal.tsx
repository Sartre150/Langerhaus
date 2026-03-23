"use client";

import { useRouter } from "next/navigation";
import { Swords, Trophy, X, BookOpen } from "lucide-react";
import { TopicWithProgress } from "@/lib/types";
import { NeonButton, ProgressBar, Badge } from "./ui";
import { Modal } from "./ui";

interface TopicModalProps {
  topic: TopicWithProgress | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TopicModal({ topic, isOpen, onClose }: TopicModalProps) {
  const router = useRouter();

  if (!topic) return null;

  const isMastered = topic.status === "mastered";
  const problemCount = topic.children.length > 0
    ? `${topic.children.length} subtemas`
    : "Problemas disponibles";

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
                <Swords size={24} className="text-neon-purple" />
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
            icon={Swords}
            onClick={() => {
              onClose();
              const targetId = topic.children.find((c) => c.status === "unlocked")?.id || topic.id;
              router.push(`/arena/${targetId}`);
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

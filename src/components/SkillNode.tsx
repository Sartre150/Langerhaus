"use client";

import { motion } from "framer-motion";
import { Lock, Star, ChevronRight, BookOpen } from "lucide-react";
import { TopicWithProgress } from "@/lib/types";
import { Badge, ProgressBar } from "./ui";

interface SkillNodeProps {
  topic: TopicWithProgress;
  onClick: (topic: TopicWithProgress) => void;
  index: number;
}

const levelColors: Record<number, string> = {
  0: "cyan",
  1: "purple",
  2: "pink",
  3: "cyan",
  4: "purple",
  5: "pink",
  6: "cyan",
  7: "purple",
  8: "pink",
  9: "cyan",
  10: "purple",
};



export default function SkillNode({ topic, onClick, index }: SkillNodeProps) {
  const isLocked = topic.status === "locked";
  const isMastered = topic.status === "mastered";
  const isUnlocked = topic.status === "unlocked";
  const accentColor = levelColors[topic.level] || "cyan";

  const borderClass = isLocked
    ? "border-text-muted/20"
    : isMastered
    ? accentColor === "cyan"
      ? "border-neon-cyan/50 shadow-neon-cyan"
      : "border-neon-purple/50 shadow-neon-purple"
    : accentColor === "cyan"
    ? "border-neon-cyan/30"
    : "border-neon-purple/30";

  const bgClass = isLocked
    ? "bg-bg-card/50"
    : isMastered
    ? "bg-bg-card"
    : "bg-bg-card hover:bg-bg-hover";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      onClick={() => !isLocked && onClick(topic)}
      className={`
        relative rounded-2xl border p-4 transition-all duration-300
        ${borderClass} ${bgClass}
        ${!isLocked ? "cursor-pointer group" : "cursor-not-allowed opacity-60"}
      `}
    >
      <div className="flex items-center gap-3">
        {/* Status icon */}
        <div
          className={`
            flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold
            ${
              isLocked
                ? "bg-text-muted/10 text-text-muted"
                : isMastered
                ? accentColor === "cyan"
                  ? "bg-neon-cyan/20 text-neon-cyan"
                  : "bg-neon-purple/20 text-neon-purple"
                : "bg-bg-secondary text-text-secondary"
            }
          `}
        >
          {isLocked ? (
            <Lock size={16} />
          ) : isMastered ? (
            <Star size={16} />
          ) : (
            <BookOpen size={16} />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3
              className={`font-semibold text-sm truncate ${
                isLocked ? "text-text-muted" : "text-text-primary"
              }`}
            >
              {topic.title}
            </h3>
            {isMastered && <Badge color="green">Dominado</Badge>}
            {isUnlocked && topic.score > 0 && (
              <Badge color="cyan">{topic.score}%</Badge>
            )}
          </div>
          <p className="text-xs text-text-secondary mt-0.5 truncate">
            {topic.description}
          </p>
          {isUnlocked && (
            <div className="mt-2">
              <ProgressBar
                value={topic.score}
                color={accentColor === "purple" ? "purple" : "cyan"}
                size="sm"
                showLabel={false}
              />
            </div>
          )}
        </div>

        {/* Arrow */}
        {!isLocked && (
          <ChevronRight
            size={18}
            className="text-text-muted group-hover:text-text-primary transition-colors flex-shrink-0"
          />
        )}
      </div>
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import React from "react";

// ─── BUTTON ───
interface ButtonProps {
  variant?: "cyan" | "purple" | "green" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

const variantStyles = {
  cyan: "bg-neon-cyan/10 border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/15 hover:shadow-soft",
  purple: "bg-neon-purple/10 border-neon-purple/30 text-neon-purple hover:bg-neon-purple/15 hover:shadow-soft",
  green: "bg-neon-green/10 border-neon-green/30 text-neon-green hover:bg-neon-green/15 hover:shadow-soft",
  ghost: "bg-transparent border-text-muted/20 text-text-secondary hover:bg-bg-hover hover:text-text-primary",
  danger: "bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/15",
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-8 py-3.5 text-base",
};

export function NeonButton({
  variant = "cyan",
  size = "md",
  icon: Icon,
  children,
  className = "",
  disabled,
  onClick,
  type = "button",
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.01 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`
        inline-flex items-center justify-center gap-2 rounded-xl border font-semibold
        transition-all duration-200 cursor-pointer
        disabled:opacity-40 disabled:cursor-not-allowed
        ${variantStyles[variant]} ${sizeStyles[size]} ${className}
      `}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {Icon && <Icon size={size === "sm" ? 14 : size === "md" ? 16 : 18} />}
      {children}
    </motion.button>
  );
}

// ─── CARD ───
interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: "cyan" | "purple" | "green" | "none";
  onClick?: () => void;
}

export function Card({ children, className = "", glow = "none", onClick }: CardProps) {
  const glowStyles = {
    cyan: "neon-border-cyan",
    purple: "neon-border-purple",
    green: "border border-neon-green/25 shadow-soft",
    none: "border border-text-muted/10 shadow-soft",
  };

  return (
    <div
      onClick={onClick}
      className={`
        rounded-2xl bg-bg-card p-6
        transition-all duration-300
        ${onClick ? "cursor-pointer hover:shadow-card hover:bg-bg-hover" : ""}
        ${glowStyles[glow]} ${className}
      `}
    >
      {children}
    </div>
  );
}

// ─── PROGRESS BAR ───
interface ProgressBarProps {
  value: number;
  max?: number;
  color?: "cyan" | "purple" | "green";
  showLabel?: boolean;
  size?: "sm" | "md";
}

export function ProgressBar({
  value,
  max = 100,
  color = "cyan",
  showLabel = true,
  size = "md",
}: ProgressBarProps) {
  const pct = Math.min((value / max) * 100, 100);
  const barColor = {
    cyan: "bg-neon-cyan",
    purple: "bg-neon-purple",
    green: "bg-neon-green",
  };
  const glowColor = {
    cyan: "shadow-neon-cyan",
    purple: "shadow-neon-purple",
    green: "shadow-neon-green",
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-xs text-text-secondary">Progreso</span>
          <span className="text-xs text-text-secondary font-mono">{Math.round(pct)}%</span>
        </div>
      )}
      <div
        className={`w-full rounded-full bg-bg-secondary overflow-hidden ${
          size === "sm" ? "h-1.5" : "h-2.5"
        }`}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full ${barColor[color]} ${glowColor[color]}`}
        />
      </div>
    </div>
  );
}

// ─── MODAL ───
interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ isOpen = true, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 350 }}
        className="relative z-10 w-full max-w-lg"
      >
        <Card glow="purple" className="!p-0 overflow-hidden">
          {children}
        </Card>
      </motion.div>
    </motion.div>
  );
}

// ─── BADGE ───
interface BadgeProps {
  children: React.ReactNode;
  color?: "cyan" | "purple" | "green" | "gray";
}

export function Badge({ children, color = "cyan" }: BadgeProps) {
  const styles = {
    cyan: "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30",
    purple: "bg-neon-purple/10 text-neon-purple border-neon-purple/30",
    green: "bg-neon-green/10 text-neon-green border-neon-green/30",
    gray: "bg-text-muted/10 text-text-muted border-text-muted/30",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${styles[color]}`}
    >
      {children}
    </span>
  );
}

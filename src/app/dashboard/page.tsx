"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Flame, Target, Trophy, RotateCcw, LogOut, User, AlertTriangle, Palette } from "lucide-react";
import SkillTree from "@/components/SkillTree";
import { TopicWithProgress } from "@/lib/types";
import { NeonButton, Card, Modal } from "@/components/ui";
import { useAuth } from "@/lib/AuthContext";
import { useProgress } from "@/lib/ProgressContext";
import ThemePicker from "@/components/ThemePicker";

export default function DashboardPage() {
  const [topics, setTopics] = useState<TopicWithProgress[]>([]);
  const [mounted, setMounted] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetConfirmText, setResetConfirmText] = useState("");
  const [showThemePicker, setShowThemePicker] = useState(false);
  const { user, loading, signOut } = useAuth();
  const { getTopicsTree, resetProgress, progressLoading } = useProgress();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth");
      return;
    }
    setMounted(true);
  }, [user, loading, router]);

  useEffect(() => {
    if (!progressLoading) {
      setTopics(getTopicsTree());
    }
  }, [progressLoading, getTopicsTree]);

  if (loading || !mounted || progressLoading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const userName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Estudiante";

  const totalTopics = topics.reduce((acc, t) => acc + 1 + t.children.length, 0);
  const masteredCount = topics.reduce(
    (acc, t) =>
      acc +
      (t.status === "mastered" ? 1 : 0) +
      t.children.filter((c) => c.status === "mastered").length,
    0
  );
  const unlockedCount = topics.reduce(
    (acc, t) =>
      acc +
      (t.status === "unlocked" ? 1 : 0) +
      t.children.filter((c) => c.status === "unlocked").length,
    0
  );
  const totalScore = topics.reduce(
    (acc, t) => acc + t.score + t.children.reduce((a, c) => a + c.score, 0),
    0
  );

  return (
    <div className="min-h-screen bg-bg-primary bg-grid">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-bg-primary/80 backdrop-blur-md border-b border-text-muted/10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
              <Brain size={22} className="text-bg-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-text-primary tracking-tight">
                Langer<span className="neon-text-cyan">haus</span>
              </h1>
              <p className="text-xs text-text-muted">Cuaderno de arena y cálculo</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 mr-2 px-3 py-1.5 rounded-lg bg-bg-secondary border border-text-muted/10">
              <User size={14} className="text-neon-purple" />
              <span className="text-xs text-text-secondary font-medium">{userName}</span>
            </div>
            <NeonButton
              variant="ghost"
              size="sm"
              icon={Palette}
              onClick={() => setShowThemePicker(true)}
            >
              Tema
            </NeonButton>
            <NeonButton
              variant="ghost"
              size="sm"
              icon={RotateCcw}
              onClick={() => setShowResetConfirm(true)}
            >
              Reset
            </NeonButton>
            <NeonButton
              variant="ghost"
              size="sm"
              icon={LogOut}
              onClick={async () => {
                await signOut();
                router.push("/auth");
              }}
            >
              Salir
            </NeonButton>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8"
        >
          <Card className="!p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-neon-cyan/10 flex items-center justify-center">
                <Target size={18} className="text-neon-cyan" />
              </div>
              <div>
                <p className="text-xs text-text-secondary">Disponibles</p>
                <p className="text-lg font-bold text-text-primary font-mono">{unlockedCount}</p>
              </div>
            </div>
          </Card>
          <Card className="!p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-neon-green/10 flex items-center justify-center">
                <Trophy size={18} className="text-neon-green" />
              </div>
              <div>
                <p className="text-xs text-text-secondary">Dominados</p>
                <p className="text-lg font-bold text-text-primary font-mono">{masteredCount}</p>
              </div>
            </div>
          </Card>
          <Card className="!p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-neon-purple/10 flex items-center justify-center">
                <Flame size={18} className="text-neon-purple" />
              </div>
              <div>
                <p className="text-xs text-text-secondary">Puntuación</p>
                <p className="text-lg font-bold text-text-primary font-mono">{totalScore}</p>
              </div>
            </div>
          </Card>
          <Card className="!p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-neon-pink/10 flex items-center justify-center">
                <Brain size={18} className="text-neon-pink" />
              </div>
              <div>
                <p className="text-xs text-text-secondary">Total Temas</p>
                <p className="text-lg font-bold text-text-primary font-mono">{totalTopics}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Skill Tree */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-xl font-bold text-text-primary">Árbol de Habilidades</h2>
            <span className="text-xs text-text-muted bg-bg-secondary px-2 py-1 rounded-full">
              {topics.length} niveles
            </span>
          </div>
          <SkillTree topics={topics} />
        </motion.div>
      </main>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <Modal onClose={() => { setShowResetConfirm(false); setResetConfirmText(""); }}>
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={28} className="text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">¿Borrar todo el progreso?</h3>
              <p className="text-sm text-text-secondary mb-4">
                Esta acción <strong className="text-red-400">no se puede deshacer</strong>. Se eliminarán todos tus puntajes y desbloqueos.
              </p>
              <p className="text-xs text-text-muted mb-3">
                Escribe <strong className="text-text-primary">BORRAR</strong> para confirmar:
              </p>
              <input
                type="text"
                value={resetConfirmText}
                onChange={(e) => setResetConfirmText(e.target.value)}
                placeholder="Escribe BORRAR"
                className="w-full bg-bg-secondary border border-text-muted/20 rounded-lg px-4 py-2.5 text-text-primary
                  placeholder-text-muted/50 text-sm text-center focus:outline-none focus:border-red-500/50 transition-all mb-4"
              />
              <div className="flex gap-3">
                <NeonButton
                  variant="ghost"
                  className="flex-1"
                  onClick={() => { setShowResetConfirm(false); setResetConfirmText(""); }}
                >
                  Cancelar
                </NeonButton>
                <NeonButton
                  variant="danger"
                  className="flex-1"
                  disabled={resetConfirmText !== "BORRAR"}
                  onClick={() => {
                    resetProgress();
                    setShowResetConfirm(false);
                    setResetConfirmText("");
                  }}
                >
                  Borrar Todo
                </NeonButton>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Theme Picker */}
      <AnimatePresence>
        {showThemePicker && (
          <Modal onClose={() => setShowThemePicker(false)}>
            <ThemePicker onClose={() => setShowThemePicker(false)} />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, Flame, Target, Trophy, RotateCcw, LogOut, User, AlertTriangle,
  Palette, CalendarDays, Zap, BookOpen, AlertCircle, ChevronRight,
  TrendingDown, BookMarked,
} from "lucide-react";
import SkillTree from "@/components/SkillTree";
import { TopicWithProgress } from "@/lib/types";
import { NeonButton, Card, Modal } from "@/components/ui";
import { useAuth } from "@/lib/AuthContext";
import { useProgress } from "@/lib/ProgressContext";
import { useStudy } from "@/lib/StudyContext";
import { getTopicById } from "@/lib/store";
import ThemePicker from "@/components/ThemePicker";

export default function DashboardPage() {
  const [topics, setTopics] = useState<TopicWithProgress[]>([]);
  const [mounted, setMounted] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetConfirmText, setResetConfirmText] = useState("");
  const [showThemePicker, setShowThemePicker] = useState(false);
  const { user, loading, signOut } = useAuth();
  const { getTopicsTree, resetProgress, progressLoading } = useProgress();
  const { streak, getDueReviews, getRecommendedTopics, getWeakTopics, getActivityHistory, setDailyGoal, resetStudyData } = useStudy();
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

  // ── Study intelligence data (must be before early returns) ──
  const dueReviews = useMemo(() => getDueReviews(), [getDueReviews]);
  const recommendations = useMemo(() => getRecommendedTopics(), [getRecommendedTopics]);
  const weakTopics = useMemo(() => getWeakTopics(), [getWeakTopics]);
  const weekActivity = useMemo(() => getActivityHistory(7), [getActivityHistory]);
  const goalPct = streak.dailyGoal > 0 ? Math.min(100, Math.round((streak.todayProgress / streak.dailyGoal) * 100)) : 0;

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
      <header className="sticky-header z-40 bg-bg-primary/90 backdrop-blur-md border-b border-text-muted/8">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-neon-cyan/15 flex items-center justify-center">
              <BookMarked size={22} className="text-neon-cyan" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-text-primary tracking-tight">
                Langerhaus
              </h1>
              <p className="text-xs text-text-muted">Cuaderno de arena y cálculo</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="hidden sm:flex items-center gap-2 mr-2 px-3 py-1.5 rounded-xl bg-bg-secondary border border-text-muted/10">
              <User size={14} className="text-neon-purple" />
              <span className="text-xs text-text-secondary font-medium">{userName}</span>
            </div>
            <NeonButton
              variant="ghost"
              size="sm"
              icon={Palette}
              onClick={() => setShowThemePicker(true)}
            >
              <span className="hidden sm:inline">Tema</span>
            </NeonButton>
            <NeonButton
              variant="ghost"
              size="sm"
              icon={RotateCcw}
              onClick={() => setShowResetConfirm(true)}
            >
              <span className="hidden sm:inline">Reset</span>
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
              <span className="hidden sm:inline">Salir</span>
            </NeonButton>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* ── Row 1: Core Stats + Streak ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3 mb-6"
        >
          {/* Streak card — spans full width on mobile, first col on desktop */}
          <Card className="!p-4 col-span-2 lg:col-span-1 lg:row-span-2 flex flex-col items-center justify-center gap-2 relative overflow-hidden">
            <div className="relative w-16 h-16">
              {/* Circular progress ring */}
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted/10" />
                <circle
                  cx="18" cy="18" r="15.9" fill="none" strokeWidth="2.5"
                  strokeDasharray={`${goalPct}, 100`}
                  strokeLinecap="round"
                  className="text-neon-orange transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Flame size={22} className={streak.currentStreak > 0 ? "text-neon-orange" : "text-text-muted/30"} />
              </div>
            </div>
            <p className="text-2xl font-black text-text-primary font-mono">{streak.currentStreak}</p>
            <p className="text-[10px] text-text-muted uppercase tracking-wider">Racha de días</p>
            <p className="text-[10px] text-text-secondary">
              {streak.todayProgress}/{streak.dailyGoal} hoy
            </p>
            {streak.longestStreak > 0 && (
              <p className="text-[10px] text-text-muted">Récord: {streak.longestStreak}d</p>
            )}
          </Card>
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
                <Zap size={18} className="text-neon-purple" />
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

        {/* ── Row 2: Activity Heatmap (7 days) + Recommendations + Weak Topics ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-6"
        >
          {/* Weekly activity mini chart */}
          <Card className="!p-4">
            <div className="flex items-center gap-2 mb-3">
              <CalendarDays size={14} className="text-neon-cyan" />
              <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider">Actividad semanal</h3>
            </div>
            <div className="flex items-end gap-1.5 h-16">
              {(() => {
                // Build 7-day array (always show 7 bars)
                const bars: { day: string; count: number; correct: number }[] = [];
                const dayNames = ["D", "L", "M", "X", "J", "V", "S"];
                for (let i = 6; i >= 0; i--) {
                  const d = new Date();
                  d.setDate(d.getDate() - i);
                  const iso = d.toISOString().slice(0, 10);
                  const entry = weekActivity.find((a) => a.date === iso);
                  bars.push({
                    day: dayNames[d.getDay()],
                    count: entry?.problemsSolved || 0,
                    correct: entry?.problemsCorrect || 0,
                  });
                }
                const maxCount = Math.max(1, ...bars.map((b) => b.count));
                return bars.map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full relative" style={{ height: "48px" }}>
                      <div
                        className="absolute bottom-0 w-full rounded-sm bg-neon-cyan/20 transition-all duration-500"
                        style={{ height: `${(bar.count / maxCount) * 100}%`, minHeight: bar.count > 0 ? "4px" : "2px" }}
                      />
                      {bar.count > 0 && (
                        <div
                          className="absolute bottom-0 w-full rounded-sm bg-neon-cyan transition-all duration-500"
                          style={{ height: `${(bar.correct / maxCount) * 100}%`, minHeight: "3px" }}
                        />
                      )}
                    </div>
                    <span className="text-[9px] text-text-muted">{bar.day}</span>
                  </div>
                ));
              })()}
            </div>
            <div className="flex items-center gap-3 mt-2 text-[9px] text-text-muted">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-neon-cyan inline-block" /> Correctos</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-neon-cyan/20 inline-block" /> Intentados</span>
            </div>
          </Card>

          {/* Due reviews + recommendations */}
          <Card className="!p-4">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={14} className="text-neon-purple" />
              <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
                Para ti hoy
                {dueReviews.length > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 text-[9px] rounded-full bg-neon-orange/20 text-neon-orange font-bold">
                    {dueReviews.length} repasos
                  </span>
                )}
              </h3>
            </div>
            <div className="space-y-2 max-h-36 overflow-y-auto">
              {recommendations.length > 0 ? recommendations.map((rec) => {
                const t = getTopicById(rec.topicId);
                if (!t) return null;
                const parentId = t.parent_topic_id || t.id;
                return (
                  <button
                    key={rec.topicId}
                    onClick={() => router.push(`/arena/${parentId}`)}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg bg-bg-secondary/50 hover:bg-bg-secondary
                      border border-transparent hover:border-text-muted/10 transition-all text-left group"
                  >
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      rec.priority === 1 ? "bg-neon-orange" : rec.priority === 2 ? "bg-neon-pink" : "bg-neon-cyan"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-text-primary truncate">{t.title}</p>
                      <p className="text-[10px] text-text-muted truncate">{rec.reason}</p>
                    </div>
                    <ChevronRight size={12} className="text-text-muted/30 group-hover:text-text-secondary transition-colors flex-shrink-0" />
                  </button>
                );
              }) : (
                <p className="text-xs text-text-muted/60 text-center py-4">
                  ¡Resuelve problemas para obtener recomendaciones!
                </p>
              )}
            </div>
          </Card>

          {/* Weak topics */}
          <Card className="!p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown size={14} className="text-neon-pink" />
              <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider">Debilidades</h3>
            </div>
            {weakTopics.length > 0 ? (
              <div className="space-y-2 max-h-36 overflow-y-auto">
                {weakTopics.slice(0, 5).map((w) => {
                  const t = getTopicById(w.topicId);
                  if (!t) return null;
                  const parentId = t.parent_topic_id || t.id;
                  return (
                    <button
                      key={w.topicId}
                      onClick={() => router.push(`/arena/${parentId}`)}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg bg-bg-secondary/50 hover:bg-bg-secondary
                        border border-transparent hover:border-text-muted/10 transition-all text-left group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-text-primary truncate">{t.title}</p>
                        <p className="text-[10px] text-text-muted">{w.attempted} intentos</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-12 h-1.5 rounded-full bg-bg-primary overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              w.accuracy < 40 ? "bg-red-400" : w.accuracy < 60 ? "bg-neon-orange" : "bg-neon-cyan"
                            }`}
                            style={{ width: `${w.accuracy}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-text-muted w-7 text-right">{w.accuracy}%</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-4">
                <AlertCircle size={20} className="text-text-muted/20 mx-auto mb-1" />
                <p className="text-xs text-text-muted/60">
                  Sin debilidades detectadas aún
                </p>
              </div>
            )}
          </Card>
        </motion.div>

        {/* ── Daily goal setter (inline) ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6 px-1"
        >
          <span className="text-xs text-text-muted">Meta diaria:</span>
          <div className="flex gap-1.5 sm:gap-2 flex-wrap">
            {[5, 10, 15, 20, 30].map((g) => (
              <button
                key={g}
                onClick={() => setDailyGoal(g)}
                className={`px-2.5 py-1.5 sm:py-1 rounded-md text-xs font-medium transition-all min-w-[2.25rem] ${
                  streak.dailyGoal === g
                    ? "bg-neon-orange/20 text-neon-orange border border-neon-orange/30"
                    : "bg-bg-secondary text-text-muted hover:text-text-secondary border border-transparent"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
          <span className="text-[10px] text-text-muted">problemas</span>
        </motion.div>

        {/* Skill Tree */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-xl font-bold text-text-primary">Tu camino</h2>
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
                    resetStudyData();
                    setShowResetConfirm(false);
                    setResetConfirmText("");
                    // Force full page reload to guarantee all cached state is gone
                    setTimeout(() => window.location.reload(), 150);
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
            <ThemePicker />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

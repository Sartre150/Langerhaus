"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Lightbulb,
  Eye,
  Send,
  SkipForward,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Sigma,
  Pi,
  Radical,
  Divide,
  Superscript,
  RefreshCw,
  Shuffle,
  Settings,
  Brain,
  Calculator,
  Zap,
  BarChart3,
  Play,
} from "lucide-react";
import MathRender from "@/components/MathRender";
import { NeonButton, Card, ProgressBar, Badge } from "@/components/ui";
import {
  getTopicById,
  getProblemsForTopic,
  checkAnswer,
  getSubtopics,
} from "@/lib/store";
import { generateProblemSet, generateCustomProblemSet, hasGenerator } from "@/lib/problemGenerator";
import { useProgress } from "@/lib/ProgressContext";
import { useStudy } from "@/lib/StudyContext";
import { Problem, Topic, CalculatorPolicy } from "@/lib/types";

type ArenaState = "solving" | "correct" | "wrong" | "surrendered";
type PageMode = "config" | "practice";

// ── Calculator policy display helpers ──
const CALC_POLICY_META: Record<CalculatorPolicy, { icon: typeof Brain; label: string; color: string; description: string }> = {
  mental: { icon: Brain, label: "Cálculo Mental", color: "text-neon-green", description: "Resuelve sin calculadora — fortalece tu base" },
  optional: { icon: Zap, label: "Opcional", color: "text-neon-orange", description: "Intenta mentalmente, usa calculadora si necesitas" },
  calculator: { icon: Calculator, label: "Calculadora", color: "text-neon-cyan", description: "Usa calculadora — enfócate en el concepto" },
};

export default function ArenaPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.topic_id as string;
  const { getTopicProgress, getExerciseStats, recordExercise, masteryConfig } = useProgress();
  const { recordDailyProblem, recordReview, initReviewCard } = useStudy();

  // ── Page mode: config (select topics/difficulty) vs practice ──
  const [pageMode, setPageMode] = useState<PageMode>("config");

  // ── Config state ──
  const [topic, setTopic] = useState<Topic | null>(null);
  const [subtopics, setSubtopics] = useState<Topic[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState(0); // 0 = mixed
  const [problemCount, setProblemCount] = useState(8);

  // ── Practice state ──
  const [problems, setProblems] = useState<Problem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [state, setState] = useState<ArenaState>("solving");
  const [hintsUsed, setHintsUsed] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showHint1, setShowHint1] = useState(false);
  const [showHint2, setShowHint2] = useState(false);
  const [, setShowSolution] = useState(false);
  const [score, setScore] = useState(0);
  const [shake, setShake] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [sessionStats, setSessionStats] = useState({ attempted: 0, correct: 0 });

  // ── Initialize topic and subtopics ──
  useEffect(() => {
    setMounted(true);
    const t = getTopicById(topicId);
    setTopic(t || null);
    const progress = getTopicProgress(topicId);
    setScore(progress.score);

    // Get subtopics that have generators
    const subs = getSubtopics(topicId).filter((s) => hasGenerator(s.id));
    setSubtopics(subs);

    // If the topic itself has a generator (it's a subtopic), pre-select it
    if (hasGenerator(topicId) && subs.length === 0) {
      setSelectedTopics([topicId]);
    } else if (subs.length > 0) {
      // Pre-select all subtopics
      setSelectedTopics(subs.map((s) => s.id));
    }
  }, [topicId, getTopicProgress]);

  // ── Available topics to select from ──
  const selectableTopics = useMemo(() => {
    if (subtopics.length > 0) return subtopics;
    if (hasGenerator(topicId) && topic) return [topic];
    return [];
  }, [subtopics, topicId, topic]);

  // ── Start practice with current config ──
  const startPractice = useCallback(() => {
    if (selectedTopics.length === 0) return;

    let generated: Problem[];
    const diff = difficulty >= 1 && difficulty <= 5 ? difficulty : undefined;

    if (selectedTopics.length === 1) {
      generated = generateProblemSet(selectedTopics[0], problemCount, diff);
    } else {
      generated = generateCustomProblemSet(selectedTopics, problemCount, diff);
    }

    // Fallback to seed problems if no generator
    if (generated.length === 0) {
      generated = getProblemsForTopic(topicId);
    }

    setProblems(generated);
    setCurrentIndex(0);
    setAnswer("");
    setState("solving");
    setHintsUsed(0);
    setAttempts(0);
    setShowHint1(false);
    setShowHint2(false);
    setShowSolution(false);
    setSessionStats({ attempted: 0, correct: 0 });
    selectedTopics.forEach((t) => initReviewCard(t));
    setPageMode("practice");
  }, [selectedTopics, difficulty, problemCount, topicId, initReviewCard]);

  const currentProblem = problems[currentIndex];

  // ── Toggle topic selection ──
  const toggleTopic = useCallback((tid: string) => {
    setSelectedTopics((prev) =>
      prev.includes(tid) ? prev.filter((id) => id !== tid) : [...prev, tid]
    );
  }, []);

  const selectAll = useCallback(() => {
    setSelectedTopics(selectableTopics.map((t) => t.id));
  }, [selectableTopics]);

  const deselectAll = useCallback(() => {
    setSelectedTopics([]);
  }, []);

  // ── Submit answer ──
  const handleSubmit = useCallback(() => {
    if (!currentProblem || !answer.trim()) return;

    const isCorrect = checkAnswer(answer, currentProblem.correct_answer_latex);
    const problemDifficulty = currentProblem.difficulty || 1;

    if (isCorrect) {
      setState("correct");
      recordExercise(currentProblem.topic_id, true, problemDifficulty);
      recordDailyProblem(currentProblem.topic_id, true);
      recordReview(currentProblem.topic_id, attempts === 0 ? 5 : 3);
      setSessionStats((prev) => ({ attempted: prev.attempted + 1, correct: prev.correct + 1 }));
      // Score will be updated reactively from getTopicProgress after state change
      setTimeout(() => {
        const newProgress = getTopicProgress(currentProblem.topic_id);
        setScore(newProgress.score);
      }, 50);
    } else {
      setAttempts((prev) => prev + 1);
      setState("wrong");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setTimeout(() => setState("solving"), 3000);
    }
  }, [answer, currentProblem, attempts, recordExercise, recordDailyProblem, recordReview, getTopicProgress]);

  // ── Next problem ──
  const nextProblem = useCallback(() => {
    if (currentIndex < problems.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setAnswer("");
      setState("solving");
      setHintsUsed(0);
      setAttempts(0);
      setShowHint1(false);
      setShowHint2(false);
      setShowSolution(false);
    } else {
      // Finished batch — re-generate with same config
      startPractice();
    }
  }, [currentIndex, problems.length, startPractice]);

  const handleSurrender = useCallback(() => {
    if (!window.confirm("¿Seguro que quieres rendirte? Se mostrará la solución.")) return;
    setState("surrendered");
    setShowSolution(true);
    const pid = currentProblem?.topic_id || topicId;
    const problemDifficulty = currentProblem?.difficulty || 1;
    recordExercise(pid, false, problemDifficulty);
    recordDailyProblem(pid, false);
    recordReview(pid, 1);
    setSessionStats((prev) => ({ ...prev, attempted: prev.attempted + 1 }));
  }, [currentProblem, topicId, recordExercise, recordDailyProblem, recordReview]);

  const insertSymbol = useCallback((symbol: string) => {
    setAnswer((prev) => prev + symbol);
  }, []);

  if (!mounted) return null;

  if (!topic) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <Card glow="purple" className="text-center">
          <h2 className="text-lg font-bold text-text-primary mb-2">Tema no encontrado</h2>
          <p className="text-sm text-text-secondary mb-4">
            No hay problemas disponibles para este tema aún.
          </p>
          <NeonButton variant="cyan" onClick={() => router.push("/dashboard")}>
            Volver al Dashboard
          </NeonButton>
        </Card>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════
  // CONFIG MODE — Select topics, difficulty, problem count
  // ════════════════════════════════════════════════════════════════
  if (pageMode === "config") {
    return (
      <div className="min-h-screen bg-bg-primary bg-grid">
        <header className="sticky top-0 z-40 bg-bg-primary/80 backdrop-blur-md border-b border-text-muted/10">
          <div className="max-w-2xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors p-1"
            >
              <ArrowLeft size={16} />
            </button>
            <Settings size={18} className="text-neon-purple flex-shrink-0" />
            <h1 className="text-xs sm:text-sm font-bold text-text-primary flex-1 truncate">
              {topic.title}
            </h1>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-4 sm:space-y-6">
          {/* ── Topic Selection ── */}
          {selectableTopics.length > 1 && (
            <Card glow="purple">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                  Selecciona los temas a practicar
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={selectAll}
                    className="text-xs text-neon-cyan hover:text-neon-cyan/80 transition-colors"
                  >
                    Todos
                  </button>
                  <span className="text-text-muted text-xs">|</span>
                  <button
                    onClick={deselectAll}
                    className="text-xs text-text-muted hover:text-text-secondary transition-colors"
                  >
                    Ninguno
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                {selectableTopics.map((st) => {
                  const stats = getExerciseStats(st.id);
                  const isSelected = selectedTopics.includes(st.id);
                  return (
                    <button
                      key={st.id}
                      onClick={() => toggleTopic(st.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all text-left
                        ${isSelected
                          ? "bg-neon-purple/10 border-neon-purple/40 text-text-primary"
                          : "bg-bg-secondary/50 border-text-muted/10 text-text-secondary hover:border-text-muted/30"
                        }`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all
                          ${isSelected ? "bg-neon-purple border-neon-purple" : "border-text-muted/30"}`}
                        >
                          {isSelected && <CheckCircle2 size={14} className="text-white" />}
                        </div>
                        <span className="text-sm truncate">{st.title}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        {stats.attempted > 0 && (
                          <span className="text-xs text-text-muted font-mono">
                            {stats.correct}/{stats.attempted}
                          </span>
                        )}
                        <Badge color={stats.attempted > 0 ? (stats.correct / stats.attempted >= 0.7 ? "green" : "gray") : "gray"}>
                          {stats.attempted > 0
                            ? `${Math.round((stats.correct / stats.attempted) * 100)}%`
                            : "Nuevo"}
                        </Badge>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>
          )}

          {/* ── Difficulty Selection ── */}
          <Card glow="cyan">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4">
              Dificultad
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              <button
                onClick={() => setDifficulty(0)}
                className={`px-3 py-2.5 rounded-lg border text-xs font-semibold transition-all
                  ${difficulty === 0
                    ? "bg-neon-cyan/10 border-neon-cyan/40 text-neon-cyan"
                    : "bg-bg-secondary/50 border-text-muted/10 text-text-secondary hover:border-text-muted/30"
                  }`}
              >
                <Shuffle size={14} className="mx-auto mb-1" />
                Mixta
              </button>
              {[1, 2, 3, 4, 5].map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`px-3 py-2.5 rounded-lg border text-xs font-semibold transition-all
                    ${difficulty === d
                      ? "bg-neon-cyan/10 border-neon-cyan/40 text-neon-cyan"
                      : "bg-bg-secondary/50 border-text-muted/10 text-text-secondary hover:border-text-muted/30"
                    }`}
                >
                  <span className="block text-base mb-0.5">{"★".repeat(d)}</span>
                  Nv.{d}
                </button>
              ))}
            </div>
          </Card>

          {/* ── Problem Count ── */}
          <Card>
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4">
              Cantidad de problemas
            </h3>
            <div className="grid grid-cols-3 sm:flex gap-2">
              {[5, 8, 10, 15, 20, 30].map((n) => (
                <button
                  key={n}
                  onClick={() => setProblemCount(n)}
                  className={`sm:flex-1 px-3 py-3 sm:py-2.5 rounded-lg border text-sm font-mono font-bold transition-all
                    ${problemCount === n
                      ? "bg-neon-purple/10 border-neon-purple/40 text-neon-purple"
                      : "bg-bg-secondary/50 border-text-muted/10 text-text-secondary hover:border-text-muted/30"
                    }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </Card>

          {/* ── Exercise Stats Summary ── */}
          {selectableTopics.some((t) => getExerciseStats(t.id).attempted > 0) && (
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 size={16} className="text-neon-cyan" />
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                  Tu historial en estos temas
                </h3>
              </div>
              <div className="space-y-2">
                {selectableTopics
                  .filter((t) => getExerciseStats(t.id).attempted > 0)
                  .map((t) => {
                    const stats = getExerciseStats(t.id);
                    const pct = Math.round((stats.correct / stats.attempted) * 100);
                    return (
                      <div key={t.id} className="flex items-center gap-3">
                        <span className="text-xs text-text-secondary flex-1 truncate">{t.title}</span>
                        <span className="text-xs text-text-muted font-mono w-16 text-right">
                          {stats.correct}/{stats.attempted}
                        </span>
                        <div className="w-20">
                          <ProgressBar
                            value={pct}
                            color={pct >= 70 ? "green" : pct >= 40 ? "cyan" : "purple"}
                            showLabel={false}
                            size="sm"
                          />
                        </div>
                        <span className="text-xs font-mono w-10 text-right" style={{ color: pct >= 70 ? "var(--neon-green)" : "var(--text-muted)" }}>
                          {pct}%
                        </span>
                      </div>
                    );
                  })}
              </div>
            </Card>
          )}

          {/* ── Start Button ── */}
          <div className="flex gap-3">
            <NeonButton
              variant="ghost"
              size="md"
              icon={ArrowLeft}
              onClick={() => router.push("/dashboard")}
              className="flex-shrink-0"
            >
              Volver
            </NeonButton>
            <NeonButton
              variant="cyan"
              size="md"
              icon={Play}
              onClick={startPractice}
              disabled={selectedTopics.length === 0}
              className="flex-1"
            >
              Iniciar Práctica ({problemCount} problemas{difficulty > 0 ? ` · Dificultad ${difficulty}` : " · Mixta"})
            </NeonButton>
          </div>
        </main>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════
  // PRACTICE MODE
  // ════════════════════════════════════════════════════════════════
  if (problems.length === 0) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
        <Card glow="cyan" className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-neon-cyan/10 flex items-center justify-center mx-auto mb-4">
            <Sigma size={32} className="text-neon-cyan" />
          </div>
          <h2 className="text-lg font-bold text-text-primary mb-2">{topic.title}</h2>
          <p className="text-sm text-text-secondary mb-6">
            No hay problemas cargados para este tema todavía. Los problemas se irán añadiendo progresivamente.
          </p>
          <NeonButton variant="cyan" icon={ArrowLeft} onClick={() => router.push("/dashboard")}>
            Volver al Dashboard
          </NeonButton>
        </Card>
      </div>
    );
  }

  // Get calculator policy for current problem
  const calcPolicy = currentProblem?.calculator_policy || "optional";
  const policyMeta = CALC_POLICY_META[calcPolicy];
  const PolicyIcon = policyMeta.icon;

  // Get the topic name for current problem
  const currentProblemTopic = getTopicById(currentProblem?.topic_id || "");
  const currentProblemStats = getExerciseStats(currentProblem?.topic_id || "");

  return (
    <div className="min-h-screen bg-bg-primary bg-grid">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-bg-primary/80 backdrop-blur-md border-b border-text-muted/10">
        <div className="max-w-3xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center gap-1 text-sm text-text-muted hover:text-text-primary transition-colors p-1"
              >
                <ArrowLeft size={16} />
              </button>
              <button
                onClick={() => setPageMode("config")}
                className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors p-1"
              >
                <Settings size={14} />
                <span className="hidden sm:inline">Configurar</span>
              </button>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-end">
              {/* Session counter */}
              <Badge color="green">
                {sessionStats.correct}/{sessionStats.attempted}
              </Badge>
              <Badge color="purple">
                {currentIndex + 1}/{problems.length}
              </Badge>
              <Badge color="cyan">{score}%</Badge>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <h1 className="text-xs sm:text-sm font-bold text-text-primary flex-1 truncate">
              {currentProblemTopic?.title || topic.title}
            </h1>
            <div className="w-20 sm:w-auto flex-shrink-0">
              <ProgressBar
                value={currentIndex + 1}
                max={problems.length}
                color="cyan"
                showLabel={false}
                size="sm"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentProblem.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Problem Card */}
            <motion.div animate={shake ? { x: [-4, 4, -4, 4, 0] } : {}} transition={{ duration: 0.4 }}>
              <Card glow="cyan" className="mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge color="purple">
                      {"★".repeat(currentProblem.difficulty)}{"☆".repeat(5 - currentProblem.difficulty)}
                    </Badge>
                    {/* Calculator policy indicator */}
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold border
                      ${calcPolicy === "mental" ? "bg-green-500/10 border-green-500/30" : ""}
                      ${calcPolicy === "optional" ? "bg-yellow-500/10 border-yellow-500/30" : ""}
                      ${calcPolicy === "calculator" ? "bg-cyan-500/10 border-cyan-500/30" : ""}
                    `}
                      title={policyMeta.description}
                    >
                      <PolicyIcon size={11} className={policyMeta.color} />
                      <span className={policyMeta.color}>{policyMeta.label}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Exercise counter for this topic */}
                    <span className="text-[10px] sm:text-xs text-text-muted font-mono" title="Ejercicios resueltos de este tema">
                      {currentProblemStats.correct}/{currentProblemStats.attempted}
                    </span>
                    {attempts > 0 && state === "solving" && (
                      <Badge color="gray">×{attempts}</Badge>
                    )}
                  </div>
                </div>

                {/* Show subtopic name if practicing mixed topics */}
                {selectedTopics.length > 1 && currentProblemTopic && (
                  <div className="mb-2 px-2 py-1 rounded bg-bg-secondary/50 inline-block">
                    <span className="text-xs text-text-muted">{currentProblemTopic.title}</span>
                  </div>
                )}

                <div className="text-lg text-text-primary leading-relaxed py-4">
                  <MathRender content={currentProblem.statement_latex} block />
                </div>
              </Card>
            </motion.div>

            {/* Feedback States */}
            <AnimatePresence>
              {state === "correct" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="mb-6"
                >
                  <Card glow="green" className="text-center">
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <CheckCircle2 size={48} className="text-neon-green mx-auto mb-3" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-neon-green mb-1">¡Correcto!</h3>
                    <p className="text-sm text-text-secondary mb-4">
                      Has ganado puntos de maestría.
                    </p>
                    <NeonButton variant="green" icon={ChevronRight} onClick={nextProblem}>
                      {currentIndex < problems.length - 1
                        ? "Siguiente Problema"
                        : "Generar Nuevos"}
                    </NeonButton>
                  </Card>
                </motion.div>
              )}

              {state === "wrong" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0.8 }}
                  className="mb-6"
                >
                  <Card className="border-red-500/30 text-center">
                    <XCircle size={32} className="text-red-400 mx-auto mb-2" />
                    <h3 className="text-lg font-bold text-red-400">Incorrecto</h3>
                    <p className="text-sm text-text-secondary">Intenta de nuevo o usa una pista.</p>
                  </Card>
                </motion.div>
              )}

              {state === "surrendered" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-6"
                >
                  <Card glow="purple">
                    <h3 className="text-lg font-bold text-neon-purple mb-3">Solución Paso a Paso</h3>
                    <div className="text-text-primary bg-bg-secondary rounded-lg p-4">
                      <MathRender content={currentProblem.step_by_step_solution_latex} block />
                    </div>
                    <div className="mt-4 flex justify-center">
                      <NeonButton variant="purple" icon={ChevronRight} onClick={nextProblem}>
                        {currentIndex < problems.length - 1
                          ? "Siguiente Problema"
                          : "Generar Nuevos"}
                      </NeonButton>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hints */}
            <div className="space-y-3 mb-6">
              {(attempts >= 1 || showHint1) && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                  {!showHint1 ? (
                    <NeonButton
                      variant="ghost"
                      icon={Lightbulb}
                      size="sm"
                      onClick={() => {
                        setShowHint1(true);
                        setHintsUsed((h) => Math.max(h, 1));
                      }}
                    >
                      Ver Pista 1
                    </NeonButton>
                  ) : (
                    <Card className="!py-3 !px-4 border-yellow-500/20 bg-yellow-500/5">
                      <div className="flex items-start gap-2">
                        <Lightbulb size={16} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-text-primary">
                          <MathRender content={currentProblem.hint_1_latex} />
                        </div>
                      </div>
                    </Card>
                  )}
                </motion.div>
              )}

              {(attempts >= 2 || showHint2) && showHint1 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                  {!showHint2 ? (
                    <NeonButton
                      variant="ghost"
                      icon={Lightbulb}
                      size="sm"
                      onClick={() => {
                        setShowHint2(true);
                        setHintsUsed((h) => Math.max(h, 2));
                      }}
                    >
                      Ver Pista 2
                    </NeonButton>
                  ) : (
                    <Card className="!py-3 !px-4 border-orange-500/20 bg-orange-500/5">
                      <div className="flex items-start gap-2">
                        <Lightbulb size={16} className="text-orange-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-text-primary">
                          <MathRender content={currentProblem.hint_2_latex} />
                        </div>
                      </div>
                    </Card>
                  )}
                </motion.div>
              )}
            </div>

            {/* Answer Input */}
            {(state === "solving" || state === "wrong") && (
              <Card className="mb-4 !p-3 sm:!p-6">
                <label className="block text-xs text-text-secondary mb-2 font-semibold uppercase tracking-wider">
                  Tu Respuesta
                </label>

                {/* Quick symbol buttons */}
                <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-3">
                  {[
                    { label: "frac", symbol: "\\frac{}{}", icon: Divide },
                    { label: "√", symbol: "\\sqrt{}", icon: Radical },
                    { label: "x²", symbol: "^{}", icon: Superscript },
                    { label: "π", symbol: "\\pi", icon: Pi },
                    { label: "±", symbol: "\\pm" },
                    { label: "·", symbol: "\\cdot" },
                    { label: "≤", symbol: "\\leq" },
                    { label: "≥", symbol: "\\geq" },
                    { label: "∞", symbol: "\\infty" },
                    { label: "∑", symbol: "\\sum", icon: Sigma },
                    { label: "∫", symbol: "\\int" },
                    { label: "λ", symbol: "\\lambda" },
                  ].map((s) => (
                    <button
                      key={s.label}
                      onClick={() => insertSymbol(s.symbol)}
                      className="px-2 py-1.5 sm:px-2.5 rounded-md bg-bg-secondary border border-text-muted/20
                        text-text-secondary hover:text-neon-cyan hover:border-neon-cyan/30 active:scale-95
                        transition-all text-xs font-mono min-w-[2rem] min-h-[2rem]"
                      title={s.symbol}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSubmit();
                    }}
                    placeholder="Escribe tu respuesta..."
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    className="flex-1 bg-bg-secondary border border-text-muted/20 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3
                      text-text-primary placeholder-text-muted/50 font-mono text-sm
                      focus:outline-none focus:border-neon-cyan/50 focus:shadow-neon-cyan
                      transition-all min-w-0"
                  />
                  <NeonButton variant="cyan" icon={Send} onClick={handleSubmit} disabled={!answer.trim()}>
                    <span className="hidden sm:inline">Verificar</span>
                    <span className="sm:hidden">OK</span>
                  </NeonButton>
                </div>

                {/* Live preview */}
                {answer && (
                  <div className="mt-3 p-3 rounded-lg bg-bg-secondary/50 border border-text-muted/10">
                    <p className="text-xs text-text-muted mb-1">Vista previa:</p>
                    <div className="text-text-primary">
                      <MathRender content={`$${answer}$`} />
                    </div>
                  </div>
                )}
              </Card>
            )}

            {/* Action buttons */}
            {state === "solving" && (
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 sm:gap-0">
                <NeonButton
                  variant="danger"
                  size="sm"
                  icon={Eye}
                  onClick={handleSurrender}
                  className="w-full sm:w-auto"
                >
                  Rendirse
                </NeonButton>
                <div className="flex gap-2">
                  <NeonButton
                    variant="ghost"
                    size="sm"
                    icon={Settings}
                    onClick={() => setPageMode("config")}
                    className="flex-1 sm:flex-initial"
                  >
                    <span className="hidden sm:inline">Reconfigurar</span>
                    <span className="sm:hidden">Config</span>
                  </NeonButton>
                  <NeonButton
                    variant="ghost"
                    size="sm"
                    icon={RefreshCw}
                    onClick={startPractice}
                    className="flex-1 sm:flex-initial"
                  >
                    <span className="hidden sm:inline">Regenerar</span>
                    <span className="sm:hidden">Nueva</span>
                  </NeonButton>
                  <NeonButton
                    variant="ghost"
                    size="sm"
                    icon={SkipForward}
                    onClick={nextProblem}
                    className="flex-1 sm:flex-initial"
                  >
                    Saltar
                  </NeonButton>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

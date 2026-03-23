"use client";

import { useState, useEffect, useCallback } from "react";
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
} from "lucide-react";
import MathRender from "@/components/MathRender";
import { NeonButton, Card, ProgressBar, Badge } from "@/components/ui";
import {
  getTopicById,
  getProblemsForTopic,
  checkAnswer,
} from "@/lib/store";
import { generateProblemSet, hasGenerator } from "@/lib/problemGenerator";
import { useProgress } from "@/lib/ProgressContext";
import { Problem, Topic } from "@/lib/types";

type ArenaState = "solving" | "correct" | "wrong" | "surrendered";

export default function ArenaPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.topic_id as string;
  const { getTopicProgress, addScore } = useProgress();

  const [topic, setTopic] = useState<Topic | null>(null);
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
  const [isRandomMode, setIsRandomMode] = useState(false);

  const loadProblems = useCallback((random: boolean) => {
    if (random && hasGenerator(topicId)) {
      setProblems(generateProblemSet(topicId, 8));
      setIsRandomMode(true);
    } else {
      setProblems(getProblemsForTopic(topicId));
      setIsRandomMode(false);
    }
    setCurrentIndex(0);
    setAnswer("");
    setState("solving");
    setHintsUsed(0);
    setAttempts(0);
    setShowHint1(false);
    setShowHint2(false);
    setShowSolution(false);
  }, [topicId]);

  useEffect(() => {
    setMounted(true);
    const t = getTopicById(topicId);
    setTopic(t || null);
    const progress = getTopicProgress(topicId);
    setScore(progress.score);
    // Default: use random if generator available, else seed problems
    if (hasGenerator(topicId)) {
      setProblems(generateProblemSet(topicId, 8));
      setIsRandomMode(true);
    } else {
      setProblems(getProblemsForTopic(topicId));
    }
  }, [topicId, getTopicProgress]);

  const currentProblem = problems[currentIndex];

  const handleSubmit = useCallback(() => {
    if (!currentProblem || !answer.trim()) return;

    const isCorrect = checkAnswer(answer, currentProblem.correct_answer_latex);

    if (isCorrect) {
      setState("correct");
      const points = Math.max(20 - hintsUsed * 5 - (attempts * 3), 5);
      addScore(topicId, points);
      setScore((prev) => Math.min(prev + points, 100));
    } else {
      setAttempts((prev) => prev + 1);
      setState("wrong");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      // After a brief moment, go back to solving
      setTimeout(() => setState("solving"), 1500);
    }
  }, [answer, currentProblem, hintsUsed, attempts, topicId, addScore]);

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
    } else if (isRandomMode) {
      // Generate a fresh batch
      loadProblems(true);
    } else {
      router.push("/dashboard");
    }
  }, [currentIndex, problems.length, router, isRandomMode, loadProblems]);

  const handleSurrender = useCallback(() => {
    setState("surrendered");
    setShowSolution(true);
  }, []);

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

  return (
    <div className="min-h-screen bg-bg-primary bg-grid">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-bg-primary/80 backdrop-blur-md border-b border-text-muted/10">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Dashboard</span>
            </button>
            <div className="flex items-center gap-2">
              {isRandomMode && (
                <Badge color="green">
                  <Shuffle size={12} className="inline mr-1" />Random
                </Badge>
              )}
              <Badge color="purple">
                {currentIndex + 1} / {problems.length}
              </Badge>
              <Badge color="cyan">Puntos: {score}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-bold text-text-primary flex-1 truncate">
              {topic.title}
            </h1>
            <ProgressBar
              value={currentIndex + 1}
              max={problems.length}
              color="cyan"
              showLabel={false}
              size="sm"
            />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
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
              <Card glow="cyan" className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge color="purple">
                    Dificultad: {"★".repeat(currentProblem.difficulty)}{"☆".repeat(5 - currentProblem.difficulty)}
                  </Badge>
                  {attempts > 0 && state === "solving" && (
                    <Badge color="gray">Intentos: {attempts}</Badge>
                  )}
                </div>

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
                        : isRandomMode
                          ? "Generar Nuevos"
                          : "Finalizar"}
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
                          : isRandomMode
                            ? "Generar Nuevos"
                            : "Finalizar"}
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
              <Card className="mb-4">
                <label className="block text-xs text-text-secondary mb-2 font-semibold uppercase tracking-wider">
                  Tu Respuesta (LaTeX)
                </label>

                {/* Quick symbol buttons */}
                <div className="flex flex-wrap gap-1.5 mb-3">
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
                      className="px-2.5 py-1.5 rounded-md bg-bg-secondary border border-text-muted/20
                        text-text-secondary hover:text-neon-cyan hover:border-neon-cyan/30
                        transition-all text-xs font-mono"
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
                    placeholder="Escribe tu respuesta aquí... (ej: \\frac{2}{3})"
                    className="flex-1 bg-bg-secondary border border-text-muted/20 rounded-lg px-4 py-3
                      text-text-primary placeholder-text-muted/50 font-mono text-sm
                      focus:outline-none focus:border-neon-cyan/50 focus:shadow-neon-cyan
                      transition-all"
                  />
                  <NeonButton variant="cyan" icon={Send} onClick={handleSubmit} disabled={!answer.trim()}>
                    Verificar
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
              <div className="flex justify-between items-center">
                <NeonButton
                  variant="danger"
                  size="sm"
                  icon={Eye}
                  onClick={handleSurrender}
                >
                  Rendirse (Ver Solución)
                </NeonButton>
                <div className="flex gap-2">
                  {hasGenerator(topicId) && (
                    <NeonButton
                      variant="ghost"
                      size="sm"
                      icon={RefreshCw}
                      onClick={() => loadProblems(true)}
                    >
                      Regenerar
                    </NeonButton>
                  )}
                  <NeonButton
                    variant="ghost"
                    size="sm"
                    icon={SkipForward}
                    onClick={nextProblem}
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

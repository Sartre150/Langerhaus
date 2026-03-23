"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  LineChart,
  Globe,
  Dumbbell,
  Lightbulb,
  ChevronRight,
  Sparkles,
  Brain,
  Zap,
} from "lucide-react";
import MathRender from "@/components/MathRender";
import MathVisualizer from "@/components/MathVisualizer";
import { NeonButton, Card, Badge } from "@/components/ui";
import { getTopicById } from "@/lib/store";
import { Topic, TopicExplanation } from "@/lib/types";

type Tab = "teoria" | "visualizacion" | "aplicaciones" | "practica";

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "teoria", label: "Teoría", icon: <BookOpen size={16} /> },
  { id: "visualizacion", label: "Visualización", icon: <LineChart size={16} /> },
  { id: "aplicaciones", label: "Aplicaciones", icon: <Globe size={16} /> },
  { id: "practica", label: "Práctica", icon: <Dumbbell size={16} /> },
];

export default function LearnPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.topic_id as string;

  const [topic, setTopic] = useState<Topic | null>(null);
  const [explanation, setExplanation] = useState<TopicExplanation | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("teoria");
  const [expandedSection, setExpandedSection] = useState<number>(0);

  useEffect(() => {
    const t = getTopicById(topicId);
    setTopic(t || null);
    // Lazy-load explanations to reduce initial bundle
    import("@/lib/explanations").then((mod) => {
      setExplanation(mod.getExplanation(topicId) || null);
    });
  }, [topicId]);

  if (!topic) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-gray-400 mb-4">Contenido de aprendizaje no encontrado para este tema.</p>
          <NeonButton onClick={() => router.push("/dashboard")}>Volver al Dashboard</NeonButton>
        </Card>
      </div>
    );
  }

  if (!explanation) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <Brain size={48} className="mx-auto text-neon-purple mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">{topic.title}</h2>
          <p className="text-gray-400 mb-6">El contenido de aprendizaje profundo para este tema se está desarrollando. Por ahora, ve directamente a practicar.</p>
          <div className="flex gap-3 justify-center">
            <NeonButton variant="ghost" onClick={() => router.push("/dashboard")}>
              <ArrowLeft size={16} /> Dashboard
            </NeonButton>
            <NeonButton onClick={() => router.push(`/arena/${topicId}`)}>
              <Zap size={16} /> Ir a la Arena
            </NeonButton>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-800 bg-primary/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/dashboard")} className="text-gray-400 hover:text-white transition">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-lg font-bold text-white">{topic.title}</h1>
              <p className="text-xs text-gray-500">Nivel {topic.level}</p>
            </div>
          </div>
          <NeonButton variant="green" onClick={() => router.push(`/arena/${topicId}`)}>
            <Dumbbell size={16} /> Practicar
          </NeonButton>
        </div>

        {/* Tabs */}
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-neon-cyan text-neon-cyan"
                    : "border-transparent text-gray-500 hover:text-gray-300"
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "teoria" && <TeoriaTab explanation={explanation} expandedSection={expandedSection} setExpandedSection={setExpandedSection} />}
            {activeTab === "visualizacion" && <VisualizacionTab explanation={explanation} />}
            {activeTab === "aplicaciones" && <AplicacionesTab explanation={explanation} />}
            {activeTab === "practica" && <PracticaTab explanation={explanation} topicId={topicId} router={router} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

// ── TAB: TEORÍA ──

function TeoriaTab({
  explanation,
  expandedSection,
  setExpandedSection,
}: {
  explanation: TopicExplanation;
  expandedSection: number;
  setExpandedSection: (n: number) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Why it matters */}
      <Card glow="cyan" className="p-6">
        <div className="flex items-start gap-3">
          <Sparkles size={24} className="text-neon-cyan shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-bold text-neon-cyan mb-2">¿Por qué importa?</h3>
            <p className="text-gray-300 leading-relaxed">{explanation.why_it_matters}</p>
          </div>
        </div>
      </Card>

      {/* Theory sections */}
      <div className="space-y-3">
        {explanation.theory_sections.map((section, i) => (
          <Card key={i} className="overflow-hidden">
            <button
              className="w-full text-left p-4 flex items-center justify-between hover:bg-white/5 transition"
              onClick={() => setExpandedSection(expandedSection === i ? -1 : i)}
            >
              <span className="font-semibold text-white flex items-center gap-2">
                <BookOpen size={16} className="text-neon-purple" />
                {section.title}
              </span>
              <ChevronRight
                size={18}
                className={`text-gray-400 transition-transform ${expandedSection === i ? "rotate-90" : ""}`}
              />
            </button>
            <AnimatePresence>
              {expandedSection === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 border-t border-gray-800 pt-3">
                    <div className="text-gray-300 leading-relaxed math-content">
                      <MathRender content={section.content_latex} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        ))}
      </div>

      {/* Key formulas */}
      {explanation.key_formulas.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-bold text-neon-green mb-4 flex items-center gap-2">
            <Zap size={20} /> Fórmulas Clave
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {explanation.key_formulas.map((f, i) => (
              <div key={i} className="bg-gray-900/50 rounded-lg p-3 border border-gray-800">
                <span className="text-xs text-gray-500 block mb-1">{f.name}</span>
                <div className="text-lg">
                  <MathRender content={f.formula_latex} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Pro tips */}
      {explanation.pro_tips.length > 0 && (
        <Card glow="purple" className="p-6">
          <h3 className="text-lg font-bold text-neon-purple mb-3 flex items-center gap-2">
            <Lightbulb size={20} /> Pro Tips
          </h3>
          <ul className="space-y-2">
            {explanation.pro_tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-300">
                <span className="text-neon-purple shrink-0 mt-1">▸</span>
                <MathRender content={tip} />
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

// ── TAB: VISUALIZACIÓN ──

function VisualizacionTab({ explanation }: { explanation: TopicExplanation }) {
  if (explanation.visualizer.type === "none") {
    return (
      <Card className="p-8 text-center">
        <LineChart size={48} className="mx-auto text-gray-600 mb-4" />
        <p className="text-gray-400">Este tema no tiene una visualización interactiva disponible.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <LineChart size={20} className="text-neon-cyan" /> Visualización Interactiva
        </h3>
        <MathVisualizer config={explanation.visualizer} />
      </Card>
      <p className="text-xs text-gray-500 text-center">
        Interactúa con los controles para explorar el concepto visualmente. Modifica valores y observa cómo cambia el resultado.
      </p>
    </div>
  );
}

// ── TAB: APLICACIONES ──

function AplicacionesTab({ explanation }: { explanation: TopicExplanation }) {
  if (!explanation.applications.length) {
    return (
      <Card className="p-8 text-center">
        <Globe size={48} className="mx-auto text-gray-600 mb-4" />
        <p className="text-gray-400">Aplicaciones del mundo real próximamente.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {explanation.applications.map((app, i) => (
        <Card key={i} className="p-6">
          <div className="flex items-start gap-3">
            <span className="text-3xl">{app.icon}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge color="purple">{app.field}</Badge>
              </div>
              <h4 className="text-lg font-bold text-white mb-2">{app.title}</h4>
              <div className="text-gray-400 mb-3 leading-relaxed">
                <MathRender content={app.description} />
              </div>
              {app.example_latex && (
                <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-800">
                  <span className="text-xs text-neon-cyan block mb-1">Ejemplo concreto:</span>
                  <MathRender content={app.example_latex} />
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// ── TAB: PRÁCTICA (Ejemplos resueltos + enlace Arena) ──

function PracticaTab({
  explanation,
  topicId,
  router,
}: {
  explanation: TopicExplanation;
  topicId: string;
  router: ReturnType<typeof useRouter>;
}) {
  const [revealedSolutions, setRevealedSolutions] = useState<Set<number>>(new Set());

  const toggleSolution = (i: number) => {
    setRevealedSolutions((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Worked examples */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Brain size={20} className="text-neon-cyan" /> Ejemplos Resueltos
        </h3>
        {explanation.worked_examples.map((ex, i) => (
          <Card key={i} className="p-6">
            <h4 className="font-semibold text-neon-cyan mb-3">{ex.title}</h4>
            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800 mb-3">
              <span className="text-xs text-gray-500 block mb-2">PROBLEMA:</span>
              <MathRender content={ex.problem_latex} />
            </div>
            {!revealedSolutions.has(i) ? (
              <NeonButton variant="ghost" onClick={() => toggleSolution(i)}>
                <Lightbulb size={16} /> Ver Solución Paso a Paso
              </NeonButton>
            ) : (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="overflow-hidden"
              >
                <div className="bg-neon-green/5 rounded-lg p-4 border border-neon-green/20">
                  <span className="text-xs text-neon-green block mb-2">SOLUCIÓN:</span>
                  <div className="text-gray-300 leading-relaxed">
                    <MathRender content={ex.solution_latex} />
                  </div>
                </div>
                <button onClick={() => toggleSolution(i)} className="text-xs text-gray-500 mt-2 hover:text-gray-300 transition">
                  Ocultar solución
                </button>
              </motion.div>
            )}
          </Card>
        ))}
      </div>

      {/* CTA to Arena */}
      <Card glow="green" className="p-8 text-center">
        <Dumbbell size={40} className="mx-auto text-neon-green mb-3" />
        <h3 className="text-xl font-bold text-white mb-2">¿Listo para practicar?</h3>
        <p className="text-gray-400 mb-4">Pon a prueba tu conocimiento resolviendo problemas interactivos en la Arena.</p>
        <NeonButton variant="green" onClick={() => router.push(`/arena/${topicId}`)}>
          <Zap size={18} /> Entrar a la Arena
        </NeonButton>
      </Card>
    </div>
  );
}

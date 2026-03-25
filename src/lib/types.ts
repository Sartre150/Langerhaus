export type TopicStatus = "locked" | "unlocked" | "mastered";

export interface Topic {
  id: string;
  level: number;
  title: string;
  description: string;
  parent_topic_id: string | null;
  is_locked_by_default: boolean;
}

export type CalculatorPolicy = "mental" | "calculator" | "optional";

export interface Problem {
  id: string;
  topic_id: string;
  difficulty: number;
  statement_latex: string;
  correct_answer_latex: string;
  hint_1_latex: string;
  hint_2_latex: string;
  step_by_step_solution_latex: string;
  calculator_policy?: CalculatorPolicy;
}

export interface DifficultyBucket {
  attempted: number;
  correct: number;
}

export interface ExerciseStats {
  attempted: number;
  correct: number;
  /** Breakdown by difficulty level (1-5) */
  byDifficulty: Record<number, DifficultyBucket>;
  /** Current consecutive-correct streak */
  currentStreak: number;
  /** Best consecutive-correct streak ever */
  bestStreak: number;
}

// ── Mastery Calculation Constants ──
// Based on Bloom's Mastery Learning & Knowledge Space Theory
export const MASTERY_CONFIG = {
  /** Minimum exercises needed before mastery is possible */
  MIN_EXERCISES: 15,
  /** Minimum accuracy ratio (0-1) required for mastery */
  MIN_ACCURACY: 0.80,
  /** Minimum number of problems solved at difficulty ≥ 3 */
  MIN_HARD_PROBLEMS: 3,
  /** Minimum difficulty level that counts as "hard" */
  HARD_DIFFICULTY_THRESHOLD: 3,
  /** Weight of each component in the composite score (must sum to 100) */
  WEIGHTS: {
    ACCURACY: 35,     // Correctness ratio
    VOLUME: 20,       // Enough practice to be statistically meaningful
    DIFFICULTY: 35,   // Proving competence at higher cognitive levels
    CONSISTENCY: 10,  // Stable knowledge via consecutive correct streaks
  },
  /** Streak length that yields full consistency credit */
  STREAK_FOR_FULL_CREDIT: 5,
} as const;

// ── Spaced Repetition (SM-2 inspired) ──

export interface ReviewCard {
  topicId: string;
  /** Next review date (ISO string) */
  nextReview: string;
  /** Interval in days until next review */
  interval: number;
  /** Ease factor (≥1.3, default 2.5) */
  easeFactor: number;
  /** Number of consecutive correct reviews */
  repetitions: number;
  /** Last review date (ISO string) */
  lastReview: string;
}

// ── Daily Activity & Streak ──

export interface DailyActivity {
  /** ISO date string YYYY-MM-DD */
  date: string;
  problemsSolved: number;
  problemsCorrect: number;
  timeSpentMinutes: number;
  topicsPracticed: string[];
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  dailyGoal: number;      // problems per day
  todayProgress: number;   // problems solved today
}

export interface PracticeConfig {
  selectedTopics: string[];
  difficulty: number;       // 1-5, 0 = mixed
  problemCount: number;
}

export interface UserProgress {
  user_id: string;
  topic_id: string;
  status: TopicStatus;
  score: number;
}

export interface TopicWithProgress extends Topic {
  status: TopicStatus;
  score: number;
  children: TopicWithProgress[];
}

// ── Learning Content Types ──

export interface RealWorldApp {
  field: string;          // e.g. "Ingeniería", "Finanzas", "Física"
  icon: string;           // emoji
  title: string;
  description: string;
  example_latex?: string; // concrete worked example
}

export type VisualizerType =
  | "function-plot"
  | "fraction-bars"
  | "number-line"
  | "unit-circle"
  | "derivative-tangent"
  | "integral-area"
  | "vector-2d"
  | "matrix-transform"
  | "none";

export interface VisualizerConfig {
  type: VisualizerType;
  /** Default math expression for the visualizer, e.g. "x^2" */
  defaultExpression?: string;
  /** Extra params the visualizer needs */
  params?: Record<string, number | string | boolean>;
}

export interface TopicExplanation {
  topic_id: string;
  /** Conceptual intro — "¿Por qué importa?" */
  why_it_matters: string;
  /** Core theory broken into digestible sections */
  theory_sections: {
    title: string;
    content_latex: string;
  }[];
  /** Key formulas/rules to memorize */
  key_formulas: {
    name: string;
    formula_latex: string;
  }[];
  /** Real-world applications across fields */
  applications: RealWorldApp[];
  /** Worked examples from textbooks (Stewart, Strang, etc.) */
  worked_examples: {
    title: string;
    problem_latex: string;
    solution_latex: string;
  }[];
  /** Which visualizer to show */
  visualizer: VisualizerConfig;
  /** Pro tips / learning strategies */
  pro_tips: string[];
}

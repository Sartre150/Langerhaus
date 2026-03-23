"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/AuthContext";
import { seedTopics } from "@/lib/seedData";
import { ReviewCard, StreakData, DailyActivity } from "@/lib/types";

// ══════════════════════════════════════════════════════════════════
// SM-2 Spaced Repetition + Daily Streak + Study Intelligence
// ══════════════════════════════════════════════════════════════════

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a), db = new Date(b);
  return Math.round((db.getTime() - da.getTime()) / 86400000);
}

// ── SM-2 Algorithm ──
function sm2Update(
  card: ReviewCard,
  quality: number // 0-5 (0=blackout, 3=correct with difficulty, 5=perfect)
): ReviewCard {
  const now = todayISO();
  let { easeFactor, interval, repetitions } = card;

  if (quality >= 3) {
    // Correct response
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * easeFactor);
    repetitions++;
  } else {
    // Incorrect — reset
    repetitions = 0;
    interval = 1;
  }

  // Update ease factor (never below 1.3)
  easeFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + interval);

  return {
    ...card,
    easeFactor,
    interval,
    repetitions,
    lastReview: now,
    nextReview: nextDate.toISOString().slice(0, 10),
  };
}

// ── Context Interface ──

interface StudyContextType {
  // Spaced repetition
  reviewCards: ReviewCard[];
  getDueReviews: () => ReviewCard[];
  getUpcomingReviews: (days: number) => ReviewCard[];
  recordReview: (topicId: string, quality: number) => void;
  initReviewCard: (topicId: string) => void;
  
  // Daily streak
  streak: StreakData;
  recordDailyProblem: (topicId: string, correct: boolean) => void;
  setDailyGoal: (goal: number) => void;
  getActivityHistory: (days: number) => DailyActivity[];
  
  // Smart recommendations
  getRecommendedTopics: () => { topicId: string; reason: string; priority: number }[];
  getWeakTopics: () => { topicId: string; accuracy: number; attempted: number }[];
}

const StudyContext = createContext<StudyContextType>({
  reviewCards: [],
  getDueReviews: () => [],
  getUpcomingReviews: () => [],
  recordReview: () => {},
  initReviewCard: () => {},
  streak: { currentStreak: 0, longestStreak: 0, lastActiveDate: "", dailyGoal: 10, todayProgress: 0 },
  recordDailyProblem: () => {},
  setDailyGoal: () => {},
  getActivityHistory: () => [],
  getRecommendedTopics: () => [],
  getWeakTopics: () => [],
});

export function StudyProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [reviewCards, setReviewCards] = useState<ReviewCard[]>([]);
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: "",
    dailyGoal: 10,
    todayProgress: 0,
  });
  const [activityLog, setActivityLog] = useState<DailyActivity[]>([]);

  // ── Storage keys ──
  const storageKey = useCallback((suffix: string) => {
    const uid = user?.id || "guest";
    return `study-${suffix}-${uid}`;
  }, [user]);

  // ── Load from localStorage ──
  useEffect(() => {
    try {
      const cardsRaw = localStorage.getItem(storageKey("review-cards"));
      if (cardsRaw) setReviewCards(JSON.parse(cardsRaw));

      const streakRaw = localStorage.getItem(storageKey("streak"));
      if (streakRaw) {
        const parsed = JSON.parse(streakRaw) as StreakData;
        // Check if streak is still alive (last active yesterday or today)
        const today = todayISO();
        const gap = daysBetween(parsed.lastActiveDate, today);
        if (gap > 1) {
          // Streak broken
          parsed.currentStreak = 0;
          parsed.todayProgress = 0;
        } else if (gap === 1) {
          // New day, keep streak but reset today progress
          parsed.todayProgress = 0;
        }
        // gap === 0: same day, keep everything
        setStreakData(parsed);
      }

      const logRaw = localStorage.getItem(storageKey("activity-log"));
      if (logRaw) setActivityLog(JSON.parse(logRaw));
    } catch { /* ignore corrupt storage */ }
  }, [storageKey]);

  // ── Persist helpers ──
  const persistCards = useCallback((cards: ReviewCard[]) => {
    try { localStorage.setItem(storageKey("review-cards"), JSON.stringify(cards)); } catch {}
  }, [storageKey]);

  const persistStreak = useCallback((data: StreakData) => {
    try { localStorage.setItem(storageKey("streak"), JSON.stringify(data)); } catch {}
  }, [storageKey]);

  const persistLog = useCallback((log: DailyActivity[]) => {
    // Keep last 90 days
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 90);
    const trimmed = log.filter((a) => new Date(a.date) >= cutoff);
    try { localStorage.setItem(storageKey("activity-log"), JSON.stringify(trimmed)); } catch {}
  }, [storageKey]);

  // ══════════════════════════════════════════════════════════════
  // SPACED REPETITION
  // ══════════════════════════════════════════════════════════════

  const initReviewCard = useCallback((topicId: string) => {
    setReviewCards((prev) => {
      if (prev.some((c) => c.topicId === topicId)) return prev;
      const now = todayISO();
      const next = [...prev, {
        topicId,
        nextReview: now,
        interval: 1,
        easeFactor: 2.5,
        repetitions: 0,
        lastReview: now,
      }];
      setTimeout(() => persistCards(next), 0);
      return next;
    });
  }, [persistCards]);

  const getDueReviews = useCallback((): ReviewCard[] => {
    const today = todayISO();
    return reviewCards.filter((c) => c.nextReview <= today);
  }, [reviewCards]);

  const getUpcomingReviews = useCallback((days: number): ReviewCard[] => {
    const future = new Date();
    future.setDate(future.getDate() + days);
    const futureISO = future.toISOString().slice(0, 10);
    const today = todayISO();
    return reviewCards.filter((c) => c.nextReview > today && c.nextReview <= futureISO);
  }, [reviewCards]);

  const recordReview = useCallback((topicId: string, quality: number) => {
    setReviewCards((prev) => {
      const next = prev.map((c) =>
        c.topicId === topicId ? sm2Update(c, quality) : c
      );
      setTimeout(() => persistCards(next), 0);
      return next;
    });
  }, [persistCards]);

  // ══════════════════════════════════════════════════════════════
  // DAILY STREAK & ACTIVITY
  // ══════════════════════════════════════════════════════════════

  const recordDailyProblem = useCallback((topicId: string, correct: boolean) => {
    const today = todayISO();

    // Update streak
    setStreakData((prev) => {
      const isNewDay = prev.lastActiveDate !== today;
      const wasYesterday = daysBetween(prev.lastActiveDate, today) === 1;
      
      let newStreak = prev.currentStreak;
      if (isNewDay) {
        if (wasYesterday || prev.lastActiveDate === "") {
          newStreak = prev.currentStreak + 1;
        } else if (daysBetween(prev.lastActiveDate, today) > 1) {
          newStreak = 1; // Restart streak
        }
      }

      const updated: StreakData = {
        currentStreak: newStreak,
        longestStreak: Math.max(prev.longestStreak, newStreak),
        lastActiveDate: today,
        dailyGoal: prev.dailyGoal,
        todayProgress: isNewDay ? 1 : prev.todayProgress + 1,
      };
      setTimeout(() => persistStreak(updated), 0);
      return updated;
    });

    // Update activity log
    setActivityLog((prev) => {
      const next = [...prev];
      const todayEntry = next.find((a) => a.date === today);
      if (todayEntry) {
        todayEntry.problemsSolved++;
        if (correct) todayEntry.problemsCorrect++;
        if (!todayEntry.topicsPracticed.includes(topicId)) {
          todayEntry.topicsPracticed.push(topicId);
        }
      } else {
        next.push({
          date: today,
          problemsSolved: 1,
          problemsCorrect: correct ? 1 : 0,
          timeSpentMinutes: 0,
          topicsPracticed: [topicId],
        });
      }
      setTimeout(() => persistLog(next), 0);
      return next;
    });
  }, [persistStreak, persistLog]);

  const setDailyGoal = useCallback((goal: number) => {
    setStreakData((prev) => {
      const updated = { ...prev, dailyGoal: Math.max(1, Math.min(100, goal)) };
      setTimeout(() => persistStreak(updated), 0);
      return updated;
    });
  }, [persistStreak]);

  const getActivityHistory = useCallback((days: number): DailyActivity[] => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const cutoffISO = cutoff.toISOString().slice(0, 10);
    return activityLog.filter((a) => a.date >= cutoffISO).sort((a, b) => a.date.localeCompare(b.date));
  }, [activityLog]);

  // ══════════════════════════════════════════════════════════════
  // SMART RECOMMENDATIONS
  // ══════════════════════════════════════════════════════════════

  const getWeakTopics = useCallback((): { topicId: string; accuracy: number; attempted: number }[] => {
    // Get exercise stats from localStorage directly (cross-context)
    try {
      const uid = user?.id || "guest";
      const raw = localStorage.getItem(`exercise-stats-${uid}`);
      if (!raw) return [];
      const stats = JSON.parse(raw) as Record<string, { attempted: number; correct: number }>;
      
      return Object.entries(stats)
        .filter(([, s]) => s.attempted >= 3) // Minimum 3 attempts to judge
        .map(([topicId, s]) => ({
          topicId,
          accuracy: Math.round((s.correct / s.attempted) * 100),
          attempted: s.attempted,
        }))
        .filter((t) => t.accuracy < 70) // Below 70% = weak
        .sort((a, b) => a.accuracy - b.accuracy); // Worst first
    } catch {
      return [];
    }
  }, [user]);

  const getRecommendedTopics = useCallback((): { topicId: string; reason: string; priority: number }[] => {
    const recs: { topicId: string; reason: string; priority: number }[] = [];

    // Priority 1: Due spaced reviews
    const due = getDueReviews();
    due.forEach((c) => {
      const topic = seedTopics.find((t) => t.id === c.topicId);
      if (topic) {
        recs.push({
          topicId: c.topicId,
          reason: `Repaso pendiente — ${c.interval > 7 ? "refuerzo" : "consolidación"}`,
          priority: 1,
        });
      }
    });

    // Priority 2: Weak topics (low accuracy)
    const weak = getWeakTopics();
    weak.slice(0, 3).forEach((w) => {
      if (!recs.some((r) => r.topicId === w.topicId)) {
        const topic = seedTopics.find((t) => t.id === w.topicId);
        if (topic) {
          recs.push({
            topicId: w.topicId,
            reason: `Precisión baja (${w.accuracy}%) — practica más`,
            priority: 2,
          });
        }
      }
    });

    // Priority 3: Unlocked but not practiced topics
    try {
      const uid = user?.id || "guest";
      const raw = localStorage.getItem(`exercise-stats-${uid}`);
      const stats = raw ? JSON.parse(raw) as Record<string, { attempted: number }> : {};
      
      // Find subtopics that are unlocked (have generators) but never attempted
      const subtopics = seedTopics.filter((t) => t.parent_topic_id !== null);
      subtopics.forEach((t) => {
        if (!stats[t.id] && !recs.some((r) => r.topicId === t.id)) {
          recs.push({
            topicId: t.id,
            reason: "Tema nuevo — ¡empieza aquí!",
            priority: 3,
          });
        }
      });
    } catch {}

    return recs.sort((a, b) => a.priority - b.priority).slice(0, 5);
  }, [getDueReviews, getWeakTopics, user]);

  return (
    <StudyContext.Provider
      value={{
        reviewCards,
        getDueReviews,
        getUpcomingReviews,
        recordReview,
        initReviewCard,
        streak: streakData,
        recordDailyProblem,
        setDailyGoal,
        getActivityHistory,
        getRecommendedTopics,
        getWeakTopics,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
}

export const useStudy = () => useContext(StudyContext);

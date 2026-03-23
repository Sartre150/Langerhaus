"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/AuthContext";
import { seedTopics } from "@/lib/seedData";
import { TopicStatus, TopicWithProgress } from "@/lib/types";

interface ProgressEntry {
  status: TopicStatus;
  score: number;
}

interface ProgressContextType {
  /** True while initial load from Supabase is in flight */
  progressLoading: boolean;
  getTopicProgress: (topicId: string) => ProgressEntry;
  addScore: (topicId: string, points: number) => void;
  getTopicsTree: () => TopicWithProgress[];
  resetProgress: () => void;
}

const ProgressContext = createContext<ProgressContextType>({
  progressLoading: true,
  getTopicProgress: () => ({ status: "locked", score: 0 }),
  addScore: () => {},
  getTopicsTree: () => [],
  resetProgress: () => {},
});

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [progressMap, setProgressMap] = useState<Map<string, ProgressEntry>>(new Map());
  const [progressLoading, setProgressLoading] = useState(true);
  // Keep a mutable ref so fire-and-forget helpers always see latest map
  const mapRef = useRef(progressMap);
  mapRef.current = progressMap;

  // ── Build default progress from seed data ──
  const buildDefaults = useCallback((): Map<string, ProgressEntry> => {
    const m = new Map<string, ProgressEntry>();
    seedTopics.forEach((t) => {
      m.set(t.id, {
        status: t.is_locked_by_default ? "locked" : "unlocked",
        score: 0,
      });
    });
    return m;
  }, []);

  // ── Load progress from Supabase when user signs in ──
  useEffect(() => {
    if (!user) {
      // No user → use defaults (guest mode)
      setProgressMap(buildDefaults());
      setProgressLoading(false);
      return;
    }

    let cancelled = false;
    setProgressLoading(true);

    (async () => {
      const defaults = buildDefaults();

      const { data, error } = await supabase
        .from("user_progress")
        .select("topic_id, status, score")
        .eq("user_id", user.id);

      if (cancelled) return;

      if (!error && data && data.length > 0) {
        // Overlay DB rows on top of defaults
        data.forEach((row: { topic_id: string; status: TopicStatus; score: number }) => {
          defaults.set(row.topic_id, { status: row.status, score: row.score });
        });
      }
      // If error or no rows yet, defaults remain untouched (first-time user)

      setProgressMap(defaults);
      setProgressLoading(false);
    })();

    return () => { cancelled = true; };
  }, [user, buildDefaults]);

  // ── Persist a single entry to Supabase (fire-and-forget) ──
  const persistEntry = useCallback(
    (topicId: string, entry: ProgressEntry) => {
      if (!user) return;
      supabase
        .from("user_progress")
        .upsert(
          {
            user_id: user.id,
            topic_id: topicId,
            status: entry.status,
            score: entry.score,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,topic_id" }
        )
        .then(({ error }) => {
          if (error) console.error("[ProgressSync]", topicId, error.message);
        });
    },
    [user]
  );

  // ── Read helpers (synchronous from cache) ──
  const getTopicProgress = useCallback(
    (topicId: string): ProgressEntry => {
      return progressMap.get(topicId) || { status: "locked", score: 0 };
    },
    [progressMap]
  );

  // ── addScore — same unlock cascade as original store.ts ──
  const addScore = useCallback(
    (topicId: string, points: number) => {
      setProgressMap((prev) => {
        const next = new Map(prev);
        const current = next.get(topicId) || { status: "unlocked" as TopicStatus, score: 0 };
        const newScore = Math.min(current.score + points, 100);
        const newStatus: TopicStatus =
          newScore >= 100
            ? "mastered"
            : current.status === "locked"
              ? "unlocked"
              : current.status;

        const entry = { status: newStatus, score: newScore };
        next.set(topicId, entry);

        // Persist the main topic change
        setTimeout(() => persistEntry(topicId, entry), 0);

        // ── Unlock cascade (same logic as original) ──
        if (newStatus === "mastered") {
          const topic = seedTopics.find((t) => t.id === topicId);
          if (topic) {
            const unlock = (id: string) => {
              const cur = next.get(id);
              if (cur && cur.status === "locked") {
                const updated = { ...cur, status: "unlocked" as TopicStatus };
                next.set(id, updated);
                setTimeout(() => persistEntry(id, updated), 0);
              }
            };

            // Unlock children of this topic
            const children = seedTopics.filter((t) => t.parent_topic_id === topicId);
            children.forEach((child) => unlock(child.id));

            if (topic.parent_topic_id) {
              // Check if all siblings mastered → master parent → unlock next level
              const siblings = seedTopics.filter(
                (t) => t.parent_topic_id === topic.parent_topic_id
              );
              const allMastered = siblings.every((s) => {
                const p = next.get(s.id);
                return p && p.status === "mastered";
              });
              if (allMastered) {
                const parentEntry = { status: "mastered" as TopicStatus, score: 100 };
                next.set(topic.parent_topic_id, parentEntry);
                setTimeout(() => persistEntry(topic.parent_topic_id!, parentEntry), 0);

                const currentLevel = topic.level;
                const nextLevelTopics = seedTopics.filter(
                  (t) => t.level === currentLevel + 1 && t.parent_topic_id === null
                );
                nextLevelTopics.forEach((t) => {
                  unlock(t.id);
                  const subtopics = seedTopics.filter((st) => st.parent_topic_id === t.id);
                  subtopics.forEach((st) => unlock(st.id));
                });
              }
            } else {
              // Main topic → unlock its subtopics
              const subtopics = seedTopics.filter((t) => t.parent_topic_id === topicId);
              subtopics.forEach((st) => unlock(st.id));
            }
          }
        }

        return next;
      });
    },
    [persistEntry]
  );

  // ── getTopicsTree (computed from cache) ──
  const getTopicsTree = useCallback((): TopicWithProgress[] => {
    const mainTopics = seedTopics.filter((t) => t.parent_topic_id === null);
    return mainTopics
      .sort((a, b) => a.level - b.level)
      .map((topic) => {
        const progress = progressMap.get(topic.id) || { status: "locked" as TopicStatus, score: 0 };
        const children = seedTopics
          .filter((t) => t.parent_topic_id === topic.id)
          .map((child) => {
            const childProgress =
              progressMap.get(child.id) || { status: "locked" as TopicStatus, score: 0 };
            return {
              ...child,
              status: childProgress.status,
              score: childProgress.score,
              children: [],
            };
          });
        return {
          ...topic,
          status: progress.status,
          score: progress.score,
          children,
        };
      });
  }, [progressMap]);

  // ── resetProgress ──
  const resetProgress = useCallback(() => {
    const defaults = buildDefaults();
    setProgressMap(defaults);

    if (!user) return;
    // Delete all progress rows for this user in Supabase
    supabase
      .from("user_progress")
      .delete()
      .eq("user_id", user.id)
      .then(({ error }) => {
        if (error) console.error("[ProgressSync] reset error:", error.message);
      });
  }, [user, buildDefaults]);

  return (
    <ProgressContext.Provider
      value={{ progressLoading, getTopicProgress, addScore, getTopicsTree, resetProgress }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export const useProgress = () => useContext(ProgressContext);

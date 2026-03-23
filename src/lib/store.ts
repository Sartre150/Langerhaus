import { seedTopics, seedProblems } from "./seedData";
import { Topic, Problem } from "./types";
import { getCalculatorPolicy } from "./problemGenerator";

// ── Pure data lookups (no user state) ──

export function getAllTopics(): Topic[] {
  return seedTopics;
}

export function getTopicById(id: string): Topic | undefined {
  return seedTopics.find((t) => t.id === id);
}

/** Returns subtopics of a given parent topic */
export function getSubtopics(parentId: string): Topic[] {
  return seedTopics.filter((t) => t.parent_topic_id === parentId);
}

export function getProblemsForTopic(topicId: string): Problem[] {
  return seedProblems
    .filter((p) => p.topic_id === topicId)
    .map((p) => ({
      ...p,
      calculator_policy: p.calculator_policy || getCalculatorPolicy(p.topic_id, p.difficulty),
    }));
}

// ── Answer checking utilities ──

export function normalizeLatex(str: string): string {
  return str
    .replace(/\s+/g, "")
    .replace(/\\,/g, "")
    .replace(/\\;/g, "")
    .replace(/\\quad/g, "")
    .replace(/\\qquad/g, "")
    .replace(/\\left/g, "")
    .replace(/\\right/g, "")
    .replace(/\\dfrac/g, "\\frac")
    .replace(/\\displaystyle/g, "")
    .replace(/\{(\w)\}/g, "$1")
    .toLowerCase()
    .trim();
}

export function checkAnswer(userAnswer: string, correctAnswer: string): boolean {
  const normalizedUser = normalizeLatex(userAnswer);
  const normalizedCorrect = normalizeLatex(correctAnswer);
  return normalizedUser === normalizedCorrect;
}

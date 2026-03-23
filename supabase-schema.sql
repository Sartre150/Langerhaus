-- ═══════════════════════════════════════════════════════
-- MathCore Forge - Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor
-- ═══════════════════════════════════════════════════════
-- NOTE: Topics and problems are stored as local seed data
-- in the app. Only user progress is persisted in Supabase.
-- topic_id is a TEXT field matching seed IDs like "t-0-1".
-- ═══════════════════════════════════════════════════════

-- ─── USER PROGRESS TABLE ───
CREATE TYPE progress_status AS ENUM ('locked', 'unlocked', 'mastered');

CREATE TABLE user_progress (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id TEXT NOT NULL,
  status progress_status NOT NULL DEFAULT 'locked',
  score INT NOT NULL DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, topic_id)
);

CREATE INDEX idx_user_progress_user ON user_progress(user_id);

-- ─── ROW LEVEL SECURITY ───
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- User progress: users can only see/modify their own
CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress"
  ON user_progress FOR DELETE
  USING (auth.uid() = user_id);

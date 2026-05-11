-- ============================================
-- MITLAR LANDING — Schema Phase 1
-- Tables: sections, hero, blog_posts
-- Run this in Supabase SQL Editor
-- ============================================

-- Drop old tables if they exist (clean start for phase 1 scope)
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS hero CASCADE;
DROP TABLE IF EXISTS sections CASCADE;

-- ============================================
-- 1. sections — visibility control for each page section
-- ============================================
CREATE TABLE sections (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key         text UNIQUE NOT NULL,  -- 'hero' | 'about' | 'equipment' | 'devblog' | 'contacts'
  is_visible  boolean DEFAULT true,
  sort_order  int NOT NULL DEFAULT 0
);

-- Default rows
INSERT INTO sections (key, is_visible, sort_order) VALUES
  ('hero',      true, 1),
  ('about',     true, 2),
  ('equipment', true, 3),
  ('devblog',   true, 4),
  ('contacts',  true, 5);

-- ============================================
-- 2. hero — content for Hero section
-- ============================================
CREATE TABLE hero (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title           text NOT NULL DEFAULT 'MITLAR',
  slogan          text NOT NULL DEFAULT 'Team game on the gliding broom',
  slogan_pl       text,
  slogan_ua       text,
  button_text     text NOT NULL DEFAULT 'Learn more',
  button_text_pl  text,
  button_text_ua  text,
  image_url       text  -- external URL or relative path
);

-- Default row
INSERT INTO hero (title, slogan, button_text) VALUES
  ('MITLAR', 'Team game on the gliding broom', 'Learn more');

-- ============================================
-- 3. blog_posts — Dev Blog articles
-- ============================================
CREATE TABLE blog_posts (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text NOT NULL,
  title_pl      text,
  title_ua      text,
  excerpt       text,
  excerpt_pl    text,
  excerpt_ua    text,
  content       text,
  content_pl    text,
  content_ua    text,
  pin_position  int DEFAULT NULL,   -- 1 = large pinned, 2 or 3 = small, NULL = not pinned
  is_published  boolean DEFAULT false,
  created_at    timestamptz DEFAULT now()
);

-- Unique constraint: only one article per pin slot
CREATE UNIQUE INDEX blog_posts_pin_unique ON blog_posts (pin_position)
  WHERE pin_position IS NOT NULL;

-- Seed with 3 sample posts
INSERT INTO blog_posts (title, excerpt, content, pin_position, is_published) VALUES
(
  'How Mitlar Was Born: From Idea to First Prototype',
  'Every sport begins with a question. Ours was simple: what if the broom wasn''t just a prop, but the engine of the game?',
  'Every sport begins with a question. Ours was simple: what if the broom wasn''t just a prop, but the engine of the game?

This is the story of how that question became Mitlar — a new team sport built around monowheels and specially designed gliding brooms.

It started in 2022 with a single prototype broom made from carbon fibre and a borrowed monowheel. Two friends on an empty basketball court in Warsaw. Lots of falling. More laughter. But something clicked.

Within six months, we had the first draft of the rules. Within a year, we had five players who believed in it enough to train twice a week. Today, Mitlar is a structured team sport with documented rules, a growing community, and equipment in active development.',
  1, true
),
(
  'Designing the Field: Rules of Space',
  'The playing field in Mitlar is not just a surface — it''s a system of zones, transitions and boundaries...',
  'The playing field in Mitlar is not just a surface — it''s a system of zones, transitions and boundaries that shape the entire game.

Early versions used a simple rectangular field. It worked, but it felt arbitrary. The zones didn''t have meaning — they were just coordinates.

The breakthrough came when we tied zone rules to team composition.',
  2, true
),
(
  'The Broom: First Working Prototype',
  'After dozens of sketches and three failed material tests, we finally have a working broom prototype...',
  'After dozens of sketches and three failed material tests, we finally have a working broom prototype.

The challenge was balance. The broom needs to feel natural in hand, respond to dynamic monowheel movement, and interact predictably with the ball.',
  3, true
);

-- ============================================
-- RLS Policies
-- ============================================

-- Enable RLS
ALTER TABLE sections   ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero       ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Public can READ all three tables
CREATE POLICY "Public read sections"   ON sections   FOR SELECT USING (true);
CREATE POLICY "Public read hero"       ON hero       FOR SELECT USING (true);
CREATE POLICY "Public read blog_posts" ON blog_posts FOR SELECT USING (true);

-- Only service_role can WRITE (INSERT / UPDATE / DELETE)
-- No explicit policy needed — service_role bypasses RLS by default in Supabase

-- ============================================
-- Keep-alive helper (for Supabase free tier)
-- A simple lightweight query to prevent project pause
-- Used by /api/keep-alive route with anon key
-- ============================================
-- No schema change needed — the SELECT on 'sections' serves as keep-alive ping

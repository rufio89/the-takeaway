-- ============================================================================
-- The Takeaway - Supabase Database Setup
-- ============================================================================
-- Copy and paste this entire file into your Supabase SQL Editor and run it.
-- This will create all tables, indexes, policies, and sample data.
-- ============================================================================

-- ============================================================================
-- 1. CREATE TABLES
-- ============================================================================

-- Categories table: Topic categorization for ideas
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Podcasts table: Source podcast metadata
CREATE TABLE podcasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  host TEXT,
  url TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Digests table: Curated collections of ideas
CREATE TABLE digests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  published_date DATE DEFAULT CURRENT_DATE,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ideas table: Individual podcast insights with clarity scores
CREATE TABLE ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  digest_id UUID REFERENCES digests(id) ON DELETE CASCADE,
  podcast_id UUID REFERENCES podcasts(id) ON DELETE SET NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  actionable_takeaway TEXT,
  clarity_score INTEGER CHECK (clarity_score >= 1 AND clarity_score <= 10),
  timestamp TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX idx_ideas_digest_id ON ideas(digest_id);
CREATE INDEX idx_ideas_podcast_id ON ideas(podcast_id);
CREATE INDEX idx_ideas_category_id ON ideas(category_id);
CREATE INDEX idx_digests_published_date ON digests(published_date DESC);
CREATE INDEX idx_digests_featured ON digests(featured);

-- ============================================================================
-- 3. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE podcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE digests ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 4. CREATE RLS POLICIES
-- ============================================================================
-- NOTE: These policies allow public read/write access for demo purposes.
-- In production, you should:
--   1. Add Supabase authentication
--   2. Protect admin routes with authentication
--   3. Update policies to require authentication for write operations
-- ============================================================================

-- Read policies (public can view all data)
CREATE POLICY "Public can read categories" ON categories
  FOR SELECT TO anon USING (true);

CREATE POLICY "Public can read podcasts" ON podcasts
  FOR SELECT TO anon USING (true);

CREATE POLICY "Public can read digests" ON digests
  FOR SELECT TO anon USING (true);

CREATE POLICY "Public can read ideas" ON ideas
  FOR SELECT TO anon USING (true);

-- Insert policies (public can create new records)
CREATE POLICY "Public can insert categories" ON categories
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Public can insert podcasts" ON podcasts
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Public can insert digests" ON digests
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Public can insert ideas" ON ideas
  FOR INSERT TO anon WITH CHECK (true);

-- Update policies (public can modify records)
CREATE POLICY "Public can update categories" ON categories
  FOR UPDATE TO anon USING (true);

CREATE POLICY "Public can update podcasts" ON podcasts
  FOR UPDATE TO anon USING (true);

CREATE POLICY "Public can update digests" ON digests
  FOR UPDATE TO anon USING (true);

CREATE POLICY "Public can update ideas" ON ideas
  FOR UPDATE TO anon USING (true);

-- Delete policies (public can remove records)
CREATE POLICY "Public can delete categories" ON categories
  FOR DELETE TO anon USING (true);

CREATE POLICY "Public can delete podcasts" ON podcasts
  FOR DELETE TO anon USING (true);

CREATE POLICY "Public can delete digests" ON digests
  FOR DELETE TO anon USING (true);

CREATE POLICY "Public can delete ideas" ON ideas
  FOR DELETE TO anon USING (true);

-- ============================================================================
-- 5. INSERT SAMPLE DATA
-- ============================================================================

-- Sample categories
INSERT INTO categories (name, slug, description) VALUES
  ('Productivity', 'productivity', 'Time management and efficiency'),
  ('Marketing', 'marketing', 'Growth and customer acquisition'),
  ('Leadership', 'leadership', 'Team management and vision'),
  ('Strategy', 'strategy', 'Business planning and execution'),
  ('Mindset', 'mindset', 'Mental models and thinking frameworks'),
  ('Innovation', 'innovation', 'Creativity and new ideas');

-- Sample podcasts
INSERT INTO podcasts (name, host, url) VALUES
  ('The Tim Ferriss Show', 'Tim Ferriss', 'https://tim.blog/podcast/'),
  ('How I Built This', 'Guy Raz', 'https://www.npr.org/series/490248027/how-i-built-this'),
  ('My First Million', 'Sam Parr & Shaan Puri', 'https://www.mfmpod.com/');

-- ============================================================================
-- SETUP COMPLETE!
-- ============================================================================
-- Your database is now ready. Go to your app's admin panel to start
-- creating digests and adding ideas.
--
-- Next steps:
--   1. Make sure your .env.local has the correct Supabase credentials
--   2. Run 'npm run dev' to start the application
--   3. Visit http://localhost:5173/admin to create your first digest
-- ============================================================================

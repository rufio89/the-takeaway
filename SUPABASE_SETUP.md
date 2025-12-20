# Supabase Setup Guide

## Database Schema

Run the following SQL in your Supabase SQL Editor:

```sql
-- Create categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create podcasts table
CREATE TABLE podcasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  host TEXT,
  url TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create digests table
CREATE TABLE digests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  published_date DATE DEFAULT CURRENT_DATE,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ideas table
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

-- Create indexes
CREATE INDEX idx_ideas_digest_id ON ideas(digest_id);
CREATE INDEX idx_ideas_podcast_id ON ideas(podcast_id);
CREATE INDEX idx_ideas_category_id ON ideas(category_id);
CREATE INDEX idx_digests_published_date ON digests(published_date DESC);
CREATE INDEX idx_digests_featured ON digests(featured);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE podcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE digests ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;

-- Create policies (public read and write access)
-- Note: In production, you should add authentication and restrict write access
CREATE POLICY "Public can read categories" ON categories FOR SELECT TO anon USING (true);
CREATE POLICY "Public can read podcasts" ON podcasts FOR SELECT TO anon USING (true);
CREATE POLICY "Public can read digests" ON digests FOR SELECT TO anon USING (true);
CREATE POLICY "Public can read ideas" ON ideas FOR SELECT TO anon USING (true);

-- Allow public insert (for demo purposes - restrict this in production!)
CREATE POLICY "Public can insert categories" ON categories FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Public can insert podcasts" ON podcasts FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Public can insert digests" ON digests FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Public can insert ideas" ON ideas FOR INSERT TO anon WITH CHECK (true);

-- Allow public updates (for demo purposes - restrict this in production!)
CREATE POLICY "Public can update categories" ON categories FOR UPDATE TO anon USING (true);
CREATE POLICY "Public can update podcasts" ON podcasts FOR UPDATE TO anon USING (true);
CREATE POLICY "Public can update digests" ON digests FOR UPDATE TO anon USING (true);
CREATE POLICY "Public can update ideas" ON ideas FOR UPDATE TO anon USING (true);

-- Allow public deletes (for demo purposes - restrict this in production!)
CREATE POLICY "Public can delete categories" ON categories FOR DELETE TO anon USING (true);
CREATE POLICY "Public can delete podcasts" ON podcasts FOR DELETE TO anon USING (true);
CREATE POLICY "Public can delete digests" ON digests FOR DELETE TO anon USING (true);
CREATE POLICY "Public can delete ideas" ON ideas FOR DELETE TO anon USING (true);

-- Insert sample categories
INSERT INTO categories (name, slug, description) VALUES
  ('Productivity', 'productivity', 'Time management and efficiency'),
  ('Marketing', 'marketing', 'Growth and customer acquisition'),
  ('Leadership', 'leadership', 'Team management and vision'),
  ('Strategy', 'strategy', 'Business planning and execution'),
  ('Mindset', 'mindset', 'Mental models and thinking frameworks'),
  ('Innovation', 'innovation', 'Creativity and new ideas');
```

## Environment Variables

Create a `.env.local` file in the root directory:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these values from your Supabase project settings.

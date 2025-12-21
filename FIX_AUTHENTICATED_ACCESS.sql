-- ============================================================================
-- Fix RLS Policies to Allow Authenticated Users
-- ============================================================================
-- The current policies only allow anonymous users. We need to add policies
-- for authenticated users as well so the admin panel can access data.
-- ============================================================================

-- Read policies for authenticated users
CREATE POLICY "Authenticated can read categories" ON categories
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated can read podcasts" ON podcasts
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated can read digests" ON digests
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated can read ideas" ON ideas
  FOR SELECT TO authenticated USING (true);

-- Insert policies for authenticated users
CREATE POLICY "Authenticated can insert categories" ON categories
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated can insert podcasts" ON podcasts
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated can insert digests" ON digests
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated can insert ideas" ON ideas
  FOR INSERT TO authenticated WITH CHECK (true);

-- Update policies for authenticated users
CREATE POLICY "Authenticated can update categories" ON categories
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated can update podcasts" ON podcasts
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated can update digests" ON digests
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated can update ideas" ON ideas
  FOR UPDATE TO authenticated USING (true);

-- Delete policies for authenticated users
CREATE POLICY "Authenticated can delete categories" ON categories
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated can delete podcasts" ON podcasts
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated can delete digests" ON digests
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated can delete ideas" ON ideas
  FOR DELETE TO authenticated USING (true);

-- ============================================================================
-- MIGRATION COMPLETE!
-- ============================================================================
-- Authenticated users can now read and write to all tables.
-- Run this SQL in your Supabase SQL Editor to apply the changes.
-- ============================================================================

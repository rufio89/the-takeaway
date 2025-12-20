-- Run this SQL in your Supabase SQL Editor to fix the RLS error
-- This adds write permissions for the admin interface

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

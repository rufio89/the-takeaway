# Sample Data for Testing

After running the schema from `SUPABASE_SETUP.md`, you can add this sample data to test the application.

## Add Sample Podcasts

```sql
INSERT INTO podcasts (name, host, url, image_url) VALUES
  ('The Tim Ferriss Show', 'Tim Ferriss', 'https://tim.blog/podcast/', null),
  ('How I Built This', 'Guy Raz', 'https://www.npr.org/series/490248027/how-i-built-this', null),
  ('My First Million', 'Sam Parr & Shaan Puri', 'https://www.mfmpod.com/', null);
```

## Create a Sample Digest

```sql
INSERT INTO digests (title, description, published_date, featured) VALUES
  (
    'Weekly Insights: Productivity & Focus',
    'This week''s digest covers powerful mental models and strategies for deep work from top entrepreneurs.',
    CURRENT_DATE,
    true
  );
```

## Add Sample Ideas

First, get the digest ID you just created:

```sql
SELECT id, title FROM digests ORDER BY created_at DESC LIMIT 1;
```

Then insert ideas (replace `YOUR_DIGEST_ID`, `PODCAST_ID`, and `CATEGORY_ID` with actual IDs):

```sql
-- Get IDs first
SELECT id, name FROM podcasts;
SELECT id, name FROM categories;

-- Insert ideas
INSERT INTO ideas (
  digest_id,
  podcast_id,
  category_id,
  title,
  summary,
  actionable_takeaway,
  clarity_score,
  timestamp
) VALUES
  (
    'YOUR_DIGEST_ID',
    (SELECT id FROM podcasts WHERE name = 'The Tim Ferriss Show' LIMIT 1),
    (SELECT id FROM categories WHERE slug = 'productivity' LIMIT 1),
    'The 80/20 Rule for Decision Making',
    'Focus on the 20% of decisions that will drive 80% of your outcomes. Most decisions are reversible and don''t deserve deep analysis. Only spend significant time on the few that are truly consequential and hard to undo.',
    'Before your next decision, ask: Is this reversible? If yes, make it quickly. If no, schedule dedicated time to think it through properly.',
    9,
    '42:15'
  ),
  (
    'YOUR_DIGEST_ID',
    (SELECT id FROM podcasts WHERE name = 'My First Million' LIMIT 1),
    (SELECT id FROM categories WHERE slug = 'strategy' LIMIT 1),
    'Build for the Minimum Viable Audience',
    'Instead of trying to appeal to everyone, find your 1000 true fans. Create something so valuable for a specific niche that they can''t imagine going back to life without it.',
    'Identify one very specific person or company that would pay 10x your current price. Build exclusively for them first.',
    8,
    '28:30'
  ),
  (
    'YOUR_DIGEST_ID',
    (SELECT id FROM podcasts WHERE name = 'How I Built This' LIMIT 1),
    (SELECT id FROM categories WHERE slug = 'mindset' LIMIT 1),
    'Embrace the Messy Middle',
    'Every successful company goes through a period where things look terrible and you question everything. This isn''t a sign you''re failing - it''s a sign you''re building something real. The companies that succeed are simply the ones that don''t quit during this phase.',
    'When things feel chaotic, remember: this is normal. Write down why you started and review it weekly during tough periods.',
    7,
    '15:45'
  );
```

## Quick Copy-Paste Version

Once you have your digest created and have the IDs, you can use this template:

```sql
-- Replace these with your actual IDs
DO $$
DECLARE
  v_digest_id UUID := 'YOUR_DIGEST_ID_HERE';
  v_tim_ferriss_id UUID := (SELECT id FROM podcasts WHERE name = 'The Tim Ferriss Show' LIMIT 1);
  v_mfm_id UUID := (SELECT id FROM podcasts WHERE name = 'My First Million' LIMIT 1);
  v_hibt_id UUID := (SELECT id FROM podcasts WHERE name = 'How I Built This' LIMIT 1);
  v_productivity_id UUID := (SELECT id FROM categories WHERE slug = 'productivity' LIMIT 1);
  v_strategy_id UUID := (SELECT id FROM categories WHERE slug = 'strategy' LIMIT 1);
  v_mindset_id UUID := (SELECT id FROM categories WHERE slug = 'mindset' LIMIT 1);
BEGIN
  INSERT INTO ideas (digest_id, podcast_id, category_id, title, summary, actionable_takeaway, clarity_score, timestamp) VALUES
    (v_digest_id, v_tim_ferriss_id, v_productivity_id, 'The 80/20 Rule for Decision Making', 'Focus on the 20% of decisions that will drive 80% of your outcomes. Most decisions are reversible and don''t deserve deep analysis.', 'Before your next decision, ask: Is this reversible? If yes, make it quickly.', 9, '42:15'),
    (v_digest_id, v_mfm_id, v_strategy_id, 'Build for the Minimum Viable Audience', 'Instead of trying to appeal to everyone, find your 1000 true fans.', 'Identify one very specific person who would pay 10x your current price.', 8, '28:30'),
    (v_digest_id, v_hibt_id, v_mindset_id, 'Embrace the Messy Middle', 'Every successful company goes through chaos. This is normal, not a sign of failure.', 'Write down why you started and review it weekly during tough periods.', 7, '15:45');
END $$;
```

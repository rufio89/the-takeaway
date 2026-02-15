-- ============================================================================
-- SEED DATA: 3 Hand-Curated Digests
-- Insert into your local Supabase instance
-- ============================================================================

-- ============================================================================
-- 1. Insert Podcasts (if not already present)
-- ============================================================================

INSERT INTO podcasts (name, host, url) 
VALUES 
  ('Lex Fridman Podcast', 'Lex Fridman', 'https://lexfridman.com/podcast/'),
  ('Naval', 'Naval Ravikant', 'https://nav.al/'),
  ('The Tim Ferriss Show', 'Tim Ferriss', 'https://tim.blog/podcast/')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- 2. Insert Categories (if not already present)
-- ============================================================================

INSERT INTO categories (name, slug, description) 
VALUES 
  ('AI & Technology', 'ai-technology', 'Artificial intelligence and tech trends'),
  ('Talent & Hiring', 'talent-hiring', 'Team building and recruitment'),
  ('Decision Making', 'decision-making', 'Frameworks for making better choices'),
  ('Simplicity', 'simplicity', 'Reducing complexity and focus')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 3. DIGEST 1: Lex Fridman #490 - State of AI in 2026
-- ============================================================================

INSERT INTO digests (title, description, published_date, featured)
VALUES (
  'State of AI in 2026',
  'Lex Fridman conversation with Nathan Lambert & Sebastian Raschka on scaling laws, AI agents, programmer displacement, and the AGI timeline.',
  '2026-02-14',
  true
) RETURNING id AS digest_1_id;

-- Get the digest ID and insert ideas
WITH digest_1 AS (
  SELECT id FROM digests WHERE title = 'State of AI in 2026' LIMIT 1
),
lex_podcast AS (
  SELECT id FROM podcasts WHERE name = 'Lex Fridman Podcast' LIMIT 1
),
ai_category AS (
  SELECT id FROM categories WHERE slug = 'ai-technology' LIMIT 1
)
INSERT INTO ideas (digest_id, podcast_id, category_id, title, summary, actionable_takeaway, clarity_score)
SELECT 
  digest_1.id,
  lex_podcast.id,
  ai_category.id,
  title,
  summary,
  actionable_takeaway,
  clarity_score
FROM digest_1, lex_podcast, ai_category,
LATERAL (
  VALUES
    (
      'Scaling Laws Still Govern AI Progress',
      'Scaling laws remain predictable despite claims of emergence. Compute, data, and model parameters follow consistent power-law relationships. This predictability allows rough forecasting of AI capabilities 2-3 years out.',
      'Use scaling law projections to plan AI infrastructure investments and feature timelines. Don''t expect sudden emergent capabilities; progress is gradual and measurable.',
      9
    ),
    (
      'AI Agents Will Be The Killer Application, Not ChatGPT',
      'Conversational AI (ChatGPT) is a thin wedge. Real utility comes from agents that take actions: code execution, API calls, database writes. Autonomous systems that accomplish goals without human in the loop.',
      'Start building agent-based workflows now. Single-turn Q&A interfaces are dead. Focus on agents that compound work over time.',
      8
    ),
    (
      'Programmers Won''t Be Replaced; They''ll Become Orchestrators',
      'AI will handle routine coding (boilerplate, refactoring, testing). Programmers shift to system design, architecture decisions, and agent orchestration. Commodity coding commodifies, high-skill roles expand.',
      'Invest in architecture and system design skills. Stop worrying about being replaced; the floor rises, the ceiling gets higher.',
      8
    ),
    (
      'OpenAI, Anthropic, and Google Are All Playing Similar Games',
      'The three labs are converging on similar approaches (transformers, RLHF, scale). Differentiation will come from data, compute cost efficiency, and deployment strategy, not fundamental breakthroughs.',
      'Watch for companies that crack inference efficiency and data quality, not just bigger models. That''s where competitive moat lives.',
      7
    ),
    (
      'AGI Timeline: 5-10 Years Is Realistic (Not Hype)',
      'Most researchers in the room believe AGI-level capability is reachable in 5-10 years. Current trajectory doesn''t require miracles, just steady scaling + better architectures.',
      'Plan long-term AI skills development for your team. This isn''t speculative; allocate resources accordingly.',
      9
    )
  ) AS ideas(title, summary, actionable_takeaway, clarity_score);

-- ============================================================================
-- 4. DIGEST 2: Naval Ravikant - Curate People
-- ============================================================================

INSERT INTO digests (title, description, published_date, featured)
VALUES (
  'Curate People: Building World-Class Teams',
  'Naval on hiring philosophy, finding undiscovered talent, why early teams feel like cults, and practicing your craft at the edge of capability.',
  '2026-02-14',
  true
) RETURNING id AS digest_2_id;

-- Get the digest ID and insert ideas
WITH digest_2 AS (
  SELECT id FROM digests WHERE title = 'Curate People: Building World-Class Teams' LIMIT 1
),
naval_podcast AS (
  SELECT id FROM podcasts WHERE name = 'Naval' LIMIT 1
),
talent_category AS (
  SELECT id FROM categories WHERE slug = 'talent-hiring' LIMIT 1
)
INSERT INTO ideas (digest_id, podcast_id, category_id, title, summary, actionable_takeaway, clarity_score)
SELECT 
  digest_2.id,
  naval_podcast.id,
  talent_category.id,
  title,
  summary,
  actionable_takeaway,
  clarity_score
FROM digest_2, naval_podcast, talent_category,
LATERAL (
  VALUES
    (
      'Hiring Is About Finding Undiscovered Talent',
      'Don''t hire the obvious résumés from top companies. Find smart people doing unglamorous work at small companies or unknown firms. They''re cheaper, hungrier, and often higher ceiling.',
      'Look for talented people in obscure places. Check smaller companies, side projects, GitHub profiles. Avoid the talent war over obvious candidates.',
      8
    ),
    (
      'Early Teams Look Like Cults Because They Need Shared Mission',
      'In the early stage, you need uncommon conviction. Team members must believe in the vision when it''s unprovable. This self-selection creates cultish cohesion, which is actually healthy.',
      'Be explicit about your mission and values. Hire people who believe in the *why*, not just the paycheck. Mission-alignment matters more than credentials early on.',
      9
    ),
    (
      'The Founder''s Personality Becomes The Company',
      'Company culture is not a document; it''s a reflection of the founder''s values, decision-making style, and integrity. You can''t fake it. The team will mimic the founder.',
      'Do deep work on your own character before scaling. You''re the template. Build habits and values you want to see across the organization.',
      9
    ),
    (
      'Practice Your Craft at the Edge of Your Capability',
      'Mastery comes from doing hard things daily. The edge of capability is where learning happens. Comfortable work is stagnation.',
      'Structure work so you and your team are constantly at the edge. Comfortable = dead. Calibrate difficulty to maintain flow state.',
      8
    ),
    (
      'Talent Scarcity Is Real; Bet on Finding It, Not Substituting It',
      'You can''t replace a top-tier person with three mediocre ones. Compound leverage favors exceptional talent. Spend energy finding the rare person.',
      'Invest heavily in recruitment. One great hire beats ten average hires. Your hiring funnel is your bottleneck.',
      8
    )
  ) AS ideas(title, summary, actionable_takeaway, clarity_score);

-- ============================================================================
-- 5. DIGEST 3: Tim Ferriss #837 - Simplify Your Life in 2026
-- ============================================================================

INSERT INTO digests (title, description, published_date, featured)
VALUES (
  'Simplify Your Life in 2026',
  'Tim Ferriss with Derek Sivers, Seth Godin, and Martha Beck on identifying 1-3 decisions that dramatically simplify life, cutting invisible complexity, and prioritizing what actually matters.',
  '2026-02-14',
  true
) RETURNING id AS digest_3_id;

-- Get the digest ID and insert ideas
WITH digest_3 AS (
  SELECT id FROM digests WHERE title = 'Simplify Your Life in 2026' LIMIT 1
),
tim_podcast AS (
  SELECT id FROM podcasts WHERE name = 'The Tim Ferriss Show' LIMIT 1
),
decision_category AS (
  SELECT id FROM categories WHERE slug = 'decision-making' LIMIT 1
)
INSERT INTO ideas (digest_id, podcast_id, category_id, title, summary, actionable_takeaway, clarity_score)
SELECT 
  digest_3.id,
  tim_podcast.id,
  decision_category.id,
  title,
  summary,
  actionable_takeaway,
  clarity_score
FROM digest_3, tim_podcast, decision_category,
LATERAL (
  VALUES
    (
      '1-3 Decisions Can Eliminate 80% of Complexity',
      'Most people are overcomplicating life by saying "yes" to everything. Derek Sivers: Pick 1-3 core decisions (e.g., "I only do remote work" or "No meetings before 10 AM"). Let that decision filter everything else.',
      'Identify your 1-3 core constraints. Let them be the decision-making framework. New opportunities are automatically rejected if they violate your constraints.',
      9
    ),
    (
      'Invisible Complexity Is The Silent Killer',
      'You don''t notice complexity until it''s gone. Commitments, subscriptions, systems, relationships you''ve stopped evaluating. Seth Godin: Audit what you''re *actually* doing vs. what you think you''re doing.',
      'Do a 30-minute audit: List everything you''re committed to. Delete 50%. You''ll feel relief, not loss.',
      8
    ),
    (
      'Saying "No" Is An Advanced Skill That Multiplies Freedom',
      'Every "yes" is an implicit "no" to something else. The opportunity cost of mediocre "yeses" is enormous. Martha Beck: "No" buys you optionality.',
      'Practice saying "no" to good opportunities. Optionality (freedom to choose) is worth more than any single "yes".',
      9
    ),
    (
      'What You Own Ends Up Owning You',
      'Possessions, memberships, commitments—they all demand attention. The physical, mental, and emotional weight is real. Minimalism isn''t virtue; it''s survival.',
      'Reduce possessions by 25%. Audit subscriptions. Cancel commitments you''re not enthusiastic about. Notice the mental lightness that follows.',
      8
    ),
    (
      'Clarity Comes From Removing, Not Adding',
      'When life is complex, the instinct is to add a system, a coach, a tool. Wrong. Remove constraints first. Usually, simplification is the answer, not optimization.',
      'Before buying a solution, try removing something. 80% of problems are solved by deletion, not addition.',
      9
    )
  ) AS ideas(title, summary, actionable_takeaway, clarity_score);

-- ============================================================================
-- DONE!
-- ============================================================================
-- You now have 3 digests with 15 ideas total.
-- Copy this entire file and run it in Supabase SQL Editor.
-- Then refresh your app—the new digests will appear on the homepage.

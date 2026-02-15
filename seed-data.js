import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vsrzqhwbrsgjajxctvcz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzcnpxaHdicnNnamFqeGN0dmN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyNTMyOTksImV4cCI6MjA4MTgyOTI5OX0.6kDzCPcH-btsAfpb_q6qhdpmA65RhnH1smCix6OFFac';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Podcast data
const podcasts = [
  { name: 'Lex Fridman Podcast', host: 'Lex Fridman', url: 'https://lexfridman.com/podcast/' },
  { name: 'Naval', host: 'Naval Ravikant', url: 'https://nav.al/' },
];

// Category data
const categories = [
  { name: 'AI & Technology', slug: 'ai-technology', description: 'Artificial intelligence and tech trends' },
  { name: 'Talent & Hiring', slug: 'talent-hiring', description: 'Team building and recruitment' },
  { name: 'Decision Making', slug: 'decision-making', description: 'Frameworks for making better choices' },
  { name: 'Simplicity', slug: 'simplicity', description: 'Reducing complexity and focus' },
];

// Digest 1: Lex Fridman - State of AI in 2026
const lexFridmanIdeas = [
  {
    title: 'Scaling Laws Still Govern AI Progress',
    summary: 'Scaling laws remain predictable despite claims of emergence. Compute, data, and model parameters follow consistent power-law relationships. This predictability allows rough forecasting of AI capabilities 2-3 years out.',
    takeaway: 'Use scaling law projections to plan AI infrastructure investments and feature timelines. Don\'t expect sudden emergent capabilities; progress is gradual and measurable.',
    clarity: 9,
  },
  {
    title: 'AI Agents Will Be The Killer Application, Not ChatGPT',
    summary: 'Conversational AI (ChatGPT) is a thin wedge. Real utility comes from agents that take actions: code execution, API calls, database writes. Autonomous systems that accomplish goals without human in the loop.',
    takeaway: 'Start building agent-based workflows now. Single-turn Q&A interfaces are dead. Focus on agents that compound work over time.',
    clarity: 8,
  },
  {
    title: 'Programmers Won\'t Be Replaced; They\'ll Become Orchestrators',
    summary: 'AI will handle routine coding (boilerplate, refactoring, testing). Programmers shift to system design, architecture decisions, and agent orchestration. Commodity coding commodifies, high-skill roles expand.',
    takeaway: 'Invest in architecture and system design skills. Stop worrying about being replaced; the floor rises, the ceiling gets higher.',
    clarity: 8,
  },
  {
    title: 'OpenAI, Anthropic, and Google Are All Playing Similar Games',
    summary: 'The three labs are converging on similar approaches (transformers, RLHF, scale). Differentiation will come from data, compute cost efficiency, and deployment strategy, not fundamental breakthroughs.',
    takeaway: 'Watch for companies that crack inference efficiency and data quality, not just bigger models. That\'s where competitive moat lives.',
    clarity: 7,
  },
  {
    title: 'AGI Timeline: 5-10 Years Is Realistic (Not Hype)',
    summary: 'Most researchers in the room believe AGI-level capability is reachable in 5-10 years. Current trajectory doesn\'t require miracles, just steady scaling + better architectures.',
    takeaway: 'Plan long-term AI skills development for your team. This isn\'t speculative; allocate resources accordingly.',
    clarity: 9,
  },
];

// Digest 2: Naval - Curate People
const navalIdeas = [
  {
    title: 'Hiring Is About Finding Undiscovered Talent',
    summary: 'Don\'t hire the obvious résumés from top companies. Find smart people doing unglamorous work at small companies or unknown firms. They\'re cheaper, hungrier, and often higher ceiling.',
    takeaway: 'Look for talented people in obscure places. Check smaller companies, side projects, GitHub profiles. Avoid the talent war over obvious candidates.',
    clarity: 8,
  },
  {
    title: 'Early Teams Look Like Cults Because They Need Shared Mission',
    summary: 'In the early stage, you need uncommon conviction. Team members must believe in the vision when it\'s unprovable. This self-selection creates cultish cohesion, which is actually healthy.',
    takeaway: 'Be explicit about your mission and values. Hire people who believe in the *why*, not just the paycheck. Mission-alignment matters more than credentials early on.',
    clarity: 9,
  },
  {
    title: 'The Founder\'s Personality Becomes The Company',
    summary: 'Company culture is not a document; it\'s a reflection of the founder\'s values, decision-making style, and integrity. You can\'t fake it. The team will mimic the founder.',
    takeaway: 'Do deep work on your own character before scaling. You\'re the template. Build habits and values you want to see across the organization.',
    clarity: 9,
  },
  {
    title: 'Practice Your Craft at the Edge of Your Capability',
    summary: 'Mastery comes from doing hard things daily. The edge of capability is where learning happens. Comfortable work is stagnation.',
    takeaway: 'Structure work so you and your team are constantly at the edge. Comfortable = dead. Calibrate difficulty to maintain flow state.',
    clarity: 8,
  },
  {
    title: 'Talent Scarcity Is Real; Bet on Finding It, Not Substituting It',
    summary: 'You can\'t replace a top-tier person with three mediocre ones. Compound leverage favors exceptional talent. Spend energy finding the rare person.',
    takeaway: 'Invest heavily in recruitment. One great hire beats ten average hires. Your hiring funnel is your bottleneck.',
    clarity: 8,
  },
];

// Digest 3: Tim Ferriss - Simplify Your Life
const timFerrissIdeas = [
  {
    title: '1-3 Decisions Can Eliminate 80% of Complexity',
    summary: 'Most people are overcomplicating life by saying "yes" to everything. Derek Sivers: Pick 1-3 core decisions (e.g., "I only do remote work" or "No meetings before 10 AM"). Let that decision filter everything else.',
    takeaway: 'Identify your 1-3 core constraints. Let them be the decision-making framework. New opportunities are automatically rejected if they violate your constraints.',
    clarity: 9,
  },
  {
    title: 'Invisible Complexity Is The Silent Killer',
    summary: 'You don\'t notice complexity until it\'s gone. Commitments, subscriptions, systems, relationships you\'ve stopped evaluating. Seth Godin: Audit what you\'re *actually* doing vs. what you think you\'re doing.',
    takeaway: 'Do a 30-minute audit: List everything you\'re committed to. Delete 50%. You\'ll feel relief, not loss.',
    clarity: 8,
  },
  {
    title: 'Saying "No" Is An Advanced Skill That Multiplies Freedom',
    summary: 'Every "yes" is an implicit "no" to something else. The opportunity cost of mediocre "yeses" is enormous. Martha Beck: "No" buys you optionality.',
    takeaway: 'Practice saying "no" to good opportunities. Optionality (freedom to choose) is worth more than any single "yes".',
    clarity: 9,
  },
  {
    title: 'What You Own Ends Up Owning You',
    summary: 'Possessions, memberships, commitments—they all demand attention. The physical, mental, and emotional weight is real. Minimalism isn\'t virtue; it\'s survival.',
    takeaway: 'Reduce possessions by 25%. Audit subscriptions. Cancel commitments you\'re not enthusiastic about. Notice the mental lightness that follows.',
    clarity: 8,
  },
  {
    title: 'Clarity Comes From Removing, Not Adding',
    summary: 'When life is complex, the instinct is to add a system, a coach, a tool. Wrong. Remove constraints first. Usually, simplification is the answer, not optimization.',
    takeaway: 'Before buying a solution, try removing something. 80% of problems are solved by deletion, not addition.',
    clarity: 9,
  },
];

async function seedData() {
  try {
    console.log('🌱 Starting seed...\n');

    // Insert podcasts
    console.log('📻 Inserting podcasts...');
    const { error: podcastError } = await supabase
      .from('podcasts')
      .insert(podcasts)
      .select();
    // Ignore conflict errors - podcasts may already exist
    if (podcastError && !podcastError.message.includes('duplicate')) {
      throw podcastError;
    }
    console.log('✓ Podcasts inserted\n');

    // Insert categories
    console.log('🏷️  Inserting categories...');
    const { error: categoryError } = await supabase
      .from('categories')
      .insert(categories)
      .select();
    // Ignore conflict errors - categories may already exist
    if (categoryError && !categoryError.message.includes('duplicate')) {
      throw categoryError;
    }
    console.log('✓ Categories inserted\n');

    // Get podcast IDs
    const { data: lexPodcast } = await supabase
      .from('podcasts')
      .select('id')
      .eq('name', 'Lex Fridman Podcast')
      .single();
    
    const { data: navalPodcast } = await supabase
      .from('podcasts')
      .select('id')
      .eq('name', 'Naval')
      .single();

    const { data: timPodcast } = await supabase
      .from('podcasts')
      .select('id')
      .eq('name', 'The Tim Ferriss Show')
      .single();

    // Get category IDs
    const { data: aiCategory } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', 'ai-technology')
      .single();

    const { data: talentCategory } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', 'talent-hiring')
      .single();

    const { data: decisionCategory } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', 'decision-making')
      .single();

    // Insert Digest 1: State of AI in 2026
    console.log('📚 Inserting Digest 1: State of AI in 2026...');
    const { data: digest1, error: digest1Error } = await supabase
      .from('digests')
      .insert([
        {
          title: 'State of AI in 2026',
          description: 'Lex Fridman conversation with Nathan Lambert & Sebastian Raschka on scaling laws, AI agents, programmer displacement, and the AGI timeline.',
          published_date: '2026-02-14',
          featured: true,
        },
      ])
      .select()
      .single();
    if (digest1Error) throw digest1Error;
    console.log('✓ Digest 1 created\n');

    // Insert Digest 2: Curate People
    console.log('📚 Inserting Digest 2: Curate People...');
    const { data: digest2, error: digest2Error } = await supabase
      .from('digests')
      .insert([
        {
          title: 'Curate People: Building World-Class Teams',
          description: 'Naval on hiring philosophy, finding undiscovered talent, why early teams feel like cults, and practicing your craft at the edge of capability.',
          published_date: '2026-02-14',
          featured: true,
        },
      ])
      .select()
      .single();
    if (digest2Error) throw digest2Error;
    console.log('✓ Digest 2 created\n');

    // Insert Digest 3: Simplify Your Life
    console.log('📚 Inserting Digest 3: Simplify Your Life...');
    const { data: digest3, error: digest3Error } = await supabase
      .from('digests')
      .insert([
        {
          title: 'Simplify Your Life in 2026',
          description: 'Tim Ferriss with Derek Sivers, Seth Godin, and Martha Beck on identifying 1-3 decisions that dramatically simplify life, cutting invisible complexity, and prioritizing what actually matters.',
          published_date: '2026-02-14',
          featured: true,
        },
      ])
      .select()
      .single();
    if (digest3Error) throw digest3Error;
    console.log('✓ Digest 3 created\n');

    // Insert ideas for Digest 1
    console.log('💡 Inserting 5 ideas for Digest 1...');
    const digest1IdeasWithRelations = lexFridmanIdeas.map(idea => ({
      digest_id: digest1.id,
      podcast_id: lexPodcast.id,
      category_id: aiCategory.id,
      title: idea.title,
      summary: idea.summary,
      actionable_takeaway: idea.takeaway,
      clarity_score: idea.clarity,
    }));
    const { error: ideas1Error } = await supabase
      .from('ideas')
      .insert(digest1IdeasWithRelations);
    if (ideas1Error) throw ideas1Error;
    console.log('✓ 5 ideas added to Digest 1\n');

    // Insert ideas for Digest 2
    console.log('💡 Inserting 5 ideas for Digest 2...');
    const digest2IdeasWithRelations = navalIdeas.map(idea => ({
      digest_id: digest2.id,
      podcast_id: navalPodcast.id,
      category_id: talentCategory.id,
      title: idea.title,
      summary: idea.summary,
      actionable_takeaway: idea.takeaway,
      clarity_score: idea.clarity,
    }));
    const { error: ideas2Error } = await supabase
      .from('ideas')
      .insert(digest2IdeasWithRelations);
    if (ideas2Error) throw ideas2Error;
    console.log('✓ 5 ideas added to Digest 2\n');

    // Insert ideas for Digest 3
    console.log('💡 Inserting 5 ideas for Digest 3...');
    const digest3IdeasWithRelations = timFerrissIdeas.map(idea => ({
      digest_id: digest3.id,
      podcast_id: timPodcast.id,
      category_id: decisionCategory.id,
      title: idea.title,
      summary: idea.summary,
      actionable_takeaway: idea.takeaway,
      clarity_score: idea.clarity,
    }));
    const { error: ideas3Error } = await supabase
      .from('ideas')
      .insert(digest3IdeasWithRelations);
    if (ideas3Error) throw ideas3Error;
    console.log('✓ 5 ideas added to Digest 3\n');

    console.log('🎉 All data seeded successfully!');
    console.log('✓ 3 digests created');
    console.log('✓ 15 ideas created');
    console.log('✓ Go to http://localhost:5173 to see them!\n');
  } catch (error) {
    console.error('❌ Error seeding data:', error.message);
    process.exit(1);
  }
}

seedData();

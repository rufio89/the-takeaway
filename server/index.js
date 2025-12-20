import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'The Takeaway API is running' });
});

// Process transcript endpoint
app.post('/api/process-transcript', async (req, res) => {
  try {
    const { transcript, podcastId, podcastName, podcastHost, digestTitle, digestDescription, digestImageUrl } = req.body;

    if (!transcript) {
      return res.status(400).json({ error: 'Transcript is required' });
    }

    console.log('Processing transcript...');

    // Call Claude API to extract ideas
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: `You are an expert at analyzing podcast transcripts and extracting actionable insights for busy entrepreneurs.

Analyze the following podcast transcript and extract 3-7 high-value ideas. For each idea, provide:

1. **title**: A concise, compelling title (5-10 words)
2. **summary**: A clear explanation of the concept (2-4 paragraphs in markdown format, use **bold** for key terms, bullet lists where appropriate)
3. **actionable_takeaway**: Specific steps someone can take to apply this insight (1-2 paragraphs in markdown, can use numbered lists)
4. **clarity_score**: Rate 1-10 how clear and actionable this insight is (10 = crystal clear and immediately actionable)
5. **category**: One of: Productivity, Marketing, Leadership, Strategy, Mindset, Innovation

Format your response as a JSON array of idea objects. Make sure the markdown is properly formatted with line breaks between paragraphs.

Podcast Transcript:
${transcript}

Respond ONLY with valid JSON in this exact format:
{
  "ideas": [
    {
      "title": "The 80/20 Rule for Decision Making",
      "summary": "Focus on the 20% of decisions that drive 80% of outcomes...\\n\\n**Key points:**\\n- Most decisions are reversible\\n- Use bold for emphasis",
      "actionable_takeaway": "Try this framework:\\n1. Identify your top 3 decisions\\n2. Schedule time for each",
      "clarity_score": 9,
      "category": "Strategy"
    }
  ]
}`,
        },
      ],
    });

    let responseText = message.content[0].text;
    console.log('Claude response received');

    // Remove markdown code blocks if present
    responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    // Parse the JSON response
    const parsed = JSON.parse(responseText);
    const ideas = parsed.ideas;

    if (!ideas || ideas.length === 0) {
      return res.status(400).json({ error: 'No ideas extracted from transcript' });
    }

    // Get or create podcast
    let podcast = null;
    if (podcastId) {
      // Use existing podcast by ID
      const { data: existingPodcast } = await supabase
        .from('podcasts')
        .select('*')
        .eq('id', podcastId)
        .single();
      podcast = existingPodcast;
    } else if (podcastName) {
      // Create new podcast
      const { data: newPodcast } = await supabase
        .from('podcasts')
        .insert({ name: podcastName, host: podcastHost || null })
        .select()
        .single();
      podcast = newPodcast;
    }

    // Create digest
    const { data: newDigest, error: digestError } = await supabase
      .from('digests')
      .insert({
        title: digestTitle || `${podcastName || 'Podcast'} Digest`,
        description: digestDescription || `Key insights extracted from ${podcastName || 'podcast transcript'}`,
        image_url: digestImageUrl || null,
      })
      .select()
      .single();

    if (digestError) {
      console.error('Digest creation error:', digestError);
      return res.status(500).json({ error: 'Failed to create digest' });
    }

    console.log(`Created digest: ${newDigest.title}`);

    // Get categories map
    const { data: categories } = await supabase.from('categories').select('*');
    const categoryMap = {};
    categories?.forEach((cat) => {
      categoryMap[cat.name.toLowerCase()] = cat.id;
    });

    // Insert ideas into Supabase
    const ideasToInsert = ideas.map((idea) => ({
      digest_id: newDigest.id,
      podcast_id: podcast?.id || null,
      category_id: categoryMap[idea.category?.toLowerCase()] || null,
      title: idea.title,
      summary: idea.summary,
      actionable_takeaway: idea.actionable_takeaway || null,
      clarity_score: idea.clarity_score || null,
    }));

    const { data: insertedIdeas, error } = await supabase
      .from('ideas')
      .insert(ideasToInsert)
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to save ideas to database' });
    }

    console.log(`Successfully extracted and saved ${insertedIdeas.length} ideas`);

    res.json({
      success: true,
      digest: newDigest,
      ideasCount: insertedIdeas.length,
      ideas: insertedIdeas,
      podcast: podcast,
    });
  } catch (error) {
    console.error('Error processing transcript:', error);
    res.status(500).json({
      error: 'Failed to process transcript',
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 The Takeaway API server running on http://localhost:${PORT}`);
  console.log(`📝 Process transcripts at: POST http://localhost:${PORT}/api/process-transcript`);
});

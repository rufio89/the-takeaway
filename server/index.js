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

// Store for SSE connections
const progressConnections = new Map();

// SSE endpoint for progress updates
app.get('/api/process-transcript/progress/:jobId', (req, res) => {
  const { jobId } = req.params;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Send initial connection message
  res.write(`data: ${JSON.stringify({ stage: 'connected', progress: 0, message: 'Connected' })}\n\n`);

  // Store the response object for sending progress updates
  progressConnections.set(jobId, (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  });

  // Clean up on connection close
  req.on('close', () => {
    progressConnections.delete(jobId);
  });
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'The Takeaway API is running' });
});

// Helper to emit progress
function emitProgress(jobId, stage, progress, message) {
  const emit = progressConnections.get(jobId);
  if (emit) {
    emit({ stage, progress, message });
  }
}

// Process transcript endpoint
app.post('/api/process-transcript', async (req, res) => {
  try {
    const { transcript, podcastId, podcastName, podcastHost, digestTitle, digestImageUrl, jobId } = req.body;

    if (!transcript) {
      return res.status(400).json({ error: 'Transcript is required' });
    }

    console.log('Processing transcript...');
    emitProgress(jobId, 'sending', 5, 'Sending transcript to Claude...');

    // Call Claude API to extract ideas
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: `Build a learning-optimized idea map from this podcast transcript.

Goal: Convert linear audio into a small, explorable mental model that improves understanding and recall.

Rules:
• Extract 1 central thesis (≤ 8 words)
• Extract 3–5 supporting ideas that directly support the thesis (≤ 8 words each)
• Do not include tools, anecdotes, or examples
• Ideas must be conceptual, not procedural
• Enforce hierarchy: thesis → ideas
• Max 6 total nodes

For each supporting idea, also provide:
1. **summary**: A clear explanation of the concept (2-4 paragraphs in markdown format, use **bold** for key terms)
2. **actionable_takeaway**: Specific steps to apply this insight (1-2 paragraphs in markdown)
3. **clarity_score**: Rate 1-10 how clear and actionable this insight is
4. **category**: One of: Productivity, Marketing, Leadership, Strategy, Mindset, Innovation

Also provide:
• **description**: A compelling 1-2 sentence description of what makes this episode valuable. Focus on the main insight or transformation the listener will gain. Make it specific to this episode's content.

Podcast Transcript:
${transcript}

Respond ONLY with valid JSON in this exact format:
{
  "thesis": "Compound growth beats linear progress",
  "description": "Discover how tiny daily improvements compound into extraordinary results over time, and why most people fail to harness this exponential power.",
  "ideas": [
    {
      "title": "Small improvements create exponential returns",
      "summary": "**Compounding** works through consistent marginal gains...\\n\\nKey concept here.",
      "actionable_takeaway": "Start with:\\n1. Identify one 1% improvement\\n2. Track it daily",
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
    console.log('Raw response:', responseText.substring(0, 500)); // Log first 500 chars
    emitProgress(jobId, 'analyzing', 40, 'Analyzing response...');

    // Remove markdown code blocks if present
    responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    // Parse the JSON response
    const parsed = JSON.parse(responseText);
    const ideas = parsed.ideas;
    const thesis = parsed.thesis;
    const generatedDescription = parsed.description;

    console.log('Parsed thesis:', thesis);
    console.log('Parsed description:', generatedDescription);
    console.log('Ideas count:', ideas?.length);
    emitProgress(jobId, 'extracting', 60, `Extracted ${ideas?.length || 0} ideas`);

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

    emitProgress(jobId, 'saving', 75, 'Creating digest...');

    // Create digest with AI-generated title and description
    const { data: newDigest, error: digestError } = await supabase
      .from('digests')
      .insert({
        title: digestTitle || thesis || `${podcastName || 'Podcast'} Digest`,
        description: generatedDescription || `Key insights extracted from ${podcastName || 'podcast transcript'}`,
        image_url: digestImageUrl || null,
      })
      .select()
      .single();

    if (digestError) {
      console.error('Digest creation error:', digestError);
      return res.status(500).json({ error: 'Failed to create digest' });
    }

    console.log(`Created digest: ${newDigest.title}`);
    emitProgress(jobId, 'saving', 85, 'Saving ideas...');

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
    emitProgress(jobId, 'complete', 100, `Created ${insertedIdeas.length} ideas`);

    res.json({
      success: true,
      digest: newDigest,
      ideasCount: insertedIdeas.length,
      ideas: insertedIdeas,
      podcast: podcast,
    });
  } catch (error) {
    console.error('Error processing transcript:', error);
    emitProgress(req.body.jobId, 'error', 0, error.message);
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

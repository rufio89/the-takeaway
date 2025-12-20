import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Check, Loader2 } from 'lucide-react';
import type { Digest, Podcast, Category, Database } from '../../types/database';

interface CreateIdeaFormProps {
  digests: Digest[];
  podcasts: Podcast[];
  categories: Category[];
  onSuccess: () => void;
}

export function CreateIdeaForm({ digests, podcasts, categories, onSuccess }: CreateIdeaFormProps) {
  const [digestId, setDigestId] = useState('');
  const [podcastId, setPodcastId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [actionableTakeaway, setActionableTakeaway] = useState('');
  const [clarityScore, setClarityScore] = useState(8);
  const [timestamp, setTimestamp] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // @ts-expect-error - Supabase type inference issue with optional fields
      const { error } = await supabase.from('ideas').insert({
        digest_id: digestId || null,
        podcast_id: podcastId || null,
        category_id: categoryId || null,
        title,
        summary,
        actionable_takeaway: actionableTakeaway || null,
        clarity_score: clarityScore,
        timestamp: timestamp || null,
      });

      if (error) throw error;

      setSuccess(true);
      setTitle('');
      setSummary('');
      setActionableTakeaway('');
      setClarityScore(8);
      setTimestamp('');
      onSuccess();

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create idea');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="digestId" className="block text-sm font-medium text-gray-700 mb-1">
          Digest *
        </label>
        <select
          id="digestId"
          value={digestId}
          onChange={(e) => setDigestId(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Select a digest</option>
          {digests.map((digest) => (
            <option key={digest.id} value={digest.id}>
              {digest.title}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="podcastId" className="block text-sm font-medium text-gray-700 mb-1">
            Podcast
          </label>
          <select
            id="podcastId"
            value={podcastId}
            onChange={(e) => setPodcastId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Select a podcast</option>
            {podcasts.map((podcast) => (
              <option key={podcast.id} value={podcast.id}>
                {podcast.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="categoryId"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="The 80/20 Rule for Decision Making"
        />
      </div>

      <div>
        <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
          Summary * <span className="text-gray-500 font-normal">(Markdown supported)</span>
        </label>
        <textarea
          id="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          required
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
          placeholder="Focus on the 20% of decisions that drive 80% of outcomes.

**Key points:**
- Most decisions are reversible
- Use **bold** and *italic* for emphasis
- Create lists with - or *"
        />
        <p className="text-xs text-gray-500 mt-1">
          Paste from Notion! Supports bold, italic, lists, and links.
        </p>
      </div>

      <div>
        <label htmlFor="actionableTakeaway" className="block text-sm font-medium text-gray-700 mb-1">
          Actionable Takeaway <span className="text-gray-500 font-normal">(Markdown supported)</span>
        </label>
        <textarea
          id="actionableTakeaway"
          value={actionableTakeaway}
          onChange={(e) => setActionableTakeaway(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
          placeholder="Try this framework:
1. Identify your top 3 decisions this week
2. Schedule 30 min for each
3. Document your reasoning"
        />
        <p className="text-xs text-gray-500 mt-1">
          Paste from Notion! Markdown formatting will be rendered beautifully.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="clarityScore" className="block text-sm font-medium text-gray-700 mb-1">
            Clarity Score (1-10) *
          </label>
          <input
            type="number"
            id="clarityScore"
            value={clarityScore}
            onChange={(e) => setClarityScore(Number(e.target.value))}
            min={1}
            max={10}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label htmlFor="timestamp" className="block text-sm font-medium text-gray-700 mb-1">
            Timestamp
          </label>
          <input
            type="text"
            id="timestamp"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="12:34"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md text-sm flex items-center gap-2">
          <Check className="w-4 h-4" />
          Idea added successfully!
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {loading ? 'Adding...' : 'Add Idea'}
      </button>
    </form>
  );
}

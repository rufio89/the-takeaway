import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../hooks/useToast';
import { Loader2 } from 'lucide-react';

interface CreateDigestFormProps {
  onSuccess: () => void;
}

export function CreateDigestForm({ onSuccess }: CreateDigestFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [publishedDate, setPublishedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [featured, setFeatured] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('digests').insert({
        title,
        description: description || null,
        image_url: imageUrl || null,
        published_date: publishedDate,
        featured,
      });

      if (error) throw error;

      toast.success('Digest created', `"${title}" has been published`);
      setTitle('');
      setDescription('');
      setImageUrl('');
      setPublishedDate(new Date().toISOString().split('T')[0]);
      setFeatured(false);
      onSuccess();
    } catch (err) {
      toast.error('Failed to create digest', err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          placeholder="Weekly Insights: AI & Productivity"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-gray-500 font-normal">(Markdown supported)</span>
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
          placeholder="A curated collection of insights from this week's top podcasts.

**Topics covered:** AI, productivity, and growth strategies."
        />
        <p className="text-xs text-gray-500 mt-1">
          Paste from Notion! Supports **bold**, *italic*, lists, and links.
        </p>
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
          Cover Image URL
        </label>
        <input
          type="url"
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="https://images.unsplash.com/photo-..."
        />
        <p className="text-xs text-gray-500 mt-1">
          Optional. Add a cover image to make your digest stand out.
        </p>
      </div>

      <div>
        <label htmlFor="publishedDate" className="block text-sm font-medium text-gray-700 mb-1">
          Published Date *
        </label>
        <input
          type="date"
          id="publishedDate"
          value={publishedDate}
          onChange={(e) => setPublishedDate(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="featured"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
        <label htmlFor="featured" className="text-sm font-medium text-gray-700">
          Featured digest
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {loading ? 'Creating...' : 'Create Digest'}
      </button>
    </form>
  );
}

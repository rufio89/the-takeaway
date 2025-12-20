import { useState } from 'react';
import type { Digest, Podcast } from '../../types/database';

interface ProcessTranscriptFormProps {
  digests: Digest[];
  podcasts: Podcast[];
  onSuccess: () => void;
}

export function ProcessTranscriptForm({ digests, podcasts, onSuccess }: ProcessTranscriptFormProps) {
  const [transcript, setTranscript] = useState('');
  const [podcastId, setPodcastId] = useState('');
  const [newPodcastName, setNewPodcastName] = useState('');
  const [newPodcastHost, setNewPodcastHost] = useState('');
  const [digestTitle, setDigestTitle] = useState('');
  const [digestDescription, setDigestDescription] = useState('');
  const [digestImageUrl, setDigestImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ ideasCount: number; digestTitle: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('http://localhost:3001/api/process-transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript,
          podcastId: podcastId || undefined,
          podcastName: newPodcastName || undefined,
          podcastHost: newPodcastHost || undefined,
          digestTitle: digestTitle || undefined,
          digestDescription: digestDescription || undefined,
          digestImageUrl: digestImageUrl || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process transcript');
      }

      const result = await response.json();
      setSuccess({
        ideasCount: result.ideasCount,
        digestTitle: result.digest?.title || 'Unknown',
      });

      // Reset form
      setTranscript('');
      setPodcastId('');
      setNewPodcastName('');
      setNewPodcastHost('');
      setDigestTitle('');
      setDigestDescription('');
      setDigestImageUrl('');

      // Refresh data
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Process Podcast Transcript
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Paste a podcast transcript below and Claude will automatically extract actionable ideas,
          summaries, and categorize them for you.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">
            <strong>Error:</strong> {error}
          </p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800">
            <strong>Success!</strong> Created digest "{success.digestTitle}" with {success.ideasCount} ideas
          </p>
        </div>
      )}

      <div>
        <label htmlFor="transcript" className="block text-sm font-medium text-gray-700 mb-2">
          Transcript <span className="text-red-500">*</span>
        </label>
        <textarea
          id="transcript"
          required
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          rows={12}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
          placeholder="Paste your podcast transcript here..."
        />
        <p className="mt-1 text-xs text-gray-500">
          Works best with 5,000 - 30,000 words. Claude will extract 3-7 high-value ideas.
        </p>
      </div>

      <div>
        <label htmlFor="digestTitle" className="block text-sm font-medium text-gray-700 mb-2">
          Digest Title
        </label>
        <input
          type="text"
          id="digestTitle"
          value={digestTitle}
          onChange={(e) => setDigestTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Weekly Insights #12"
        />
        <p className="mt-1 text-xs text-gray-500">
          Optional. Defaults to "[Podcast Name] Digest" if not provided.
        </p>
      </div>

      <div>
        <label htmlFor="digestDescription" className="block text-sm font-medium text-gray-700 mb-2">
          Digest Description
        </label>
        <textarea
          id="digestDescription"
          value={digestDescription}
          onChange={(e) => setDigestDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="A curated collection of actionable insights..."
        />
        <p className="mt-1 text-xs text-gray-500">
          Optional. A brief description of what this digest contains.
        </p>
      </div>

      <div>
        <label htmlFor="digestImageUrl" className="block text-sm font-medium text-gray-700 mb-2">
          Digest Cover Image URL
        </label>
        <input
          type="url"
          id="digestImageUrl"
          value={digestImageUrl}
          onChange={(e) => setDigestImageUrl(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="https://images.unsplash.com/photo-..."
        />
        <p className="mt-1 text-xs text-gray-500">
          Optional. Add a cover image to make the digest stand out.
        </p>
      </div>

      <div>
        <label htmlFor="podcastId" className="block text-sm font-medium text-gray-700 mb-2">
          Podcast
        </label>
        <select
          id="podcastId"
          value={podcastId}
          onChange={(e) => setPodcastId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">Select existing podcast or create new...</option>
          {podcasts.map((podcast) => (
            <option key={podcast.id} value={podcast.id}>
              {podcast.name} {podcast.host ? `- ${podcast.host}` : ''}
            </option>
          ))}
          <option value="new">+ Create New Podcast</option>
        </select>
        <p className="mt-1 text-xs text-gray-500">
          Optional. Choose an existing podcast or create a new one.
        </p>
      </div>

      {podcastId === 'new' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label htmlFor="newPodcastName" className="block text-sm font-medium text-gray-700 mb-2">
              New Podcast Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="newPodcastName"
              required={podcastId === 'new'}
              value={newPodcastName}
              onChange={(e) => setNewPodcastName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="The Tim Ferriss Show"
            />
          </div>

          <div>
            <label htmlFor="newPodcastHost" className="block text-sm font-medium text-gray-700 mb-2">
              Podcast Host
            </label>
            <input
              type="text"
              id="newPodcastHost"
              value={newPodcastHost}
              onChange={(e) => setNewPodcastHost(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Tim Ferriss"
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Processing typically takes 10-30 seconds
        </p>
        <button
          type="submit"
          disabled={loading || !transcript.trim()}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Processing...' : 'Process Transcript'}
        </button>
      </div>
    </form>
  );
}

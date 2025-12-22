import { useState, useRef, useCallback } from 'react';
import { useToast } from '../../hooks/useToast';
import { TranscriptProgress, type ProgressState } from './TranscriptProgress';
import type { Podcast } from '../../types/database';

interface ProcessTranscriptFormProps {
  podcasts: Podcast[];
  onSuccess: () => void;
}

export function ProcessTranscriptForm({ podcasts, onSuccess }: ProcessTranscriptFormProps) {
  const [transcript, setTranscript] = useState('');
  const [podcastId, setPodcastId] = useState('');
  const [newPodcastName, setNewPodcastName] = useState('');
  const [newPodcastHost, setNewPodcastHost] = useState('');
  const [digestTitle, setDigestTitle] = useState('');
  const [digestImageUrl, setDigestImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<ProgressState | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const toast = useToast();

  const cleanupEventSource = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setProgress({ stage: 'sending', progress: 0, message: 'Starting...' });

    // Generate a unique job ID for SSE progress tracking
    const jobId = crypto.randomUUID();

    try {
      // Set up SSE connection for progress updates
      const eventSource = new EventSource(`http://localhost:3001/api/process-transcript/progress/${jobId}`);
      eventSourceRef.current = eventSource;

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setProgress(data);
      };

      eventSource.onerror = () => {
        cleanupEventSource();
      };

      // Make the API request
      const response = await fetch('http://localhost:3001/api/process-transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript,
          jobId,
          podcastId: podcastId && podcastId !== 'new' ? podcastId : undefined,
          podcastName: newPodcastName || undefined,
          podcastHost: newPodcastHost || undefined,
          digestTitle: digestTitle || undefined,
          digestImageUrl: digestImageUrl || undefined,
        }),
      });

      cleanupEventSource();

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process transcript');
      }

      const result = await response.json();

      toast.success(
        'Transcript processed',
        `Created "${result.digest?.title}" with ${result.ideasCount} ideas`
      );

      // Reset form
      setTranscript('');
      setPodcastId('');
      setNewPodcastName('');
      setNewPodcastHost('');
      setDigestTitle('');
      setDigestImageUrl('');

      // Refresh data
      onSuccess();
    } catch (err) {
      cleanupEventSource();
      setProgress({ stage: 'error', progress: 0, message: err instanceof Error ? err.message : 'An error occurred' });
      toast.error('Processing failed', err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      // Clear progress after a delay
      setTimeout(() => setProgress(null), 3000);
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

      {progress && <TranscriptProgress progress={progress} />}

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            Optional. Defaults to AI-generated thesis if not provided.
          </p>
        </div>

        <div>
          <label htmlFor="digestImageUrl" className="block text-sm font-medium text-gray-700 mb-2">
            Cover Image URL
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
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> The digest description will be automatically generated by AI from the transcript content.
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

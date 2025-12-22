import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { DigestCard } from '../components/DigestCard';
import type { DigestWithIdeas } from '../types/database';
import { Loader2 } from 'lucide-react';

export function HomePage() {
  const [digests, setDigests] = useState<DigestWithIdeas[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDigests();
  }, []);

  async function fetchDigests() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('digests')
        .select(`
          *,
          ideas (
            *,
            podcast:podcasts (*),
            category:categories (*)
          )
        `)
        .order('published_date', { ascending: false });

      if (error) throw error;
      setDigests(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load digests');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-16 border-b border-gray-200 pb-8">
          <p className="text-sm text-gray-500 uppercase tracking-wider mb-4">Latest</p>
          <h2 className="text-5xl font-serif text-gray-900 mb-4 leading-tight tracking-tight">
            Podcast Insights
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl font-light">
            Curated ideas, compressed for clarity
          </p>
        </div>

        {digests.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 text-lg font-medium">No digests yet</p>
            <p className="text-gray-500 text-sm mt-1">Check back soon for new content!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {digests.map((digest) => (
              <DigestCard key={digest.id} digest={digest} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

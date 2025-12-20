import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { supabase } from '../lib/supabase';
import { IdeaCard } from '../components/IdeaCard';
import type { DigestWithIdeas } from '../types/database';
import { Loader2, ArrowLeft, Calendar } from 'lucide-react';

export function DigestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [digest, setDigest] = useState<DigestWithIdeas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchDigest(id);
    }
  }, [id]);

  async function fetchDigest(digestId: string) {
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
        .eq('id', digestId)
        .single();

      if (error) throw error;
      setDigest(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load digest');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      </div>
    );
  }

  if (error || !digest) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 mb-4">
          {error || 'Digest not found'}
        </div>
        <Link to="/" className="text-primary-600 hover:text-primary-700 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to all digests
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(digest.published_date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to all digests
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-2 text-gray-600 mb-3">
          <Calendar className="w-4 h-4" />
          <span>{formattedDate}</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{digest.title}</h1>
        {digest.description && (
          <div className="notion-content text-lg">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => (
                  <p className="text-[17px] leading-[1.6] mb-[1em] text-gray-700">{children}</p>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-gray-900">{children}</strong>
                ),
                em: ({ children }) => (
                  <em className="italic">{children}</em>
                ),
                a: ({ children, href }) => (
                  <a href={href} className="text-primary-600 underline hover:text-primary-700" target="_blank" rel="noopener noreferrer">{children}</a>
                ),
                ul: ({ children }) => (
                  <ul className="my-[0.5em] pl-[1.5em] space-y-[0.25em] list-disc">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="my-[0.5em] pl-[1.5em] space-y-[0.25em] list-decimal">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="text-[17px] leading-[1.6] text-gray-700 pl-[0.25em] marker:text-gray-600">{children}</li>
                ),
                hr: () => <hr className="my-[2em] border-t border-gray-200" />,
                br: () => <br />,
              }}
            >
              {digest.description}
            </ReactMarkdown>
          </div>
        )}
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Key Ideas ({digest.ideas?.length || 0})
        </h2>
        {digest.ideas && digest.ideas.length > 0 ? (
          <div className="space-y-8">
            {digest.ideas.map((idea) => <IdeaCard key={idea.id} idea={idea} />)}
          </div>
        ) : (
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <p className="text-gray-600">No ideas in this digest yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

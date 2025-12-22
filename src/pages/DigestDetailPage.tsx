import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { supabase } from '../lib/supabase';
import { IdeaCard } from '../components/IdeaCard';
import { IdeaMap } from '../components/IdeaMap';
import { ShareButton } from '../components/ShareButton';
import { ExportButton } from '../components/ExportButton';
import type { DigestWithIdeas } from '../types/database';
import { Loader2, ArrowLeft } from 'lucide-react';

export function DigestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [digest, setDigest] = useState<DigestWithIdeas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'map' | 'ideas'>('ideas');

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
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !digest) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="border border-gray-300 p-6 text-gray-900 mb-6">
            {error || 'Article not found'}
          </div>
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            All Articles
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(digest.published_date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          All Articles
        </Link>

        <article className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs text-gray-500 uppercase tracking-wider">
              {formattedDate}
            </div>
            <div className="flex items-center gap-2">
              <ShareButton
                title={digest.title}
                url={`/digest/${digest.id}`}
                description={digest.description?.slice(0, 280)}
              />
              <ExportButton digest={digest} />
            </div>
          </div>
          <h1 className="text-5xl font-serif text-gray-900 mb-6 leading-tight tracking-tight">
            {digest.title}
          </h1>
          {digest.description && (
            <div className="notion-content text-lg border-b border-gray-200 pb-8">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ children }) => (
                    <p className="text-[17px] leading-[1.7] mb-[1.2em] text-gray-700 font-light">{children}</p>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-gray-900">{children}</strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic">{children}</em>
                  ),
                  a: ({ children, href }) => (
                    <a href={href} className="text-gray-900 underline hover:text-gray-600" target="_blank" rel="noopener noreferrer">{children}</a>
                  ),
                  ul: ({ children }) => (
                    <ul className="my-[1em] pl-[1.5em] space-y-[0.5em] list-disc">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="my-[1em] pl-[1.5em] space-y-[0.5em] list-decimal">{children}</ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-[17px] leading-[1.7] text-gray-700 font-light pl-[0.25em] marker:text-gray-600">{children}</li>
                  ),
                  hr: () => <hr className="my-[2em] border-t border-gray-200" />,
                  br: () => <br />,
                }}
              >
                {digest.description}
              </ReactMarkdown>
            </div>
          )}
        </article>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-12">
          <nav className="flex gap-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('ideas')}
              className={`
                pb-4 px-1 border-b-2 text-sm transition-colors
                ${activeTab === 'ideas'
                  ? 'border-gray-900 text-gray-900 font-medium'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
                }
              `}
            >
              Key Ideas ({digest.ideas?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`
                pb-4 px-1 border-b-2 text-sm transition-colors
                ${activeTab === 'map'
                  ? 'border-gray-900 text-gray-900 font-medium'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
                }
              `}
            >
              Semantic Graph
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'ideas' ? (
          <div className="space-y-4">
            {digest.ideas && digest.ideas.length > 0 ? (
              <div className="space-y-4">
                {[...digest.ideas]
                  .sort((a, b) => (b.clarity_score || 0) - (a.clarity_score || 0))
                  .map((idea, index) => (
                    <IdeaCard
                      key={idea.id}
                      idea={idea}
                      defaultExpanded={index < 2}
                    />
                  ))
                }
              </div>
            ) : (
              <div className="border border-gray-200 p-8 text-center">
                <p className="text-gray-600 text-sm">No ideas in this article yet.</p>
              </div>
            )}
          </div>
        ) : (
          <IdeaMap
            thesis={digest.title}
            ideas={digest.ideas || []}
          />
        )}
      </div>
    </div>
  );
}

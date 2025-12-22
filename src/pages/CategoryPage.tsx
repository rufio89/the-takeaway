import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { IdeaCard } from '../components/IdeaCard';
import type { Category, Idea, Podcast } from '../types/database';
import { Loader2, ArrowLeft } from 'lucide-react';

type IdeaWithRelations = Idea & {
  podcast: Podcast | null;
  category: Category | null;
  digest: { id: string; title: string } | null;
};

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [ideas, setIdeas] = useState<IdeaWithRelations[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchCategoryAndIdeas(slug);
    }
  }, [slug]);

  async function fetchCategoryAndIdeas(categorySlug: string) {
    try {
      setLoading(true);

      // Fetch all categories for navigation
      const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      setAllCategories(categories || []);

      // Find the current category
      const currentCategory = categories?.find((c) => c.slug === categorySlug);
      if (!currentCategory) {
        throw new Error('Category not found');
      }
      setCategory(currentCategory);

      // Fetch ideas in this category
      const { data: ideasData, error: ideasError } = await supabase
        .from('ideas')
        .select(`
          *,
          podcast:podcasts (*),
          category:categories (*),
          digest:digests (id, title)
        `)
        .eq('category_id', currentCategory.id)
        .order('clarity_score', { ascending: false });

      if (ideasError) throw ideasError;
      setIdeas(ideasData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load category');
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

  if (error || !category) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="border border-gray-300 p-6 text-gray-900 mb-6">
            {error || 'Category not found'}
          </div>
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            All Articles
          </Link>
        </div>
      </div>
    );
  }

  // Group ideas by podcast
  const ideasByPodcast = ideas.reduce((acc, idea) => {
    const podcastName = idea.podcast?.name || 'Other';
    if (!acc[podcastName]) {
      acc[podcastName] = [];
    }
    acc[podcastName].push(idea);
    return acc;
  }, {} as Record<string, IdeaWithRelations[]>);

  const podcastNames = Object.keys(ideasByPodcast).sort();

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

        {/* Category Header */}
        <div className="mb-12 border-b border-gray-200 pb-8">
          <p className="text-sm text-gray-500 uppercase tracking-wider mb-4">Category</p>
          <h1 className="text-5xl font-serif text-gray-900 mb-4 leading-tight tracking-tight">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-lg text-gray-600 max-w-2xl font-light">
              {category.description}
            </p>
          )}
          <p className="text-sm text-gray-500 mt-4">
            {ideas.length} idea{ideas.length !== 1 ? 's' : ''} across {podcastNames.length} podcast{podcastNames.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Category Navigation */}
        <div className="mb-8">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Browse Categories</p>
          <div className="flex flex-wrap gap-2">
            {allCategories.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className={`px-3 py-1.5 text-sm rounded-sm transition-colors ${
                  cat.id === category.id
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Ideas grouped by Podcast */}
        {ideas.length === 0 ? (
          <div className="border border-gray-200 p-8 text-center">
            <p className="text-gray-600 text-sm">No ideas in this category yet.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {podcastNames.map((podcastName) => (
              <div key={podcastName}>
                <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  {podcastName}
                  <span className="text-sm text-gray-500 font-normal ml-2">
                    ({ideasByPodcast[podcastName].length})
                  </span>
                </h2>
                <div className="space-y-4">
                  {ideasByPodcast[podcastName].map((idea) => (
                    <div key={idea.id}>
                      {idea.digest && (
                        <Link
                          to={`/digest/${idea.digest.id}#idea-${idea.id}`}
                          className="block text-xs text-gray-500 hover:text-gray-700 mb-2"
                        >
                          From: {idea.digest.title}
                        </Link>
                      )}
                      <IdeaCard idea={idea} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

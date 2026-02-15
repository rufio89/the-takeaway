import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { DigestCard } from '../components/DigestCard';
import { DigestFilters } from '../components/filters/DigestFilters';
import { useDigestFilters } from '../hooks/useDigestFilters';
import type { DigestWithIdeas, Category } from '../types/database';
import { Loader2 } from 'lucide-react';

export function HomePage() {
  const [digests, setDigests] = useState<DigestWithIdeas[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    filters,
    filteredDigests,
    categoryOptions,
    podcastOptions,
    setSearchQuery,
    setSelectedCategories,
    setSelectedPodcasts,
    setSortBy,
    clearFilters,
    hasActiveFilters,
  } = useDigestFilters(digests);

  useEffect(() => {
    fetchDigests();
  }, []);

  async function fetchDigests() {
    try {
      setLoading(true);

      // Fetch digests and categories in parallel
      const [digestsResult, categoriesResult] = await Promise.all([
        supabase
          .from('digests')
          .select(`
            *,
            ideas (
              *,
              podcast:podcasts (*),
              category:categories (*)
            )
          `)
          .order('published_date', { ascending: false }),
        supabase
          .from('categories')
          .select('*')
          .order('name'),
      ]);

      if (digestsResult.error) throw digestsResult.error;
      setDigests(digestsResult.data || []);
      setCategories(categoriesResult.data || []);
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
          <Loader2 className="w-8 h-8 animate-spin text-primary-600 dark:text-primary-400" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-800 dark:text-red-200">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12 border-b border-gray-200 dark:border-gray-800 pb-8">
          <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Latest</p>
          <h2 className="text-5xl font-serif text-gray-900 dark:text-white mb-4 leading-tight tracking-tight">
            Podcast Insights
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl font-light mb-6">
            Curated ideas, compressed for clarity
          </p>

          {/* Category Quick Links */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mr-2 self-center">Explore:</span>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.slug}`}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-sm transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="mb-8">
          <DigestFilters
            searchQuery={filters.searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={filters.sortBy}
            onSortChange={setSortBy}
            categoryOptions={categoryOptions}
            selectedCategories={filters.selectedCategories}
            onCategoriesChange={setSelectedCategories}
            podcastOptions={podcastOptions}
            selectedPodcasts={filters.selectedPodcasts}
            onPodcastsChange={setSelectedPodcasts}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
            resultCount={filteredDigests.length}
            totalCount={digests.length}
          />
        </div>

        {filteredDigests.length === 0 && hasActiveFilters ? (
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-12 text-center rounded-lg">
            <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">No matching articles</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Try adjusting your filters</p>
            <button
              onClick={clearFilters}
              className="mt-4 text-sm text-gray-700 dark:text-gray-300 underline hover:text-gray-900 dark:hover:text-white"
            >
              Clear all filters
            </button>
          </div>
        ) : digests.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-50 dark:from-gray-900 to-gray-100 dark:to-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-12 text-center">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">No digests yet</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Check back soon for new content!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {filteredDigests.map((digest) => (
              <DigestCard key={digest.id} digest={digest} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

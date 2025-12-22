import { useState, useMemo, useCallback } from 'react';
import type { DigestWithIdeas } from '../types/database';
import type { SortOption } from '../components/filters/SortSelect';

interface FilterState {
  searchQuery: string;
  selectedCategories: string[];
  selectedPodcasts: string[];
  sortBy: SortOption;
}

interface FilterOption {
  id: string;
  name: string;
}

export function useDigestFilters(digests: DigestWithIdeas[]) {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedCategories: [],
    selectedPodcasts: [],
    sortBy: 'date-desc',
  });

  // Extract unique categories from all digests
  const categoryOptions = useMemo<FilterOption[]>(() => {
    const categoryMap = new Map<string, string>();
    digests.forEach((digest) => {
      digest.ideas?.forEach((idea) => {
        if (idea.category) {
          categoryMap.set(idea.category.id, idea.category.name);
        }
      });
    });
    return Array.from(categoryMap.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [digests]);

  // Extract unique podcasts from all digests
  const podcastOptions = useMemo<FilterOption[]>(() => {
    const podcastMap = new Map<string, string>();
    digests.forEach((digest) => {
      digest.ideas?.forEach((idea) => {
        if (idea.podcast) {
          podcastMap.set(idea.podcast.id, idea.podcast.name);
        }
      });
    });
    return Array.from(podcastMap.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [digests]);

  // Calculate average clarity score for a digest
  const getAvgClarity = useCallback((digest: DigestWithIdeas): number => {
    if (!digest.ideas?.length) return 0;
    const sum = digest.ideas.reduce((acc, idea) => acc + (idea.clarity_score || 0), 0);
    return sum / digest.ideas.length;
  }, []);

  // Filter and sort digests
  const filteredDigests = useMemo(() => {
    return digests
      .filter((digest) => {
        // Search filter
        if (filters.searchQuery) {
          const query = filters.searchQuery.toLowerCase();
          const matchesTitle = digest.title.toLowerCase().includes(query);
          const matchesDescription = digest.description?.toLowerCase().includes(query);
          if (!matchesTitle && !matchesDescription) return false;
        }

        // Category filter
        if (filters.selectedCategories.length > 0) {
          const digestCategoryIds = digest.ideas
            ?.map((idea) => idea.category?.id)
            .filter(Boolean) as string[];
          const hasCategory = filters.selectedCategories.some((catId) =>
            digestCategoryIds.includes(catId)
          );
          if (!hasCategory) return false;
        }

        // Podcast filter
        if (filters.selectedPodcasts.length > 0) {
          const digestPodcastIds = digest.ideas
            ?.map((idea) => idea.podcast?.id)
            .filter(Boolean) as string[];
          const hasPodcast = filters.selectedPodcasts.some((podId) =>
            digestPodcastIds.includes(podId)
          );
          if (!hasPodcast) return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'date-desc':
            return new Date(b.published_date).getTime() - new Date(a.published_date).getTime();
          case 'date-asc':
            return new Date(a.published_date).getTime() - new Date(b.published_date).getTime();
          case 'clarity-desc':
            return getAvgClarity(b) - getAvgClarity(a);
          case 'clarity-asc':
            return getAvgClarity(a) - getAvgClarity(b);
          default:
            return 0;
        }
      });
  }, [digests, filters, getAvgClarity]);

  const setSearchQuery = useCallback((searchQuery: string) => {
    setFilters((prev) => ({ ...prev, searchQuery }));
  }, []);

  const setSelectedCategories = useCallback((selectedCategories: string[]) => {
    setFilters((prev) => ({ ...prev, selectedCategories }));
  }, []);

  const setSelectedPodcasts = useCallback((selectedPodcasts: string[]) => {
    setFilters((prev) => ({ ...prev, selectedPodcasts }));
  }, []);

  const setSortBy = useCallback((sortBy: SortOption) => {
    setFilters((prev) => ({ ...prev, sortBy }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      searchQuery: '',
      selectedCategories: [],
      selectedPodcasts: [],
      sortBy: 'date-desc',
    });
  }, []);

  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.selectedCategories.length > 0 ||
    filters.selectedPodcasts.length > 0;

  return {
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
  };
}

import { SearchBar } from './SearchBar';
import { SortSelect, type SortOption } from './SortSelect';
import { FilterDropdown } from './FilterDropdown';
import { X } from 'lucide-react';

interface FilterOption {
  id: string;
  name: string;
}

interface DigestFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
  categoryOptions: FilterOption[];
  selectedCategories: string[];
  onCategoriesChange: (ids: string[]) => void;
  podcastOptions: FilterOption[];
  selectedPodcasts: string[];
  onPodcastsChange: (ids: string[]) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  resultCount: number;
  totalCount: number;
}

export function DigestFilters({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  categoryOptions,
  selectedCategories,
  onCategoriesChange,
  podcastOptions,
  selectedPodcasts,
  onPodcastsChange,
  hasActiveFilters,
  onClearFilters,
  resultCount,
  totalCount,
}: DigestFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Search and Sort Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchBar value={searchQuery} onChange={onSearchChange} />
        </div>
        <div className="flex gap-3">
          <FilterDropdown
            label="Category"
            options={categoryOptions}
            selectedIds={selectedCategories}
            onChange={onCategoriesChange}
          />
          <FilterDropdown
            label="Podcast"
            options={podcastOptions}
            selectedIds={selectedPodcasts}
            onChange={onPodcastsChange}
          />
          <SortSelect value={sortBy} onChange={onSortChange} />
        </div>
      </div>

      {/* Results Count and Clear Filters */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">
          {hasActiveFilters ? (
            <>
              Showing {resultCount} of {totalCount} articles
            </>
          ) : (
            <>{totalCount} articles</>
          )}
        </span>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-4 h-4" />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}

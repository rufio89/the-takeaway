import { ChevronDown } from 'lucide-react';

export type SortOption = 'date-desc' | 'date-asc' | 'clarity-desc' | 'clarity-asc';

interface SortSelectProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'date-desc', label: 'Newest First' },
  { value: 'date-asc', label: 'Oldest First' },
  { value: 'clarity-desc', label: 'Highest Clarity' },
  { value: 'clarity-asc', label: 'Lowest Clarity' },
];

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-gray-400 transition-colors bg-white cursor-pointer"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  );
}

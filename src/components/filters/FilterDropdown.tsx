import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface FilterOption {
  id: string;
  name: string;
}

interface FilterDropdownProps {
  label: string;
  options: FilterOption[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
}

export function FilterDropdown({ label, options, selectedIds, onChange }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const selectedCount = selectedIds.length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-sm hover:border-gray-400 transition-colors bg-white"
      >
        <span className="text-gray-700">{label}</span>
        {selectedCount > 0 && (
          <span className="px-1.5 py-0.5 text-xs bg-gray-900 text-white rounded-sm">
            {selectedCount}
          </span>
        )}
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-sm shadow-lg z-10 max-h-64 overflow-y-auto">
          {options.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-500">No options available</div>
          ) : (
            options.map((option) => (
              <button
                key={option.id}
                onClick={() => toggleOption(option.id)}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors"
              >
                <span
                  className={`w-4 h-4 border rounded-sm flex items-center justify-center ${
                    selectedIds.includes(option.id)
                      ? 'bg-gray-900 border-gray-900'
                      : 'border-gray-300'
                  }`}
                >
                  {selectedIds.includes(option.id) && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </span>
                <span className="text-gray-700">{option.name}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

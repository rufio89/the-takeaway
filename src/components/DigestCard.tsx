import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import type { DigestWithIdeas } from '../types/database';

interface DigestCardProps {
  digest: DigestWithIdeas;
}

export function DigestCard({ digest }: DigestCardProps) {
  const ideaCount = digest.ideas?.length || 0;
  const avgClarityScore = digest.ideas?.length
    ? (digest.ideas.reduce((sum, idea) => sum + (idea.clarity_score || 0), 0) / digest.ideas.length).toFixed(1)
    : 'N/A';

  const formattedDate = new Date(digest.published_date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Get unique podcasts and categories from ideas
  const podcasts = [...new Set(digest.ideas?.map(idea => idea.podcast?.name).filter(Boolean))] as string[];
  const categories = [...new Set(digest.ideas?.map(idea => idea.category?.name).filter(Boolean))] as string[];

  // Generate placeholder image based on digest ID for visual variety
  const generatePlaceholderColor = (id: string): string => {
    const colors = [
      'from-blue-500 to-purple-600',
      'from-green-500 to-blue-600',
      'from-orange-500 to-red-600',
      'from-purple-500 to-pink-600',
      'from-indigo-500 to-blue-600',
    ];
    const index = parseInt(id.slice(0, 8), 16) % colors.length;
    return colors[index];
  };

  const placeholderGradient = generatePlaceholderColor(digest.id);
  const isFeatured = digest.featured;

  return (
    <Link
      to={`/digest/${digest.id}`}
      className={`block transition-all duration-200 group ${
        isFeatured
          ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 hover:border-amber-400 shadow-md hover:shadow-lg'
          : 'bg-white border border-gray-200 hover:border-gray-400'
      }`}
    >
      {/* Cover Image with Placeholder Fallback */}
      <div className={`relative h-56 overflow-hidden border-b ${
        isFeatured ? 'border-amber-200' : 'border-gray-200'
      }`}>
        {digest.image_url ? (
          <img
            src={digest.image_url}
            alt={digest.title}
            className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-200"
            onError={(e) => {
              // Fallback to gradient if image fails to load
              const target = e.currentTarget;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`w-full h-full bg-gradient-to-br ${placeholderGradient} flex items-center justify-center ${
          digest.image_url ? 'hidden' : ''
        }`}>
          <div className="text-white text-opacity-20">
            <div className="text-6xl">📡</div>
          </div>
        </div>

        {/* Featured Badge */}
        {isFeatured && (
          <div className="absolute top-3 right-3 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
            <Star className="w-3 h-3 fill-white" />
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`p-8 ${isFeatured ? 'bg-gradient-to-br from-amber-50/50 to-transparent' : ''}`}>
        {podcasts.length > 0 && (
          <div className={`text-xs font-medium uppercase tracking-wider mb-2 ${
            isFeatured ? 'text-amber-700' : 'text-gray-700'
          }`}>
            {podcasts.join(' • ')}
          </div>
        )}
        <div className={`flex items-center gap-2 text-xs uppercase tracking-wider mb-3 ${
          isFeatured ? 'text-amber-600' : 'text-gray-500'
        }`}>
          <span>{formattedDate}</span>
          {categories.length > 0 && (
            <>
              <span>•</span>
              <span>{categories.join(', ')}</span>
            </>
          )}
        </div>

        <h3 className={`text-2xl font-serif mb-3 leading-tight tracking-tight ${
          isFeatured ? 'text-amber-900' : 'text-gray-900'
        }`}>
          {digest.title}
        </h3>

        {digest.description && (
          <p className={`text-sm mb-4 line-clamp-3 leading-relaxed font-light ${
            isFeatured ? 'text-amber-800' : 'text-gray-600'
          }`}>
            {digest.description}
          </p>
        )}

        <div className={`flex items-center gap-4 text-xs pt-4 border-t ${
          isFeatured 
            ? 'border-amber-200 text-amber-700' 
            : 'border-gray-200 text-gray-500'
        }`}>
          <span>{ideaCount} ideas</span>
          <span>•</span>
          <span>{avgClarityScore}/10 clarity</span>
        </div>
      </div>
    </Link>
  );
}

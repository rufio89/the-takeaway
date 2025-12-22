import { Link } from 'react-router-dom';
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

  return (
    <Link
      to={`/digest/${digest.id}`}
      className="block bg-white border border-gray-200 hover:border-gray-400 transition-all duration-200 group"
    >
      {/* Cover Image */}
      {digest.image_url && (
        <div className="relative h-56 overflow-hidden border-b border-gray-200">
          <img
            src={digest.image_url}
            alt={digest.title}
            className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-200"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-8">
        <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">
          {formattedDate}
        </div>

        <h3 className="text-2xl font-serif text-gray-900 mb-3 leading-tight tracking-tight">
          {digest.title}
        </h3>

        {digest.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed font-light">
            {digest.description}
          </p>
        )}

        <div className="flex items-center gap-4 text-xs text-gray-500 pt-4 border-t border-gray-200">
          <span>{ideaCount} ideas</span>
          <span>•</span>
          <span>{avgClarityScore}/10 clarity</span>
        </div>
      </div>
    </Link>
  );
}

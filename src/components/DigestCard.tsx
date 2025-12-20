import { Link } from 'react-router-dom';
import { Calendar, Lightbulb, ArrowRight, Image as ImageIcon } from 'lucide-react';
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
      className="block bg-white rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all duration-200 group relative overflow-hidden"
    >
      {/* Cover Image */}
      {digest.image_url ? (
        <div className="relative h-48 overflow-hidden">
          <img
            src={digest.image_url}
            alt={digest.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          {digest.featured && (
            <span className="absolute top-3 right-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg">
              ⭐ Featured
            </span>
          )}
        </div>
      ) : (
        <div className="relative h-48 bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
          <ImageIcon className="w-16 h-16 text-primary-200" />
          {digest.featured && (
            <span className="absolute top-3 right-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-sm">
              ⭐ Featured
            </span>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-6 relative">
        {/* Subtle gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/0 to-primary-100/0 group-hover:from-primary-50/50 group-hover:to-primary-100/30 transition-all duration-200 pointer-events-none rounded-b-xl" />

        <div className="relative">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <Calendar className="w-4 h-4" />
          <span className="font-medium">{formattedDate}</span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors leading-tight">
          {digest.title}
        </h3>

        {digest.description && (
          <p className="text-gray-600 text-sm mb-5 line-clamp-2 leading-relaxed">{digest.description}</p>
        )}

        <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
          <div className="flex items-center gap-5 text-sm">
            <div className="flex items-center gap-1.5">
              <div className="p-1.5 bg-primary-50 rounded-lg">
                <Lightbulb className="w-4 h-4 text-primary-600" />
              </div>
              <div>
                <span className="font-bold text-gray-900">{ideaCount}</span>
                <span className="text-gray-500 ml-1">ideas</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-green-500" />
              <div>
                <span className="font-bold text-gray-900">{avgClarityScore}</span>
                <span className="text-gray-500 ml-1">/10</span>
              </div>
            </div>
          </div>
          <div className="p-2 bg-primary-50 rounded-lg group-hover:bg-primary-100 transition-colors">
            <ArrowRight className="w-4 h-4 text-primary-600 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
        </div>
      </div>
    </Link>
  );
}

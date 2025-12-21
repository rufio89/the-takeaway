import { Lightbulb, Target, Gauge, Tag, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Idea, Podcast, Category } from '../types/database';

interface IdeaCardProps {
  idea: Idea & {
    podcast: Podcast | null;
    category: Category | null;
  };
}

export function IdeaCard({ idea }: IdeaCardProps) {
  const clarityColor = idea.clarity_score
    ? idea.clarity_score >= 8
      ? 'bg-green-100 text-green-800 border-green-300'
      : idea.clarity_score >= 6
      ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
      : 'bg-orange-100 text-orange-800 border-orange-300'
    : 'bg-gray-100 text-gray-800 border-gray-300';

  return (
    <div id={`idea-${idea.id}`} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow scroll-mt-8">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-start gap-2">
            <Lightbulb className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
            <span>{idea.title}</span>
          </h3>
          {idea.category && (
            <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
              <Tag className="w-4 h-4" />
              <span>{idea.category.name}</span>
            </div>
          )}
        </div>
        {idea.clarity_score && (
          <div
            className={`flex items-center gap-1 px-3 py-1 rounded-full border text-sm font-semibold ${clarityColor}`}
          >
            <Gauge className="w-4 h-4" />
            <span>{idea.clarity_score}/10</span>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="notion-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => (
                <p className="text-[15px] leading-[1.6] mb-[1em] text-gray-800">{children}</p>
              ),
              h1: ({ children }) => (
                <h1 className="text-2xl font-bold leading-[1.3] mt-[1.4em] mb-[0.6em] first:mt-0 text-gray-900">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl font-bold leading-[1.3] mt-[1.4em] mb-[0.6em] first:mt-0 text-gray-900">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg font-bold leading-[1.3] mt-[1.4em] mb-[0.6em] first:mt-0 text-gray-900">{children}</h3>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-gray-900">{children}</strong>
              ),
              em: ({ children }) => (
                <em className="italic">{children}</em>
              ),
              a: ({ children, href }) => (
                <a href={href} className="text-primary-600 underline hover:text-primary-700" target="_blank" rel="noopener noreferrer">{children}</a>
              ),
              ul: ({ children }) => (
                <ul className="my-[0.5em] pl-[1.5em] space-y-[0.25em] list-disc">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="my-[0.5em] pl-[1.5em] space-y-[0.25em] list-decimal">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="text-[15px] leading-[1.6] text-gray-800 pl-[0.25em] marker:text-gray-600">{children}</li>
              ),
              hr: () => <hr className="my-[2em] border-t border-gray-200" />,
              br: () => <br />,
            }}
          >
            {idea.summary}
          </ReactMarkdown>
        </div>

        {idea.actionable_takeaway && (
          <div className="bg-primary-50 border-l-4 border-primary-500 p-5 rounded">
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-primary-700 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold text-primary-900 mb-3 text-base">Actionable Takeaway</h4>
                <div className="notion-content">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => (
                        <p className="text-[15px] leading-[1.6] mb-[1em] text-primary-900">{children}</p>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold text-primary-950">{children}</strong>
                      ),
                      em: ({ children }) => (
                        <em className="italic">{children}</em>
                      ),
                      ul: ({ children }) => (
                        <ul className="my-[0.5em] pl-[1.5em] space-y-[0.25em] list-disc">{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="my-[0.5em] pl-[1.5em] space-y-[0.25em] list-decimal">{children}</ol>
                      ),
                      li: ({ children }) => (
                        <li className="text-[15px] leading-[1.6] text-primary-900 pl-[0.25em] marker:text-primary-700">{children}</li>
                      ),
                      hr: () => <hr className="my-[2em] border-t border-primary-200" />,
                      br: () => <br />,
                    }}
                  >
                    {idea.actionable_takeaway}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-100 text-sm text-gray-600">
          {idea.podcast && (
            <div className="flex items-center gap-2">
              <span className="font-medium">{idea.podcast.name}</span>
              {idea.podcast.host && (
                <span className="text-gray-400">• {idea.podcast.host}</span>
              )}
            </div>
          )}
          {idea.timestamp && (
            <div className="flex items-center gap-1 text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{idea.timestamp}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

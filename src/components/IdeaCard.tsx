import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ShareButton } from './ShareButton';
import type { Idea, Podcast, Category } from '../types/database';

interface IdeaCardProps {
  idea: Idea & {
    podcast: Podcast | null;
    category: Category | null;
  };
  defaultExpanded?: boolean;
}

export function IdeaCard({ idea, defaultExpanded = false }: IdeaCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <article id={`idea-${idea.id}`} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 scroll-mt-8 transition-colors">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-8 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 transition-colors">
              {idea.category && (
                <Link
                  to={`/category/${idea.category.slug}`}
                  onClick={(e) => e.stopPropagation()}
                  className="hover:text-gray-900 dark:hover:text-white hover:underline transition-colors"
                >
                  {idea.category.name}
                </Link>
              )}
              {idea.category && idea.clarity_score && <span>•</span>}
              {idea.clarity_score && <span>Clarity: {idea.clarity_score}/10</span>}
            </div>
            <h3 className="text-2xl font-serif text-gray-900 dark:text-white leading-tight tracking-tight transition-colors">
              {idea.title}
            </h3>
          </div>
          <div className="flex-shrink-0 mt-1">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400 dark:text-gray-600 transition-colors" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-600 transition-colors" />
            )}
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className="px-8 pb-8 pt-6 border-t border-gray-200 dark:border-gray-800 transition-colors">
          <div className="space-y-6">
        <div className="notion-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => (
                <p className="text-[15px] leading-[1.7] mb-[1em] text-gray-700 dark:text-gray-300 font-light transition-colors">{children}</p>
              ),
              h1: ({ children }) => (
                <h1 className="text-2xl font-serif leading-[1.3] mt-[1.4em] mb-[0.6em] first:mt-0 text-gray-900 dark:text-white transition-colors">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl font-serif leading-[1.3] mt-[1.4em] mb-[0.6em] first:mt-0 text-gray-900 dark:text-white transition-colors">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg font-serif leading-[1.3] mt-[1.4em] mb-[0.6em] first:mt-0 text-gray-900 dark:text-white transition-colors">{children}</h3>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-gray-900 dark:text-white transition-colors">{children}</strong>
              ),
              em: ({ children }) => (
                <em className="italic">{children}</em>
              ),
              a: ({ children, href }) => (
                <a href={href} className="text-gray-900 dark:text-gray-100 underline hover:text-gray-600 dark:hover:text-gray-400 transition-colors" target="_blank" rel="noopener noreferrer">{children}</a>
              ),
              ul: ({ children }) => (
                <ul className="my-[0.5em] pl-[1.5em] space-y-[0.25em] list-disc">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="my-[0.5em] pl-[1.5em] space-y-[0.25em] list-decimal">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="text-[15px] leading-[1.7] text-gray-700 dark:text-gray-300 font-light pl-[0.25em] marker:text-gray-600 dark:marker:text-gray-500 transition-colors">{children}</li>
              ),
              hr: () => <hr className="my-[2em] border-t border-gray-200 dark:border-gray-800 transition-colors" />,
              br: () => <br />,
            }}
          >
            {idea.summary}
          </ReactMarkdown>
        </div>

        {idea.actionable_takeaway && (
          <div className="border-l-2 border-gray-900 dark:border-white pl-6 py-2 transition-colors">
            <h4 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 transition-colors">Actionable Takeaway</h4>
            <div className="notion-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ children }) => (
                    <p className="text-[15px] leading-[1.7] mb-[1em] text-gray-900 dark:text-gray-100 font-light transition-colors">{children}</p>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-gray-900 dark:text-white transition-colors">{children}</strong>
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
                    <li className="text-[15px] leading-[1.7] text-gray-900 dark:text-gray-100 font-light pl-[0.25em] marker:text-gray-600 dark:marker:text-gray-500 transition-colors">{children}</li>
                  ),
                  hr: () => <hr className="my-[2em] border-t border-gray-200 dark:border-gray-800 transition-colors" />,
                  br: () => <br />,
                }}
              >
                {idea.actionable_takeaway}
              </ReactMarkdown>
            </div>
          </div>
        )}

            <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-200 dark:border-gray-800 transition-colors">
              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 transition-colors">
                {idea.podcast && (
                  <>
                    <span>{idea.podcast.name}</span>
                    {idea.podcast.host && (
                      <>
                        <span>•</span>
                        <span>{idea.podcast.host}</span>
                      </>
                    )}
                  </>
                )}
                {idea.timestamp && (
                  <>
                    {idea.podcast && <span>•</span>}
                    <span>{idea.timestamp}</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                {idea.category && (
                  <Link
                    to={`/category/${idea.category.slug}`}
                    className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:underline transition-colors"
                  >
                    More {idea.category.name}
                  </Link>
                )}
                <ShareButton
                  title={idea.title}
                  url={`#idea-${idea.id}`}
                  description={idea.summary?.slice(0, 280)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

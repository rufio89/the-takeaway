import { Download } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import type { DigestWithIdeas } from '../types/database';

interface ExportButtonProps {
  digest: DigestWithIdeas;
}

export function ExportButton({ digest }: ExportButtonProps) {
  const toast = useToast();

  const generateMarkdown = (): string => {
    const lines: string[] = [];

    // Title
    lines.push(`# ${digest.title}`);
    lines.push('');

    // Description
    if (digest.description) {
      lines.push(digest.description);
      lines.push('');
    }

    // Metadata
    const date = new Date(digest.published_date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    lines.push(`*Published: ${date}*`);
    lines.push('');
    lines.push('---');
    lines.push('');

    // Ideas
    if (digest.ideas && digest.ideas.length > 0) {
      digest.ideas.forEach((idea, index) => {
        lines.push(`## ${index + 1}. ${idea.title}`);
        lines.push('');

        // Metadata line
        const meta: string[] = [];
        if (idea.podcast?.name) meta.push(`**Podcast:** ${idea.podcast.name}`);
        if (idea.category?.name) meta.push(`**Category:** ${idea.category.name}`);
        if (idea.clarity_score) meta.push(`**Clarity:** ${idea.clarity_score}/10`);
        if (meta.length > 0) {
          lines.push(meta.join(' | '));
          lines.push('');
        }

        // Summary
        if (idea.summary) {
          lines.push(idea.summary);
          lines.push('');
        }

        // Actionable takeaway
        if (idea.actionable_takeaway) {
          lines.push('### Actionable Takeaway');
          lines.push('');
          lines.push(idea.actionable_takeaway);
          lines.push('');
        }

        lines.push('---');
        lines.push('');
      });
    }

    // Footer
    lines.push(`*Exported from The Takeaway*`);

    return lines.join('\n');
  };

  const handleExport = () => {
    const markdown = generateMarkdown();
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${digest.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Exported', 'Markdown file downloaded');
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-1.5 px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
      aria-label="Export as Markdown"
    >
      <Download className="w-3.5 h-3.5" />
      <span>Export</span>
    </button>
  );
}

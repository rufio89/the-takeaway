import { useState, useRef, useEffect } from 'react';
import { Share2, Link, Twitter, Linkedin, Check } from 'lucide-react';
import { useToast } from '../hooks/useToast';

interface ShareButtonProps {
  title: string;
  url: string;
  description?: string;
}

export function ShareButton({ title, url, description }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toast = useToast();

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

  const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      toast.success('Link copied', 'Share it anywhere!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy', 'Please copy the URL manually');
    }
  };

  const handleCopyQuote = async () => {
    const quote = description
      ? `"${title}"\n\n${description}\n\n${fullUrl}`
      : `"${title}"\n\n${fullUrl}`;

    try {
      await navigator.clipboard.writeText(quote);
      toast.success('Quote copied', 'Ready to paste on social media');
    } catch {
      toast.error('Failed to copy', 'Please copy manually');
    }
    setIsOpen(false);
  };

  const handleTwitterShare = () => {
    const text = description
      ? `${title}\n\n${description.slice(0, 200)}${description.length > 200 ? '...' : ''}`
      : title;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(fullUrl)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
    setIsOpen(false);
  };

  const handleLinkedInShare = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`;
    window.open(linkedInUrl, '_blank', 'width=550,height=420');
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
        aria-label="Share"
      >
        <Share2 className="w-3.5 h-3.5" />
        <span>Share</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-sm shadow-lg z-20">
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left hover:bg-gray-50 transition-colors"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Link className="w-4 h-4 text-gray-500" />
            )}
            <span>{copied ? 'Copied!' : 'Copy link'}</span>
          </button>

          <button
            onClick={handleCopyQuote}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left hover:bg-gray-50 transition-colors border-t border-gray-100"
          >
            <span className="w-4 h-4 text-gray-500 text-center font-serif">"</span>
            <span>Copy as quote</span>
          </button>

          <div className="border-t border-gray-100" />

          <button
            onClick={handleTwitterShare}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left hover:bg-gray-50 transition-colors"
          >
            <Twitter className="w-4 h-4 text-gray-500" />
            <span>Share on X</span>
          </button>

          <button
            onClick={handleLinkedInShare}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left hover:bg-gray-50 transition-colors"
          >
            <Linkedin className="w-4 h-4 text-gray-500" />
            <span>Share on LinkedIn</span>
          </button>
        </div>
      )}
    </div>
  );
}

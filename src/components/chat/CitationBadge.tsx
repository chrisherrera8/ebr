import { BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Citation } from '@/types';

interface CitationBadgeProps {
  citation: Citation;
  index: number;
}

export function CitationBadge({ citation, index }: CitationBadgeProps) {
  const maxDocNameLength = 24;
  const docName =
    citation.document.length > maxDocNameLength
      ? citation.document.slice(0, maxDocNameLength - 1) + '…'
      : citation.document;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-neutral-200',
        'bg-neutral-50 px-2 py-0.5 text-xs text-neutral-600',
        'hover:bg-neutral-100 transition-colors cursor-default',
      )}
      title={`${citation.document} · page ${citation.page}`}
      aria-label={`Citation ${index + 1}: ${citation.document}, page ${citation.page}`}
    >
      <BookOpen className="h-3 w-3 shrink-0 text-neutral-400" />
      <span className="truncate max-w-[120px]">{docName}</span>
      <span className="text-neutral-400">·</span>
      <span className="text-neutral-500 shrink-0">p.{citation.page}</span>
    </span>
  );
}

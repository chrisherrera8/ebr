import { useState } from 'react';
import { FileText, Trash2, BookOpen, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDate, truncateFilename } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { useDeleteDocument } from '@/hooks/useDocuments';
import { useToast } from '@/components/ui/Toast';
import type { Document } from '@/types';

interface DocumentCardProps {
  document: Document;
  isSelected: boolean;
  onSelectionChange: (selected: boolean) => void;
}

export function DocumentCard({
  document,
  isSelected,
  onSelectionChange,
}: DocumentCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { mutate: deleteDoc, isPending } = useDeleteDocument();
  const { toast } = useToast();

  const handleDelete = () => {
    deleteDoc(document.id, {
      onSuccess: () => {
        toast({
          variant: 'success',
          title: 'Document deleted',
          description: document.filename,
        });
        setConfirmOpen(false);
      },
      onError: (err) => {
        toast({
          variant: 'error',
          title: 'Delete failed',
          description: err instanceof Error ? err.message : 'Unknown error',
        });
        setConfirmOpen(false);
      },
    });
  };

  return (
    <>
      <Card
        className={cn(
          'transition-all',
          isSelected && 'ring-2 ring-neutral-900 ring-offset-1',
        )}
      >
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id={`doc-${document.id}`}
                checked={isSelected}
                onChange={(e) => onSelectionChange(e.target.checked)}
                className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-400 cursor-pointer"
                aria-label={`Select ${document.filename}`}
              />
            </div>

            <div className="flex-1 min-w-0">
              <label
                htmlFor={`doc-${document.id}`}
                className="flex items-start gap-2 cursor-pointer"
              >
                <FileText className="h-4 w-4 text-neutral-400 mt-0.5 shrink-0" />
                <span
                  className="text-sm font-medium text-neutral-900 break-all leading-snug"
                  title={document.filename}
                >
                  {truncateFilename(document.filename, 40)}
                </span>
              </label>

              <div className="mt-2 flex flex-wrap items-center gap-3 pl-6">
                <span className="flex items-center gap-1 text-xs text-neutral-500">
                  <BookOpen className="h-3 w-3" />
                  {document.page_count} page{document.page_count !== 1 ? 's' : ''}
                </span>
                <span className="flex items-center gap-1 text-xs text-neutral-500">
                  <Layers className="h-3 w-3" />
                  {document.chunk_count} chunk{document.chunk_count !== 1 ? 's' : ''}
                </span>
              </div>

              <p className="mt-1 pl-6 text-xs text-neutral-400">
                {formatDate(document.created_at)}
              </p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setConfirmOpen(true)}
              className="shrink-0 h-7 w-7 p-0 text-neutral-400 hover:text-red-600 hover:bg-red-50"
              aria-label={`Delete ${document.filename}`}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete document"
        description={`Are you sure you want to delete "${truncateFilename(document.filename, 50)}"? This action cannot be undone.`}
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfirmOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              isLoading={isPending}
            >
              Delete
            </Button>
          </>
        }
      />
    </>
  );
}

import { UploadCloud } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { DocumentCard } from './DocumentCard';
import { useDocuments } from '@/hooks/useDocuments';

interface DocumentListProps {
  selectedIds: number[];
  onSelectionChange: (ids: number[]) => void;
}

export function DocumentList({ selectedIds, onSelectionChange }: DocumentListProps) {
  const { data: documents, isLoading, isError, error } = useDocuments();

  const handleSelection = (docId: number, selected: boolean) => {
    if (selected) {
      onSelectionChange([...selectedIds, docId]);
    } else {
      onSelectionChange(selectedIds.filter((id) => id !== docId));
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 p-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-neutral-200 p-4">
            <div className="flex items-start gap-3">
              <Skeleton className="h-4 w-4 mt-0.5 rounded" />
              <div className="flex-1">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-2 p-6 text-center">
        <p className="text-sm text-red-600 font-medium">Failed to load documents</p>
        <p className="text-xs text-neutral-500">
          {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      </div>
    );
  }

  if (!documents || documents.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 p-8 text-center">
        <UploadCloud className="h-10 w-10 text-neutral-300" />
        <div>
          <p className="text-sm font-medium text-neutral-600">No documents yet</p>
          <p className="text-xs text-neutral-400 mt-0.5">
            Upload a PDF to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-3">
      {documents.map((doc) => (
        <DocumentCard
          key={doc.id}
          document={doc}
          isSelected={selectedIds.includes(doc.id)}
          onSelectionChange={(selected) => handleSelection(doc.id, selected)}
        />
      ))}
    </div>
  );
}

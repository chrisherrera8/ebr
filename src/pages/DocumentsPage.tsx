import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { DocumentUpload } from '@/components/documents/DocumentUpload';
import { useDocuments } from '@/hooks/useDocuments';
import { Skeleton } from '@/components/ui/Skeleton';
import { DocumentCard } from '@/components/documents/DocumentCard';

export default function DocumentsPage() {
  const { data: documents, isLoading, isError, error } = useDocuments();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleSelection = (docId: number, selected: boolean) => {
    if (selected) {
      setSelectedIds((prev) => [...prev, docId]);
    } else {
      setSelectedIds((prev) => prev.filter((id) => id !== docId));
    }
  };

  return (
    <div className="min-h-full bg-neutral-50">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-6 py-3">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to chat
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-neutral-500" />
            <h1 className="text-sm font-semibold text-neutral-900">
              Document Library
            </h1>
            {documents && (
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
                {documents.length}
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        {/* Upload section */}
        <section aria-labelledby="upload-heading" className="mb-8">
          <h2
            id="upload-heading"
            className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500"
          >
            Upload New Document
          </h2>
          <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
            <DocumentUpload />
          </div>
        </section>

        {/* Document grid */}
        <section aria-labelledby="docs-heading">
          <div className="mb-3 flex items-center justify-between">
            <h2
              id="docs-heading"
              className="text-xs font-semibold uppercase tracking-wide text-neutral-500"
            >
              All Documents
            </h2>
            {selectedIds.length > 0 && (
              <button
                onClick={() => setSelectedIds([])}
                className="text-xs text-neutral-500 hover:text-neutral-900 underline"
              >
                Clear selection ({selectedIds.length})
              </button>
            )}
          </div>

          {isLoading && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-lg border border-neutral-200 bg-white p-4">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          )}

          {isError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
              <p className="text-sm font-medium text-red-700">Failed to load documents</p>
              <p className="text-xs text-red-500 mt-1">
                {error instanceof Error ? error.message : 'Unknown error'}
              </p>
            </div>
          )}

          {!isLoading && !isError && documents && documents.length === 0 && (
            <div className="rounded-lg border border-neutral-200 bg-white p-12 text-center">
              <FileText className="mx-auto h-10 w-10 text-neutral-300 mb-3" />
              <p className="text-sm font-medium text-neutral-600">No documents yet</p>
              <p className="text-xs text-neutral-400 mt-1">
                Upload a PDF document above to get started.
              </p>
            </div>
          )}

          {!isLoading && !isError && documents && documents.length > 0 && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {documents.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  isSelected={selectedIds.includes(doc.id)}
                  onSelectionChange={(selected) => handleSelection(doc.id, selected)}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

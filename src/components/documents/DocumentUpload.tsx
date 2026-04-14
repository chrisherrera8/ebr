import { useState, useRef, useCallback } from 'react';
import { UploadCloud, FileText, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatFileSize } from '@/lib/utils';
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_MB } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { useUploadDocument } from '@/hooks/useDocuments';
import { useToast } from '@/components/ui/Toast';

interface DocumentUploadProps {
  onSuccess?: () => void;
}

export function DocumentUpload({ onSuccess }: DocumentUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate: upload, isPending } = useUploadDocument();
  const { toast } = useToast();

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      return 'Only PDF and text files are accepted.';
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return `File size must be less than ${MAX_FILE_SIZE_MB}MB.`;
    }
    return null;
  };

  const handleFile = useCallback((file: File) => {
    const error = validateFile(file);
    if (error) {
      setValidationError(error);
      setSelectedFile(null);
    } else {
      setValidationError(null);
      setSelectedFile(file);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    upload(selectedFile, {
      onSuccess: (data) => {
        toast({
          variant: 'success',
          title: 'Document uploaded',
          description: `${data.filename} — ${data.page_count} pages, ${data.chunk_count} chunks`,
        });
        setSelectedFile(null);
        onSuccess?.();
      },
      onError: (err) => {
        toast({
          variant: 'error',
          title: 'Upload failed',
          description: err instanceof Error ? err.message : 'Unknown error',
        });
      },
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isPending && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
        }}
        aria-label="Upload file"
        className={cn(
          'flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 cursor-pointer transition-colors',
          dragOver
            ? 'border-neutral-500 bg-neutral-100'
            : 'border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50',
          isPending && 'pointer-events-none opacity-60',
        )}
      >
        <UploadCloud className="h-8 w-8 text-neutral-400" />
        <div className="text-center">
          <p className="text-sm font-medium text-neutral-700">
            Drag & drop a file here
          </p>
          <p className="text-xs text-neutral-500 mt-0.5">
            or click to browse — max {MAX_FILE_SIZE_MB}MB
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,text/plain"
          className="sr-only"
          onChange={handleInputChange}
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>

      {validationError && (
        <div className="flex items-center gap-2 rounded-md bg-red-50 border border-red-200 px-3 py-2">
          <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
          <p className="text-xs text-red-700">{validationError}</p>
        </div>
      )}

      {selectedFile && !validationError && (
        <div className="flex items-center gap-3 rounded-md bg-neutral-50 border border-neutral-200 px-3 py-2.5">
          <FileText className="h-4 w-4 text-neutral-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-neutral-900 truncate">
              {selectedFile.name}
            </p>
            <p className="text-xs text-neutral-500">
              {formatFileSize(selectedFile.size)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedFile(null)}
            className="shrink-0 h-6 w-6 p-0 text-neutral-400 hover:text-neutral-700"
            aria-label="Remove file"
          >
            ×
          </Button>
        </div>
      )}

      <Button
        onClick={handleUpload}
        disabled={!selectedFile || !!validationError}
        isLoading={isPending}
        className="w-full"
      >
        {isPending ? 'Uploading…' : 'Upload Document'}
      </Button>
    </div>
  );
}

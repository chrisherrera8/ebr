import { useState } from 'react';
import { Upload, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Dialog } from '@/components/ui/Dialog';
import { DocumentList } from '@/components/documents/DocumentList';
import { DocumentUpload } from '@/components/documents/DocumentUpload';
import { useDocuments } from '@/hooks/useDocuments';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/components/ui/Toast';

interface SidebarProps {
  selectedDocumentIds: number[];
  onSelectionChange: (ids: number[]) => void;
}

export function Sidebar({ selectedDocumentIds, onSelectionChange }: SidebarProps) {
  const [uploadOpen, setUploadOpen] = useState(false);
  const { data: documents } = useDocuments();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const count = documents?.length ?? 0;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Documents
          </span>
          {count > 0 && (
            <Badge variant="secondary" className="text-xs">
              {count}
            </Badge>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setUploadOpen(true)}
          className="h-7 gap-1 text-xs"
        >
          <Upload className="h-3 w-3" />
          Upload
        </Button>
      </div>

      {selectedDocumentIds.length > 0 && (
        <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50 px-4 py-2">
          <span className="text-xs text-neutral-600">
            {selectedDocumentIds.length} selected for chat
          </span>
          <button
            onClick={() => onSelectionChange([])}
            className="text-xs text-neutral-500 hover:text-neutral-900 underline"
          >
            Clear
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <DocumentList
          selectedIds={selectedDocumentIds}
          onSelectionChange={onSelectionChange}
        />
      </div>

      <div className="border-t border-neutral-100 px-4 py-3">
        <button
          onClick={() =>
            signOut()
              .then(() => navigate('/sign-in'))
              .catch((err) => {
                console.error('Sign out failed:', err);
                toast({
                  variant: 'error',
                  title: 'We could not log you out, try later',
                });
              })
          }
          className="flex items-center gap-2 text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign out
        </button>
      </div>

      <Dialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        title="Upload Document"
        description="Upload a PDF document to use in your RAG queries."
      >
        <DocumentUpload onSuccess={() => setUploadOpen(false)} />
      </Dialog>
    </div>
  );
}

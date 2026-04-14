import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchDocuments, uploadDocument, deleteDocument } from '@/api/documents';
import { QUERY_KEYS } from '@/lib/constants';

export function useDocuments() {
  return useQuery({
    queryKey: QUERY_KEYS.documents,
    queryFn: fetchDocuments,
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadDocument(file),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.documents });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteDocument(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.documents });
    },
  });
}

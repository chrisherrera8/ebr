import { apiFetch } from './client';
import type { Document, DeleteResponse, UploadResponse } from '@/types';

export async function fetchDocuments(): Promise<Document[]> {
  return apiFetch<Document[]>('/documents');
}

export async function uploadDocument(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  return apiFetch<UploadResponse>('/documents/upload', {
    method: 'POST',
    body: formData,
  });
}

export async function deleteDocument(id: number): Promise<DeleteResponse> {
  return apiFetch<DeleteResponse>(`/documents/${id}`, {
    method: 'DELETE',
  });
}

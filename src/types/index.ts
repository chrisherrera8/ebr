export interface Document {
  id: number;
  filename: string;
  num_pages: number;
  num_chunks: number;
  created_at: string;
}

export interface Citation {
  document: string;
  page: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  timestamp: Date;
}

export interface ChatRequest {
  question: string;
  document_ids?: number[];
}

export interface UploadResponse {
  id: number;
  filename: string;
  num_pages: number;
  num_chunks: number;
  created_at: string;
}

export interface DocumentsResponse {
  documents: Document[];
}

export interface DeleteResponse {
  success: boolean;
  message: string;
}

export interface HealthResponse {
  status: 'healthy';
  db_connected: boolean;
}

export interface SSEChunk {
  content: string;
  citations?: Citation[];
}

export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
  duration?: number;
}

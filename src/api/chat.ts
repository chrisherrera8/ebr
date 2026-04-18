import { API_URL } from './client';
import type { ChatRequest, Citation, SSEChunk } from '@/types';

export async function streamChat(
  request: ChatRequest,
  onChunk: (content: string, citations?: Citation[]) => void,
  signal?: AbortSignal,
): Promise<void> {
  const response = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
    ...(signal !== undefined ? { signal } : {}),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({})) as Record<string, unknown>;
    const detail = typeof error['detail'] === 'string' ? error['detail'] : 'Chat request failed';
    throw new Error(detail);
  }

  if (!response.body) {
    throw new Error('Response body is empty');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith(':')) continue;

        if (trimmed.startsWith('data: ')) {
          const jsonStr = trimmed.slice(6);
          if (jsonStr === '[DONE]') return;

          try {
            const parsed = JSON.parse(jsonStr) as SSEChunk & { error?: string };
            if (parsed.error) {
              throw new Error(parsed.error);
            }
            onChunk(parsed.content, parsed.citations);
          } catch (err) { // handles errors during streaming.
            if (err instanceof SyntaxError) continue; // Skip malformed JSON chunks
            throw err;
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

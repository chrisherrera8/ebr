import { useState, useRef, useCallback } from 'react';
import { streamChat } from '@/api/chat';
import type { ChatRequest, Citation } from '@/types';

interface StreamResponseState {
  streamedContent: string;
  citations: Citation[];
  isStreaming: boolean;
  error: string | null;
}

interface UseStreamResponseReturn extends StreamResponseState {
  sendMessage: (request: ChatRequest) => Promise<void>;
  abort: () => void;
  reset: () => void;
}

export function useStreamResponse(): UseStreamResponseReturn {
  const [state, setState] = useState<StreamResponseState>({
    streamedContent: '',
    citations: [],
    isStreaming: false,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setState((prev) => ({ ...prev, isStreaming: false }));
  }, []);

  const reset = useCallback(() => {
    setState({
      streamedContent: '',
      citations: [],
      isStreaming: false,
      error: null,
    });
  }, []);

  const sendMessage = useCallback(async (request: ChatRequest): Promise<void> => {
    abort();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setState({
      streamedContent: '',
      citations: [],
      isStreaming: true,
      error: null,
    });

    try {
      await streamChat(
        request,
        (content, newCitations) => {
          setState((prev) => ({
            ...prev,
            streamedContent: prev.streamedContent + content,
            citations: newCitations
              ? [...prev.citations, ...newCitations]
              : prev.citations,
          }));
        },
        controller.signal,
      );
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : 'An error occurred',
      }));
    } finally {
      setState((prev) => ({ ...prev, isStreaming: false }));
      abortControllerRef.current = null;
    }
  }, [abort]);

  return {
    ...state,
    sendMessage,
    abort,
    reset,
  };
}

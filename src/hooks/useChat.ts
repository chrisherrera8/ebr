import { useState, useCallback, useEffect } from 'react';
import { useStreamResponse } from './useStreamResponse';
import { useToast } from '@/components/ui/Toast';
import { generateId } from '@/lib/utils';
import type { ChatMessage } from '@/types';

interface UseChatReturn {
  messages: ChatMessage[];
  isStreaming: boolean;
  streamedContent: string;
  sendMessage: (question: string, documentIds?: number[]) => Promise<void>;
  abort: () => void;
  clearMessages: () => void;
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { streamedContent, citations, isStreaming, error, sendMessage: streamSend, abort, reset } =
    useStreamResponse();
  const { toast } = useToast();
  const [prevIsStreaming, setPrevIsStreaming] = useState(false);

  useEffect(() => {
    if (error) {
      toast({ variant: 'error', title: 'Something went wrong', description: error, duration: 10000 });
    }
  }, [error, toast]);

  // Detect transition from streaming to done and commit the assistant message
  if (prevIsStreaming && !isStreaming && streamedContent) {
    const assistantMessage: ChatMessage =
      citations.length > 0
        ? {
            id: generateId(),
            role: 'assistant',
            content: streamedContent,
            citations,
            timestamp: new Date(),
          }
        : {
            id: generateId(),
            role: 'assistant',
            content: streamedContent,
            timestamp: new Date(),
          };
    setMessages((prev) => [...prev, assistantMessage]);
    setPrevIsStreaming(false);
  } else if (!prevIsStreaming && isStreaming) {
    setPrevIsStreaming(true);
  }

  const sendMessage = useCallback(
    async (question: string, documentIds?: number[]): Promise<void> => {
      const userMessage: ChatMessage = {
        id: generateId(),
        role: 'user',
        content: question,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      reset();

      await streamSend({
        question,
        ...(documentIds && documentIds.length > 0
          ? { document_ids: documentIds }
          : {}),
      });
    },
    [streamSend, reset],
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    reset();
  }, [reset]);

  return {
    messages,
    isStreaming,
    streamedContent,
    sendMessage,
    abort,
    clearMessages,
  };
}

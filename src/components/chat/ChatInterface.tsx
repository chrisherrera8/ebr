import { useEffect, useRef } from 'react';
import { MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SUGGESTED_QUESTIONS } from '@/lib/constants';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { useChat } from '@/hooks/useChat';

interface ChatInterfaceProps {
  selectedDocumentIds: number[];
}

export function ChatInterface({ selectedDocumentIds }: ChatInterfaceProps) {
  const { messages, isStreaming, streamedContent, sendMessage, abort } =
    useChat();
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamedContent]);

  const handleSend = (question: string) => {
    void sendMessage(question, selectedDocumentIds);
  };

  const handleSuggestedQuestion = (question: string) => {
    void sendMessage(question, selectedDocumentIds);
  };

  const isEmpty = messages.length === 0 && !isStreaming;

  return (
    <div className="flex h-full flex-col">
      {/* Messages area */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto scrollbar-thin px-4 py-6"
      >
        {isEmpty ? (
          <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100">
                <MessageSquare className="h-6 w-6 text-neutral-400" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-neutral-900">
                  Ask anything
                </h2>
                <p className="mt-1 text-sm text-neutral-500">
                  {selectedDocumentIds.length > 0
                    ? `Querying ${selectedDocumentIds.length} selected document${selectedDocumentIds.length > 1 ? 's' : ''}`
                    : 'Select documents in the sidebar to search within them, or ask general questions.'}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full max-w-sm">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSuggestedQuestion(q)}
                  className="rounded-lg border border-neutral-200 bg-white px-4 py-3 text-left text-sm text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 transition-colors shadow-sm"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto flex max-w-2xl flex-col gap-6">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {/* Streaming message */}
            {isStreaming && streamedContent && (
              <div className="flex flex-col gap-1.5 items-start">
                <div
                  className={cn(
                    'max-w-[80%] rounded-2xl rounded-bl-sm px-4 py-3',
                    'bg-white border border-neutral-200 shadow-sm',
                    'text-sm leading-relaxed text-neutral-900',
                  )}
                >
                  <p className="whitespace-pre-wrap break-words streaming-cursor">
                    {streamedContent}
                  </p>
                </div>
              </div>
            )}

            {/* Thinking indicator when streaming but no content yet */}
            {isStreaming && !streamedContent && (
              <div className="flex items-start">
                <div className="rounded-2xl rounded-bl-sm border border-neutral-200 bg-white px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-neutral-400 animate-blink"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <ChatInput
        onSend={handleSend}
        onAbort={abort}
        isStreaming={isStreaming}
      />
    </div>
  );
}

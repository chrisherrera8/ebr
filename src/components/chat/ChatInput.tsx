import { useRef, useCallback } from 'react';
import { Send, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface ChatInputProps {
  onSend: (message: string) => void;
  onAbort: () => void;
  isStreaming: boolean;
  disabled?: boolean;
}

export function ChatInput({ onSend, onAbort, isStreaming, disabled }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    const value = textareaRef.current?.value.trim();
    if (!value) return;
    onSend(value);
    if (textareaRef.current) {
      textareaRef.current.value = '';
      textareaRef.current.style.height = 'auto';
    }
  }, [onSend]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isStreaming && !disabled) handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  return (
    <div className="border-t border-neutral-200 bg-white px-4 py-3">
      <div className="flex items-end gap-2 rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2 focus-within:border-neutral-400 focus-within:ring-2 focus-within:ring-neutral-200 transition-all">
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder={
            isStreaming ? 'Waiting for response…' : 'Ask a question… (Enter to send, Shift+Enter for newline)'
          }
          onKeyDown={handleKeyDown}
          onChange={handleInput}
          disabled={isStreaming || disabled}
          aria-label="Chat message input"
          className={cn(
            'flex-1 resize-none bg-transparent text-sm text-neutral-900',
            'placeholder:text-neutral-400 focus:outline-none',
            'min-h-[24px] max-h-[160px] leading-6',
            'disabled:cursor-not-allowed disabled:opacity-60',
          )}
        />

        {isStreaming ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={onAbort}
            className="h-8 w-8 p-0 shrink-0 text-neutral-500 hover:text-red-600 hover:bg-red-50"
            aria-label="Stop generating"
          >
            <Square className="h-4 w-4 fill-current" />
          </Button>
        ) : (
          <Button
            variant="default"
            size="sm"
            onClick={handleSend}
            disabled={disabled}
            className="h-8 w-8 p-0 shrink-0"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </Button>
        )}
      </div>
      <p className="mt-1.5 text-center text-xs text-neutral-400">
        AI can make mistakes. Verify important information.
      </p>
    </div>
  );
}

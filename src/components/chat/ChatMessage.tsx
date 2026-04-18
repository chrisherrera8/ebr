import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import { CitationBadge } from './CitationBadge';
import type { ChatMessage as ChatMessageType } from '@/types';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex flex-col gap-1.5',
        isUser ? 'items-end' : 'items-start',
      )}
    >
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
          isUser
            ? 'bg-neutral-900 text-white rounded-br-sm'
            : 'bg-white border border-neutral-200 text-neutral-900 rounded-bl-sm shadow-sm',
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        ) : (
          <div className="prose prose-sm prose-neutral max-w-none break-words">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                table: ({ children }) => (
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse text-left">
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="border border-neutral-200 bg-neutral-50 px-3 py-2 font-semibold whitespace-nowrap">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border border-neutral-200 px-3 py-2 align-top">
                    {children}
                  </td>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {message.citations && message.citations.length > 0 && (
        <div
          className={cn(
            'flex flex-wrap gap-1.5 max-w-[80%]',
            isUser ? 'justify-end' : 'justify-start',
          )}
          aria-label="Sources"
        >
          {message.citations.map((citation, i) => (
            <CitationBadge
              key={`${citation.document}-${citation.page}-${i}`}
              citation={citation}
              index={i}
            />
          ))}
        </div>
      )}

      <time
        className="text-xs text-neutral-400 px-1"
        dateTime={message.timestamp.toISOString()}
      >
        {message.timestamp.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </time>
    </div>
  );
}

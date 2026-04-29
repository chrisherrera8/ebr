import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { SUGGESTED_QUESTIONS } from '@/lib/constants';

// Mock useChat so tests don't need a real streaming backend
const mockSendMessage = vi.fn();
const mockAbort = vi.fn();

vi.mock('@/hooks/useChat', () => ({
  useChat: () => ({
    messages: [],
    isStreaming: false,
    streamedContent: '',
    sendMessage: mockSendMessage,
    abort: mockAbort,
  }),
}));

describe('ChatInterface', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows the empty state with suggested questions when there are no messages', () => {
    render(<ChatInterface selectedDocumentIds={[]} />);

    expect(screen.getByText('Ask anything')).toBeInTheDocument();
    for (const q of SUGGESTED_QUESTIONS) {
      expect(screen.getByText(q)).toBeInTheDocument();
    }
  });

  it('shows the document count hint when documents are selected', () => {
    render(<ChatInterface selectedDocumentIds={[1, 2]} />);

    expect(screen.getByText(/querying 2 selected documents/i)).toBeInTheDocument();
  });

  it('shows singular form for one selected document', () => {
    render(<ChatInterface selectedDocumentIds={[3]} />);

    expect(screen.getByText(/querying 1 selected document\b/i)).toBeInTheDocument();
  });

  it('calls sendMessage when a suggested question is clicked', async () => {
    const user = userEvent.setup();
    render(<ChatInterface selectedDocumentIds={[]} />);

    await user.click(screen.getByText(SUGGESTED_QUESTIONS[0]));

    expect(mockSendMessage).toHaveBeenCalledWith(SUGGESTED_QUESTIONS[0], []);
  });

  it('passes selected document ids to sendMessage when a suggested question is clicked', async () => {
    const user = userEvent.setup();
    render(<ChatInterface selectedDocumentIds={[1, 2, 3]} />);

    await user.click(screen.getByText(SUGGESTED_QUESTIONS[1]));

    expect(mockSendMessage).toHaveBeenCalledWith(SUGGESTED_QUESTIONS[1], [1, 2, 3]);
  });

  it('calls sendMessage with document ids when a message is sent via ChatInput', async () => {
    const user = userEvent.setup();
    render(<ChatInterface selectedDocumentIds={[5]} />);

    const textarea = screen.getByRole('textbox', { name: /chat message input/i });
    await user.type(textarea, 'What is in this document?');
    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(mockSendMessage).toHaveBeenCalledWith('What is in this document?', [5]);
  });
});

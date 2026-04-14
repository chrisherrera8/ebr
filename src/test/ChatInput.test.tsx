import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatInput } from '@/components/chat/ChatInput';

describe('ChatInput', () => {
  const onSend = vi.fn();
  const onAbort = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the textarea and send button when not streaming', () => {
    render(<ChatInput onSend={onSend} onAbort={onAbort} isStreaming={false} />);
    expect(screen.getByRole('textbox', { name: /chat message input/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('renders the stop button when streaming', () => {
    render(<ChatInput onSend={onSend} onAbort={onAbort} isStreaming={true} />);
    expect(screen.getByRole('button', { name: /stop generating/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /send message/i })).not.toBeInTheDocument();
  });

  it('calls onSend with the message when send button is clicked', async () => {
    const user = userEvent.setup();
    render(<ChatInput onSend={onSend} onAbort={onAbort} isStreaming={false} />);

    const textarea = screen.getByRole('textbox', { name: /chat message input/i });
    await user.type(textarea, 'What is RAG?');
    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(onSend).toHaveBeenCalledWith('What is RAG?');
  });

  it('calls onSend when Enter is pressed (without Shift)', async () => {
    const user = userEvent.setup();
    render(<ChatInput onSend={onSend} onAbort={onAbort} isStreaming={false} />);

    const textarea = screen.getByRole('textbox', { name: /chat message input/i });
    await user.type(textarea, 'Hello{Enter}');

    expect(onSend).toHaveBeenCalledWith('Hello');
  });

  it('does not send when Shift+Enter is pressed', async () => {
    const user = userEvent.setup();
    render(<ChatInput onSend={onSend} onAbort={onAbort} isStreaming={false} />);

    const textarea = screen.getByRole('textbox', { name: /chat message input/i });
    await user.type(textarea, 'Hello{Shift>}{Enter}{/Shift}');

    expect(onSend).not.toHaveBeenCalled();
  });

  it('does not send when the textarea is empty', async () => {
    const user = userEvent.setup();
    render(<ChatInput onSend={onSend} onAbort={onAbort} isStreaming={false} />);

    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(onSend).not.toHaveBeenCalled();
  });

  it('disables the textarea while streaming', () => {
    render(<ChatInput onSend={onSend} onAbort={onAbort} isStreaming={true} />);
    expect(screen.getByRole('textbox', { name: /chat message input/i })).toBeDisabled();
  });

  it('calls onAbort when the stop button is clicked', async () => {
    const user = userEvent.setup();
    render(<ChatInput onSend={onSend} onAbort={onAbort} isStreaming={true} />);

    await user.click(screen.getByRole('button', { name: /stop generating/i }));

    expect(onAbort).toHaveBeenCalledOnce();
  });

  it('clears the textarea after sending', async () => {
    const user = userEvent.setup();
    render(<ChatInput onSend={onSend} onAbort={onAbort} isStreaming={false} />);

    const textarea = screen.getByRole('textbox', { name: /chat message input/i });
    await user.type(textarea, 'Some question');
    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(textarea).toHaveValue('');
  });
});

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChatMessage } from '@/components/chat/ChatMessage';
import type { ChatMessage as ChatMessageType } from '@/types';

function makeMessage(overrides: Partial<ChatMessageType>): ChatMessageType {
  return {
    id: '1',
    role: 'assistant',
    content: '',
    timestamp: new Date('2024-01-01T12:00:00Z'),
    ...overrides,
  };
}

describe('ChatMessage — markdown rendering', () => {
  it('renders bold text in assistant messages', () => {
    render(<ChatMessage message={makeMessage({ content: '**bold word**' })} />);
    const strong = document.querySelector('strong');
    expect(strong).toBeInTheDocument();
    expect(strong).toHaveTextContent('bold word');
  });

  it('renders headings in assistant messages', () => {
    render(<ChatMessage message={makeMessage({ content: '## Section Title' })} />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Section Title');
  });

  it('renders inline code in assistant messages', () => {
    render(<ChatMessage message={makeMessage({ content: 'Use `useState` here' })} />);
    const code = document.querySelector('code');
    expect(code).toBeInTheDocument();
    expect(code).toHaveTextContent('useState');
  });

  it('renders fenced code blocks in assistant messages', () => {
    render(
      <ChatMessage
        message={makeMessage({ content: '```js\nconsole.log("hi")\n```' })}
      />,
    );
    const pre = document.querySelector('pre');
    expect(pre).toBeInTheDocument();
    expect(pre).toHaveTextContent('console.log("hi")');
  });

  it('renders unordered lists in assistant messages', () => {
    render(<ChatMessage message={makeMessage({ content: '- item one\n- item two' })} />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('item one');
  });

  it('renders links in assistant messages', () => {
    render(
      <ChatMessage
        message={makeMessage({ content: '[Visit docs](https://example.com)' })}
      />,
    );
    const link = screen.getByRole('link', { name: /visit docs/i });
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('does NOT render markdown in user messages — shows raw text', () => {
    render(
      <ChatMessage
        message={makeMessage({ role: 'user', content: '**not bold**' })}
      />,
    );
    expect(document.querySelector('strong')).not.toBeInTheDocument();
    expect(screen.getByText('**not bold**')).toBeInTheDocument();
  });

  it('renders plain assistant text unchanged', () => {
    render(<ChatMessage message={makeMessage({ content: 'Hello world' })} />);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });
});
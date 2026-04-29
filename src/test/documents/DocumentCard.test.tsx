import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DocumentCard } from '@/components/documents/DocumentCard';
import { ToastProvider } from '@/components/ui/Toast';
import type { Document } from '@/types';

const mockDeleteDoc = vi.fn();

vi.mock('@/hooks/useDocuments', () => ({
  useDeleteDocument: () => ({
    mutate: mockDeleteDoc,
    isPending: false,
  }),
}));

const sampleDoc: Document = {
  id: 1,
  filename: 'report.pdf',
  num_pages: 10,
  num_chunks: 42,
  created_at: '2024-01-15T12:00:00Z',
};

function renderCard(props: Partial<Parameters<typeof DocumentCard>[0]> = {}) {
  const onSelectionChange = vi.fn();
  return {
    onSelectionChange,
    ...render(
      <ToastProvider>
        <DocumentCard
          document={sampleDoc}
          isSelected={false}
          onSelectionChange={onSelectionChange}
          {...props}
        />
      </ToastProvider>,
    ),
  };
}

describe('DocumentCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the document filename, page count, and chunk count', () => {
    renderCard();

    expect(screen.getByText('report.pdf')).toBeInTheDocument();
    expect(screen.getByText(/10 pages/i)).toBeInTheDocument();
    expect(screen.getByText(/42 chunks/i)).toBeInTheDocument();
  });

  it('renders the checkbox as unchecked when isSelected is false', () => {
    renderCard({ isSelected: false });

    expect(screen.getByRole('checkbox', { name: /select report\.pdf/i })).not.toBeChecked();
  });

  it('renders the checkbox as checked when isSelected is true', () => {
    renderCard({ isSelected: true });

    expect(screen.getByRole('checkbox', { name: /select report\.pdf/i })).toBeChecked();
  });

  it('calls onSelectionChange(true) when the checkbox is checked', async () => {
    const user = userEvent.setup();
    const { onSelectionChange } = renderCard({ isSelected: false });

    await user.click(screen.getByRole('checkbox', { name: /select report\.pdf/i }));

    expect(onSelectionChange).toHaveBeenCalledWith(true);
  });

  it('calls onSelectionChange(false) when the checkbox is unchecked', async () => {
    const user = userEvent.setup();
    const { onSelectionChange } = renderCard({ isSelected: true });

    await user.click(screen.getByRole('checkbox', { name: /select report\.pdf/i }));

    expect(onSelectionChange).toHaveBeenCalledWith(false);
  });

  it('opens the confirmation dialog when the delete button is clicked', async () => {
    const user = userEvent.setup();
    renderCard();

    await user.click(screen.getByRole('button', { name: /delete report\.pdf/i }));

    expect(screen.getByText('Delete document')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^delete$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('closes the dialog when Cancel is clicked', async () => {
    const user = userEvent.setup();
    renderCard();

    await user.click(screen.getByRole('button', { name: /delete report\.pdf/i }));
    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(screen.queryByText('Delete document')).not.toBeInTheDocument();
  });

  it('calls deleteDoc with the document id when Delete is confirmed', async () => {
    const user = userEvent.setup();
    renderCard();

    await user.click(screen.getByRole('button', { name: /delete report\.pdf/i }));
    await user.click(screen.getByRole('button', { name: /^delete$/i }));

    expect(mockDeleteDoc).toHaveBeenCalledWith(1, expect.any(Object));
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DocumentUpload } from '@/components/documents/DocumentUpload';
import { ToastProvider } from '@/components/ui/Toast';
import { MAX_FILE_SIZE_MB, MAX_FILE_SIZE_BYTES } from '@/lib/constants';

const mockUpload = vi.fn();

vi.mock('@/hooks/useDocuments', () => ({
  useUploadDocument: () => ({
    mutate: mockUpload,
    isPending: false,
  }),
}));

function renderUpload(onSuccess?: () => void) {
  return render(
    <ToastProvider>
      {onSuccess ? <DocumentUpload onSuccess={onSuccess} /> : <DocumentUpload />}
    </ToastProvider>,
  );
}

function makePdfFile(name = 'test.pdf', size = 1024) {
  return new File(['x'.repeat(size)], name, { type: 'application/pdf' });
}

function makeTextFile(name = 'test.txt', size = 1024) {
  return new File(['x'.repeat(size)], name, { type: 'text/plain' });
}

describe('DocumentUpload', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the upload area and upload button', () => {
    renderUpload();

    expect(screen.getByRole('button', { name: /upload file/i })).toBeInTheDocument();
    expect(screen.getByText(/drag & drop a file here/i)).toBeInTheDocument();
    expect(screen.getByText(`max ${MAX_FILE_SIZE_MB}MB`, { exact: false })).toBeInTheDocument();
  });

  it('the Upload Document button is disabled when no file is selected', () => {
    renderUpload();

    expect(screen.getByRole('button', { name: /upload document/i })).toBeDisabled();
  });

  it('shows the selected file name and size after a valid PDF is chosen', async () => {
    const user = userEvent.setup();
    renderUpload();

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(input, makePdfFile('my-report.pdf', 2048));

    expect(screen.getByText('my-report.pdf')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /upload document/i })).not.toBeDisabled();
  });

  it('shows the selected file name and size after a valid text file is chosen', async () => {
    const user = userEvent.setup();
    renderUpload();

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(input, makeTextFile('notes.txt', 2048));

    expect(screen.getByText('notes.txt')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /upload document/i })).not.toBeDisabled();
  });

  it('shows a validation error when an unsupported file type is selected', () => {
    renderUpload();

    const unsupported = new File(['data'], 'image.png', { type: 'image/png' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    // Use fireEvent to bypass the accept attribute filter jsdom applies to userEvent.upload
    fireEvent.change(input, { target: { files: [unsupported] } });

    expect(screen.getByText(/only pdf and text files are accepted/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /upload document/i })).toBeDisabled();
  });

  it('shows a validation error when the file exceeds the size limit', async () => {
    const user = userEvent.setup();
    renderUpload();

    const oversized = makePdfFile('huge.pdf', MAX_FILE_SIZE_BYTES + 1);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(input, oversized);

    expect(screen.getByText(new RegExp(`less than ${MAX_FILE_SIZE_MB}MB`, 'i'))).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /upload document/i })).toBeDisabled();
  });

  it('removes the selected file when the remove button is clicked', async () => {
    const user = userEvent.setup();
    renderUpload();

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(input, makePdfFile('to-remove.pdf'));

    expect(screen.getByText('to-remove.pdf')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /remove file/i }));

    expect(screen.queryByText('to-remove.pdf')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /upload document/i })).toBeDisabled();
  });

  it('calls upload mutate with the selected file when Upload Document is clicked', async () => {
    const user = userEvent.setup();
    renderUpload();

    const file = makePdfFile('my-doc.pdf');
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(input, file);

    await user.click(screen.getByRole('button', { name: /upload document/i }));

    expect(mockUpload).toHaveBeenCalledWith(file, expect.any(Object));
  });
});

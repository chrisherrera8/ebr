import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { ToastProvider } from '@/components/ui/Toast';

const mockSignOut = vi.fn();

vi.mock('@/hooks/useDocuments', () => ({
  useDocuments: () => ({ data: [] }),
}));

// useAuth must be mocked because Clerk requires its provider in context.
// We give it a controllable signOut so we can test both success and failure.
vi.mock('@/lib/auth', () => ({
  useAuth: () => ({ signOut: mockSignOut }),
}));

vi.mock('@/components/documents/DocumentList', () => ({
  DocumentList: () => <div data-testid="document-list" />,
}));

// Render inside a real router with a /sign-in destination so we can assert
// the actual navigation happened rather than just checking a mock was called.
function renderSidebar() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <ToastProvider>
        <Routes>
          <Route
            path="/"
            element={<Sidebar selectedDocumentIds={[]} onSelectionChange={vi.fn()} />}
          />
          <Route path="/sign-in" element={<div>Sign in destination</div>} />
        </Routes>
      </ToastProvider>
    </MemoryRouter>,
  );
}

describe('Sidebar — sign out', () => {
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    consoleError.mockClear();
  });

  it('renders a <button> element (not a div or anchor) for sign out', () => {
    renderSidebar();
    const btn = screen.getByRole('button', { name: /sign out/i });
    expect(btn.tagName).toBe('BUTTON');
  });

  it('navigates to the sign-in page after a successful sign out', async () => {
    mockSignOut.mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderSidebar();

    await user.click(screen.getByRole('button', { name: /sign out/i }));

    expect(await screen.findByText('Sign in destination')).toBeInTheDocument();
  });

  it('shows an error toast and does not navigate when signOut rejects', async () => {
    mockSignOut.mockRejectedValue(new Error('network error'));
    const user = userEvent.setup();
    renderSidebar();

    await user.click(screen.getByRole('button', { name: /sign out/i }));

    expect(await screen.findByText(/we could not log you out/i)).toBeInTheDocument();
    expect(screen.queryByText('Sign in destination')).not.toBeInTheDocument();
  });

  it('logs the error to the console when signOut rejects', async () => {
    const err = new Error('network error');
    mockSignOut.mockRejectedValue(err);
    const user = userEvent.setup();
    renderSidebar();

    await user.click(screen.getByRole('button', { name: /sign out/i }));

    await vi.waitFor(() =>
      expect(consoleError).toHaveBeenCalledWith('Sign out failed:', err),
    );
  });
});

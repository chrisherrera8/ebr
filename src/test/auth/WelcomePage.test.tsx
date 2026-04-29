import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import WelcomePage from '@/pages/WelcomePage';

// Render inside a real router with stub destination routes so clicking a
// button actually changes the URL and renders the right destination — no
// mocking of useNavigate needed.
function renderWithRoutes() {
  return render(
    <MemoryRouter initialEntries={['/welcome']}>
      <Routes>
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/sign-up" element={<div>Sign up destination</div>} />
        <Route path="/sign-in" element={<div>Sign in destination</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('WelcomePage', () => {
  it('renders the app name and tagline', () => {
    renderWithRoutes();
    expect(screen.getByRole('heading', { name: /pdf chat/i })).toBeInTheDocument();
    expect(screen.getByText(/upload your documents/i)).toBeInTheDocument();
  });

  it('renders Get started and Sign in as interactive buttons', () => {
    renderWithRoutes();
    const getStarted = screen.getByRole('button', { name: /get started/i });
    const signIn = screen.getByRole('button', { name: /sign in/i });
    expect(getStarted.tagName).toBe('BUTTON');
    expect(signIn.tagName).toBe('BUTTON');
  });

  it('navigates to the sign-up page when Get started is clicked', async () => {
    const user = userEvent.setup();
    renderWithRoutes();

    await user.click(screen.getByRole('button', { name: /get started/i }));

    expect(screen.getByText('Sign up destination')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /pdf chat/i })).not.toBeInTheDocument();
  });

  it('navigates to the sign-in page when Sign in is clicked', async () => {
    const user = userEvent.setup();
    renderWithRoutes();

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByText('Sign in destination')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /pdf chat/i })).not.toBeInTheDocument();
  });
});

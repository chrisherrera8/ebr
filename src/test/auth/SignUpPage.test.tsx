import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SignUpPage from '@/pages/SignUpPage';

// Same constraint as SignInPage — Clerk needs live context. Mock captures
// props only. Actual sign-up flow belongs in E2E tests.
vi.mock('@clerk/clerk-react', () => ({
  SignUp: ({ path, signInUrl, routing }: { path: string; signInUrl: string; routing: string }) => (
    <div data-testid="clerk-sign-up" data-path={path} data-sign-in-url={signInUrl} data-routing={routing} />
  ),
}));

function renderPage() {
  return render(
    <MemoryRouter>
      <SignUpPage />
    </MemoryRouter>,
  );
}

describe('SignUpPage', () => {
  it('mounts the Clerk SignUp component with path="/sign-up"', () => {
    renderPage();
    expect(screen.getByTestId('clerk-sign-up')).toHaveAttribute('data-path', '/sign-up');
  });

  it('passes signInUrl="/sign-in" so Clerk can link back to the sign-in page', () => {
    renderPage();
    expect(screen.getByTestId('clerk-sign-up')).toHaveAttribute('data-sign-in-url', '/sign-in');
  });

  it('uses path-based routing so Clerk sub-routes resolve correctly', () => {
    renderPage();
    expect(screen.getByTestId('clerk-sign-up')).toHaveAttribute('data-routing', 'path');
  });
});

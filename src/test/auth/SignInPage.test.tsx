import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SignInPage from '@/pages/SignInPage';

// Clerk's <SignIn> requires a live Clerk context and network — it cannot run
// in jsdom. The mock replaces the Clerk component but captures the props our
// page passes so we can assert the wiring is correct. The actual sign-in form
// rendering and authentication flow should be covered by E2E tests.
vi.mock('@clerk/clerk-react', () => ({
  SignIn: ({ path, signUpUrl, routing }: { path: string; signUpUrl: string; routing: string }) => (
    <div data-testid="clerk-sign-in" data-path={path} data-sign-up-url={signUpUrl} data-routing={routing} />
  ),
}));

function renderPage() {
  return render(
    <MemoryRouter>
      <SignInPage />
    </MemoryRouter>,
  );
}

describe('SignInPage', () => {
  it('mounts the Clerk SignIn component with path="/sign-in"', () => {
    renderPage();
    expect(screen.getByTestId('clerk-sign-in')).toHaveAttribute('data-path', '/sign-in');
  });

  it('passes signUpUrl="/sign-up" so Clerk can link to the sign-up page', () => {
    renderPage();
    expect(screen.getByTestId('clerk-sign-in')).toHaveAttribute('data-sign-up-url', '/sign-up');
  });

  it('uses path-based routing so Clerk sub-routes resolve correctly', () => {
    renderPage();
    expect(screen.getByTestId('clerk-sign-in')).toHaveAttribute('data-routing', 'path');
  });
});

// Clerk implementation of the auth interface.
// If you switch providers, replace this file and update the re-exports in auth.ts.
// Nothing outside this file should import from @clerk/clerk-react directly.

import {
  ClerkProvider,
  useAuth as useClerkAuth,
  useUser as useClerkUser,
} from '@clerk/clerk-react';
import type { AppUser } from '@/types';
import type { Auth } from './auth';

export { ClerkProvider as AuthProvider };

export function useAuth(): Omit<Auth, 'user'> {
  const { isLoaded, isSignedIn, getToken, signOut } = useClerkAuth();
  return {
    isLoaded,
    isSignedIn: isSignedIn ?? false,
    getToken: () => getToken(),
    signOut,
  };
}

export function useUser(): { user: AppUser | null; isLoaded: boolean } {
  const { isLoaded, user } = useClerkUser();
  return {
    isLoaded,
    user: user
      ? {
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress ?? '',
          firstName: user.firstName,
          lastName: user.lastName,
          avatarUrl: user.imageUrl ?? null,
        }
      : null,
  };
}

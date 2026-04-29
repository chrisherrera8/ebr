import type { AppUser } from '@/types';

export interface AuthState {
  user: AppUser | null;
  isLoaded: boolean;
  isSignedIn: boolean;
}

export interface AuthActions {
  getToken: () => Promise<string | null>;
  signOut: () => Promise<void>;
}

export type Auth = AuthState & AuthActions;

// Components import these — never the provider-specific hooks directly.
export { useAuth, useUser, AuthProvider } from './auth.clerk';

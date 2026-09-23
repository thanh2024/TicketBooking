import { create } from 'zustand';
import type { User } from '../../domain/entities/User';
import { tokenStorage } from '../../infrastructure/storage/tokenStorage';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  setLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: !!tokenStorage.getAccessToken(),
  isLoading: !!tokenStorage.getAccessToken(),

  setAuth: (user, accessToken, refreshToken) => {
    tokenStorage.setAccessToken(accessToken);
    tokenStorage.setRefreshToken(refreshToken);
    set({ user, isAuthenticated: true, isLoading: false });
  },

  setUser: (user) => set({ user, isAuthenticated: true, isLoading: false }),

  logout: () => {
    tokenStorage.clearTokens();
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  setLoading: (isLoading) => set({ isLoading }),
}));

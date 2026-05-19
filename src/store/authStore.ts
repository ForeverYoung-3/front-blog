import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthResponse, Role } from '../types';

interface AuthState {
  token: string | null;
  user: {
    id: number;
    username: string;
    nickname: string;
    avatar?: string;
    role: Role;
  } | null;
  isAuthenticated: boolean;
  login: (auth: AuthResponse) => void;
  logout: () => void;
  isAdmin: () => boolean;
  isEditor: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      login: (auth: AuthResponse) => {
        localStorage.setItem('token', auth.accessToken);
        set({
          token: auth.accessToken,
          user: {
            id: auth.userId,
            username: auth.username,
            nickname: auth.nickname,
            avatar: auth.avatar,
            role: auth.role,
          },
          isAuthenticated: true,
        });
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ token: null, user: null, isAuthenticated: false });
      },

      isAdmin: () => get().user?.role === 'ROLE_ADMIN',
      isEditor: () => ['ROLE_ADMIN', 'ROLE_EDITOR'].includes(get().user?.role || ''),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

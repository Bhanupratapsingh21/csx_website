import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  booted: boolean;
  setBooted: (booted: boolean) => void;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  setUser: (userData: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  booted: false,
  setBooted: (booted) => set({ booted }),

  login: (userData) =>
    set({ user: userData, isAuthenticated: true }),

  logout: () =>
    set({ user: null, isAuthenticated: false }),

  setUser: (userData) =>
    set({ user: userData, isAuthenticated: !!userData }),
}));
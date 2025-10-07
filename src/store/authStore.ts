import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState, LoginCredentials } from "@/types";
import { authService } from "@/services/authService";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      type: null,
      expiration: null,
      isAuthenticated: false,

      login: async (credentials: LoginCredentials) => {
        try {
          const response = await authService.login(credentials);

          if (response.success && response.data) {
            set({
              token: response.data.token,
              type: response.data.type,
              expiration: response.data.expiration,
              isAuthenticated: true,
            });
          } else {
            throw new Error(response.message || "Login failed");
          }
        } catch (error) {
          // Reset auth state on error
          set({
            token: null,
            type: null,
            expiration: null,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      logout: (reason?: string) => {
        set({
          token: null,
          type: null,
          expiration: null,
          isAuthenticated: false,
        });
        if (reason) {
          // Dispatch custom event for toast
          window.dispatchEvent(new CustomEvent('auth:logout', { detail: { reason } }));
        }
      },

      checkExpiration: (): boolean => {
        const { expiration } = get();

        if (!expiration) return false;

        const isExpired = authService.isTokenExpired(expiration);

        if (isExpired) {
          get().logout();
          return false;
        }

        return true;
      },

      isTokenValid: (): boolean => {
        const { token, expiration } = get();

        if (!token) return false;
        if (!authService.validateToken(token)) return false;
        if (expiration && authService.isTokenExpired(expiration)) {
          get().logout();
          return false;
        }

        return true;
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        type: state.type,
        expiration: state.expiration,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
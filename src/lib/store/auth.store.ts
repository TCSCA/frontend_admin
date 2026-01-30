"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  token: string | null;
  isLoading: boolean;
  error: string | null;

  login: (usuario: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isLoading: false,
      error: null,

      login: async (usuario: string, password: string) => {
        try {
          set({ isLoading: true, error: null });

          const res = await fetch("http://localhost:4000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario, password }),
          });

          const data = await res.json();
          console.log("RESPUESTA LOGIN:", data);

          if (!res.ok) {
            set({ error: data.message || "Credenciales incorrectas" });
            return;
          }

          set({ token: data.access_token, error: null });
        } catch (err) {
          set({ error: "Error de conexión con el servidor" });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        set({ token: null });

        if (typeof window !== "undefined") {
          window.location.href = "/desa_medicamentos";
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

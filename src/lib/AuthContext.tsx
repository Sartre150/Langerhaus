"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

// ── Translate Supabase auth errors to user-friendly Spanish ──
function translateAuthError(message: string, status?: number): string {
  if (status === 429) return "Demasiados intentos. Espera unos minutos antes de intentar de nuevo.";
  const lower = message.toLowerCase();
  if (lower.includes("invalid login credentials")) return "Email o contraseña incorrectos.";
  if (lower.includes("email not confirmed")) return "Confirma tu correo electrónico antes de iniciar sesión.";
  if (lower.includes("user already registered")) return "Ya existe una cuenta con este correo.";
  if (lower.includes("password") && lower.includes("at least")) return "La contraseña debe tener al menos 6 caracteres.";
  if (lower.includes("rate limit") || lower.includes("too many requests")) return "Demasiados intentos. Espera unos minutos.";
  if (lower.includes("email") && lower.includes("invalid")) return "Ingresa un correo electrónico válido.";
  if (lower.includes("signup is disabled")) return "El registro está deshabilitado temporalmente.";
  return message;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  signInWithGoogle: async () => ({ error: null }),
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session — if the refresh token is stale/invalid, clear it
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        // Invalid refresh token → sign out to clear corrupted session
        console.warn("[Auth] Stale session cleared:", error.message);
        supabase.auth.signOut();
        setSession(null);
        setUser(null);
      } else {
        setSession(session);
        setUser(session?.user ?? null);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });
    if (error) return { error: translateAuthError(error.message, error.status) };
    return { error: null };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: translateAuthError(error.message, error.status) };
    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) return { error: error.message };
    return { error: null };
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

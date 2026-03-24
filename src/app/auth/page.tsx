"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BookMarked, Mail, Lock, User, LogIn, UserPlus, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { NeonButton, Card } from "@/components/ui";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (mode === "login") {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error);
      } else {
        router.push("/dashboard");
      }
    } else {
      if (!name.trim()) {
        setError("Ingresa tu nombre");
        setLoading(false);
        return;
      }
      const { error } = await signUp(email, password, name);
      if (error) {
        setError(error);
      } else {
        setSuccess("¡Cuenta creada! Revisa tu correo para confirmar o inicia sesión directamente.");
        setMode("login");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-bg-primary bg-grid flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-3xl bg-neon-cyan/10 flex items-center justify-center mx-auto mb-4">
            <BookMarked size={32} className="text-neon-cyan" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">
            Langerhaus
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Cuaderno de arena y cálculo
          </p>
        </div>

        <Card glow="purple">
          {/* Tab Switch */}
          <div className="flex rounded-xl bg-bg-secondary p-1 mb-6">
            <button
              onClick={() => { setMode("login"); setError(null); setSuccess(null); }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                mode === "login"
                  ? "bg-neon-cyan/20 text-neon-cyan"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => { setMode("signup"); setError(null); setSuccess(null); }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                mode === "signup"
                  ? "bg-neon-purple/20 text-neon-purple"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              Registrarse
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-xs text-text-secondary mb-1.5 font-medium">
                  Nombre
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre"
                    className="w-full bg-bg-secondary border border-text-muted/20 rounded-lg pl-10 pr-4 py-2.5
                      text-text-primary placeholder-text-muted/50 text-sm
                      focus:outline-none focus:border-neon-purple/50 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs text-text-secondary mb-1.5 font-medium">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="w-full bg-bg-secondary border border-text-muted/20 rounded-lg pl-10 pr-4 py-2.5
                    text-text-primary placeholder-text-muted/50 text-sm
                    focus:outline-none focus:border-neon-cyan/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-text-secondary mb-1.5 font-medium">
                Contraseña
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
                  className="w-full bg-bg-secondary border border-text-muted/20 rounded-lg pl-10 pr-4 py-2.5
                    text-text-primary placeholder-text-muted/50 text-sm
                    focus:outline-none focus:border-neon-cyan/50 transition-all"
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3"
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-sm text-neon-green bg-neon-green/10 border border-neon-green/20 rounded-lg p-3"
              >
                {success}
              </motion.div>
            )}

            <NeonButton
              variant={mode === "login" ? "cyan" : "purple"}
              size="lg"
              icon={mode === "login" ? LogIn : UserPlus}
              disabled={loading}
              className="w-full"
              type="submit"
            >
              {loading
                ? "Cargando..."
                : mode === "login"
                ? "Entrar"
                : "Crear Cuenta"}
            </NeonButton>
          </form>

          {/* Separator */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-text-muted/20" />
            <span className="text-xs text-text-muted">o continúa con</span>
            <div className="flex-1 h-px bg-text-muted/20" />
          </div>

          {/* Google OAuth */}
          <button
            onClick={async () => {
              setError(null);
              const { error } = await signInWithGoogle();
              if (error) setError(error);
            }}
            className="w-full flex items-center justify-center gap-3 py-2.5 rounded-lg
              bg-bg-secondary border border-text-muted/20 hover:border-text-muted/40
              text-text-primary text-sm font-medium transition-all hover:bg-bg-secondary/80"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>

          <p className="text-xs text-text-muted text-center mt-4">
            {mode === "login" ? (
              <>
                ¿No tienes cuenta?{" "}
                <button onClick={() => setMode("signup")} className="text-neon-cyan hover:underline">
                  Regístrate
                </button>
              </>
            ) : (
              <>
                ¿Ya tienes cuenta?{" "}
                <button onClick={() => setMode("login")} className="text-neon-cyan hover:underline">
                  Inicia sesión
                </button>
              </>
            )}
          </p>
        </Card>
      </motion.div>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace("/dashboard");
      } else {
        router.replace("/auth");
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold text-text-primary tracking-tight">Langerhaus</h1>
      <div className="w-8 h-8 border-2 border-neon-cyan/20 border-t-neon-cyan rounded-full animate-spin" />
      <p className="text-sm text-text-muted">Cargando...</p>
    </div>
  );
}

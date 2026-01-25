"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    try {
      setLoading(true);
      setError(null);

      await login(email, password);
    } catch (err: any) {
      setError(err.message || "Erro ao realizar login");
    } finally {
      setLoading(false);
    }
  }

  /*async function handleLogin() {
    try {
      setLoading(true);
      setError(null);
      await login(email, password); // login já faz o router.push
    } catch (err: any) {
      setError(err.message || "Erro ao realizar login");
    } finally {
      setLoading(false);
    }
  }*/

  return (
    <main className="min-h-screen flex items-center justify-center bg-color2">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-color5 mb-6 text-center">
          Login
        </h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-color4">E-mail</label>
            <Input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-color4">Senha</label>
            <Input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button
            className="w-full mt-4"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </div>

        <p className="text-sm text-center text-color4 mt-4">
          Não tem conta?{" "}
          <Link href="/register" className="text-color5 underline">
            Criar conta
          </Link>
        </p>
      </div>
    </main>
  );
}

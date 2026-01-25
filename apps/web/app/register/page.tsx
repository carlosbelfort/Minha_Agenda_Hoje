"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister() {
    try {
      setLoading(true);
      setError(null);

      await api("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      // Cadastro OK → vai para login
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-color2">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-color5 mb-6 text-center">
          Criar conta
        </h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-color4">Nome</label>
            <Input
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? "Criando conta..." : "Cadastrar"}
          </Button>
        </div>

        <p className="text-sm text-center text-color4 mt-4">
          Já tem conta?{" "}
          <Link href="/login" className="text-color5 underline">
            Fazer login
          </Link>
        </p>
      </div>
    </main>
  );
}
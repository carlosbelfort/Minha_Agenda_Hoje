"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";

type Profile = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  createdAt: string;
};

type UpdateBackgroundResponse = {
  message: string;
  backgroundImage: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  // Estados do background
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [bgError, setBgError] = useState<string | null>(null);
  const [bgSuccess, setBgSuccess] = useState<string | null>(null);

  // Dados do perfil
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Estados gerais
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Estados da senha
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  /* =========================
     CARREGAR PERFIL
  ========================= */
  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await api<Profile>("/users/me");
        setProfile(response);
        setName(response.name);
        setEmail(response.email);
      } catch (err) {
        setError("Erro ao carregar perfil");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  /* =========================
     ATUALIZAR PERFIL
  ========================= */
  async function handleUpdateProfile() {
    try {
      setError(null);
      setSuccess(null);

      const response = await api<Profile>("/users/me", {
        method: "PUT",
        body: JSON.stringify({ name, email }),
      });

      setProfile(response);
      setSuccess("Perfil atualizado com sucesso");
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar perfil");
    }
  }

  /* =========================
     ATUALIZAR SENHA
  ========================= */
  async function handleUpdatePassword() {
    try {
      setPasswordLoading(true);
      setPasswordError(null);
      setPasswordSuccess(null);

      await api("/users/me/password", {
        method: "PUT",
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      setCurrentPassword("");
      setNewPassword("");
      setPasswordSuccess("Senha atualizada com sucesso");
    } catch (err: any) {
      setPasswordError(err.message || "Erro ao atualizar senha");
    } finally {
      setPasswordLoading(false);
    }
  }

  if (loading) {
    return <p>Carregando perfil...</p>;
  }

  if (!profile) {
    return <p>Perfil não encontrado</p>;
  }

  /* =========================
     ATUALIZAR Background
  ========================= */

  async function handleUpdateBackground() {
    if (!backgroundFile) return;

    try {
      setBgError(null);
      setBgSuccess(null);

      const formData = new FormData();
      formData.append("file", backgroundFile);

      const response = await api<UpdateBackgroundResponse>(
        "/users/me/background",
        {
          method: "PUT",
          body: formData,
        },
      );

      setBgSuccess("Fundo atualizado com sucesso");

      document.body.style.setProperty(
        "--user-background",
        `url("${response.backgroundImage}")`,
      );
    } catch (err: any) {
      setBgError(err.message || "Erro ao atualizar fundo");
    }
  }

  return (
    <main className="space-y-8">
      <BackButton />
      <div className="max-w-2xl space-y-6">
        {/* =========================
          CARD - DADOS DO PERFIL
      ========================= */}
        <Card className="border-border bg-black/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-center text-lg">Meu Perfil</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Nome</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div>
              <label className="text-sm text-muted-foreground">E-mail</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground">
                Tipo de conta
              </label>
              <Input value={profile.role} disabled />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
            {success && <p className="text-sm text-green-500">{success}</p>}

            <Button onClick={handleUpdateProfile}>Salvar alterações</Button>
          </CardContent>
        </Card>

        {/* =========================
          CARD - ALTERAR SENHA
      ========================= */}
        <Card className="border-border bg-black/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-center text-lg">Alterar Senha</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">
                Senha atual
              </label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground">
                Nova senha
              </label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            {passwordError && (
              <p className="text-sm text-red-500">{passwordError}</p>
            )}

            {passwordSuccess && (
              <p className="text-sm text-green-500">{passwordSuccess}</p>
            )}

            <Button onClick={handleUpdatePassword} disabled={passwordLoading}>
              {passwordLoading ? "Atualizando..." : "Atualizar senha"}
            </Button>
          </CardContent>
        </Card>
        <Card className="border-border bg-black/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-center text-lg">Fundo de Tela</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <Input
              type="file"
              accept="image/jpeg,image/jpg"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                if (file.size > 10 * 1024 * 1024) {
                  setBgError("O arquivo deve ter no máximo 10MB");
                  return;
                }

                setBgError(null);
                setBackgroundFile(file);
              }}
            />

            <p className="text-xs text-muted-foreground">
              • Formato permitido: JPG ou JPEG <br />
              • Tamanho máximo: 10MB <br />• A imagem será ajustada
              automaticamente ao fundo da tela
            </p>

            {bgError && <p className="text-sm text-red-500">{bgError}</p>}
            {bgSuccess && <p className="text-sm text-green-500">{bgSuccess}</p>}

            <Button onClick={handleUpdateBackground}>
              Atualizar fundo de tela
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

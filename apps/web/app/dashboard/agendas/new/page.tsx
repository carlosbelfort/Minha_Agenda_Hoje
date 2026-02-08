"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BackButton } from "@/components/ui/back-button";

export default function NewAgendaPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreateAgenda() {
    try {
      setLoading(true);
      setError(null);

      await api("/agendas", {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          date,
        }),
      });

      // volta para dashboard ou lista
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Erro ao criar agenda");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="space-y-8">
      <BackButton />
      <div className="p-6 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-lg">
              CRIAR NOVA TAREFA
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <label className="text-sm">Título</label>
              <Input
                placeholder="Ex: Reunião com cliente"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm">Descrição</label>
              <Input
                placeholder="Detalhes da tarefa (opcional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm">Data e hora</label>
              <Input
                type="datetime-local"
                value={date}                
                onClick={(e) =>
                  (e.currentTarget as HTMLInputElement).showPicker()
                }
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => router.back()}>
                Cancelar
              </Button>

              <Button onClick={handleCreateAgenda} disabled={loading}>
                {loading ? "Salvando..." : "Criar tarefa"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

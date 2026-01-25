"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";

type Agenda = {
  id: string;
  title: string;
  description?: string;
  date: string;
  completed: boolean;
};

export default function AgendasPage() {
  const [agendas, setAgendas] = useState<Agenda[]>([]);

  async function handleCompleteAgenda(id: string) {
    try {
      await api(`/agendas/${id}/complete`, {
        method: "PATCH",
        body: JSON.stringify({}),
      });

      setAgendas((prev) =>
        prev.map((agenda) =>
          agenda.id === id ? { ...agenda, completed: true } : agenda,
        ),
      );

      setTimeout(() => {
        setAgendas((prev) => prev.filter((agenda) => agenda.id !== id));
      }, 600);
    } catch (error) {
      console.error("Erro ao concluir agenda", error);
    }
  }

  useEffect(() => {
    api<Agenda[]>("/agendas")
      .then(setAgendas)
      .catch((err) => {
        console.error("Erro ao carregar agendas", err);
      });
  }, []);

  return (
    <div className="space-y-6">
      {/* HEADER + BOTÃO NOVA TAREFA */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Minhas agendas</h1>

        <Link
          href="/dashboard/agendas/new"
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-black"
        >
          <Plus size={18} />
          Nova tarefa
        </Link>
      </div>

      {/* GRID DE AGENDAS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {agendas.map((agenda) => (
          <div key={agenda.id} className="relative">
            <Link href={`/dashboard/agendas/${agenda.id}`}>
              <Card
                className={`cursor-pointer transition hover:shadow-md ${
                  agenda.completed ? "opacity-50 bg-muted" : ""
                }`}
              >
                <CardHeader>
                  <CardTitle>{agenda.title}</CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {agenda.description || "Sem descrição"}
                  </p>
                  <p className="mt-2 text-xs">
                    {new Date(agenda.date).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </Link>

            {!agenda.completed && (
              <button
                onClick={() => handleCompleteAgenda(agenda.id)}
                className="absolute right-3 bottom-3 z-10 rounded-md
                           bg-green-600 px-3 py-1 text-xs font-medium text-white
                           transition hover:bg-green-700"
              >
                Concluída
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

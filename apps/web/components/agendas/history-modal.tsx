"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Agenda = {
  id: string;
  title: string;
  completedAt: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function HistoryModal({ open, onOpenChange }: Props) {
  const [agendas, setAgendas] = useState<Agenda[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    setLoading(true);

    api<Agenda[]>("/agendas/history")
      .then(setAgendas)
      .finally(() => setLoading(false));
  }, [open]);

  async function handleRestore(id: string) {
    await api(`/agendas/${id}/restore`, {
      method: "PATCH",
      body: JSON.stringify({}),
    });

    setAgendas((prev) => prev.filter((agenda) => agenda.id !== id));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tarefas concluídas (últimas 24h)</DialogTitle>
        </DialogHeader>

        {loading && <p>Carregando...</p>}

        {!loading && agendas.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Nenhuma tarefa concluída
          </p>
        )}

        <div className="space-y-3">
          {agendas.map((agenda) => (
            <div
              key={agenda.id}
              className="flex items-center justify-between rounded-md border p-3"
            >
              <div>
                <p className="font-medium">{agenda.title}</p>
                <p className="text-xs text-muted-foreground">
                  Concluída em{" "}
                  {new Date(agenda.completedAt).toLocaleString()}
                </p>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => handleRestore(agenda.id)}
              >
                Restaurar
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
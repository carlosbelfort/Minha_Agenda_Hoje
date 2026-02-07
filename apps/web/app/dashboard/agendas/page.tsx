"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, Pencil, History } from "lucide-react";
import { BackButton } from "@/components/ui/back-button";
import { HistoryModal } from "@/components/agendas/history-modal";

type Agenda = {
  id: string;
  title: string;
  description?: string;
  date: string;
  completed: boolean;
  photos?: {
    id: string;
    url: string;
  }[];
};

export default function AgendasPage() {
  const [agendas, setAgendas] = useState<Agenda[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [selectedAgenda, setSelectedAgenda] = useState<Agenda | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);

  async function handleCompleteAgenda(id: string) {
    try {
      await api(`/agendas/${id}/complete`, {
        method: "PATCH",
        body: JSON.stringify({}),
      });

      setAgendas((prev) => prev.filter((agenda) => agenda.id !== id));
    } catch (error) {
      console.error("Erro ao concluir agenda", error);
    }
  }

  function handlePrevPhoto() {
    if (!selectedAgenda?.photos) return;

    setSelectedPhotoIndex((prev) =>
      prev === 0 ? selectedAgenda.photos.length - 1 : prev - 1,
    );
  }

  function handleNextPhoto() {
    if (!selectedAgenda?.photos) return;

    setSelectedPhotoIndex((prev) =>
      prev === selectedAgenda.photos.length - 1 ? 0 : prev + 1,
    );
  }

  async function handleDeletePhoto(agendaId: string, photoId: string) {
    const confirmDelete = confirm("Deseja remover esta foto?");
    if (!confirmDelete) return;

    try {
      await api(`/agendas/${agendaId}/photos/${photoId}`, {
        method: "DELETE",
      });

      // Atualiza lista de agendas
      setAgendas((prev) =>
        prev.map((agenda) =>
          agenda.id === agendaId
            ? {
                ...agenda,
                photos: agenda.photos?.filter((photo) => photo.id !== photoId),
              }
            : agenda,
        ),
      );

      // Atualiza modal, se estiver aberto
      if (selectedAgenda?.id === agendaId && selectedAgenda.photos) {
        const updatedPhotos = selectedAgenda.photos.filter(
          (photo) => photo.id !== photoId,
        );

        if (updatedPhotos.length === 0) {
          setSelectedAgenda(null);
        } else {
          setSelectedAgenda({
            ...selectedAgenda,
            photos: updatedPhotos,
          });
          setSelectedPhotoIndex(0);
        }
      }
    } catch (error) {
      console.error("Erro ao excluir foto", error);
      alert("Erro ao excluir foto");
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
    <main className="space-y-8">
      <BackButton />

      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Minhas agendas</h1>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/agendas/new"
              className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-black"
            >
              <Plus size={18} />
              Nova tarefa
            </Link>

            <button
              onClick={() => setHistoryOpen(true)}
              className="rounded-md border p-2 hover:bg-muted"
              title="Histórico"
            >
              <History size={18} />
            </button>
          </div>
        </div>

        {/* GRID DE AGENDAS */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {agendas.map((agenda) => (
            <div key={agenda.id} className="relative">
              {/* ÍCONE EDITAR */}
              <Link
                href={`/dashboard/agendas/${agenda.id}`}
                className="absolute top-3 right-3 z-10 text-muted-foreground hover:text-primary"
              >
                <Pencil size={16} />
              </Link>

              {/* CARD */}
              <Card className="transition hover:shadow-md">
                <CardHeader>
                  <CardTitle>{agenda.title}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {agenda.description || "Sem descrição"}
                  </p>

                  <p className="text-xs">
                    {new Date(agenda.date).toLocaleDateString()}
                  </p>

                  {/* FOTOS */}
                  {agenda.photos && agenda.photos.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pt-2">
                      {agenda.photos.slice(0, 3).map((photo, index) => (
                        <div key={photo.id} className="relative">
                          <img
                            src={photo.url}
                            alt="Foto da agenda"
                            onClick={() => {
                              setSelectedAgenda(agenda);
                              setSelectedPhotoIndex(index);
                            }}
                            className="h-12 w-12 cursor-pointer rounded-md object-cover
               transition hover:opacity-80"
                          />

                          {/* BOTÃO EXCLUIR */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePhoto(agenda.id, photo.id);
                            }}
                            className="absolute -top-1 -right-1 flex h-5 w-5
               items-center justify-center rounded-full
               bg-red-600 text-xs text-white
               hover:bg-red-700"
                            title="Excluir foto"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* BOTÃO CONCLUIR */}
              <button
                onClick={() => handleCompleteAgenda(agenda.id)}
                className="absolute right-3 bottom-3 z-10 rounded-md
                           bg-green-600 px-3 py-1 text-xs font-medium text-white
                           transition hover:bg-green-700"
              >
                Concluída
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL DE HISTÓRICO */}
      <HistoryModal open={historyOpen} onOpenChange={setHistoryOpen} />
      {/* MODAL DE VISUALIZAÇÃO DA FOTO */}
      {selectedAgenda && selectedAgenda.photos?.length > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center
               bg-black/70 backdrop-blur-sm"
          onClick={() => setSelectedAgenda(null)}
        >
          {/* BOTÃO FECHAR */}
          <button
            onClick={() => setSelectedAgenda(null)}
            className="absolute top-4 right-4 text-white text-xl hover:opacity-80"
          >
            ✕
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeletePhoto(
                selectedAgenda.id,
                selectedAgenda.photos![selectedPhotoIndex].id,
              );
            }}
            className="absolute top-4 left-4 rounded-md
             bg-red-600 px-3 py-1 text-sm text-white
             hover:bg-red-700"
          >
            Excluir
          </button>

          {/* SETA ESQUERDA */}
          {selectedAgenda.photos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevPhoto();
              }}
              className="absolute left-4 text-white text-3xl hover:opacity-80"
            >
              ←
            </button>
          )}

          {/* IMAGEM */}
          <img
            src={selectedAgenda.photos![selectedPhotoIndex].url}
            alt="Foto ampliada"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] max-w-[90vw] rounded-lg
                 object-contain shadow-lg"
          />

          {/* SETA DIREITA */}
          {selectedAgenda.photos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNextPhoto();
              }}
              className="absolute right-4 text-white text-3xl hover:opacity-80"
            >
              →
            </button>
          )}
        </div>
      )}
    </main>
  );
}

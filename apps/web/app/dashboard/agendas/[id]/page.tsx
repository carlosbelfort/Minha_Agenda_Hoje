"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BackButton } from "@/components/ui/back-button";

type Agenda = {
  id: string;
  title: string;
  description?: string;
  date: string;
  photos?: { id: string; url: string }[];
};

export default function EditAgendaPage() {
  const params = useParams();
  const id = params?.id as string;

  const [agenda, setAgenda] = useState<Agenda | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;

    api<Agenda>(`/agendas/${id}`)
      .then(setAgenda)
      .catch((err) => {
        console.error("Erro ao carregar agenda", err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSave() {
    if (!agenda) return;

    try {
      setSaving(true);

      await api(`/agendas/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          title: agenda.title,
          description: agenda.description,
          date: agenda.date,
        }),
      });

      alert("Agenda atualizada com sucesso");
    } catch (error) {
      console.error("Erro ao salvar agenda", error);
      alert("Erro ao salvar agenda");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    await api(`/agendas/${id}/photos`, {
      method: "POST",
      body: formData,
    });

    const updatedAgenda = await api<Agenda>(`/agendas/${id}`);
    setAgenda(updatedAgenda);
  }

  if (loading) return <p>Carregando...</p>;
  if (!agenda) return <p>Agenda não encontrada</p>;

  return (
    <main className="space-y-8">
      <BackButton />
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Editar agenda</h1>
        <p className="text-sm text-muted-foreground">
          Atualize os dados e gerencie fotos
        </p>
      </div>

      {/* FORMULÁRIO */}
      <Card>
        <CardHeader>
          <CardTitle>Informações da agenda</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Título</label>
            <Input
              value={agenda.title}
              onChange={(e) => setAgenda({ ...agenda, title: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Descrição</label>
            <Textarea
              value={agenda.description || ""}
              onChange={(e) =>
                setAgenda({
                  ...agenda,
                  description: e.target.value,
                })
              }
              rows={4}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Data</label>
            <Input
              type="datetime-local"
              value={agenda.date.slice(0, 16)}
              onChange={(e) =>
                setAgenda({
                  ...agenda,
                  date: e.target.value,
                })
              }
            />
          </div>

          {/* UPLOAD */}
          <Card>
            <CardHeader>
              <CardTitle>Fotos da agenda</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleUpload(e.target.files)}
              />

              {agenda.photos && agenda.photos.length > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {agenda.photos.map((photo) => (
                    <img
                      key={photo.id}
                      src={photo.url}
                      alt="Foto da agenda"
                      className="h-24 w-full rounded-md object-cover"
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Salvando..." : "Salvar alterações"}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}

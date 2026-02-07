"use client";

import { useEffect, useState } from "react";
import { getAgendaPhotos } from "@/lib/agendas";

type Photo = {
  id: string;
  url: string;
  createdAt: string;
};

export function AgendaPhotosGallery({ agendaId }: { agendaId: string }) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getAgendaPhotos(agendaId);
        setPhotos(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [agendaId]);

  if (loading) return <p>Carregando fotos...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  if (photos.length === 0) {
    return <p className="text-muted-foreground">Nenhuma foto anexada</p>;
  }

  return (
    <main>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <img
            key={photo.id}
            src={photo.url}
            alt="Foto da agenda"
            className="rounded-lg object-cover aspect-square"
          />
        ))}
      </div>
    </main>
  );
}


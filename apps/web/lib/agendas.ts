import { api } from "./api";

type Photo = {
  id: string;
  url: string;
  createdAt: string;
};

export async function getAgendaPhotos(agendaId: string): Promise<Photo[]> {
  const response = await api<Photo[]>(`/agendas/${agendaId}/photos`);

  return response;
}

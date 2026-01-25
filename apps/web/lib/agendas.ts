import { api } from "./api";

export async function getAgendaPhotos(agendaId: string) {
  return api(`/agendas/${agendaId}/photos`);
}
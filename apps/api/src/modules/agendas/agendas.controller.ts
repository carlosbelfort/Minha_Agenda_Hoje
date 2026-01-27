import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../../lib/prisma";
import { authMiddleware } from "../../middlewares/auth";
import { uploadAgendaPhotos } from "./agendas.photos.controller";
import { Role } from "@prisma/client";

/* =========================
   CONTROLLERS
========================= */

/**
 * USER / ADMIN
 * Lista agendas do usuário logado
 * Cada usuário vê apenas suas próprias agendas
 */
async function listAgendas(request: FastifyRequest, reply: FastifyReply) {
  const { sub } = request.user as { sub: string };

  const agendas = await prisma.agenda.findMany({
    where: {
      userId: sub,
      completed: false,
    },
    orderBy: {
      date: "asc",
    },
  });

  return reply.send(agendas);
}

/**
 * USER / ADMIN
 * Busca uma agenda específica
 */
async function getAgenda(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const { sub, role } = request.user as { sub: string; role: Role };

  const agenda = await prisma.agenda.findUnique({
    where: { id },
  });

  if (!agenda) {
    return reply.status(404).send({ message: "Agenda não encontrada" });
  }

  if (role !== Role.ADMIN && agenda.userId !== sub) {
    return reply.status(403).send({ message: "Acesso negado" });
  }

  return reply.send(agenda);
}

/**
 * USER / ADMIN
 * Cria nova agenda
 */
async function createAgenda(request: FastifyRequest, reply: FastifyReply) {
  const { sub } = request.user as { sub: string };
  const { title, description, date } = request.body as {
    title: string;
    description?: string;
    date: string;
  };

  const agenda = await prisma.agenda.create({
    data: {
      title,
      description,
      date: new Date(date),
      userId: sub,
    },
  });

  return reply.status(201).send(agenda);
}

/**
 * USER / ADMIN
 * Atualiza agenda
 */
async function updateAgenda(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const { sub, role } = request.user as { sub: string; role: Role };
  const { title, description, date } = request.body as {
    title?: string;
    description?: string;
    date?: string;
  };

  const agenda = await prisma.agenda.findUnique({ where: { id } });

  if (!agenda) {
    return reply.status(404).send({ message: "Agenda não encontrada" });
  }

  if (role !== Role.ADMIN && agenda.userId !== sub) {
    return reply.status(403).send({ message: "Acesso negado" });
  }

  const updatedAgenda = await prisma.agenda.update({
    where: { id },
    data: {
      title,
      description,
      date: date ? new Date(date) : undefined,
    },
  });

  return reply.send(updatedAgenda);
}

/**
 * USER / ADMIN
 * Status agenda como completa
 */

async function completeAgenda(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as { id: string };
  const { sub, role } = request.user as { sub: string; role: Role };

  const agenda = await prisma.agenda.findUnique({ where: { id } });

  if (!agenda) {
    return reply.status(404).send({ message: "Agenda não encontrada" });
  }

  if (role !== Role.ADMIN && agenda.userId !== sub) {
    return reply.status(403).send({ message: "Acesso negado" });
  }

  await prisma.agenda.update({
    where: { id },
    data: { completed: true },
  });

  return reply.send({ success: true });
}


/**
 * USER / ADMIN
 * Remove agenda
 */
async function deleteAgenda(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const { sub, role } = request.user as { sub: string; role: Role };

  const agenda = await prisma.agenda.findUnique({ where: { id } });

  if (!agenda) {
    return reply.status(404).send({ message: "Agenda não encontrada" });
  }

  if (role !== Role.ADMIN && agenda.userId !== sub) {
    return reply.status(403).send({ message: "Acesso negado" });
  }

  await prisma.agenda.delete({ where: { id } });

  return reply.status(204).send();
}

/* =========================
   ROTAS
========================= */

export async function agendasRoutes(app: FastifyInstance) {
  // Todas as rotas exigem autenticação
  app.addHook("onRequest", authMiddleware);

  // USER / ADMIN
  app.get("/", listAgendas);
  app.get("/:id", getAgenda);
  app.post("/", createAgenda);
  app.put("/:id", updateAgenda);
  app.delete("/:id", deleteAgenda);
  app.post("/:id/photos", uploadAgendaPhotos);
  app.patch("/:id/complete", completeAgenda);

}

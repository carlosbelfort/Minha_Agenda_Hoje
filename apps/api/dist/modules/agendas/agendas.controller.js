"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agendasRoutes = agendasRoutes;
const prisma_1 = require("../../lib/prisma");
const auth_1 = require("../../middlewares/auth");
const agendas_photos_controller_1 = require("./agendas.photos.controller");
/* =========================
   CONTROLLERS
========================= */
async function listAgendas(request, reply) {
    const { sub } = request.user;
    const agendas = await prisma_1.prisma.agenda.findMany({
        where: {
            userId: sub,
            completed: false,
        },
        orderBy: {
            date: "asc",
        },
        include: {
            photos: true,
        },
    });
    return reply.send(agendas);
}
async function getAgenda(request, reply) {
    const { id } = request.params;
    const { sub, role } = request.user;
    const agenda = await prisma_1.prisma.agenda.findUnique({ where: { id } });
    if (!agenda) {
        return reply.status(404).send({ message: "Agenda não encontrada" });
    }
    if (role !== "ADMIN" && agenda.userId !== sub) {
        return reply.status(403).send({ message: "Acesso negado" });
    }
    return reply.send(agenda);
}
async function createAgenda(request, reply) {
    const { sub } = request.user;
    const { title, description, date } = request.body;
    const agenda = await prisma_1.prisma.agenda.create({
        data: {
            title,
            description,
            date: new Date(date),
            userId: sub,
        },
    });
    return reply.status(201).send(agenda);
}
async function updateAgenda(request, reply) {
    const { id } = request.params;
    const { sub, role } = request.user;
    const { title, description, date } = request.body;
    const agenda = await prisma_1.prisma.agenda.findUnique({ where: { id } });
    if (!agenda) {
        return reply.status(404).send({ message: "Agenda não encontrada" });
    }
    if (role !== "ADMIN" && agenda.userId !== sub) {
        return reply.status(403).send({ message: "Acesso negado" });
    }
    const updatedAgenda = await prisma_1.prisma.agenda.update({
        where: { id },
        data: {
            title,
            description,
            date: date ? new Date(date) : undefined,
        },
    });
    return reply.send(updatedAgenda);
}
async function completeAgenda(request, reply) {
    const { id } = request.params;
    const { sub, role } = request.user;
    const agenda = await prisma_1.prisma.agenda.findUnique({ where: { id } });
    if (!agenda) {
        return reply.status(404).send({ message: "Agenda não encontrada" });
    }
    if (role !== "ADMIN" && agenda.userId !== sub) {
        return reply.status(403).send({ message: "Acesso negado" });
    }
    await prisma_1.prisma.agenda.update({
        where: { id },
        data: {
            completed: true,
            completedAt: new Date(),
        },
    });
    return reply.send({ success: true });
}
async function listCompletedAgendas(request, reply) {
    const { sub } = request.user;
    const since = new Date();
    since.setHours(since.getHours() - 24);
    await prisma_1.prisma.agenda.deleteMany({
        where: {
            completed: true,
            completedAt: {
                lt: new Date(Date.now() - 24 * 60 * 60 * 1000),
            },
        },
    });
    const agendas = await prisma_1.prisma.agenda.findMany({
        where: {
            userId: sub,
            completed: true,
            completedAt: {
                gte: since,
            },
        },
        orderBy: {
            completedAt: "desc",
        },
        include: {
            photos: true,
        },
    });
    return reply.send(agendas);
}
async function restoreAgenda(request, reply) {
    const { id } = request.params;
    const { sub, role } = request.user;
    const agenda = await prisma_1.prisma.agenda.findUnique({ where: { id } });
    if (!agenda) {
        return reply.status(404).send({ message: "Agenda não encontrada" });
    }
    if (role !== "ADMIN" && agenda.userId !== sub) {
        return reply.status(403).send({ message: "Acesso negado" });
    }
    const restored = await prisma_1.prisma.agenda.update({
        where: { id },
        data: {
            completed: false,
            completedAt: null,
        },
    });
    return reply.send(restored);
}
async function deleteAgenda(request, reply) {
    const { id } = request.params;
    const { sub, role } = request.user;
    const agenda = await prisma_1.prisma.agenda.findUnique({ where: { id } });
    if (!agenda) {
        return reply.status(404).send({ message: "Agenda não encontrada" });
    }
    if (role !== "ADMIN" && agenda.userId !== sub) {
        return reply.status(403).send({ message: "Acesso negado" });
    }
    await prisma_1.prisma.agenda.delete({ where: { id } });
    return reply.status(204).send();
}
/* =========================
   ROTAS
========================= */
async function agendasRoutes(app) {
    app.addHook("onRequest", auth_1.authMiddleware);
    app.get("/", listAgendas);
    app.get("/:id", getAgenda);
    app.get("/history", listCompletedAgendas);
    app.post("/", createAgenda);
    app.put("/:id", updateAgenda);
    app.delete("/:id", deleteAgenda);
    app.post("/:id/photos", agendas_photos_controller_1.uploadAgendaPhotos);
    app.delete("/:agendaId/photos/:photoId", agendas_photos_controller_1.deleteAgendaPhoto);
    app.patch("/:id/complete", completeAgenda);
    app.patch("/:id/restore", restoreAgenda);
}

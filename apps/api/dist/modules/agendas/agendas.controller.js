"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agendasRoutes = agendasRoutes;
const prisma_1 = require("../../lib/prisma");
const auth_1 = require("../../middlewares/auth");
const agendas_photos_controller_1 = require("./agendas.photos.controller");
const client_1 = require("@prisma/client");
/* =========================
   CONTROLLERS
========================= */
/**
 * USER / ADMIN
 * Lista agendas do usuário logado
 * Cada usuário vê apenas suas próprias agendas
 */
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
    });
    return reply.send(agendas);
}
/**
 * USER / ADMIN
 * Busca uma agenda específica
 */
async function getAgenda(request, reply) {
    const { id } = request.params;
    const { sub, role } = request.user;
    const agenda = await prisma_1.prisma.agenda.findUnique({
        where: { id },
    });
    if (!agenda) {
        return reply.status(404).send({ message: "Agenda não encontrada" });
    }
    if (role !== client_1.Role.ADMIN && agenda.userId !== sub) {
        return reply.status(403).send({ message: "Acesso negado" });
    }
    return reply.send(agenda);
}
/**
 * USER / ADMIN
 * Cria nova agenda
 */
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
/**
 * USER / ADMIN
 * Atualiza agenda
 */
async function updateAgenda(request, reply) {
    const { id } = request.params;
    const { sub, role } = request.user;
    const { title, description, date } = request.body;
    const agenda = await prisma_1.prisma.agenda.findUnique({ where: { id } });
    if (!agenda) {
        return reply.status(404).send({ message: "Agenda não encontrada" });
    }
    if (role !== client_1.Role.ADMIN && agenda.userId !== sub) {
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
/**
 * USER / ADMIN
 * Status agenda como completa
 */
async function completeAgenda(request, reply) {
    const { id } = request.params;
    const { sub, role } = request.user;
    const agenda = await prisma_1.prisma.agenda.findUnique({ where: { id } });
    if (!agenda) {
        return reply.status(404).send({ message: "Agenda não encontrada" });
    }
    if (role !== client_1.Role.ADMIN && agenda.userId !== sub) {
        return reply.status(403).send({ message: "Acesso negado" });
    }
    await prisma_1.prisma.agenda.update({
        where: { id },
        data: { completed: true },
    });
    return reply.send({ success: true });
}
/**
 * USER / ADMIN
 * Remove agenda
 */
async function deleteAgenda(request, reply) {
    const { id } = request.params;
    const { sub, role } = request.user;
    const agenda = await prisma_1.prisma.agenda.findUnique({ where: { id } });
    if (!agenda) {
        return reply.status(404).send({ message: "Agenda não encontrada" });
    }
    if (role !== client_1.Role.ADMIN && agenda.userId !== sub) {
        return reply.status(403).send({ message: "Acesso negado" });
    }
    await prisma_1.prisma.agenda.delete({ where: { id } });
    return reply.status(204).send();
}
/* =========================
   ROTAS
========================= */
async function agendasRoutes(app) {
    // Todas as rotas exigem autenticação
    app.addHook("onRequest", auth_1.authMiddleware);
    // USER / ADMIN
    app.get("/", listAgendas);
    app.get("/:id", getAgenda);
    app.post("/", createAgenda);
    app.put("/:id", updateAgenda);
    app.delete("/:id", deleteAgenda);
    app.post("/:id/photos", agendas_photos_controller_1.uploadAgendaPhotos);
    app.patch("/:id/complete", completeAgenda);
}

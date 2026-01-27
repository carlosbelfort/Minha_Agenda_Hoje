"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRoutes = usersRoutes;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../../lib/prisma");
const auth_1 = require("../../middlewares/auth");
const role_1 = require("../../middlewares/role");
const client_1 = require("@prisma/client");
/* =========================
   CONTROLLERS
========================= */
/**
 * ADMIN
 * Lista todos os usuários
 */
async function listUsers(request, reply) {
    const users = await prisma_1.prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
        },
    });
    return reply.send(users);
}
/**
 * USER / ADMIN
 * Retorna o próprio perfil
 */
async function getProfile(request, reply) {
    const { sub } = request.user;
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: sub },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
        },
    });
    if (!user) {
        return reply.status(404).send({ message: "Usuário não encontrado" });
    }
    return reply.send(user);
}
/**
 * USER / ADMIN
 * Atualiza o próprio perfil
 */
async function updateProfile(request, reply) {
    const { sub } = request.user;
    const { name, email } = request.body;
    // VERIFICA SE O EMAIL JÁ EXISTE (ANTES DO UPDATE)
    if (email) {
        const emailExists = await prisma_1.prisma.user.findUnique({
            where: { email },
        });
        if (emailExists && emailExists.id !== sub) {
            return reply.status(409).send({
                message: "E-mail já em uso",
            });
        }
    }
    // ATUALIZA O PERFIL
    const user = await prisma_1.prisma.user.update({
        where: { id: sub },
        data: { name, email },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            updatedAt: true,
        },
    });
    return reply.send(user);
}
/**
 * USER / ADMIN
 * Atualiza a própria senha
 */
async function updatePassword(request, reply) {
    const { sub } = request.user;
    const { currentPassword, newPassword } = request.body;
    if (!currentPassword || !newPassword) {
        return reply.status(400).send({
            message: "Senha atual e nova senha são obrigatórias",
        });
    }
    if (newPassword.length < 6) {
        return reply.status(400).send({
            message: "A nova senha deve ter no mínimo 6 caracteres",
        });
    }
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: sub },
        select: {
            id: true,
            password: true,
        },
    });
    if (!user) {
        return reply.status(404).send({ message: "Usuário não encontrado" });
    }
    const passwordMatch = await bcryptjs_1.default.compare(currentPassword, user.password);
    if (!passwordMatch) {
        return reply.status(401).send({
            message: "Senha atual incorreta",
        });
    }
    const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
    await prisma_1.prisma.user.update({
        where: { id: sub },
        data: {
            password: hashedPassword,
        },
    });
    return reply.send({
        message: "Senha atualizada com sucesso",
    });
}
/**
 * ADMIN
 * Atualiza role de um usuário
 */
async function updateUserRole(request, reply) {
    const { userId } = request.params;
    const { role } = request.body;
    if (!Object.values(client_1.Role).includes(role)) {
        return reply.status(400).send({ message: "Role inválida" });
    }
    const user = await prisma_1.prisma.user.update({
        where: { id: userId },
        data: { role },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
        },
    });
    return reply.send(user);
}
/**
 * ADMIN
 * Remove usuário
 */
async function deleteUser(request, reply) {
    const { userId } = request.params;
    await prisma_1.prisma.user.delete({
        where: { id: userId },
    });
    return reply.status(204).send();
}
/* =========================
   ROTAS
========================= */
async function usersRoutes(app) {
    // Todas as rotas abaixo exigem autenticação
    app.addHook("onRequest", auth_1.authMiddleware);
    // USER / ADMIN
    app.get("/me", getProfile);
    app.put("/me", updateProfile);
    app.put("/me/password", updatePassword);
    // ADMIN
    app.get("/", { preHandler: (0, role_1.roleMiddleware)(client_1.Role.ADMIN) }, listUsers);
    app.patch("/:userId/role", { preHandler: (0, role_1.roleMiddleware)(client_1.Role.ADMIN) }, updateUserRole);
    app.delete("/:userId", { preHandler: (0, role_1.roleMiddleware)(client_1.Role.ADMIN) }, deleteUser);
}

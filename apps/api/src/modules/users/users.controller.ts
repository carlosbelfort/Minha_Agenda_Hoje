import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { authMiddleware } from "../../middlewares/auth";
import { roleMiddleware } from "../../middlewares/role";
import { Role } from "@prisma/client";

/* =========================
   CONTROLLERS
========================= */

/**
 * ADMIN
 * Lista todos os usuários
 */
async function listUsers(request: FastifyRequest, reply: FastifyReply) {
  const users = await prisma.user.findMany({
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
async function getProfile(request: FastifyRequest, reply: FastifyReply) {
  const { sub } = request.user as { sub: string };

  const user = await prisma.user.findUnique({
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
async function updateProfile(request: FastifyRequest, reply: FastifyReply) {
  const { sub } = request.user as { sub: string };
  const { name, email } = request.body as {
    name?: string;
    email?: string;
  };

  // VERIFICA SE O EMAIL JÁ EXISTE (ANTES DO UPDATE)
  if (email) {
    const emailExists = await prisma.user.findUnique({
      where: { email },
    });

    if (emailExists && emailExists.id !== sub) {
      return reply.status(409).send({
        message: "E-mail já em uso",
      });
    }
  }

  // ATUALIZA O PERFIL
  const user = await prisma.user.update({
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
async function updatePassword(request: FastifyRequest, reply: FastifyReply) {
  const { sub } = request.user as { sub: string };
  const { currentPassword, newPassword } = request.body as {
    currentPassword: string;
    newPassword: string;
  };

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

  const user = await prisma.user.findUnique({
    where: { id: sub },
    select: {
      id: true,
      password: true,
    },
  });

  if (!user) {
    return reply.status(404).send({ message: "Usuário não encontrado" });
  }

  const passwordMatch = await bcrypt.compare(currentPassword, user.password);

  if (!passwordMatch) {
    return reply.status(401).send({
      message: "Senha atual incorreta",
    });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
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
async function updateUserRole(request: FastifyRequest, reply: FastifyReply) {
  const { userId } = request.params as { userId: string };
  const { role } = request.body as { role: Role };

  if (!Object.values(Role).includes(role)) {
    return reply.status(400).send({ message: "Role inválida" });
  }

  const user = await prisma.user.update({
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
async function deleteUser(request: FastifyRequest, reply: FastifyReply) {
  const { userId } = request.params as { userId: string };

  await prisma.user.delete({
    where: { id: userId },
  });

  return reply.status(204).send();
}

/* =========================
   ROTAS
========================= */

export async function usersRoutes(app: FastifyInstance) {
  // Todas as rotas abaixo exigem autenticação
  app.addHook("onRequest", authMiddleware);

  // USER / ADMIN
  app.get("/me", getProfile);
  app.put("/me", updateProfile);
  app.put("/me/password", updatePassword);

  // ADMIN
  app.get("/", { preHandler: roleMiddleware(Role.ADMIN) }, listUsers);
  app.patch(
    "/:userId/role",
    { preHandler: roleMiddleware(Role.ADMIN) },
    updateUserRole,
  );
  app.delete(
    "/:userId",
    { preHandler: roleMiddleware(Role.ADMIN) },
    deleteUser,
  );
}

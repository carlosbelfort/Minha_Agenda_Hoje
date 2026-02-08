"use strict";
/*import { FastifyRequest, FastifyReply } from "fastify";
import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";

export async function login(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { email, password } = request.body as {
    email: string;
    password: string;
  };

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return reply.status(401).send({ message: "Credenciais inválidas" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return reply.status(401).send({ message: "Credenciais inválidas" });
  }

  const token = await reply.jwtSign({
    sub: user.id,
    role: user.role,
  });

  return reply.send({ token });
}*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../../lib/prisma");
async function login(request, reply) {
    const { email, password } = request.body;
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user) {
        return reply.status(401).send({ message: "Credenciais inválidas" });
    }
    const passwordMatch = await bcryptjs_1.default.compare(password, user.password);
    if (!passwordMatch) {
        return reply.status(401).send({ message: "Credenciais inválidas" });
    }
    const token = await reply.jwtSign({
        sub: user.id,
        role: user.role,
    });
    return reply.send({
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role, // 🔥 ESSENCIAL
        },
    });
}

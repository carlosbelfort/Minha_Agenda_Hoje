import { FastifyRequest, FastifyReply } from "fastify";
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
}
import { FastifyRequest, FastifyReply } from "fastify";
import bcrypt  from "bcryptjs";
import { prisma } from "../../lib/prisma";

export async function register(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { name, email, password } = request.body as {
    name: string;
    email: string;
    password: string;
  };

  const userExists = await prisma.user.findUnique({ where: { email } });

  if (userExists) {
    return reply.status(400).send({ message: "Email já cadastrado" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return reply.status(201).send({
    id: user.id,
    name: user.name,
    email: user.email,
  });
}
import { FastifyReply, FastifyRequest } from "fastify";
import { Role } from "@prisma/client";

export const verifyRole = (role: string) => {
  return (request: FastifyRequest, reply: FastifyReply, done: Function) => {
    const user = (request as any).user;
    if (!user || user.role !== role) {
      return reply.status(403).send({ error: "Forbidden" });
    }
    done();
  };
};

export function roleMiddleware(role: Role) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user as { role: Role };

    if (user.role !== role) {
      return reply.status(403).send({ message: "Acesso negado" });
    }
  };
}
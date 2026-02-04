/*import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

export const verifyJWT = (request: FastifyRequest, reply: FastifyReply, done: Function) => {
  const authHeader = request.headers.authorization;
  if (!authHeader) return reply.status(401).send({ error: "Token missing" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    (request as any).user = decoded;
    done();
  } catch {
    return reply.status(401).send({ error: "Invalid token" });
  }
};

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    await request.jwtVerify();
  } catch {
    return reply.status(401).send({ message: "Não autenticado" });
  }
}*/

import { FastifyReply, FastifyRequest } from "fastify";

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    await request.jwtVerify();
  } catch {
    return reply.status(401).send({ message: "Não autenticado" });
  }
}

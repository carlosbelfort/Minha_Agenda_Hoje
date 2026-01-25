import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";

export default fp(async (app) => {
  app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || "super-secret"
  });

  app.decorate(
    "authenticate",
    async (request: any, reply: any) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.code(401).send({ message: "Token inválido ou ausente" });
      }
    }
  );
});
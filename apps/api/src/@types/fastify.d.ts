import "fastify";

declare module "fastify" {
  interface FastifyRequest {
    user: {
      sub: string;
      role: "ADMIN" | "USER";
    };
  }
}



declare module "fastify" {
  interface FastifyInstance {
    authenticate: any;
  }
}

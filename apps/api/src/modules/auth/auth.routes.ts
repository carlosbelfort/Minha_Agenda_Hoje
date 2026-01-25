import { FastifyInstance } from "fastify";
import { register } from "./register.controller";
import { login } from "./login.controller";

export async function authRoutes(app: FastifyInstance) {
  app.post("/register", register);
  app.post("/login", login);
}
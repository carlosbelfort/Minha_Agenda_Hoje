import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { routes } from "./routes";

export const app = Fastify({
  logger: false,
});

app.register(cors);
app.register(jwt, {
  secret: process.env.JWT_SECRET || "test-secret",
});

app.register(routes);

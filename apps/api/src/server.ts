import Fastify from "fastify";
import cors from "@fastify/cors";
import { routes } from "./routes";
import multipart from "@fastify/multipart";
import jwtPlugin from "./plugins/jwt";
import { app } from "./app";



app.register(cors, { origin: true });

// Registrar plugin JWT
app.register(jwtPlugin);

// upload de arquivos
app.register(multipart, {
  limits: {
    fileSize: 12 * 3450 * 2300, // 12MB
  },
});

// Registrar todas as rotas
app.register(routes);



app.listen({ port: 3333 }).then(() => {
  console.log("🚀 API rodando em http://localhost:3333");
});

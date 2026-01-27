import Fastify from "fastify";
import cors from "@fastify/cors";
import { routes } from "./routes";
import multipart from "@fastify/multipart";
import jwtPlugin from "./plugins/jwt";
import { app } from "./app";

const port = Number(process.env.PORT) || 3333;

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

/*app.listen(
  {
    port: PORT,
    host: "0.0.0.0",
  },
  () => {
    console.log(`🚀 Server running on port ${PORT}`);
  },
);*/
app.listen({
  port,
  host: "0.0.0.0",
}).then(() => {
  console.log(`🚀 Server running on port ${port}`);
}).catch(err => {
  console.error(err);
  process.exit(1);
});

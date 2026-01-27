import Fastify from "fastify";

import { routes } from "./routes";

export const app = Fastify({
  logger: false,
});



app.register(routes);

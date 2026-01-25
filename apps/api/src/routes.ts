import { FastifyInstance } from "fastify";
import { authRoutes } from "./modules/auth/auth.controller";
import { usersRoutes } from "./modules/users/users.controller";
import { agendasRoutes } from "./modules/agendas/agendas.controller";
import { uploadAgendaPhotos } from "./modules/agendas/agendas.photos.controller";
import { dashboardRoutes } from "./modules/dashboard/dashboard.controller";


export async function routes(app: FastifyInstance) {
  app.register(authRoutes, { prefix: "/auth" });
  app.register(usersRoutes, { prefix: "/users" });
  app.register(agendasRoutes, { prefix: "/agendas" });  
  app.post("/:id/photos", uploadAgendaPhotos);
  app.register(dashboardRoutes, { prefix: "/dashboard" });
}

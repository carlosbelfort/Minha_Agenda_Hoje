"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = routes;
const auth_controller_1 = require("./modules/auth/auth.controller");
const users_controller_1 = require("./modules/users/users.controller");
const agendas_controller_1 = require("./modules/agendas/agendas.controller");
const agendas_photos_controller_1 = require("./modules/agendas/agendas.photos.controller");
const dashboard_controller_1 = require("./modules/dashboard/dashboard.controller");
async function routes(app) {
    app.register(auth_controller_1.authRoutes, { prefix: "/auth" });
    app.register(users_controller_1.usersRoutes, { prefix: "/users" });
    app.register(agendas_controller_1.agendasRoutes, { prefix: "/agendas" });
    app.post("/:id/photos", agendas_photos_controller_1.uploadAgendaPhotos);
    app.register(dashboard_controller_1.dashboardRoutes, { prefix: "/dashboard" });
}

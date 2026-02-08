"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardRoutes = dashboardRoutes;
const prisma_1 = require("../../lib/prisma");
async function dashboardRoutes(app) {
    app.get("/", { preHandler: app.authenticate }, async (request, reply) => {
        const { sub, role } = request.user;
        const now = new Date();
        // Intervalo de hoje
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        // Total de agendamentos hoje (apenas do usuário logado)
        const appointmentsToday = await prisma_1.prisma.agenda.count({
            where: {
                userId: sub,
                completed: false,
                date: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
        });
        // Próximo agendamento (apenas do usuário logado)
        /*const nextAppointment = await prisma.agenda.findFirst({
          where: {
            userId: sub,
            date: { gte: new Date() },
          },
          orderBy: {
            date: "asc",
          },
          select: {
            date: true,
          },
        });*/
        const nextAgenda = await prisma_1.prisma.agenda.findFirst({
            where: {
                userId: sub,
                completed: false,
                date: {
                    gte: now,
                },
            },
            orderBy: {
                date: "asc",
            },
        });
        /*return {
          appointmentsToday,
          nextAppointment: nextAppointment
            ? nextAppointment.date.toISOString()
            : null,
          userRole: role,
        };*/
        return reply.send({
            appointmentsToday,
            nextAppointment: nextAgenda ? nextAgenda.date : null,
            userRole: role,
        });
    });
}

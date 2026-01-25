import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";

export async function dashboardRoutes(app: FastifyInstance) {
  app.get("/",{ preHandler: app.authenticate }, async (request, reply) => {
    const user = request.user;

    if (!user) {
      return reply.status(401).send({ message: "Unauthorized" });
    }

    // Intervalo de HOJE
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // ADMIN vê tudo | USER vê só o dele
    const whereClause =
      user.role === "ADMIN"
        ? {
            date: {
              gte: startOfDay,
              lte: endOfDay,
            },
          }
        : {
            userId: user.id,
            date: {
              gte: startOfDay,
              lte: endOfDay,
            },
          };

    // Total de agendamentos hoje
    const appointmentsToday = await prisma.agenda.count({
      where: whereClause,
    });

    // Próximo agendamento
    const nextAppointment = await prisma.agenda.findFirst({
      where: user.role === "ADMIN" ? {} : { userId: user.id },
      orderBy: {
        date: "asc",
      },
      select: {
        date: true,
      },
    });

    return {
      appointmentsToday,
      nextAppointment: nextAppointment
        ? nextAppointment.date.toISOString()
        : null,
      userRole: user.role,
    };
  });
}
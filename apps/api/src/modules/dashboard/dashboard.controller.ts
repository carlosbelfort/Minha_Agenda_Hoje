import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";

export async function dashboardRoutes(app: FastifyInstance) {
  app.get("/", { preHandler: app.authenticate }, async (request, reply) => {
    const { sub, role } = request.user as {
      sub: string;
      role: "ADMIN" | "USER";
    };

    // Intervalo de hoje
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Total de agendamentos hoje (apenas do usuário logado)
    const appointmentsToday = await prisma.agenda.count({
      where: {
        userId: sub,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    // Próximo agendamento (apenas do usuário logado)
    const nextAppointment = await prisma.agenda.findFirst({
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
    });
    return {
      appointmentsToday,
      nextAppointment: nextAppointment
        ? nextAppointment.date.toISOString()
        : null,
      userRole: role,
    };
  });
}

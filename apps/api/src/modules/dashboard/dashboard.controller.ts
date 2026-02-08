import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";

export async function dashboardRoutes(app: FastifyInstance) {
  app.get("/", { preHandler: app.authenticate }, async (request, reply) => {
    const { sub, role } = request.user as {
      sub: string;
      role: "ADMIN" | "USER";
    };

    const now = new Date();

    // Intervalo de hoje
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Total de agendamentos hoje (apenas do usuário logado)
    const appointmentsToday = await prisma.agenda.count({
      where: {
        userId: sub,
        completed: false,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });


    //Proximo agendamento futuro (apenas do usuário logado)
    const nextAgenda = await prisma.agenda.findFirst({
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

    return reply.send({
      appointmentsToday,
      nextAppointment: nextAgenda ? nextAgenda.date : null,
      userRole: role,
    });
  });
}

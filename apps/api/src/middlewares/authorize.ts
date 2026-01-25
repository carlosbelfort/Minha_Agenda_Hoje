export function authorize(role: "ADMIN" | "USER") {
  return async (request: any, reply: any) => {
    const userRole = request.user?.role;

    if (userRole !== role) {
      return reply.code(403).send({
        message: "Acesso negado"
      });
    }
  };
}
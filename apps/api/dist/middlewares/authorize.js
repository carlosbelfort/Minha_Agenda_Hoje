"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = authorize;
function authorize(role) {
    return async (request, reply) => {
        const userRole = request.user?.role;
        if (userRole !== role) {
            return reply.code(403).send({
                message: "Acesso negado"
            });
        }
    };
}

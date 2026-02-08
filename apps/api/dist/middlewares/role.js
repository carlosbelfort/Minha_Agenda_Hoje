"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRole = void 0;
exports.roleMiddleware = roleMiddleware;
const verifyRole = (role) => {
    return (request, reply, done) => {
        const user = request.user;
        if (!user || user.role !== role) {
            return reply.status(403).send({ error: "Forbidden" });
        }
        done();
    };
};
exports.verifyRole = verifyRole;
function roleMiddleware(role) {
    return async (request, reply) => {
        const user = request.user;
        if (user.role !== role) {
            return reply.status(403).send({ message: "Acesso negado" });
        }
    };
}

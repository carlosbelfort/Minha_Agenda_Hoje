"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
async function authMiddleware(request, reply) {
    try {
        await request.jwtVerify();
    }
    catch {
        return reply.status(401).send({ message: "Não autenticado" });
    }
}

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../../lib/prisma");
async function login(request, reply) {
    const { email, password } = request.body;
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user) {
        return reply.status(401).send({ message: "Credenciais inválidas" });
    }
    const passwordMatch = await bcryptjs_1.default.compare(password, user.password);
    if (!passwordMatch) {
        return reply.status(401).send({ message: "Credenciais inválidas" });
    }
    const token = await reply.jwtSign({
        sub: user.id,
        role: user.role,
    });
    return reply.send({ token });
}

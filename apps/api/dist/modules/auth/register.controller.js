"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../../lib/prisma");
async function register(request, reply) {
    const { name, email, password } = request.body;
    const userExists = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (userExists) {
        return reply.status(400).send({ message: "Email já cadastrado" });
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const user = await prisma_1.prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });
    return reply.status(201).send({
        id: user.id,
        name: user.name,
        email: user.email,
    });
}

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = authRoutes;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../../lib/prisma");
async function authRoutes(app) {
    app.post("/login", async (request, reply) => {
        const { email, password } = request.body;
        if (!email || !password) {
            return reply.status(400).send({ message: "Credenciais inválidas" });
        }
        const user = await prisma_1.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return reply.status(401).send({ message: "Usuário ou senha inválidos" });
        }
        const passwordMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!passwordMatch) {
            return reply.status(401).send({ message: "Usuário ou senha inválidos" });
        }
        const token = jsonwebtoken_1.default.sign({
            sub: user.id,
            role: user.role,
        }, process.env.JWT_SECRET, { expiresIn: "1d" });
        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    });
    app.post("/register", async (request, reply) => {
        const { name, email, password } = request.body;
        if (!name || !email || !password) {
            return reply.status(400).send({ message: "Dados inválidos" });
        }
        const userExists = await prisma_1.prisma.user.findUnique({
            where: { email },
        });
        if (userExists) {
            return reply.status(409).send({ message: "E-mail já cadastrado" });
        }
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        const user = await prisma_1.prisma.user.create({
            data: {
                name,
                email,
                password: passwordHash,
                role: "USER",
            },
        });
        return reply.status(201).send({
            id: user.id,
            name: user.name,
            email: user.email,
        });
    });
}

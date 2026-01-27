"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = void 0;
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyJWT = (request, reply, done) => {
    const authHeader = request.headers.authorization;
    if (!authHeader)
        return reply.status(401).send({ error: "Token missing" });
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        request.user = decoded;
        done();
    }
    catch {
        return reply.status(401).send({ error: "Invalid token" });
    }
};
exports.verifyJWT = verifyJWT;
async function authMiddleware(request, reply) {
    try {
        await request.jwtVerify();
    }
    catch {
        return reply.status(401).send({ message: "Não autenticado" });
    }
}

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("@fastify/cors"));
const routes_1 = require("./routes");
const multipart_1 = __importDefault(require("@fastify/multipart"));
const jwt_1 = __importDefault(require("./plugins/jwt"));
const app_1 = require("./app");
const PORT = Number(process.env.PORT) || 3333;
app_1.app.register(cors_1.default, { origin: true });
// Registrar plugin JWT
app_1.app.register(jwt_1.default);
// upload de arquivos
app_1.app.register(multipart_1.default, {
    limits: {
        fileSize: 12 * 3450 * 2300, // 12MB
    },
});
// Registrar todas as rotas
app_1.app.register(routes_1.routes);
app_1.app.listen({
    port: PORT,
    host: "0.0.0.0",
}, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
